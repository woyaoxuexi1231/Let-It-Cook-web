import axios from 'axios'
import { getProxyTarget } from '@/utils/proxyUrl'

const API_BASE_URL = '/api/let-it-cook/api'

// 存储客户端真实IP
let clientIP = '';

// IP缓存相关常量
const IP_CACHE_KEY = 'client_real_ip';
const IP_CACHE_TIMESTAMP_KEY = 'client_real_ip_timestamp';
const IP_CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

// 从localStorage获取缓存的IP
function getCachedIP() {
    try {
        const cachedIP = localStorage.getItem(IP_CACHE_KEY);
        const cachedTime = localStorage.getItem(IP_CACHE_TIMESTAMP_KEY);
        if (cachedIP && cachedTime) {
            const elapsed = Date.now() - parseInt(cachedTime);
            if (elapsed < IP_CACHE_DURATION) {
                return cachedIP;
            }
        }
    } catch (e) {
        console.warn('读取IP缓存失败:', e);
    }
    return null;
}

// 保存IP到localStorage缓存
function saveIPToCache(ip) {
    try {
        localStorage.setItem(IP_CACHE_KEY, ip);
        localStorage.setItem(IP_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
        console.warn('保存IP缓存失败:', e);
    }
}

// 备选IP查询API列表（按优先级分组，并发查询）
const IP_API_LIST = [
  // 第一组：优先尝试（JSON格式，响应较快）
  { url: 'https://api.ipify.org?format=json', type: 'json', extract: 'ip', group: 1 },
  { url: 'https://api64.ipify.org?format=json', type: 'json', extract: 'ip', group: 1 },
  // 第二组：备用（JSON格式）
  { url: 'https://ip.seeip.org/json', type: 'json', extract: 'ip', group: 2 },
  { url: 'https://api.my-ip.io/v2/ip', type: 'json', extract: 'ip', group: 2 },
  // 第三组：降级（纯文本格式）
  { url: 'https://api.ipify.org', type: 'text', group: 3 },
  { url: 'https://icanhazip.com', type: 'text', group: 3 },
  { url: 'https://ifconfig.me/ip', type: 'text', group: 3 },
  { url: 'https://ifconfig.io/ip', type: 'text', group: 3 }
]

// 获取客户端真实IP（多线程并发查询，任一成功即返回，支持10分钟缓存）
async function fetchClientIP() {
    // 优先从缓存读取
    const cachedIP = getCachedIP();
    if (cachedIP) {
        clientIP = cachedIP;
        console.log('📦 使用缓存的客户端IP:', clientIP);
        return clientIP;
    }

    if (clientIP) return clientIP;

    console.log('🔍 开始并发查询客户端IP...');

    // 创建单个API请求（带超时）
    const createRequest = (api) => {
        return new Promise((resolve) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
                resolve({ success: false, api: api.url, error: 'timeout' });
            }, 5000); // 5秒超时

            fetch(api.url, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json, text/plain' },
                cache: 'no-cache'
            })
                .then(async (response) => {
                    clearTimeout(timeout);
                    if (!response.ok) {
                        resolve({ success: false, api: api.url, error: `HTTP ${response.status}` });
                        return;
                    }

                    let ip = '';
                    try {
                        if (api.type === 'json') {
                            const data = await response.json();
                            ip = data[api.extract] || '';
                        } else {
                            ip = await response.text();
                            ip = ip.trim();
                        }

                        if (isValidIP(ip)) {
                            resolve({ success: true, ip: ip, api: api.url });
                        } else {
                            resolve({ success: false, api: api.url, error: 'invalid IP format' });
                        }
                    } catch (e) {
                        resolve({ success: false, api: api.url, error: e.message });
                    }
                })
                .catch((error) => {
                    clearTimeout(timeout);
                    resolve({ success: false, api: api.url, error: error.message });
                });
        });
    };

    // 分阶段并发查询：先查第一组，再查第二组，最后查第三组
    const groups = [1, 2, 3];
    for (const group of groups) {
        const groupApis = IP_API_LIST.filter(api => api.group === group);
        console.log(`📡 第${group}组并发查询: ${groupApis.length}个API`);

        // 并发执行当前组的所有API
        const results = await Promise.allSettled(groupApis.map(createRequest));

        // 检查是否有成功的结果
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.success) {
                clientIP = result.value.ip;
                saveIPToCache(clientIP);
                console.log(`✅ 成功获取客户端IP (${result.value.api}): ${clientIP}`);
                return clientIP;
            }
        }

        // 当前组全部失败，输出日志并尝试下一组
        console.log(`⚠️ 第${group}组全部失败，尝试下一组...`);
    }

    console.warn('❌ 所有IP查询API都失败了');
    clientIP = '';
    return clientIP;
}

// 简单验证IP地址格式
function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') return false
  ip = ip.trim()
  // IPv4验证
  const ipv4Pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  // IPv6简单验证
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$/
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip)
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