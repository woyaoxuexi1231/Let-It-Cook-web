<template>
  <div class="app-container" ref="containerRef">
    <div class="bg-gradient"></div>
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>

    <main class="main-content">
      <div class="detail-area">
        <div class="detail-header">
          <button class="back-button" @click="goBack">
            &larr; 返回
          </button>
          <h2 class="detail-title">{{ dishDetail ? dishDetail.name : '加载中...' }}</h2>
        </div>

        <div class="detail-content" v-if="dishDetail">
          <div class="dish-image-large" v-if="dishDetail.image">
            <img :src="getFileUrl(dishDetail.image)" :alt="dishDetail.name" />
          </div>

          <div class="tutorials-section">
            <h3 class="section-title">教程</h3>
            <div v-if="dishDetail.tutorials && dishDetail.tutorials.length > 0" class="tutorials-list">
              <div
                v-for="(tutorial, index) in dishDetail.tutorials"
                :key="index"
                class="tutorial-item"
              >
                <div class="tutorial-info">
                  <h4 class="tutorial-title">{{ tutorial.title }}</h4>
                  <span class="tutorial-type">{{ tutorial.type === 'video' ? '视频' : '链接' }}</span>
                </div>
                <div v-if="tutorial.type === 'video'" class="video-container">
                  <video
                    :src="getFileUrl(tutorial.url)"
                    controls
                    class="tutorial-video"
                  ></video>
                </div>
                <a
                  v-else
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

        <div v-else class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">加载中...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { getFileUrl } from '@/utils/fileUrl'
import { getProxyTarget } from '@/utils/proxyUrl'

const router = useRouter()
const route = useRoute()
const containerRef = ref(null)

const dishDetail = ref(null)

const fetchDishDetail = async (id) => {
  try {
    const url = '/api/let-it-cook/api/client/dishes/detail'
    const fullUrl = window.location.origin + url
    const proxyTarget = getProxyTarget()
    const realUrl = proxyTarget ? proxyTarget + url.replace(/^\/api/, '') : fullUrl
    console.log('🚀 前端访问:', fullUrl)
    console.log('🎯 实际转发到:', realUrl)
    const response = await axios.post(url, { id })
    dishDetail.value = response.data.data
  } catch (error) {
    console.error('获取菜谱详情失败:', error)
  }
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  const dishId = route.params.id
  if (dishId) {
    await fetchDishDetail(dishId)
  }
})

onActivated(async () => {
  const dishId = route.params.id
  if (dishId) {
    await fetchDishDetail(dishId)
  }
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  padding: 40px 0;
  overflow: hidden;
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
  align-items: flex-start;
  justify-content: center;
  animation: fadeInUp 1s ease-out;
  width: 100%;
  max-width: 600px;
  padding: 0 20px;
}

.detail-area {
  width: 100%;
  animation: fadeInUp 0.5s ease-out;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  padding: 10px 0;
}

.back-button {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.25);
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
  border-radius: 16px;
  overflow: hidden;
}

.dish-image-large img {
  width: 100%;
  height: auto;
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
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.tutorial-item:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.15);
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
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tutorial-link:hover {
  background: rgba(64, 158, 255, 0.1);
  border-color: #409eff;
}

.video-container {
  flex: 0 0 auto;
  width: 200px;
}

.tutorial-video {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
}

.no-tutorials {
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  padding: 20px;
  text-align: center;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top: 3px solid rgba(255,255,255,0.6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.1em;
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

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .app-container {
    padding: 20px 0;
  }

  .main-content {
    max-width: 100%;
    padding: 0 15px;
  }

  .detail-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    margin-bottom: 20px;
  }

  .back-button {
    align-self: flex-start;
  }

  .detail-title {
    font-size: 24px;
  }

  .detail-content {
    gap: 20px;
  }

  .tutorial-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
  }

  .tutorial-info {
    width: 100%;
  }

  .tutorial-title {
    font-size: 14px;
  }

  .video-container {
    width: 100%;
  }

  .tutorial-video {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }

  .tutorial-link {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 15px 0;
  }

  .main-content {
    padding: 0 10px;
  }

  .back-button {
    padding: 8px 16px;
    font-size: 13px;
  }

  .detail-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .tutorial-item {
    padding: 10px;
  }

  .tutorial-title {
    font-size: 13px;
  }

  .tutorial-type {
    font-size: 11px;
  }
}
</style>