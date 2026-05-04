<template>
  <div class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="w-full max-w-lg bg-[#1b1b1b] rounded-[32px] shadow-2xl ring-1 ring-white/5 overflow-hidden flex flex-col max-h-[90vh]" @click.stop>
      <!-- Header -->
      <div class="px-6 py-6 md:px-8 md:py-6 border-b border-white/5 shrink-0 flex justify-between items-center bg-[#1b1b1b]/50">
        <div class="space-y-1">
          <h2 class="text-emerald-500 text-[11px] uppercase tracking-[0.3em] font-bold">Informações</h2>
          <h3 class="text-xl font-semibold tracking-tight text-white">Detalhes do Lançamento</h3>
        </div>
        <button @click="$emit('close')" class="text-neutral-500 hover:text-white transition-colors">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 md:p-8 space-y-4 overflow-y-auto custom-scrollbar bg-[#1b1b1b]">
        <div class="bg-[#151515] rounded-2xl p-6 space-y-4 border border-white/5">
          <div class="flex items-center justify-between border-b border-dashed border-white/10 pb-4">
            <span class="text-neutral-500 text-sm">Descrição</span>
            <span class="text-white font-bold text-right truncate max-w-[60%]">{{ expense.descricao || '—' }}</span>
          </div>
          <div class="flex items-center justify-between border-b border-dashed border-white/10 pb-4">
            <span class="text-neutral-500 text-sm">Valor</span>
            <span :class="expense.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400'" class="text-2xl font-black">
              R$ {{ Number(expense.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>
          <div class="flex items-center justify-between border-b border-dashed border-white/10 pb-4">
            <span class="text-neutral-500 text-sm">Data</span>
            <span class="text-neutral-300 font-semibold">{{ brDate(expense.data) }}</span>
          </div>
          <div class="flex items-center justify-between border-b border-dashed border-white/10 pb-4">
            <span class="text-neutral-500 text-sm">Categoria</span>
            <span class="text-neutral-300 font-semibold capitalize">{{ expense.categoria || 'Geral' }}</span>
          </div>
          <div class="flex items-center justify-between border-b border-dashed border-white/10 pb-4">
            <span class="text-neutral-500 text-sm">Método</span>
            <span class="text-neutral-300 font-semibold capitalize">{{ expense.tipoTransacao || expense.modalidade || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 md:p-6 border-t border-white/5 flex justify-end bg-[#1b1b1b]/50 shrink-0">
        <button @click="$emit('close')" class="text-xs uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-all">
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  expense: {
    type: Object,
    required: true
  }
});

const brDate = (s) => {
  if (!s) return '—';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
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
