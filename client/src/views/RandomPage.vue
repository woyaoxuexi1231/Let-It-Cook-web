<template>
  <div class="app-container" ref="containerRef">
    <div class="bg-gradient"></div>
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>

    <main class="main-content">
      <div class="display-area" ref="displayRef">
        <div v-if="isRandomizing" class="randoming">
          <div class="dish-text" :key="currentDish">{{ currentDish }}</div>
        </div>

        <div v-else class="result-area">
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
                @touchstart="handleTouchMove($event)"
                @touchmove="handleTouchMove($event)"
                @touchend="resetGlow($event)"
                @click="goToDetail(dish.id, $event)"
            >
              <span class="dish-number">{{ index + 1 }}</span>
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <div class="dish-image" v-if="dish.image">
                  <img :src="getFileUrl(dish.image)" :alt="dish.name"/>
                </div>
              </div>
              <div class="glow-effect"></div>
            </div>
            <div class="ingredients-section" v-if="allIngredients.length > 0">
              <h3 class="ingredients-title">所需食材</h3>
              <div class="ingredients-list">
                <span
                    v-for="(ingredient, idx) in allIngredients"
                    :key="idx"
                    class="ingredient-tag"
                >{{ ingredient }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-tip">
            <span class="tip-line"></span>
            <span class="tip-text">点击按钮开始</span>
            <span class="tip-line"></span>
          </div>
        </div>
      </div>
    </main>

    <button
        class="action-button"
        :class="{ 'active': isRandomizing }"
        @click="toggleRandom($event)"
        @mousemove="handleMouseMove($event)"
        @mouseleave="resetGlow($event)"
        @touchstart="handleTouchMove($event)"
        @touchmove="handleTouchMove($event)"
        @touchend="resetGlow($event)"
    >
      <span class="button-inner">{{ isRandomizing ? '停止' : '开始' }}</span>
      <div class="button-glow"></div>
    </button>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import axios from 'axios'
import {getFileUrl} from '@/utils/fileUrl'
import {getProxyTarget} from '@/utils/proxyUrl'

const router = useRouter()
const containerRef = ref(null)
const displayRef = ref(null)

const isRandomizing = ref(false)
const currentDish = ref('')
const selectedDishes = ref([])
const dishes = ref([])
let randomInterval = null

const allIngredients = computed(() => {
  const ingredientsSet = new Set()
  selectedDishes.value.forEach(dish => {
    if (dish.ingredients) {
      const parts = dish.ingredients.split(/[,，;；]/).map(s => s.trim()).filter(s => s)
      parts.forEach(part => ingredientsSet.add(part))
    }
  })
  return Array.from(ingredientsSet)
})

// 获取客户端真实IP
const getClientIp = async () => {

  // 备用方案
  try {
    const response = await axios.get('https://ipinfo.io/json')
    return response.data.ip
  } catch (err) {
    console.error('备用IP获取失败:', err)
    return 'unknown'
  }

}

const fetchDishes = async () => {
  try {
    const url = '/api/let-it-cook/api/client/dishes/list'
    const fullUrl = window.location.origin + url
    const proxyTarget = getProxyTarget()
    const realUrl = proxyTarget ? proxyTarget + url.replace(/^\/api/, '') : fullUrl
    console.log('🚀 前端访问:', fullUrl)
    console.log('🎯 实际转发到:', realUrl)
    const response = await axios.post(url)
    dishes.value = response.data.data || []
  } catch (error) {
    console.error('获取菜谱失败:', error)
    dishes.value = [
      {id: 1, name: '宫保鸡丁', image: 'https://example.com/gongbaojiding.jpg'},
      {id: 2, name: '鱼香肉丝', image: 'https://example.com/yuxiangrousi.jpg'},
      {id: 3, name: '糖醋排骨', image: 'https://example.com/tangcupaigu.jpg'},
      {id: 4, name: '红烧肉', image: 'https://example.com/hongshaorou.jpg'},
      {id: 5, name: '麻婆豆腐', image: 'https://example.com/mapodoufu.jpg'}
    ]
  }
}

const fetchLastResult = async () => {
  try {
    const clientIp = await getClientIp()
    const url = '/api/let-it-cook/api/client/dishes/last-result'
    const fullUrl = window.location.origin + url
    const proxyTarget = getProxyTarget()
    const realUrl = proxyTarget ? proxyTarget + url.replace(/^\/api/, '') : fullUrl
    console.log('🚀 前端访问:', fullUrl)
    console.log('🎯 实际转发到:', realUrl)
    console.log('📡 客户端IP:', clientIp)
    const response = await axios.post(url, {clientIp})
    selectedDishes.value = response.data.data || []
  } catch (error) {
    console.error('查询上次结果失败:', error)
  }
}

const fetchRandomDishes = async (count = 3) => {
  try {
    const clientIp = await getClientIp()
    const url = '/api/let-it-cook/api/client/dishes/random'
    const fullUrl = window.location.origin + url
    const proxyTarget = getProxyTarget()
    const realUrl = proxyTarget ? proxyTarget + url.replace(/^\/api/, '') : fullUrl
    console.log('🚀 前端访问:', fullUrl)
    console.log('🎯 实际转发到:', realUrl)
    console.log('📡 客户端IP:', clientIp)
    const response = await axios.post(url, {count, clientIp})
    selectedDishes.value = response.data.data || []
  } catch (error) {
    console.error('获取随机菜谱失败:', error)
    const shuffled = [...dishes.value].sort(() => 0.5 - Math.random())
    selectedDishes.value = shuffled.slice(0, count)
  }
}

const toggleRandom = (event) => {
  // 点击时手动重置光影
  if (event && event.currentTarget) {
    resetGlow(event)
  }

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

const goToDetail = (id, event) => {
  // 点击时手动重置光影
  if (event && event.currentTarget) {
    resetGlow(event)
  }
  router.push(`/detail/${id}`)
}

const updateGlow = (element, clientX, clientY) => {
  const rect = element.getBoundingClientRect()
  const x = ((clientX - rect.left) / rect.width) * 100
  const y = ((clientY - rect.top) / rect.height) * 100

  const glowElement = element.querySelector('.glow-effect, .button-glow')
  if (glowElement) {
    glowElement.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
  }
}

const handleMouseMove = (event) => {
  updateGlow(event.currentTarget, event.clientX, event.clientY)
  event.currentTarget.style.transform = 'scale(1.02)'
}

const handleTouchMove = (event) => {
  // 触摸时也触发光影，并轻微放大
  const touch = event.touches[0]
  updateGlow(event.currentTarget, touch.clientX, touch.clientY)
  event.currentTarget.style.transform = 'scale(1.02)'
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
  await fetchLastResult()
})

onUnmounted(() => {
  if (randomInterval) clearInterval(randomInterval)
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
  padding-bottom: 120px; /* 为固定按钮留出空间 */
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 20% 20%, rgba(60, 60, 60, 0.4) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(40, 40, 40, 0.3) 0%, transparent 50%),
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
  flex-grow: 1; /* 弹性填充剩余空间 */
  width: 100%;
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: dishSlideIn 0.5s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.dish-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateX(8px);
}

.dish-number {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
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
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.tip-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.2em;
}

.ingredients-section {
  margin-top: 30px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  animation: dishSlideIn 0.5s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.ingredients-title {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px 0;
  letter-spacing: 0.15em;
}

.ingredients-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ingredient-tag {
  padding: 8px 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  letter-spacing: 0.05em;
}

.action-button {
  position: fixed; /* 固定定位 */
  bottom: 60px; /* 距离底部60px */
  left: 0;
  right: 0;
  margin: 0 auto; /* 水平居中 */
  z-index: 10; /* 确保在其他内容之上 */
  width: calc(100% - 40px); /* 宽度适应，左右各留20px */
  max-width: 600px; /* 最大宽度 */
  padding: 20px 80px;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.4em;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-button.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  animation: textPulse 1s ease-in-out infinite;
}

.button-inner {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  transition: all 0.3s ease;
  pointer-events: none;
}

@media (max-width: 768px) {
  .main-content {
    gap: 30px;
    padding: 0 10px;
  }

  .display-area {
    max-width: 100%;
    min-height: 200px;
  }

  .dish-text {
    font-size: 32px;
  }

  .dish-item {
    padding: 16px 20px;
    gap: 15px;
  }

  .dish-number {
    font-size: 12px;
    width: 20px;
  }

  .dish-name {
    font-size: 18px;
  }

  .dish-image {
    width: 50px;
    height: 38px;
  }

  .action-button {
    padding: 16px 50px;
    font-size: 16px;
    width: calc(100% - 40px); /* 宽度适应，左右各留20px */
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 10px;
    padding-bottom: 100px; /* 为固定按钮留出空间 */
  }

  .main-content {
    gap: 20px;
  }

  .display-area {
    min-height: 150px;
  }

  .dish-text {
    font-size: 26px;
  }

  .dish-item {
    padding: 12px 16px;
    gap: 12px;
  }

  .dish-name {
    font-size: 16px;
  }

  .dish-image {
    width: 45px;
    height: 34px;
  }

  .action-button {
    padding: 14px 40px;
    font-size: 14px;
    width: calc(100% - 20px); /* 宽度适应，左右各留10px */
    bottom: 50px; /* 距离底部50px */
  }
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
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

</style>