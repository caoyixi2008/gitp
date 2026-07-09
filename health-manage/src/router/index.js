import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Target from '../views/Target.vue'
import Sport from '../views/Sport.vue'
import Food from '../views/Food.vue'
import Notice from '../views/Notice.vue'
import Report from '../views/Report.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      { path: '/profile', name: 'Profile', component: Profile },
      { path: '/target', name: 'Target', component: Target },
      { path: '/sport', name: 'Sport', component: Sport },
      { path: '/diet', name: 'Diet', component: Food },
      { path: '/notice', name: 'Notice', component: Notice },
      { path: '/report', name: 'Report', component: Report }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
