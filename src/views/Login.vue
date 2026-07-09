<template>
  <div>
    <h2>登录测试</h2>
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="login">登录</button>
    <p>{{ result }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '../utils/request'

const username = ref('')
const password = ref('')
const result = ref('')

const login = async () => {
  try {
    const res = await request.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })
    result.value = JSON.stringify(res.data)
  } catch (e) {
    result.value = '登录失败'
  }
}
</script>
