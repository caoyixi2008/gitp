import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {

      // ===== 运动 =====
      '/api/sport': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      },

      // ===== 饮食 =====
      '/api/diet': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      },

      // ===== 健康提醒 =====
      '/api/notice': {
        target: 'http://10.133.132.79:8080',
        changeOrigin: true
      },

      // ===== 体重 =====
      '/api/user/weight': {
        target: 'http://10.133.134.227:8081',
        changeOrigin: true
      }

    }
  }
})