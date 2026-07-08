import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/user/login': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/api/user/register': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/api/user/profile': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      '/api/goal': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      '/api/sport': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/api/diet': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/api/notice': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})