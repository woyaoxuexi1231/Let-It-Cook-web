<template>
  <div class="dish-manage">
    <div class="header">
      <h2>菜谱管理</h2>
      <el-button type="primary" round @click="handleAdd">添加菜谱</el-button>
    </div>

    <el-table :data="dishList" border stripe class="black-white-table">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="菜名" />
      <el-table-column prop="image" label="图片" width="120">
        <template #default="{ row }">
          <el-image 
            v-if="row.image" 
            :src="row.image" 
            fit="cover"
            style="width: 80px; height: 60px; border-radius: 8px;"
          />
          <span v-else class="no-image">暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="教程数量" width="100">
        <template #default="{ row }">
          <span class="tutorial-count">{{ row.tutorialCount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="{ row }">
          <el-button size="small" type="primary" round @click="handleManageTutorials(row)">管理教程</el-button>
          <el-button size="small" round @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" round @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜谱编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑菜谱' : '添加菜谱'"
      width="600px"
      class="black-white-dialog"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="菜名">
          <el-input v-model="form.name" placeholder="请输入菜名" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :show-file-list="false"
            :http-request="handleImageUpload"
            action=""
            :auto-upload="true"
          >
            <div class="image-upload-box">
              <el-image 
                v-if="form.image" 
                :src="form.image" 
                fit="cover"
                class="upload-image"
              />
              <div v-else class="upload-placeholder">
                <el-icon :size="40"><Plus /></el-icon>
                <span>点击上传图片</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 教程管理弹窗(属于某个菜谱) -->
    <el-dialog
      v-model="tutorialDialogVisible"
      :title="`教程管理 - ${currentDish?.name || ''}`"
      width="1000px"
      class="black-white-dialog"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="tutorial-tabs">
        <el-tabs v-model="tutorialTab">
          <el-tab-pane label="视频教程" name="video">
            <div class="tutorial-header">
              <el-button type="primary" round @click="handleAddTutorial('video')">添加视频</el-button>
            </div>
            
            <el-table :data="videoTutorials" border stripe class="black-white-table">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="教程标题" />
              <el-table-column label="视频预览" width="200">
                <template #default="{ row }">
                  <video 
                    v-if="row.url" 
                    :src="row.url" 
                    controls
                    style="width: 180px; height: 120px; border-radius: 8px;"
                  />
                  <span v-else class="no-video">无视频</span>
                </template>
              </el-table-column>
              <el-table-column prop="sortOrder" label="排序" width="80" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button size="small" round @click="handleEditTutorial(row)">编辑</el-button>
                  <el-button size="small" type="danger" round @click="handleDeleteTutorial(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="链接教程" name="link">
            <div class="tutorial-header">
              <el-button type="primary" round @click="handleAddTutorial('link')">添加链接</el-button>
            </div>
            
            <el-table :data="linkTutorials" border stripe class="black-white-table">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="教程标题" />
              <el-table-column prop="url" label="链接地址" show-overflow-tooltip>
                <template #default="{ row }">
                  <a :href="row.url" target="_blank" class="tutorial-link">{{ row.url }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="sortOrder" label="排序" width="80" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button size="small" round @click="handleEditTutorial(row)">编辑</el-button>
                  <el-button size="small" type="danger" round @click="handleDeleteTutorial(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <!-- 教程编辑弹窗 -->
    <el-dialog
      v-model="tutorialEditVisible"
      :title="isEditTutorial ? '编辑教程' : '添加教程'"
      width="600px"
      class="black-white-dialog"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form :model="tutorialForm" label-width="80px">
        <el-form-item label="教程标题">
          <el-input v-model="tutorialForm.title" placeholder="请输入教程标题" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="tutorialForm.sortOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="上传视频" v-if="tutorialForm.type === 'video'">
          <el-upload
            :show-file-list="false"
            :http-request="handleVideoUpload"
            action=""
            :auto-upload="true"
            :disabled="uploadingVideo"
          >
            <el-button :loading="uploadingVideo">{{ uploadingVideo ? '上传中...' : '选择视频' }}</el-button>
          </el-upload>
          <div v-if="tutorialForm.url" class="video-preview">
            <video :src="tutorialForm.url" controls style="width: 100%; max-height: 300px; margin-top: 10px;" />
          </div>
        </el-form-item>
        <el-form-item label="视频链接" v-if="tutorialForm.type === 'video'">
          <el-input v-model="tutorialForm.url" placeholder="或输入视频链接" />
        </el-form-item>
        <el-form-item label="链接地址" v-if="tutorialForm.type === 'link'">
          <el-input v-model="tutorialForm.url" placeholder="请输入链接地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="tutorialEditVisible = false">取消</el-button>
        <el-button type="primary" round @click="handleSubmitTutorial">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'

const MINIO_UPLOAD_URL = '/minio/upload'

const dishList = ref([])
const currentDish = ref(null)
const currentTutorials = ref([])
const tutorialTab = ref('video')
const dialogVisible = ref(false)
const tutorialDialogVisible = ref(false)
const tutorialEditVisible = ref(false)
const isEdit = ref(false)
const isEditTutorial = ref(false)
const uploadingVideo = ref(false)
const uploadingImage = ref(false)

const form = ref({
  id: null,
  name: '',
  image: ''
})

const tutorialForm = ref({
  id: null,
  dishId: null,
  title: '',
  type: 'video',
  url: '',
  sortOrder: 0
})

// 计算属性: 视频教程
const videoTutorials = computed(() => {
  return currentTutorials.value.filter(t => t.type === 'video')
})

// 计算属性: 链接教程
const linkTutorials = computed(() => {
  return currentTutorials.value.filter(t => t.type === 'link')
})

// 获取菜谱列表(优化:只调用一次接口获取所有数据)
const fetchDishes = async () => {
  try {
    const res = await axios.get('/api/dishes/list')
    dishList.value = (res.data.data || []).map(dish => ({
      ...dish,
      tutorialCount: 0  // 初始为0,管理教程时再加载
    }))
  } catch (error) {
    console.error('❌ 获取菜谱列表失败', error)
    ElMessage.error('❌ 获取菜谱列表失败')
  }
}

// 添加菜谱
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    id: null,
    name: '',
    image: ''
  }
  dialogVisible.value = true
}

// 编辑菜谱
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 提交菜谱
const handleSubmit = async () => {
  if (!form.value.name) {
    ElMessage.warning('⚠️ 请输入菜名')
    return
  }

  try {
    if (isEdit.value) {
      await axios.post('/api/dishes/update', form.value)
      ElMessage.success('✅ 菜谱更新成功')
    } else {
      await axios.post('/api/dishes/add', form.value)
      ElMessage.success('✅ 菜谱添加成功')
    }
    dialogVisible.value = false
    await fetchDishes()
  } catch (error) {
    console.error('❌ 保存失败', error)
    ElMessage.error('❌ 保存失败')
  }
}

// 删除菜谱
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除菜谱 "${row.name}" 吗?该菜谱下的所有教程也会被删除`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await axios.post('/api/dishes/delete', { id: row.id })
    ElMessage.success('✅ 菜谱删除成功')
    await fetchDishes()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('❌ 删除失败', error)
      ElMessage.error('❌ 删除失败')
    }
  }
}

// 管理教程
const handleManageTutorials = async (row) => {
  currentDish.value = row
  tutorialDialogVisible.value = true
  tutorialTab.value = 'video'  // 默认显示视频
  await fetchTutorials(row.id)
}

// 获取教程列表
const fetchTutorials = async (dishId) => {
  try {
    const res = await axios.get('/api/tutorials/list', {
      params: { dishId }
    })
    currentTutorials.value = res.data.data || []
    // 更新菜谱的教程数量
    const dish = dishList.value.find(d => d.id === dishId)
    if (dish) {
      dish.tutorialCount = currentTutorials.value.length
    }
  } catch (error) {
    console.error('❌ 获取教程列表失败', error)
    ElMessage.error('❌ 获取教程列表失败')
  }
}

// 添加教程
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
}

// 编辑教程
const handleEditTutorial = (row) => {
  isEditTutorial.value = true
  tutorialForm.value = { ...row }
  tutorialEditVisible.value = true
}

// 提交教程
const handleSubmitTutorial = async () => {
  if (!tutorialForm.value.title) {
    ElMessage.warning('⚠️ 请输入教程标题')
    return
  }

  try {
    if (isEditTutorial.value) {
      await axios.post('/api/tutorials/update', tutorialForm.value)
      ElMessage.success('✅ 教程更新成功')
    } else {
      await axios.post('/api/tutorials/add', tutorialForm.value)
      ElMessage.success('✅ 教程添加成功')
    }
    tutorialEditVisible.value = false
    await fetchTutorials(currentDish.value.id)
  } catch (error) {
    console.error('❌ 保存失败', error)
    ElMessage.error('❌ 保存失败')
  }
}

// 删除教程
const handleDeleteTutorial = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该教程吗?', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await axios.post('/api/tutorials/delete', { id: row.id })
    ElMessage.success('✅ 教程删除成功')
    await fetchTutorials(currentDish.value.id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('❌ 删除失败', error)
      ElMessage.error('❌ 删除失败')
    }
  }
}

// 图片上传处理(修复:使用 http-request)
const handleImageUpload = async (options) => {
  const file = options.file
  
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('❌ 只能上传图片文件')
    return
  }
  
  uploadingImage.value = true
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const res = await axios.post(MINIO_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (res.data.accessUrl) {
      form.value.image = res.data.accessUrl
      ElMessage.success('✅ 图片上传成功')
    } else {
      ElMessage.error('❌ 图片上传失败')
    }
  } catch (error) {
    console.error('❌ 图片上传失败', error)
    ElMessage.error('❌ 图片上传失败: ' + (error.response?.data?.error || error.message))
  } finally {
    uploadingImage.value = false
  }
}

// 视频上传处理(修复:使用 http-request)
const handleVideoUpload = async (options) => {
  const file = options.file
  
  const isVideo = file.type.startsWith('video/')
  if (!isVideo) {
    ElMessage.error('❌ 只能上传视频文件')
    return
  }
  
  uploadingVideo.value = true
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const res = await axios.post(MINIO_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (res.data.accessUrl) {
      tutorialForm.value.url = res.data.accessUrl
      ElMessage.success('✅ 视频上传成功')
    } else {
      ElMessage.error('❌ 视频上传失败')
    }
  } catch (error) {
    console.error('❌ 视频上传失败', error)
    ElMessage.error('❌ 视频上传失败: ' + (error.response?.data?.error || error.message))
  } finally {
    uploadingVideo.value = false
  }
}

onMounted(() => {
  fetchDishes()
})
</script>

<style scoped>
.dish-manage {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.header:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.header h2 {
  color: #333;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.tutorial-header {
  margin-bottom: 16px;
}

.tutorial-tabs {
  margin-top: 10px;
}

.tutorial-link {
  color: #409eff;
  text-decoration: none;
}

.tutorial-link:hover {
  text-decoration: underline;
}

.no-image {
  color: #999;
  font-size: 12px;
}

.no-video {
  color: #999;
  font-size: 12px;
}

.tutorial-count {
  font-weight: bold;
  color: #333;
}

.video-preview {
  margin-top: 10px;
}

/* 黑白风格表格 */
:deep(.black-white-table) {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

:deep(.black-white-table .el-table__header th) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: bold;
  border: none !important;
  font-size: 14px;
  padding: 16px 0;
}

:deep(.black-white-table .el-table__row) {
  transition: all 0.3s;
}

:deep(.black-white-table .el-table__row:hover) {
  background: #f5f7fa !important;
  transform: scale(1.001);
}

:deep(.black-white-table .el-table__row td) {
  border-color: #ebeef5 !important;
  color: #333 !important;
  padding: 14px 0;
}

/* 黑白风格弹窗 */
:deep(.black-white-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  margin: 0;
  border-radius: 8px 8px 0 0;
}

:deep(.black-white-dialog .el-dialog__title) {
  color: white !important;
  font-weight: bold;
  font-size: 18px;
}

:deep(.black-white-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white !important;
  font-size: 20px;
}

:deep(.black-white-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: #f0f0f0 !important;
}

:deep(.black-white-dialog .el-dialog__body) {
  padding: 30px 20px;
  background: white;
}

:deep(.black-white-dialog .el-dialog__footer) {
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  border-radius: 0 0 8px 8px;
}

:deep(.black-white-dialog) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.image-upload-box {
  width: 200px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background: #fafafa;
}

.image-upload-box:hover {
  border-color: #333;
  background: #f0f0f0;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.upload-placeholder span {
  margin-top: 8px;
  font-size: 14px;
}
</style>
