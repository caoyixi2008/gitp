<template>
  <div class="register-container">
    <h1>个人健康管理系统</h1>
    <div class="register-box">
      <h2>注册</h2>
      
      <input type="text" v-model="form.username" placeholder="用户名" />
      <input type="password" v-model="form.password" placeholder="密码" />
      <input type="password" v-model="form.confirmPassword" placeholder="确认密码" />
      <input type="number" v-model="form.age" placeholder="年龄" />
      <input type="number" v-model="form.height" placeholder="身高(cm)" />
      <input type="number" v-model="form.weight" placeholder="体重(kg)" />
      <select v-model="form.gender">
        <option value="">请选择性别</option>
        <option value="MALE">男</option>
        <option value="FEMALE">女</option>
      </select>
      
      <button @click="handleRegister">注册</button>
      <router-link to="/login">去登录</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  age: '',
  height: '',
  weight: '',
  gender: ''
})

const handleRegister = async () => {
  if (!form.username || !form.password || !form.confirmPassword) {
    alert('请填写完整信息')
    return
  }
  if (form.password !== form.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }
  if (form.password.length < 6) {
    alert('密码长度不能少于6位')
    return
  }

  try {
    const res = await request.post('/auth/register', {
      username: form.username,
      password: form.password,
      age: form.age || null,
      height: form.height || null,
      weight: form.weight || null,
      gender: form.gender || null
    })
    if (res.data.code === 200) {
      alert('注册成功！请登录')
      router.push('/login')
    } else {
      alert(res.data.message || '注册失败')
    }
  } catch (error) {
    alert('网络错误，请检查后端是否启动')
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-container h1 {
  color: white;
  font-size: 36px;
  margin-bottom: 30px;
}
.register-box {
  background: white;
  padding: 30px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.register-box h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}
.register-box input, .register-box select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
.register-box input:focus, .register-box select:focus {
  outline: none;
  border-color: #667eea;
}
.register-box button {
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.register-box button:hover {
  background: #5a6fd6;
}
.register-box a {
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}
</style>
