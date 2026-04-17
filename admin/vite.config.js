import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * Vite 配置文件
 * 
 * 【怎么用】
 * 
 * 本地开发：
 *   npm run dev
 *   访问: http://localhost:5174
 * 
 * 换端口（端口被占用时）：
 *   PowerShell: $env:PORT=3000; npm run dev
 * 
 * 打包部署：
 *   npm run build
 *   生成 dist/ 目录
 */
export default defineConfig(({ mode }) => {
  // 从环境变量读取端口，默认 5174
  const port = process.env.PORT || 5174
  
  // 生产环境配置
  const isProduction = mode === 'production'
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    // 生产环境打包配置
    base: isProduction ? '/let-it-cook-admin/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // 生成静态资源的文件名格式
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    server: {
      port: parseInt(port),
      proxy: {
        '/api': {
          target: 'http://192.168.2.102:19999',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    }
  }
})
