import axios from 'axios'
import { getProxyTarget } from '@/utils/proxyUrl'

// 存储客户端真实IP
let clientIP = ''

// 获取客户端真实IP（通过第三方API）
export async function fetchClientIP() {
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

// 创建带拦截器的 axios 实例
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：添加真实IP请求头
apiClient.interceptors.request.use(
  async config => {
    // 获取客户端真实IP并添加到请求头
    const ip = await fetchClientIP()
    if (ip) {
      config.headers['X-Real-IP'] = ip
      config.headers['X-Client-IP'] = ip
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 带日志的请求方法
export async function apiPost(url, data = {}) {
  const fullUrl = window.location.origin + url
  const proxyTarget = getProxyTarget()
  const realUrl = proxyTarget ? proxyTarget + url.replace(/^\/api/, '') : fullUrl
  console.log('🚀 前端访问:', fullUrl)
  console.log('🎯 实际转发到:', realUrl)
  
  return apiClient.post(url, data)
}

export default apiClient
