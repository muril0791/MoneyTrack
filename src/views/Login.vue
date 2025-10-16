<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] p-6 md:p-8">
        <div class="mb-6 text-center">
          <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">Bem-vindo de volta</h1>
          <p class="text-sm text-neutral-400 mt-1">Acesse sua conta para continuar</p>
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

          <p v-if="error" class="text-sm text-red-400 -mb-2">{{ error }}</p>

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

      <div class="text-center mt-6 text-xs text-neutral-500">
        Aurora •
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";

const router = useRouter();
const credentials = ref({ email: "", password: "" });
const error = ref("");
const show = ref(false);

async function handleLogin() {
  error.value = "";
  const { email, password } = credentials.value;

  const { data, error: err } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (err) {
    error.value = err.message || "Não foi possível entrar.";
    return;
  }

  if (data?.session) {
    router.push({ name: "Home" });
  } else {
    error.value = "Falha ao autenticar. Tente novamente.";
  }
}
</script>
