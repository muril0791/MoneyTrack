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
          <p class="text-neutral-500 text-sm mt-2 font-medium uppercase tracking-widest">Recuperar acesso</p>
        </div>
       
        <form v-if="!success" @submit.prevent="handleForgot" class="space-y-4">
          <div>
            <label for="email" class="block text-sm text-neutral-300 mb-1">E-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 text-[15px] placeholder:text-neutral-500 transition"
              placeholder="voce@email.com"
            />
          </div>

          <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 transition shadow-md shadow-emerald-500/10">
            {{ loading ? 'Enviando...' : 'Enviar link' }}
          </button>
        </form>

        <div v-else class="text-center py-4">
          <div class="text-emerald-400 mb-4 text-4xl">✓</div>
          <p class="text-neutral-300 mb-6">Se o e-mail estiver cadastrado, você receberá um link em breve.</p>
          <p class="text-xs text-neutral-500 mb-4">(Verifique seu terminal/console para ver o link mockado)</p>
          <router-link to="/login" class="text-emerald-400 hover:text-emerald-300 font-medium">
            Voltar para o login
          </router-link>
        </div>

        <div v-if="!success" class="mt-6 text-center text-sm text-neutral-400">
          Lembrou a senha?
          <router-link to="/login" class="text-emerald-400 hover:text-emerald-300 font-medium">
            Voltar para o login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/api";

const email = ref("");
const error = ref("");
const loading = ref(false);
const success = ref(false);

async function handleForgot() {
  error.value = "";
  loading.value = true;

  try {
    await api.post("/auth/forgot-password", { email: email.value });
    success.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || "Erro ao solicitar recuperação.";
  } finally {
    loading.value = false;
  }
}
</script>
