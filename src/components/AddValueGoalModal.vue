<template>
  <div class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="w-full max-w-md bg-[#1b1b1b] rounded-[32px] shadow-2xl ring-1 ring-white/5 overflow-hidden" @click.stop>
      <div class="p-8 space-y-8">
        <div class="space-y-2">
          <h2 class="text-emerald-500 text-[11px] uppercase tracking-[0.3em] font-bold text-center">Guardar Dinheiro</h2>
          <h3 class="text-3xl font-semibold tracking-tight text-white text-center">{{ goal.title }}</h3>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1 text-center block w-full">Quanto você guardou hoje?</label>
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-lg">R$</span>
              <input 
                v-model.number="value"
                type="number"
                step="0.01"
                placeholder="0,00"
                required
                autofocus
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl pl-12 pr-4 py-5 text-3xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700 text-white"
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
              class="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-lg"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  goal: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'add']);

const value = ref(null);

const handleSubmit = () => {
  if (value.value > 0) {
    emit('add', { goalId: props.goal.id, value: value.value });
  }
};
</script>
