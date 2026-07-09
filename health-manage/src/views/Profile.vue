<template>
  <div class="profile-page">
    <h2>👤 个人资料</h2>
    <div class="profile-card">
      <div class="form-group">
        <label>用户名</label>
        <input type="text" v-model="form.username" disabled />
      </div>
      <div class="form-group">
        <label>昵称</label>
        <input type="text" v-model="form.nickname" />
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
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import request from '../utils/request'

const form = reactive({
  username: '',
  nickname: '',
  age: '',
  height: '',
  weight: '',
  gender: 'MALE'
})
const message = ref('')

const loadUserInfo = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    message.value = '请先登录'
    return
  }

  try {
    const res = await request.get('/user/profile')
    if (res.data.code === 200) {
      const data = res.data.data
      form.username = data.username || ''
      form.nickname = data.nickname || ''
      form.age = data.age || ''
      form.height = data.height || ''
      form.weight = data.weight || ''
      form.gender = data.gender || 'MALE'
    } else {
      message.value = res.data.message || '加载失败'
    }
  } catch (error) {
    message.value = '网络错误，请检查后端是否启动'
  }
}

const handleSave = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    message.value = '请先登录'
    return
  }

  try {
    const res = await request.put('/user/profile', {
      nickname: form.nickname,
      age: Number(form.age),
      gender: form.gender,
      height: Number(form.height),
      weight: Number(form.weight)
    })
    if (res.data.code === 200) {
      message.value = '✅ 保存成功！'
    } else {
      message.value = res.data.message || '保存失败'
    }
  } catch (error) {
    message.value = '网络错误，请检查后端是否启动'
  }
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
.message {
  margin-top: 12px;
  font-size: 14px;
  color: #333;
}
</style>
