import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AppMain from '@/views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: AppMain, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('userToken')
  const isAuth = !!token
  
  if (to.meta.requiresAuth && !isAuth) {
    return { name: 'Login' }
  }
  
  if ((to.name === 'Login' || to.name === 'Register') && isAuth) {
    return { name: 'Home' }
  }
})

export default router
