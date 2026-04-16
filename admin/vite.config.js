import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://192.168.2.102:19999/let-it-cook',
        changeOrigin: true
      },
      '/minio': {
        target: 'http://192.168.2.102:19999',
        changeOrigin: true
      }
    }
  }
})
