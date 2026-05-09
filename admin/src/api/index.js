import axios from 'axios'
import { getProxyTarget } from '@/utils/proxyUrl'

const API_BASE_URL = '/api/let-it-cook/api'

let clientIP = '';
const IP_CACHE_KEY = 'common_real_ip';
const IP_CACHE_TIMESTAMP_KEY = 'common_real_ip_timestamp';

function getCachedIP() {
    try {
        const cachedIP = localStorage.getItem(IP_CACHE_KEY);
        const cachedTime = localStorage.getItem(IP_CACHE_TIMESTAMP_KEY);
        if (cachedIP && cachedTime) {
            const elapsed = Date.now() - parseInt(cachedTime);
            if (elapsed < 10 * 60 * 1000) {
                return cachedIP;
            }
        }
    } catch (e) {
        console.warn('读取IP缓存失败:', e);
    }
    return null;
}

async function fetchClientIP() {
    if (clientIP) return clientIP;
    clientIP = getCachedIP() || '';
    return clientIP;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  async config => {
    // 获取客户端真实IP并添加到请求头
    // 使用自定义头 X-Custom-Real-IP 避免被内网穿透拦截
    const ip = await fetchClientIP()
    if (ip) {
      config.headers['X-Custom-Real-IP'] = ip
      config.headers['X-Real-IP'] = ip
      config.headers['X-Client-IP'] = ip
    }
    
    const fullUrl = window.location.origin + config.baseURL + config.url
    const proxyTarget = getProxyTarget()
    const realUrl = proxyTarget ? proxyTarget + (config.baseURL + config.url).replace(/^\/api/, '') : fullUrl
    console.log('🚀 前端访问:', fullUrl)
    console.log('🎯 实际转发到:', realUrl)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const dishAPI = {
  getDishes(pageNum = 1, pageSize = 10, keyword = '') {
    return apiClient.post('/dishes/list', { pageNum, pageSize, keyword })
  },

  addDish(data) {
    return apiClient.post('/dishes/add', data)
  },

  updateDish(data) {
    return apiClient.post('/dishes/update', data)
  },

  deleteDish(id) {
    return apiClient.post('/dishes/delete', { id })
  },

  addImageToDish(id, image) {
    return apiClient.post('/dishes/addImage', { id, image })
  },

  getTutorialsByDishId(dishId) {
    return apiClient.post('/dishes/tutorials/list', { dishId })
  },

  addTutorial(data) {
    return apiClient.post('/dishes/tutorials/add', data)
  },

  updateTutorial(data) {
    return apiClient.post('/dishes/tutorials/update', data)
  },

  deleteTutorial(id) {
    return apiClient.post('/dishes/tutorials/delete', { id })
  }
}

export const uploadAPI = {
  async uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    const url = '/api/minio/upload'
    const fullUrl = window.location.origin + url
    const proxyTarget = getProxyTarget()
    const realUrl = proxyTarget ? proxyTarget + url.replace(/^\/api/, '') : fullUrl
    console.log('🚀 前端访问:', fullUrl)
    console.log('🎯 实际转发到:', realUrl)
    
    // 获取客户端真实IP并添加到请求头
    // 使用自定义头 X-Custom-Real-IP 避免被内网穿透拦截
    const ip = await fetchClientIP()
    const headers = {
      'Content-Type': 'multipart/form-data'
    }
    if (ip) {
      headers['X-Custom-Real-IP'] = ip
      headers['X-Real-IP'] = ip
      headers['X-Client-IP'] = ip
    }
    
    return axios.post(url, formData, { headers })
  }
}

export default apiClient