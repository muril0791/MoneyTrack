<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] p-6 md:p-8">
        <!-- Logo/Header -->
        <div class="flex flex-col items-center mb-10 text-center">
          <div class="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10 overflow-hidden shadow-2xl">
             <img src="/logo.png" alt="Logo" class="w-full h-full object-cover scale-110" />
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight">Track<span class="text-emerald-500">Finances</span></h1>
          <p class="text-neutral-500 text-sm mt-2 font-medium uppercase tracking-widest">Nova Senha</p>
        </div>
       
        <form @submit.prevent="handleReset" class="space-y-4">
          <div>
            <label class="block text-sm text-neutral-300 mb-1">E-mail</label>
            <input
              v-model="email"
              type="email"
              readonly
              class="w-full bg-[#151515] border border-[#2a2a2a] outline-none rounded-lg px-4 py-3 text-[15px] text-neutral-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label for="password" class="block text-sm text-neutral-300 mb-1">Nova Senha</label>
            <div class="relative">
              <input
                id="password"
                v-model="newPassword"
                :type="show ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 text-[15px] placeholder:text-neutral-500 transition"
                placeholder="••••••••"
              />
              <button type="button"
                @click="show = !show"
                class="absolute inset-y-0 right-0 pr-3 text-neutral-400 hover:text-neutral-200 text-sm">
                {{ show ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm text-neutral-300 mb-1">Confirmar Senha</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                required
                class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 text-[15px] placeholder:text-neutral-500 transition"
                placeholder="••••••••"
              />
              <button type="button"
                @click="showConfirm = !showConfirm"
                class="absolute inset-y-0 right-0 pr-3 text-neutral-400 hover:text-neutral-200 text-sm">
                {{ showConfirm ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

          <div v-if="success" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm text-center">
            Senha atualizada com sucesso! Redirecionando...
          </div>

          <button
            type="submit"
            :disabled="loading || success"
            class="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 transition shadow-md shadow-emerald-500/10 mt-2">
            {{ loading ? 'Atualizando...' : 'Redefinir Senha' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-neutral-400">
          <router-link to="/login" class="text-emerald-400 hover:text-emerald-300 font-medium">
            Voltar para o login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()

const email = ref('')
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const show = ref(false)
const showConfirm = ref(false)

onMounted(() => {
  email.value = route.query.email || ''
  token.value = route.query.token || ''
  
  if (!email.value || !token.value) {
    error.value = 'Link de recuperação inválido ou incompleto.'
  }
})

const handleReset = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem.'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    await api.post('/auth/reset-password', {
      email: email.value,
      token: token.value,
      newPassword: newPassword.value
    })
    
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao redefinir senha.'
  } finally {
    loading.value = false
  }
}
</script>
