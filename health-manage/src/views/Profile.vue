<template>
  <div class="profile-page">
    <h2>👤 个人资料</h2>
    <div class="profile-card">
      <div class="form-group">
        <label>用户名</label>
        <input type="text" v-model="form.username" disabled />
      </div>
      <div class="form-group">
        <label>邮箱</label>
        <input type="email" v-model="form.email" />
      </div>
      <div class="form-group">
        <label>年龄</label>
        <input type="number" v-model="form.age" />
      </div>
      <div class="form-group">
        <label>身高 (cm)</label>
        <input type="number" v-model="form.height" />
      </div>
      <div class="form-group">
        <label>体重 (kg)</label>
        <input type="number" v-model="form.weight" />
      </div>
      <div class="form-group">
        <label>性别</label>
        <select v-model="form.gender">
          <option value="MALE">男</option>
          <option value="FEMALE">女</option>
        </select>
      </div>
      <button @click="handleSave" class="save-btn">保存修改</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'

const form = reactive({
  username: '',
  email: '',
  age: '',
  height: '',
  weight: '',
  gender: 'MALE'
})

// 加载用户数据（模拟，等后端好了再改）
const loadUserInfo = () => {
  // 模拟数据
  const savedUsername = localStorage.getItem('username') || 'admin'
  form.username = savedUsername
  form.email = 'admin@test.com'
  form.age = 25
  form.height = 170
  form.weight = 65
  form.gender = 'MALE'
}

const handleSave = () => {
  alert('保存成功！（模拟，等后端接口好了再真实保存）')
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.profile-page h2 {
  margin-bottom: 20px;
  color: #333;
}
.profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  max-width: 500px;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.form-group label {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
  color: #555;
}
.form-group input,
.form-group select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}
.form-group input:disabled {
  background: #f1f3f5;
  color: #888;
}
.save-btn {
  padding: 12px 30px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
}
.save-btn:hover {
  background: #5a6fd6;
}
</style>