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
              <div class="dish-item-main">
                <span class="dish-number">{{ index + 1 }}</span>
                <div class="dish-info">
                  <span class="dish-name">{{ dish.name }}</span>
                  <div class="dish-image" v-if="dish.image">
                    <img :src="getFileUrl(dish.image)" :alt="dish.name"/>
                  </div>
                </div>
              </div>
              <div class="dish-item-ingredients" v-if="dish.ingredients">
                <span
                    v-for="(ingredient, idx) in parseIngredients(dish.ingredients)"
                    :key="idx"
                    class="ingredient-tag"
                >{{ ingredient }}</span>
              </div>
              <div class="glow-effect"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="!isRandomizing && selectedDishes.length === 0" class="empty-tip">
      <span class="tip-line"></span>
      <span class="tip-text">点击按钮开始</span>
      <span class="tip-line"></span>
    </div>

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
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
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

const parseIngredients = (ingredients) => {
  if (!ingredients) return []
  return ingredients.split(/[,，;；、]/).map(s => s.trim()).filter(s => s)
}

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
  justify-content: flex-start;
  position: relative;
  overflow-x: hidden;
  padding: 20px;
  padding-bottom: 120px;
}

.bg-gradient {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at 20% 20%, rgba(60, 60, 60, 0.4) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(40, 40, 40, 0.3) 0%, transparent 50%),
  linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
}

.bg-circle {
  position: fixed;
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
  flex-grow: 1;
  width: 100%;
  max-width: 100%;
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
  max-width: 100%;
}

.dishes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.dish-item {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
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

.dish-item-main {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 30px;
  min-width: 0;
}

.dish-item-ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 30px 20px 74px;
  min-width: 0;
}

.dish-item-ingredients .ingredient-tag {
  padding: 4px 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  letter-spacing: 0.05em;
  pointer-events: none;
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
  position: fixed;
  left: 0;
  right: 0;
  bottom: 140px;
  margin: 0 auto;
  z-index: 10;
  width: calc(100% - 40px);
  max-width: 600px;
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
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 10;
  width: calc(100% - 40px);
  max-width: 600px;
  padding: 20px 80px;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.4em;
  color: #fff;
  background: rgba(20, 20, 20, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-button:hover {
  background: rgba(30, 30, 30, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-button.active {
  background: rgba(30, 30, 30, 0.8);
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

  .dish-item-main {
    padding: 16px 20px;
    gap: 15px;
  }

  .dish-item-ingredients {
    padding: 0 20px 14px 55px;
    gap: 6px;
  }

  .dish-item-ingredients .ingredient-tag {
    padding: 3px 10px;
    font-size: 11px;
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
    width: calc(100% - 40px);
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 10px;
    padding-bottom: 100px;
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

  .dish-item-main {
    padding: 12px 16px;
    gap: 12px;
  }

  .dish-item-ingredients {
    padding: 0 16px 10px 48px;
    gap: 4px;
  }

  .dish-item-ingredients .ingredient-tag {
    padding: 2px 8px;
    font-size: 10px;
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
    width: calc(100% - 20px);
    bottom: 50px;
  }

  .empty-tip {
    width: calc(100% - 20px);
    bottom: 110px;
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