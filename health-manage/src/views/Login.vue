<template>
  <div class="login-container">
    <div class="login-box">
      <h1>🏥 健康管理系统</h1>
      <p class="subtitle">记录健康生活每一天</p>
      <div class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="form.username" placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="form.password" placeholder="请输入密码" @keydown.enter="handleLogin" />
        </div>
        <button @click="handleLogin" class="login-btn">登 录</button>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <div class="register-link">
          还没有账号？<router-link to="/register">去注册</router-link>
        </div>
      </div>
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
      router.push('/profile')
    } else {
      errorMsg.value = res.data.message || '登录失败'
    }
  } catch (error) {
    errorMsg.value = '网络错误，请检查后端是否启动'
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 48px 44px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  font-size: 28px;
  color: #2d3436;
  margin-bottom: 4px;
}

.subtitle {
  text-align: center;
  color: #636e72;
  font-size: 14px;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  color: #2d3436;
  margin-bottom: 4px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #dfe6e9;
  border-radius: 10px;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 4px;
}

.login-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
}

.error-msg {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: -6px;
}

.register-link {
  text-align: center;
  color: #636e72;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
