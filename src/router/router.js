import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AppMain from '@/views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: AppMain, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuth = !!session
  if (to.meta.requiresAuth && !isAuth) return { name: 'Login' }
  if ((to.name === 'Login' || to.name === 'Register') && isAuth) return { name: 'Home' }
})

export default router
