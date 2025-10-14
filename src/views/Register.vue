<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <div class="bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] p-6 md:p-8">

        <div class="mb-6 text-center">
          <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">Criar conta</h1>
          <p class="text-sm text-neutral-400 mt-1">Comece a organizar suas finanças</p>
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

          <p v-if="error" class="text-sm text-red-400 -mb-2">{{ error }}</p>

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

      <div class="text-center mt-6 text-xs text-neutral-500">
        moneyTRACK •
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";

const router = useRouter();
const user = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const error = ref("");
const showPass = ref(false);
const showConfirm = ref(false);

async function handleRegister() {
  error.value = "";

  if (user.value.password !== user.value.confirmPassword) {
    error.value = "As senhas não conferem.";
    return;
  }


  const { data, error: err } = await supabase.auth.signUp({
    email: user.value.email,
    password: user.value.password,
    options: {
      data: { display_name: user.value.username },

      emailRedirectTo: window.location.origin,
    },
  });

  if (err) {
    error.value = err.message || "Erro no cadastro.";
    return;
  }


  if (data?.session) {
    router.push({ name: "Home" });
    return;
  }


  router.push({ name: "Login" });
}
</script>
