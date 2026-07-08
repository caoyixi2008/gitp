<template>
  <div class="login-container">
    <h1>个人健康管理系统</h1>
    <div class="login-box">
      <h2>登录</h2>
      <input type="text" v-model="form.username" placeholder="请输入用户名" />
      <input type="password" v-model="form.password" placeholder="请输入密码" />
      <button @click="handleLogin">登录</button>
      <router-link to="/register">去注册</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  // 表单校验
  if (!form.username || !form.password) {
    alert('请输入用户名和密码')
    return
  }

  // 暂时使用模拟登录（等后端接口好了再切换到真实请求）
  // ===== 模拟登录开始（等后端接口好了就删掉这段）=====
  if (form.username === 'admin' && form.password === '123456') {
    localStorage.setItem('token', 'mock-token-xxx')
    localStorage.setItem('username', form.username)
    alert('登录成功！')
    router.push('/home')
    return
  } else {
    alert('用户名或密码错误！')
    return
  }
  // ===== 模拟登录结束 =====

  // 真实后端请求（等后端接口好了，把上面的模拟登录删掉，取消下面代码的注释）
  /*
  try {
    const res = await axios.post('/api/user/login', {
      username: form.username,
      password: form.password
    })
    if (res.data.code === 200 && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('username', form.username)
      router.push('/home')
    } else {
      alert(res.data.msg || '登录失败')
    }
  } catch (error) {
    alert('网络错误，请重试')
  }
  */
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