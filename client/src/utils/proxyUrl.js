/**
 * 获取 Vite 代理配置的后端地址
 * 
 * 【开发环境】从 vite.config.js 的 proxy.target 读取
 * 【生产环境】返回空（不经过代理，直接访问当前域名）
 */
export function getProxyTarget() {
  // 开发环境：vite 代理配置
  const proxyConfig = {
    '/api': 'http://192.168.2.102:19999'
  }
  
  // 如果是开发环境，返回代理目标地址
  if (import.meta.env.DEV) {
    return proxyConfig['/api']
  }
  
  // 生产环境返回空（不经过代理）
  return ''
}
