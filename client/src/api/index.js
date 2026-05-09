import axios from 'axios'
import { getProxyTarget } from '@/utils/proxyUrl'

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

export async function fetchClientIP() {
    if (clientIP) return clientIP;
    clientIP = getCachedIP() || '';
    return clientIP;
}

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
    // 使用自定义头 X-Custom-Real-IP 避免被内网穿透拦截
    const ip = await fetchClientIP()
    if (ip) {
      config.headers['X-Custom-Real-IP'] = ip
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
