<template>
  <div class="app-container" ref="containerRef">
    <!-- 背景装饰 -->
    <div class="bg-gradient"></div>
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>
    
    <!-- 主内容 -->
    <main class="main-content">
      <!-- 随机展示区 -->
      <div class="display-area" ref="displayRef">
        <!-- 随机中 -->
        <div v-if="isRandomizing" class="randoming">
          <div class="dish-text" :key="currentDish">{{ currentDish }}</div>
        </div>
        
        <!-- 结果展示 -->
        <div v-else-if="!showDetail" class="result-area">
          <div v-if="selectedDishes.length > 0" class="dishes-list">
            <div 
              v-for="(dish, index) in selectedDishes" 
              :key="dish.id"
              class="dish-item"
              :style="{ 
                animationDelay: `${index * 0.1}s`,
                '--delay': `${index * 0.1}s`
              }"
              @mousemove="handleMouseMove($event)"
              @mouseleave="resetGlow($event)"
              @click="viewDishDetail(dish.id)"
            >
              <span class="dish-number">{{ index + 1 }}</span>
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <div class="dish-image" v-if="dish.image">
                  <img :src="dish.image" :alt="dish.name" />
                </div>
              </div>
              <div class="glow-effect"></div>
            </div>
          </div>
          <div v-else class="empty-tip">
            <span class="tip-line"></span>
            <span class="tip-text">点击按钮开始</span>
            <span class="tip-line"></span>
          </div>
        </div>
        
        <!-- 详情展示 -->
        <div v-else-if="showDetail && selectedDish" class="detail-area">
          <div class="detail-header">
            <button class="back-button" @click="showDetail = false">
              &larr; 返回
            </button>
            <h2 class="detail-title">{{ selectedDish.name }}</h2>
          </div>
          
          <div class="detail-content">
            <div class="dish-image-large" v-if="selectedDish.image">
              <img :src="selectedDish.image" :alt="selectedDish.name" />
            </div>
            
            <div class="tutorials-section">
              <h3 class="section-title">教程</h3>
              <div v-if="selectedDish.tutorials && selectedDish.tutorials.length > 0" class="tutorials-list">
                <div 
                  v-for="(tutorial, index) in selectedDish.tutorials" 
                  :key="index"
                  class="tutorial-item"
                >
                  <div class="tutorial-info">
                    <h4 class="tutorial-title">{{ tutorial.title }}</h4>
                    <span class="tutorial-type">{{ tutorial.type === 'video' ? '视频' : '链接' }}</span>
                  </div>
                  <a 
                    :href="tutorial.url" 
                    target="_blank" 
                    class="tutorial-link"
                  >
                    查看教程
                  </a>
                </div>
              </div>
              <div v-else class="no-tutorials">
                暂无教程
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 控制按钮 -->
      <button 
        v-if="!showDetail"
        class="action-button"
        :class="{ 'active': isRandomizing }"
        @click="toggleRandom"
        @mousemove="handleMouseMove($event)"
        @mouseleave="resetGlow($event)"
      >
        <span class="button-inner">{{ isRandomizing ? '停止' : '开始' }}</span>
        <div class="button-glow"></div>
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'

const containerRef = ref(null)
const displayRef = ref(null)

const isRandomizing = ref(false)
const currentDish = ref('')
const selectedDishes = ref([])
const showDetail = ref(false)
const selectedDish = ref(null)
const dishes = ref([])
let randomInterval = null

// 获取所有菜谱
const fetchDishes = async () => {
  try {
    const response = await axios.get('http://localhost:19999/api/dishes/list')
    // 新接口返回 Result 包装，数据在 response.data.data 中
    dishes.value = response.data.data || []
  } catch (error) {
    console.error('获取菜谱失败:', error)
    // 使用默认数据作为后备
    dishes.value = [
      { id: 1, name: '宫保鸡丁', image: 'https://example.com/gongbaojiding.jpg' },
      { id: 2, name: '鱼香肉丝', image: 'https://example.com/yuxiangrousi.jpg' },
      { id: 3, name: '糖醋排骨', image: 'https://example.com/tangcupaigu.jpg' },
      { id: 4, name: '红烧肉', image: 'https://example.com/hongshaorou.jpg' },
      { id: 5, name: '麻婆豆腐', image: 'https://example.com/mapodoufu.jpg' }
    ]
  }
}

// 获取菜谱详情
const fetchDishDetail = async (id) => {
  try {
    // 使用 POST 请求，参数放在 body 中
    const response = await axios.post('http://localhost:19999/api/dishes/detail', { id })
    selectedDish.value = response.data.data
  } catch (error) {
    console.error('获取菜谱详情失败:', error)
  }
}

// 随机获取菜谱
const fetchRandomDishes = async (count = 3) => {
  try {
    // 使用 POST 请求，参数放在 body 中
    const response = await axios.post('http://localhost:19999/api/dishes/random', { count })
    selectedDishes.value = response.data.data || []
  } catch (error) {
    console.error('获取随机菜谱失败:', error)
    // 使用本地随机作为后备
    const shuffled = [...dishes.value].sort(() => 0.5 - Math.random())
    selectedDishes.value = shuffled.slice(0, count)
  }
}

const toggleRandom = () => {
  if (isRandomizing.value) {
    clearInterval(randomInterval)
    isRandomizing.value = false
    nextTick(() => {
      fetchRandomDishes(3)
    })
  } else {
    selectedDishes.value = []
    startRandom()
  }
}

const startRandom = () => {
  isRandomizing.value = true
  randomInterval = setInterval(() => {
    if (dishes.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * dishes.value.length)
      currentDish.value = dishes.value[randomIndex].name
    } else {
      currentDish.value = '加载中...'
    }
  }, 80)
}

const viewDishDetail = async (id) => {
  showDetail.value = true
  await fetchDishDetail(id)
}

const handleMouseMove = (event) => {
  const element = event.currentTarget
  const rect = element.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  
  const glowElement = element.querySelector('.glow-effect, .button-glow')
  if (glowElement) {
    glowElement.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
  }
  
  element.style.transform = 'scale(1.02)'
}

const resetGlow = (event) => {
  const element = event.currentTarget
  const glowElement = element.querySelector('.glow-effect, .button-glow')
  if (glowElement) {
    glowElement.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)'
  }
  element.style.transform = 'scale(1)'
}

onMounted(async () => {
  await fetchDishes()
})

onUnmounted(() => {
  if (randomInterval) clearInterval(randomInterval)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #0a0a0a;
  min-height: 100vh;
  overflow: hidden;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dishSlideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes textPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(60,60,60,0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(40,40,40,0.3) 0%, transparent 50%),
    linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: rgba(80, 80, 80, 0.15);
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(60, 60, 60, 0.1);
  bottom: -50px;
  left: -50px;
  animation-delay: -4s;
}

.main-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 50px;
  animation: fadeInUp 1s ease-out;
}

.display-area {
  width: 100%;
  max-width: 600px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.randoming {
  animation: textPulse 0.15s ease-in-out infinite;
}

.dish-text {
  font-size: 48px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.2em;
}

.result-area {
  width: 100%;
}

.dishes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dish-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 30px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: dishSlideIn 0.5s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.dish-item:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.15);
  transform: translateX(8px);
}

.dish-number {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  width: 24px;
}

.dish-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
}

.dish-name {
  font-size: 22px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.15em;
}

.dish-image {
  width: 60px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.glow-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%);
  transition: all 0.3s ease;
  pointer-events: none;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.tip-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}

.tip-text {
  font-size: 14px;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.2em;
}

.action-button {
  position: relative;
  padding: 20px 80px;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.4em;
  color: #fff;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-button:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}

.action-button.active {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.25);
  animation: textPulse 1s ease-in-out infinite;
}

.button-inner {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%);
  transition: all 0.3s ease;
  pointer-events: none;
}

/* 详情页样式 */
.detail-area {
  width: 100%;
  max-width: 500px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 30px;
  animation: fadeInUp 0.5s ease-out;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-button {
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 16px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255,255,255,0.05);
  color: #fff;
}

.detail-title {
  font-size: 28px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  flex: 1;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.dish-image-large {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.dish-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tutorials-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-title {
  font-size: 20px;
  font-weight: 400;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.1em;
}

.tutorials-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tutorial-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tutorial-item:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.1);
}

.tutorial-info {
  flex: 1;
}

.tutorial-title {
  font-size: 16px;
  font-weight: 300;
  color: #fff;
  margin-bottom: 4px;
}

.tutorial-type {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.tutorial-link {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
  padding: 6px 12px;
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tutorial-link:hover {
  background: rgba(64, 158, 255, 0.1);
  border-color: #409eff;
}

.no-tutorials {
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  padding: 20px;
  text-align: center;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
}

@media (max-width: 768px) {
  .dish-text {
    font-size: 32px;
  }
  
  .dish-name {
    font-size: 18px;
  }
  
  .action-button {
    padding: 16px 50px;
    font-size: 16px;
  }
  
  .detail-title {
    font-size: 24px;
  }
  
  .dish-image-large {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .dish-text {
    font-size: 26px;
  }
  
  .dish-item {
    padding: 18px 20px;
    gap: 15px;
  }
  
  .dish-name {
    font-size: 16px;
  }
  
  .dish-image {
    width: 50px;
    height: 38px;
  }
  
  .detail-area {
    padding: 20px;
  }
  
  .detail-title {
    font-size: 20px;
  }
  
  .dish-image-large {
    height: 120px;
  }
}
</style>
