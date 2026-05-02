<template>
  <div class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="w-full max-w-xl bg-[#1b1b1b] rounded-[32px] shadow-2xl ring-1 ring-white/5 overflow-hidden" @click.stop>
      <div class="p-8 space-y-8">
        <div class="space-y-2">
          <h2 class="text-emerald-500 text-[11px] uppercase tracking-[0.3em] font-bold text-center sm:text-left">
            {{ editingGoal ? 'Editar Planejamento' : 'Novo Planejamento' }}
          </h2>
          <h3 class="text-3xl font-semibold tracking-tight text-white text-center sm:text-left">
            {{ editingGoal ? 'Ajuste sua meta' : 'Qual o seu objetivo?' }}
          </h3>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Título da Meta</label>
            <input 
              v-model="form.title"
              type="text"
              placeholder="Ex: Viagem para Europa"
              required
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Valor Objetivo</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                <input 
                  v-model.number="form.targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  required
                  class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Já guardado</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                <input 
                  v-model.number="form.currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Data de Início</label>
              <input 
                v-model="form.startDate"
                type="date"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all color-scheme-dark"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Data Final</label>
              <input 
                v-model="form.endDate"
                type="date"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all color-scheme-dark"
              />
            </div>
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
              :disabled="submitting"
              class="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!submitting">{{ editingGoal ? 'Salvar Alterações' : 'Criar Meta' }}</span>
              <span v-else>Salvando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

const props = defineProps({
  editingGoal: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'create', 'update']);

const submitting = ref(false);
const form = reactive({
  title: '',
  targetAmount: null,
  currentAmount: 0,
  startDate: '',
  endDate: '',
});

onMounted(() => {
  if (props.editingGoal) {
    form.title = props.editingGoal.title;
    form.targetAmount = props.editingGoal.targetAmount;
    form.currentAmount = props.editingGoal.currentAmount;
    
    if (props.editingGoal.startDate) {
      form.startDate = new Date(props.editingGoal.startDate).toISOString().split('T')[0];
    }
    if (props.editingGoal.endDate) {
      form.endDate = new Date(props.editingGoal.endDate).toISOString().split('T')[0];
    }
  }
});

const handleSubmit = async () => {
  if (submitting.value) return;
  submitting.value = true;
  
  try {
    const payload = { ...form };
    if (!payload.startDate) delete payload.startDate;
    if (!payload.endDate) delete payload.endDate;

    if (props.editingGoal) {
      await emit('update', { id: props.editingGoal.id, ...payload });
    } else {
      await emit('create', payload);
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.color-scheme-dark {
  color-scheme: dark;
}
</style>
