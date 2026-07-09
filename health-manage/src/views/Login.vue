<template>
  <div class="login-container">
    <h1>个人健康管理系统</h1>
    <div class="login-box">
      <h2>登录</h2>
      <input type="text" v-model="form.username" placeholder="请输入用户名" />
      <input type="password" v-model="form.password" placeholder="请输入密码" />
      <button @click="handleLogin">登录</button>
      <router-link to="/register">去注册</router-link>
      <p v-if="errorMsg" style="color:red;font-size:14px;">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'

const router = useRouter()
const errorMsg = ref('')

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  try {
    const res = await request.post('/auth/login', {
      username: form.username,
      password: form.password
    })
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('username', form.username)
      alert('登录成功！')
      router.push('/home')
    } else {
      errorMsg.value = res.data.message || '登录失败'
    }
  } catch (error) {
    errorMsg.value = '网络错误'
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-container h1 {
  color: white;
  font-size: 36px;
  margin-bottom: 30px;
}
.login-box {
  background: white;
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login-box h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}
.login-box input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}
.login-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
}
.login-box button {
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}
.login-box button:hover {
  background: #5a6fd6;
}
.login-box a {
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}
.login-box a:hover {
  text-decoration: underline;
}
</style>
