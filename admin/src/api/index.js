import axios from 'axios'
import { getProxyTarget } from '@/utils/proxyUrl'

const API_BASE_URL = '/api/let-it-cook/api'

// 存储客户端真实IP
let clientIP = ''

// 获取客户端真实IP（通过第三方API）
async function fetchClientIP() {
  if (clientIP) return clientIP
  
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    clientIP = data.ip || ''
    console.log('🌐 客户端真实IP:', clientIP)
  } catch (error) {
    console.warn('⚠️ 获取客户端IP失败:', error)
    clientIP = ''
  }
  
  return clientIP
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
    const ip = await fetchClientIP()
    if (ip) {
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
    const ip = await fetchClientIP()
    const headers = {
      'Content-Type': 'multipart/form-data'
    }
    if (ip) {
      headers['X-Real-IP'] = ip
      headers['X-Client-IP'] = ip
    }
    
    return axios.post(url, formData, { headers })
  }
}

export default apiClient