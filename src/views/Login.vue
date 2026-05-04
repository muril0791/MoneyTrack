<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] p-6 md:p-8">
        <!-- Logo/Header -->
        <div class="flex flex-col items-center mb-10">
          <div class="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10 overflow-hidden shadow-2xl">
             <img src="/logo.png" alt="Logo" class="w-full h-full object-cover scale-110" />
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight">Track<span class="text-emerald-500">Finances</span></h1>
          <p class="text-neutral-500 text-sm mt-2 font-medium uppercase tracking-widest">Sua gestão inteligente</p>
        </div>
       
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm text-neutral-300 mb-1">E-mail</label>
            <div class="relative">
              <input
                id="email"
                v-model="credentials.email"
                type="email"
                required
                inputmode="email"
                autocomplete="email"
                class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 text-[15px] placeholder:text-neutral-500 transition"
                placeholder="voce@email.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm text-neutral-300 mb-1">Senha</label>
            <div class="relative">
              <input
                id="password"
                v-model="credentials.password"
                :type="show ? 'text' : 'password'"
                required
                minlength="6"
                autocomplete="current-password"
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

          <div class="flex items-center justify-between py-1">
            <label class="flex items-center gap-2 cursor-pointer group">
              <div class="relative flex items-center justify-center">
                <input 
                  v-model="remember" 
                  type="checkbox" 
                  class="peer appearance-none w-5 h-5 bg-[#151515] border border-[#2a2a2a] rounded-lg checked:bg-emerald-500 checked:border-emerald-500 transition-all outline-none"
                />
                <svg class="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span class="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Manter-me conectado</span>
            </label>

            <router-link to="/forgot-password" class="text-sm text-emerald-500 hover:text-emerald-400 font-medium">Esqueceu a senha?</router-link>
          </div>

          <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

          <button
            type="submit"
            class="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-lg py-3 transition shadow-md shadow-emerald-500/10">
            Entrar
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-neutral-400">
          Não possui conta?
          <router-link to="/register" class="text-emerald-400 hover:text-emerald-300 font-medium">
            Cadastre-se
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/store";
import authService from "@/services/authService";

const router = useRouter();
const store = useMainStore();
const credentials = ref({ email: "", password: "" });
const remember = ref(true);
const error = ref("");
const show = ref(false);

async function handleLogin() {
  error.value = "";
  const { email, password } = credentials.value;

  try {
    const user = await authService.signIn({ email, password, remember: remember.value });
    store.setUser(user);
    router.push({ name: "Home" });
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Não foi possível entrar.";
  }
}
</script>
