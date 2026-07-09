import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // ===== 登录注册 → Java 后端（曹祎茜 10.133.132.79:8080）=====
      '/api/user/login': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      },
      '/api/user/register': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      },
      // ===== 个人资料 + 目标 → JS 后端（闵文欣 10.133.134.227:8081）=====
      '/api/user/profile': {
        target: 'http://10.133.134.227:8081',
        changeOrigin: true
      },
      '/api/goal': {
        target: 'http://10.133.134.227:8081',
        changeOrigin: true
      },
      // ===== 运动 + 饮食 + 提醒 → Java 后端（曹祎茜 10.133.132.79:8080）=====
      '/api/sport': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      },
      '/api/diet': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      },
      '/api/notice': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      }
    }
  }
})
