/**
 * 文件 URL 组装工具
 * 
 * 【自动切换】
 * 
 * 开发环境（npm run dev）：
 *   → http://192.168.2.102:9000/test-bucket/xxx.jpg
 * 
 * 生产环境（npm run build）：
 *   → /files/test-bucket/xxx.jpg
 * 
 * 不用手动配置，自动判断！
 */

// 开发环境直接访问 MinIO，生产环境通过 Nginx 代理
const isDevelopment = import.meta.env.DEV
const FILE_BASE_URL = isDevelopment 
  ? 'http://192.168.2.102:9000'  // 开发环境：直接访问 MinIO
  : '/files'                       // 生产环境：通过 Nginx 代理

export function getFileUrl(url) {
  if (!url) return ''
  // // 如果已经是完整URL，直接返回
  // if (url.startsWith('http://') || url.startsWith('https://')) {
  //   return url
  // }
  // 拼接基础路径 + 完整对象路径（包含bucket）
  return FILE_BASE_URL + url
}

export default { getFileUrl }
