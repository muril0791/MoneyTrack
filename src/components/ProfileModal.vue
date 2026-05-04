<template>
  <div class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="w-full max-w-xl bg-[#1b1b1b] rounded-[32px] shadow-2xl ring-1 ring-white/5 overflow-hidden max-h-[95vh] flex flex-col" @click.stop>
      <!-- Header -->
      <div class="px-6 py-6 md:px-8 md:py-6 border-b border-white/5 shrink-0 flex justify-between items-center bg-[#1b1b1b]/50">
        <div class="space-y-1">
          <h2 class="text-emerald-500 text-[11px] uppercase tracking-[0.3em] font-bold">Configurações</h2>
          <h3 class="text-xl font-semibold tracking-tight text-white">Meu Perfil</h3>
        </div>
        <button @click="$emit('close')" class="text-neutral-500 hover:text-white transition-colors">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar bg-[#1b1b1b]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Nome de Exibição</label>
            <input 
              v-model="form.displayName"
              type="text"
              required
              placeholder="Como você quer ser chamado?"
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">E-mail</label>
            <input 
              v-model="form.email"
              type="email"
              required
              placeholder="seu@email.com"
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
            />
          </div>

          <div class="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
             <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p class="text-[11px] uppercase tracking-widest text-emerald-500 font-bold">Alterar Senha</p>
             </div>
             <p class="text-[11px] text-neutral-500 -mt-1">Deixe em branco para manter a senha atual.</p>
             <input 
                v-model="form.password"
                type="password"
                placeholder="Nova senha (mín. 6 caracteres)"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
             />
          </div>

          <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-sm font-medium">
            {{ error }}
          </div>

          <div v-if="success" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-sm font-medium">
            Perfil atualizado com sucesso!
          </div>

          <div class="flex gap-4 pt-4">
            <button 
              type="button"
              @click="$emit('close')"
              class="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Salvar Alterações</span>
              <span v-else>Salvando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useMainStore } from '@/stores/store';
import authService from '@/services/authService';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'updated']);
const store = useMainStore();

const loading = ref(false);
const error = ref("");
const success = ref(false);

const form = reactive({
  displayName: props.user.displayName || '',
  email: props.user.email || '',
  password: ''
});

const handleSubmit = async () => {
  if (loading.value) return;
  
  error.value = "";
  success.value = false;

  if (form.password && form.password.length < 6) {
    error.value = "A nova senha deve ter pelo menos 6 caracteres.";
    return;
  }

  loading.value = true;
  
  try {
    const payload = {
      displayName: form.displayName,
      email: form.email
    };
    
    if (form.password) {
      payload.password = form.password;
    }

    const updatedUser = await authService.updateProfile(payload);
    store.setUser(updatedUser);
    success.value = true;
    
    setTimeout(() => {
      emit('updated');
      emit('close');
    }, 1500);
  } catch (err) {
    error.value = err.response?.data?.message || "Ocorreu um erro ao atualizar o perfil.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 10px;
}
</style>
