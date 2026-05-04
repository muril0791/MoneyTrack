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


        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="username" class="block text-sm text-neutral-300 mb-1">Nome</label>
            <input id="username" v-model="user.username" type="text" required
              class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 text-[15px] placeholder:text-neutral-500 transition"
              placeholder="Seu nome" />
          </div>

          <div>
            <label for="email" class="block text-sm text-neutral-300 mb-1">E-mail</label>
            <input id="email" v-model="user.email" type="email" required inputmode="email" autocomplete="email"
              class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 text-[15px] placeholder:text-neutral-500 transition"
              placeholder="voce@email.com" />
          </div>

          <div>
            <label for="password" class="block text-sm text-neutral-300 mb-1">Senha</label>
            <div class="relative">
              <input id="password" v-model="user.password" :type="showPass ? 'text' : 'password'" required minlength="6"
                autocomplete="new-password"
                class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 pr-16 text-[15px] placeholder:text-neutral-500 transition"
                placeholder="Mínimo 6 caracteres" />
              <button type="button" @click="showPass = !showPass"
                class="absolute inset-y-0 right-0 pr-3 text-neutral-400 hover:text-neutral-200 text-sm">
                {{ showPass ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div>
            <label for="confirm" class="block text-sm text-neutral-300 mb-1">Confirmar senha</label>
            <div class="relative">
              <input id="confirm" v-model="user.confirmPassword" :type="showConfirm ? 'text' : 'password'" required
                minlength="6" autocomplete="new-password"
                class="w-full bg-[#151515] border border-[#2a2a2a] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none rounded-lg px-4 py-3 pr-16 text-[15px] placeholder:text-neutral-500 transition"
                placeholder="Repita a senha" />
              <button type="button" @click="showConfirm = !showConfirm"
                class="absolute inset-y-0 right-0 pr-3 text-neutral-400 hover:text-neutral-200 text-sm">
                {{ showConfirm ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <button type="submit"
            class="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-lg py-3 transition shadow-md shadow-emerald-500/10">
            Cadastrar
          </button>
        </form>


        <div class="mt-6 text-center text-sm text-neutral-400">
          Já possui conta?
          <router-link to="/login" class="text-emerald-400 hover:text-emerald-300 font-medium">
            Faça login
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
const user = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const showPass = ref(false);
const showConfirm = ref(false);

async function handleRegister() {
  if (user.value.password !== user.value.confirmPassword) {
    store.addToast("As senhas não conferem.", "error");
    return;
  }

  try {
    const userResp = await authService.signUp({
      email: user.value.email,
      password: user.value.password,
      username: user.value.username,
    });
    store.setUser(userResp);
    store.addToast("Conta criada com sucesso! Bem-vindo.");
    router.push({ name: "Home" });
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Erro no cadastro.";
    store.addToast(msg, "error");
  }
}
</script>
