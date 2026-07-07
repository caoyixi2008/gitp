import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Target from '../views/Target.vue'   // ← 新增这行

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        name: 'Profile',
        component: Profile
      },
      {   // ← 新增这个对象
        path: '/target',
        name: 'Target',
        component: Target
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router