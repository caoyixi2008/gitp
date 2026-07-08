<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">🏥 个人健康管理系统</div>
      <div class="user-info">
        <span>欢迎，{{ username }}</span>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 侧边菜单 -->
      <aside class="sidebar">
        <ul>
          <li @click="goTo('/profile')">👤 个人资料</li>
          <li @click="goTo('/target')">🎯 健康目标</li>
          <li @click="goTo('/sport')">🏃 运动记录</li>
          <li @click="goTo('/diet')">🍽️ 饮食日记</li>
          <li @click="goTo('/report')">📊 健康报表</li>
          <li @click="goTo('/notice')">🔔 消息提醒</li>
        </ul>
      </aside>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '用户')

const goTo = (path) => {
  router.push(path)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  alert('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.logo {
  font-size: 22px;
  font-weight: bold;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.logout-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.logout-btn:hover {
  background: rgba(255,255,255,0.3);
}
.main-content {
  display: flex;
  flex: 1;
}
.sidebar {
  width: 200px;
  background: #f8f9fa;
  padding: 20px 0;
  border-right: 1px solid #e9ecef;
  min-height: calc(100vh - 70px);
}
.sidebar ul {
  list-style: none;
}
.sidebar li {
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 15px;
  color: #333;
}
.sidebar li:hover {
  background: #e9ecef;
}
.content-area {
  flex: 1;
  padding: 24px 30px;
  background: #f1f3f5;
}
</style>