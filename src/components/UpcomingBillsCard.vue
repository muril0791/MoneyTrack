<template>
  <div class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] px-4 py-5 overflow-hidden relative group">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-bold">Vencimentos</h3>
      </div>
      <button 
        @click="$emit('open-all')"
        class="text-[9px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors"
      >
        Ver Tudo
      </button>
    </div>

    <!-- Bills List -->
    <div v-if="upcomingBills.length > 0" class="space-y-3">
      <div 
        v-for="bill in upcomingBills" 
        :key="bill.id" 
        class="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 group/item hover:border-amber-500/30 transition-all"
      >
        <div class="flex items-center gap-3">
          <div class="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/5 shrink-0">
            <span class="text-[8px] font-black text-neutral-600 uppercase leading-none">Dia</span>
            <span class="text-[13px] font-bold text-white">{{ bill.dueDay }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-[12px] font-bold text-white truncate max-w-[90px]">{{ bill.title }}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span :class="getStatusColor(bill.dueDay)" class="w-1.5 h-1.5 rounded-full"></span>
              <span class="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter">{{ getStatusLabel(bill.dueDay) }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="text-right">
            <p class="text-[11px] font-black text-white">R$ {{ Number(bill.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
          </div>
          <button 
            @click="$emit('pay', bill)"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10 active:scale-90"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-8 text-center border-2 border-dashed border-[#2a2a2a] rounded-2xl">
      <p class="text-xs text-neutral-500">Tudo pago por aqui! 🎉</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  bills: {
    type: Array,
    default: () => []
  }
});

defineEmits(['open-all', 'pay']);

const upcomingBills = computed(() => {
  // Filter unpaid bills and sort by due day
  return props.bills
    .filter(b => b.status !== 'paid')
    .sort((a, b) => a.dueDay - b.dueDay)
    .slice(0, 3); // Show only top 3
});

const today = new Date().getDate();

const getStatusColor = (dueDay) => {
  if (dueDay === today) return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
  if (dueDay < today) return 'bg-rose-500/50';
  if (dueDay <= today + 3) return 'bg-amber-500';
  return 'bg-neutral-600';
};

const getStatusLabel = (dueDay) => {
  if (dueDay === today) return 'Vence Hoje';
  if (dueDay < today) return 'Atrasada';
  if (dueDay <= today + 3) return 'Vence em Breve';
  return 'Pendente';
};
</script>
