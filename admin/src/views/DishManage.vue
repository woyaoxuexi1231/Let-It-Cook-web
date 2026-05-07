<template>
  <div class="dish-manage">
    <div class="page-header">
      <h2 class="page-title">Recipe Management</h2>
      <div class="header-actions">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="Search recipe name..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <span class="search-icon">🔍</span>
          <button class="btn-search" @click="handleSearch">Search</button>
        </div>
        <button class="btn-primary" @click="handleAdd">
          <span>+</span>
          <span>Add Recipe</span>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table" v-if="dishList.length > 0">
        <thead>
          <tr>
            <th class="col-recipe">Recipe</th>
            <th class="col-cuisine">Cuisine</th>
            <th class="col-tutorial">Tutorials</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dish in dishList" :key="dish.id">
            <td class="col-recipe">
              <div class="dish-cell">
                <div class="dish-image-wrapper" @click="previewImage(getFileUrl(dish.image))">
                  <img
                    v-if="dish.image"
                    :src="getFileUrl(dish.image)"
                    :alt="dish.name"
                    class="dish-thumb"
                  />
                  <div v-else class="dish-thumb-placeholder">
                    <span class="placeholder-icon">🍽️</span>
                  </div>
                </div>
                <span class="dish-name">{{ dish.name }}</span>
              </div>
            </td>
            <td class="col-cuisine">
              <span class="cuisine-tag" v-if="dish.cuisine">{{ dish.cuisine }}</span>
              <span class="cuisine-tag empty" v-else>-</span>
            </td>
            <td class="col-tutorial">
              <span class="badge" :class="{ 'badge-active': dish.tutorialCount > 0 }">
                {{ dish.tutorialCount || 0 }}
              </span>
            </td>
            <td class="col-actions">
              <div class="action-buttons">
                <button class="btn-action btn-tutorial" @click="handleManageTutorials(dish)">
                  <span>📚</span>
                  <span>Tutorials</span>
                </button>
                <button class="btn-action btn-edit" @click="handleEdit(dish)">
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(dish)">
                  <span>🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页组件 -->
      <div class="pagination" v-if="total > pageSize">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          ‹ Prev
        </button>
        
        <span class="page-info">
          Page {{ currentPage }} / {{ Math.ceil(total / pageSize) }} (Total: {{ total }})
        </span>
        
        <button 
          class="page-btn" 
          :disabled="currentPage >= Math.ceil(total / pageSize)"
          @click="handlePageChange(currentPage + 1)"
        >
          Next ›
        </button>
      </div>

      <div v-else-if="!searchKeyword" class="empty-state">
        <span class="empty-icon">📋</span>
        <p class="empty-text">No recipes yet</p>
        <button class="btn-primary" @click="handleAdd">
          <span>+</span>
          <span>Add your first recipe</span>
        </button>
      </div>
      <div v-else class="empty-state">
        <span class="empty-icon">🔍</span>
        <p class="empty-text">No recipes found matching "{{ searchKeyword }}"</p>
        <button class="btn-secondary" @click="searchKeyword = ''">
          <span>Clear search</span>
        </button>
      </div>
    </div>

    <div class="modal-overlay" v-if="dialogVisible" @click.self="closeDialog">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEdit ? 'Edit Recipe' : 'Add Recipe' }}</h3>
          <button class="modal-close" @click="closeDialog">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Recipe Name</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="form.name" 
              placeholder="Enter recipe name"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Cuisine</label>
            <select class="form-input" v-model="form.cuisine">
              <option value="">Select cuisine</option>
              <option value="川菜">川菜 (Sichuan)</option>
              <option value="粤菜">粤菜 (Cantonese)</option>
              <option value="湘菜">湘菜 (Hunan)</option>
              <option value="鲁菜">鲁菜 (Shandong)</option>
              <option value="苏菜">苏菜 (Jiangsu)</option>
              <option value="浙菜">浙菜 (Zhejiang)</option>
              <option value="闽菜">闽菜 (Fujian)</option>
              <option value="徽菜">徽菜 (Anhui)</option>
              <option value="家常菜">家常菜 (Home-style)</option>
              <option value="其他">其他 (Other)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Recipe Image</label>
            <div class="upload-area" @click="triggerImageUpload">
              <img
                v-if="form.image"
                :src="getFileUrl(form.image)"
                class="uploaded-image"
              />
              <div v-else class="upload-placeholder">
                <span class="upload-icon">📷</span>
                <span class="upload-text">Click to upload</span>
              </div>
            </div>
            <input 
              ref="imageInput"
              type="file" 
              accept="image/*"
              style="display: none"
              @change="handleImageFileChange"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeDialog">Cancel</button>
          <button class="btn-primary" @click="handleSubmit">Confirm</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="tutorialDialogVisible" @click.self="closeTutorialDialog">
      <div class="modal modal-large">
        <div class="modal-header">
          <h3 class="modal-title">Tutorials - {{ currentDish?.name }}</h3>
          <button class="modal-close" @click="closeTutorialDialog">×</button>
        </div>
        <div class="modal-body">
          <div class="tab-actions">
            <button class="btn-primary btn-small" @click="handleAddTutorial('video')">
              <span>+</span>
              <span>Add Video Tutorial</span>
            </button>
            <button class="btn-secondary btn-small" @click="handleAddTutorial('link')">
              <span>+</span>
              <span>Add Link Tutorial</span>
            </button>
          </div>

          <table class="data-table" v-if="currentTutorials.length > 0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Preview</th>
                <th>Sort</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tutorial in currentTutorials" :key="tutorial.id">
                <td>{{ tutorial.title }}</td>
                <td>
                  <span class="type-tag" :class="'type-' + tutorial.type">
                    {{ tutorial.type === 'video' ? '🎬 Video' : '🔗 Link' }}
                  </span>
                </td>
                <td>
                  <div v-if="tutorial.type === 'video'" class="video-wrapper">
                    <video
                      v-if="tutorial.url"
                      :src="getFileUrl(tutorial.url)"
                      controls
                      class="video-preview"
                    />
                    <div v-else class="video-placeholder">
                      <span>🎬</span>
                    </div>
                  </div>
                  <a v-else-if="tutorial.url" :href="tutorial.url" target="_blank" class="link-cell">
                    <span>🔗</span>
                    <span>{{ tutorial.url }}</span>
                  </a>
                  <span v-else class="no-data">-</span>
                </td>
                <td>{{ tutorial.sortOrder }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-action btn-edit" @click="handleEditTutorial(tutorial)">
                      <span>✏️</span>
                    </button>
                    <button class="btn-action btn-delete" @click="handleDeleteTutorial(tutorial)">
                      <span>🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-tab">
            <span>No tutorials yet</span>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="tutorialEditVisible" @click.self="closeTutorialEdit">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditTutorial ? 'Edit Tutorial' : 'Add Tutorial' }}</h3>
          <button class="modal-close" @click="closeTutorialEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Tutorial Title</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="tutorialForm.title" 
              placeholder="Enter tutorial title"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Sort Order</label>
            <input 
              type="number" 
              class="form-input" 
              v-model="tutorialForm.sortOrder"
              min="0"
              max="999"
            />
          </div>
          
          <template v-if="tutorialForm.type === 'video'">
            <div class="form-group">
              <label class="form-label">Upload Video</label>
              <button class="btn-secondary" @click="triggerVideoUpload" :disabled="uploadingVideo">
                {{ uploadingVideo ? 'Uploading...' : 'Select Video' }}
              </button>
              <input 
                ref="videoInput"
                type="file" 
                accept="video/*"
                style="display: none"
                @change="handleVideoFileChange"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Or Video URL</label>
              <input 
                type="text" 
                class="form-input" 
                v-model="tutorialForm.url" 
                placeholder="Enter video URL"
              />
            </div>
            <div class="form-group" v-if="tutorialForm.url">
              <label class="form-label">Preview</label>
              <div class="video-preview-container">
                <video :src="getFileUrl(tutorialForm.url)" controls class="preview-video" />
              </div>
            </div>
          </template>
          
          <div class="form-group" v-if="tutorialForm.type === 'link'">
            <label class="form-label">Link URL</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="tutorialForm.url" 
              placeholder="Enter link URL"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeTutorialEdit">Cancel</button>
          <button class="btn-primary" @click="handleSubmitTutorial">Confirm</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="confirmVisible" @click.self="closeConfirm">
      <div class="modal modal-small">
        <div class="modal-header">
          <h3 class="modal-title">Confirm</h3>
          <button class="modal-close" @click="closeConfirm">×</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">{{ confirmOptions.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeConfirm">
            {{ confirmOptions.cancelText || 'Cancel' }}
          </button>
          <button class="btn-danger" @click="confirmAction">
            {{ confirmOptions.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <div class="toast-container" v-if="toast.visible">
      <div class="toast" :class="'toast-' + toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️' }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { dishAPI, uploadAPI } from '@/api/index'
import { getFileUrl } from '@/utils/fileUrl'

const dishList = ref([])
const searchKeyword = ref('')
const currentDish = ref(null)
const currentTutorials = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const tutorialDialogVisible = ref(false)
const tutorialEditVisible = ref(false)
const isEdit = ref(false)
const isEditTutorial = ref(false)

const uploadingVideo = ref(false)
const uploadingImage = ref(false)
const loading = ref(false)

const form = ref({
  id: null,
  name: '',
  image: '',
  cuisine: ''
})

const tutorialForm = ref({
  id: null,
  dishId: null,
  title: '',
  type: 'video',
  url: '',
  sortOrder: 0
})

const imageInput = ref(null)
const videoInput = ref(null)

const toast = ref({
  visible: false,
  message: '',
  type: 'success'
})

const confirmVisible = ref(false)
const confirmOptions = ref({})
const confirmCallback = ref(null)

const showToast = (message, type = 'success') => {
  toast.value = {
    visible: true,
    message,
    type
  }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

const showConfirm = (options) => {
  return new Promise((resolve) => {
    confirmOptions.value = {
      title: 'Confirm',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      ...options
    }
    confirmVisible.value = true
    pushModal('confirm')
    confirmCallback.value = resolve
  })
}

const confirmAction = () => {
  confirmVisible.value = false
  popModal()
  if (confirmCallback.value) {
    confirmCallback.value(true)
  }
}

// 关闭弹窗时从栈中移除
const closeDialog = () => {
  dialogVisible.value = false
  const index = modalStack.value.indexOf('dialog')
  if (index > -1) modalStack.value.splice(index, 1)
}

const closeTutorialDialog = () => {
  tutorialDialogVisible.value = false
  const index = modalStack.value.indexOf('tutorialDialog')
  if (index > -1) modalStack.value.splice(index, 1)
}

const closeTutorialEdit = () => {
  tutorialEditVisible.value = false
  const index = modalStack.value.indexOf('tutorialEdit')
  if (index > -1) modalStack.value.splice(index, 1)
}

const closeConfirm = () => {
  confirmVisible.value = false
  const index = modalStack.value.indexOf('confirm')
  if (index > -1) modalStack.value.splice(index, 1)
}

const fetchDishes = async () => {
  loading.value = true
  try {
    const result = await dishAPI.getDishes(currentPage.value, pageSize.value, searchKeyword.value)
    if (result.data && result.data.records) {
      dishList.value = result.data.records
      total.value = result.data.total || 0
    }
  } catch (error) {
    console.error('Failed to fetch recipes', error)
    showToast('Failed to fetch recipes', 'error')
  } finally {
    loading.value = false
  }
}

// 搜索功能 - 调用后端接口
const handleSearch = async () => {
  currentPage.value = 1 // 搜索时重置到第一页
  await fetchDishes()
}

// 切换页码
const handlePageChange = async (page) => {
  currentPage.value = page
  await fetchDishes()
  // 滚动到顶部
  document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' })
}

// 刷新数据
const refreshData = async () => {
  await fetchDishes()
}

const fetchTutorials = async (dishId) => {
  try {
    const result = await dishAPI.getTutorialsByDishId(dishId)
    if (result.data) {
      currentTutorials.value = result.data
      const dish = dishList.value.find(d => d.id === dishId)
      if (dish) {
        dish.tutorialCount = result.data.length
      }
    }
  } catch (error) {
    console.error('Failed to fetch tutorials', error)
    showToast('Failed to fetch tutorials', 'error')
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = { id: null, name: '', image: '', cuisine: '' }
  dialogVisible.value = true
  pushModal('dialog')
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
  pushModal('dialog')
}

const handleSubmit = async () => {
  if (!form.value.name) {
    showToast('Please enter recipe name', 'warning')
    return
  }

  try {
    if (isEdit.value) {
      await dishAPI.updateDish({
        id: form.value.id,
        name: form.value.name,
        image: form.value.image
      })
      const index = dishList.value.findIndex(d => d.id === form.value.id)
      if (index !== -1) {
        dishList.value[index] = { ...form.value }
      }
      showToast('Recipe updated successfully', 'success')
    } else {
      const result = await dishAPI.addDish({
        name: form.value.name,
        image: form.value.image,
        cuisine: form.value.cuisine
      })
      if (result.data) {
        dishList.value.push(result.data)
      }
      showToast('Recipe added successfully', 'success')
    }
    dialogVisible.value = false
    // 刷新数据
    await refreshData()
  } catch (error) {
    console.error('Save failed', error)
    showToast('Save failed', 'error')
  }
}

const handleDelete = async (row) => {
  const confirmed = await showConfirm({
    message: `Are you sure you want to delete "${row.name}"? All tutorials under this recipe will also be deleted.`
  })
  
  if (confirmed) {
    try {
      await dishAPI.deleteDish(row.id)
      await refreshData()
      showToast('Recipe deleted successfully', 'success')
    } catch (error) {
      console.error('Delete failed', error)
      showToast('Delete failed', 'error')
    }
  }
}

const handleManageTutorials = async (row) => {
  currentDish.value = row
  tutorialDialogVisible.value = true
  pushModal('tutorialDialog')
  await fetchTutorials(row.id)
}

const handleAddTutorial = (type) => {
  isEditTutorial.value = false
  tutorialForm.value = {
    id: null,
    dishId: currentDish.value.id,
    title: '',
    type: type,
    url: '',
    sortOrder: currentTutorials.value.length
  }
  tutorialEditVisible.value = true
  pushModal('tutorialEdit')
}

const handleEditTutorial = (row) => {
  isEditTutorial.value = true
  tutorialForm.value = { ...row }
  tutorialEditVisible.value = true
  pushModal('tutorialEdit')
}

const handleSubmitTutorial = async () => {
  if (!tutorialForm.value.title) {
    showToast('Please enter tutorial title', 'warning')
    return
  }

  try {
    if (isEditTutorial.value) {
      await dishAPI.updateTutorial({
        id: tutorialForm.value.id,
        dishId: tutorialForm.value.dishId,
        title: tutorialForm.value.title,
        type: tutorialForm.value.type,
        url: tutorialForm.value.url,
        sortOrder: tutorialForm.value.sortOrder
      })
      const index = currentTutorials.value.findIndex(t => t.id === tutorialForm.value.id)
      if (index !== -1) {
        currentTutorials.value[index] = { ...tutorialForm.value }
      }
      showToast('Tutorial updated successfully', 'success')
    } else {
      const result = await dishAPI.addTutorial({
        dishId: tutorialForm.value.dishId,
        title: tutorialForm.value.title,
        type: tutorialForm.value.type,
        url: tutorialForm.value.url,
        sortOrder: tutorialForm.value.sortOrder
      })
      if (result.data) {
        currentTutorials.value.push(result.data)
      }
      showToast('Tutorial added successfully', 'success')
    }
    tutorialEditVisible.value = false
    // 刷新教程列表和菜谱数据
    await fetchTutorials(currentDish.value.id)
    await refreshData()
    const dish = dishList.value.find(d => d.id === currentDish.value.id)
    if (dish) {
      dish.tutorialCount = currentTutorials.value.length
    }
  } catch (error) {
    console.error('Save failed', error)
    showToast('Save failed', 'error')
  }
}

const handleDeleteTutorial = async (row) => {
  const confirmed = await showConfirm({
    message: 'Are you sure you want to delete this tutorial?'
  })
  
  if (confirmed) {
    try {
      await dishAPI.deleteTutorial(row.id)
      await fetchTutorials(currentDish.value.id)
      await refreshData()
      showToast('Tutorial deleted successfully', 'success')
      const dish = dishList.value.find(d => d.id === currentDish.value.id)
      if (dish) {
        dish.tutorialCount = currentTutorials.value.length
      }
    } catch (error) {
      console.error('Delete failed', error)
      showToast('Delete failed', 'error')
    }
  }
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    showToast('Only image files are allowed', 'error')
    return
  }
  
  uploadingImage.value = true
  
  try {
    const response = await uploadAPI.uploadFile(file)
    // 获取 objectName（存储到数据库）
    const objectName = response.data?.objectName || response.objectName
    if (objectName) {
      // 存储 objectName，后端查询时会组装成完整URL
      form.value.image = objectName
      showToast('Image uploaded successfully', 'success')
    } else {
      showToast('Failed to get image object name', 'error')
    }
  } catch (error) {
    console.error('Upload failed', error)
    showToast('Image upload failed', 'error')
  } finally {
    uploadingImage.value = false
    event.target.value = ''
  }
}

const triggerVideoUpload = () => {
  videoInput.value?.click()
}

const handleVideoFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('video/')) {
    showToast('Only video files are allowed', 'error')
    return
  }
  
  uploadingVideo.value = true
  
  try {
    const response = await uploadAPI.uploadFile(file)
    // 获取 objectName（存储到数据库）
    const objectName = response.data?.objectName || response.objectName
    if (objectName) {
      // 存储 objectName，后端查询时会组装成完整URL
      tutorialForm.value.url = objectName
      showToast('Video uploaded successfully', 'success')
    } else {
      showToast('Failed to get video object name', 'error')
    }
  } catch (error) {
    console.error('Upload failed', error)
    showToast('Video upload failed', 'error')
  } finally {
    uploadingVideo.value = false
    event.target.value = ''
  }
}

const previewImage = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

// 弹窗栈，用于管理多个弹窗的打开顺序
const modalStack = ref([])

// 打开弹窗时入栈
const pushModal = (modalName) => {
  modalStack.value.push(modalName)
}

// 关闭弹窗时出栈
const popModal = () => {
  return modalStack.value.pop()
}

// 按栈顺序关闭弹窗（LIFO - 最后打开的最先关闭）
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    // 获取最后打开的弹窗
    const lastModal = modalStack.value[modalStack.value.length - 1]
    
    switch (lastModal) {
      case 'confirm':
        confirmVisible.value = false
        popModal()
        break
      case 'tutorialEdit':
        tutorialEditVisible.value = false
        popModal()
        break
      case 'tutorialDialog':
        tutorialDialogVisible.value = false
        popModal()
        break
      case 'dialog':
        dialogVisible.value = false
        popModal()
        break
      default:
        // 栈为空，不做任何操作
        break
    }
  }
}

onMounted(() => {
  fetchDishes()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.dish-manage {
  width: 100%;
  min-height: 100%;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 10px 16px 10px 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-primary);
  background-color: var(--bg-card);
  width: 240px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: var(--text-muted);
}

.btn-search {
  margin-left: 8px;
  padding: 10px 16px;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-search:hover {
  opacity: 0.8;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--bg-secondary);
  border-color: var(--text-secondary);
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-small {
  padding: 8px 16px;
  font-size: 13px;
}

.table-container {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.data-table th,
.data-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: var(--bg-secondary);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.data-table td {
  font-size: 14px;
  color: var(--text-primary);
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover td {
  background-color: var(--bg-secondary);
}

.col-cuisine {
  width: 120px;
  text-align: center;
}

.col-tutorial {
  width: 120px;
  text-align: center;
}

.col-actions {
  width: 320px;
  text-align: center;
}

.dish-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dish-image-wrapper {
  flex-shrink: 0;
  cursor: pointer;
}

.dish-thumb {
  width: 64px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.dish-thumb:hover {
  transform: scale(1.05);
}

.dish-thumb-placeholder {
  width: 64px;
  height: 48px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 20px;
}

.dish-name {
  font-weight: 500;
  color: var(--text-primary);
}

.cuisine-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

.cuisine-tag.empty {
  color: var(--text-muted);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.badge.badge-active {
  background-color: var(--text-primary);
  color: var(--bg-primary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  color: var(--text-secondary);
}

.btn-action:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-delete:hover {
  color: #dc2626;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* 分页组件 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-card);
}

.page-btn {
  padding: 8px 16px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border-color: var(--text-primary);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 40px 20px;
  overflow-y: auto;
}

.modal {
  width: 480px;
  max-width: 90%;
  background-color: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  animation: modalIn 0.2s ease;
  margin: auto;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.modal-large {
  width: 900px;
}

.modal-small {
  width: 400px;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: var(--bg-secondary);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-primary);
  background-color: var(--bg-card);
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--text-primary);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.upload-area {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-secondary);
}

.upload-area:hover {
  border-color: var(--text-primary);
  background-color: var(--bg-secondary);
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.upload-icon {
  font-size: 32px;
}

.upload-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-wrapper {
  width: 100%;
  max-width: 180px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.video-preview {
  width: 100%;
  display: block;
}

.video-placeholder {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  font-size: 24px;
}

.video-preview-container {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.preview-video {
  width: 100%;
  max-height: 250px;
  display: block;
}

.link-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 13px;
  word-break: break-all;
}

.link-cell:hover {
  text-decoration: underline;
}

.tab-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-tag.type-video {
  background-color: #e0f2fe;
  color: #0369a1;
}

.type-tag.type-link {
  background-color: #fef3c7;
  color: #92400e;
}

.empty-tab {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.confirm-message {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0;
}

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background-color: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: toastIn 0.3s ease;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-icon {
  font-size: 20px;
}

.toast-message {
  font-size: 14px;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .dish-manage {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    flex-direction: column;
    gap: 12px;
  }

  .search-box {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .btn-search {
    width: 100%;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .col-actions {
    min-width: 200px;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .dish-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .dish-thumb {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }

  .modal-large {
    width: 95%;
  }

  .modal {
    width: 95%;
    max-height: 90vh;
  }

  .modal-body {
    padding: 16px;
  }

  .tab-actions {
    flex-direction: column;
  }

  .tab-actions .btn-small {
    width: 100%;
    justify-content: center;
  }

  .video-wrapper {
    max-width: 120px;
  }
}
</style>