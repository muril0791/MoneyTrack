<template>
  <div class="w-full h-[100dvh] bg-[#0d0d0d] font-sans flex flex-col text-neutral-300 selection:bg-emerald-500/30 overflow-hidden">
    <!-- Main Wrapper -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      
      <!-- Home-Aligned Sidebar -->
      <aside class="w-full lg:w-80 bg-[#1b1b1b] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col shrink-0 z-20 shadow-2xl overflow-hidden">
        <div class="p-8 lg:p-10">
          <div class="flex items-center gap-3 mb-10">
            <div class="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <svg class="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
            </div>
            <div>
              <h2 class="text-emerald-500 text-[9px] uppercase tracking-[0.2em] font-bold">Track Finances</h2>
              <h3 class="text-lg font-bold text-white tracking-tight">Meus Cartões</h3>
            </div>
          </div>

          <div class="space-y-4 overflow-y-auto no-scrollbar max-h-[50vh]">
            <button
              @click="selectedCardId = 'todos'"
              :class="selectedCardId === 'todos' ? 'border-emerald-500/40 bg-emerald-500/10 text-white' : 'bg-[#121212] border-white/5 text-neutral-400 hover:bg-[#151515]'"
              class="w-full group relative overflow-hidden flex flex-col p-5 rounded-[22px] border transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>
                </div>
                <span class="text-[8px] font-bold uppercase tracking-widest opacity-30">Geral</span>
              </div>
              <p class="text-[12px] font-bold uppercase tracking-widest text-left">Visão Geral</p>
            </button>

            <button
              v-for="card in creditCards"
              :key="card.id"
              @click="selectedCardId = card.id"
              :class="selectedCardId === card.id ? 'border-emerald-500/40 bg-emerald-500/10 text-white' : 'bg-[#121212] border-white/5 text-neutral-400 hover:bg-[#151515]'"
              class="w-full group relative overflow-hidden flex flex-col p-5 rounded-[22px] border transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-4">
                 <div class="flex gap-1.5">
                   <div class="w-4 h-3 bg-emerald-500/30 rounded-sm"></div>
                   <div class="w-1.5 h-3 bg-white/10 rounded-sm"></div>
                 </div>
                 <span class="text-[8px] font-bold uppercase tracking-widest opacity-30">Credit</span>
              </div>
              <p class="text-[12px] font-bold uppercase tracking-widest text-left truncate">{{ card.name }}</p>
              <p class="text-[8px] text-neutral-600 font-mono mt-1">•••• •••• {{ card.id }}</p>
            </button>
          </div>
        </div>

        <div class="p-8 border-t border-white/5 mt-auto">
          <button @click="$emit('close')" class="w-full py-3.5 rounded-xl bg-[#121212] border border-white/10 text-neutral-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Sair
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 bg-[#0d0d0d] flex flex-col min-w-0 overflow-y-auto custom-scrollbar touch-pan-y relative">
        <div class="p-6 lg:p-12 space-y-8 max-w-[1400px] mx-auto w-full relative z-10">
          
          <!-- Minimal Header -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <h2 class="text-3xl font-bold text-white tracking-tight">
                {{ selectedCardId === 'todos' ? 'Geral' : getCreditCardName(selectedCardId) }}
              </h2>
              <p class="text-neutral-500 text-sm mt-1">Visão detalhada de faturas e limites.</p>
            </div>
            
            <div v-if="selectedCardId !== 'todos'" class="flex items-center gap-2">
               <div class="px-4 py-2 bg-[#1b1b1b] border border-white/5 rounded-xl text-center min-w-[100px]">
                  <p class="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mb-0.5">Vencimento</p>
                  <p class="text-sm font-bold text-emerald-500">Dia {{ getSelectedCard().dueDay }}</p>
               </div>
               <div class="px-4 py-2 bg-[#1b1b1b] border border-white/5 rounded-xl text-center min-w-[100px]">
                  <p class="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mb-0.5">Fechamento</p>
                  <p class="text-sm font-bold text-emerald-500">Dia {{ getSelectedCard().closingDay }}</p>
               </div>
            </div>
          </div>

          <!-- Summary Stats: Home Card Color -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div class="bg-[#1b1b1b] border border-white/5 rounded-2xl p-6 shadow-sm">
              <p class="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4">Dívida Total</p>
              <p class="text-2xl font-bold text-white">R$ {{ Number(totalUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
            </div>
            <div class="bg-[#1b1b1b] border border-white/5 rounded-2xl p-6 shadow-sm">
              <p class="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4">Próxima Fatura</p>
              <p class="text-2xl font-bold text-white">R$ {{ Number(currentInvoiceTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
            </div>
            <div class="bg-[#1b1b1b] border border-white/5 rounded-2xl p-6 shadow-sm">
              <p class="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4">Limite Disponível</p>
              <p class="text-2xl font-bold text-emerald-500">R$ {{ Number(totalAvailable).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
            </div>
          </div>

          <!-- Main Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-10 lg:gap-16">
            
            <!-- Transactions Feed -->
            <div class="space-y-6">
              <h3 class="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-600 px-1">Lançamentos Recentes</h3>
              
              <div v-if="filteredExpenses.length === 0" class="py-20 text-center border border-white/5 rounded-3xl bg-[#1b1b1b]/50">
                <p class="text-neutral-600 text-sm font-medium italic">Nenhum lançamento encontrado.</p>
              </div>

              <div v-else class="bg-[#1b1b1b] border border-white/5 rounded-3xl divide-y divide-white/[0.03] overflow-hidden shadow-sm">
                <div
                  v-for="(expense, index) in sortedExpenses"
                  :key="index"
                  class="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-all"
                >
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-black/20 border border-white/5 text-neutral-500">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 mb-0.5">
                        <p class="text-sm font-bold text-white truncate">{{ expense.descricao || 'Compra' }}</p>
                        <span v-if="expense.parcelas" class="text-[9px] text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded font-bold">
                          {{ expense.parcelas }}x
                        </span>
                      </div>
                      <p class="text-[10px] text-neutral-600 font-medium">
                        {{ getCreditCardName(expense.creditCardId) }} • {{ formatDateDetailed(expense.data) }}
                      </p>
                    </div>
                  </div>

                  <div class="text-right">
                    <p class="text-base font-bold text-white">R$ {{ Number(expense.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
                    <p class="text-[9px] text-neutral-700 font-bold uppercase tracking-tight">
                      {{ expense.parcelas ? `Parc: ${formatCurrency(Number(expense.valor) / expense.parcelas)}` : 'À vista' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dashboard Analytics -->
            <div class="space-y-10">
               <div class="bg-[#1b1b1b] border border-white/5 rounded-2xl p-8 space-y-10 shadow-sm">
                  <!-- Header -->
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Utilização do Limite</p>
                    <span class="text-xl font-bold text-white">{{ usagePercent }}%</span>
                  </div>
                  
                  <!-- Thin Progress Bar -->
                  <div class="h-1.5 bg-black/60 rounded-full overflow-hidden">
                       <div 
                         class="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                         :style="{ width: usagePercent + '%' }"
                       ></div>
                  </div>

                  <!-- Footer Stats -->
                  <div class="flex items-center justify-between pt-2">
                    <div class="space-y-1.5">
                      <p class="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Em uso</p>
                      <p class="text-base font-bold text-rose-500">R$ {{ Number(totalUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="space-y-1.5 text-right">
                      <p class="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Disponível</p>
                      <p class="text-base font-bold text-emerald-500">R$ {{ Number(totalAvailable).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
                    </div>
                  </div>
               </div>

               <!-- Projections -->
               <div class="space-y-4">
                  <div class="flex items-center justify-between px-2">
                    <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">Projeções</h4>
                    
                    <!-- Month Selector -->
                    <div class="flex bg-black/40 p-1 rounded-lg border border-white/5">
                      <button 
                        v-for="period in [6, 12, 24]" 
                        :key="period"
                        @click="projectionMonths = period"
                        :class="projectionMonths === period ? 'bg-emerald-500 text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'"
                        class="px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all min-w-[32px]"
                      >
                        {{ period }}m
                      </button>
                    </div>
                  </div>

                  <div class="bg-[#1b1b1b] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                    <div class="max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                      <div 
                        v-for="(proj, idx) in projection" 
                        :key="idx" 
                        class="flex items-center justify-between py-3.5 px-5 hover:bg-white/[0.02] transition-colors"
                      >
                        <span class="text-[12px] text-neutral-500 capitalize font-medium">{{ proj.monthLabel }}</span>
                        <span class="text-[12px] font-bold text-white">{{ formatCurrency(proj.total) }}</span>
                      </div>
                    </div>
                    <div v-if="projection.length > 8" class="p-2 bg-black/20 text-center border-t border-white/5">
                       <span class="text-[8px] text-neutral-700 font-bold uppercase">Role para ver mais</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { computed, ref, h } from "vue";

export default {
  name: "CreditCardList",
  props: {
    creditCards: { type: Array, required: true },
    expenses: { type: Array, required: true },
  },
  setup(props) {
    const selectedCardId = ref("todos");
    const projectionMonths = ref(6);

    const clampDay = (y, m, d) => {
      const last = new Date(y, m + 1, 0).getDate();
      return new Date(y, m, Math.min(d, last));
    };
    const nextClosingAfter = (purchase, closingDay) => {
      const y = purchase.getFullYear();
      const m = purchase.getMonth();
      const closeThis = clampDay(y, m, closingDay);
      if (purchase.getDate() >= closeThis.getDate())
        return clampDay(y, m + 1, closingDay);
      return closeThis;
    };
    const dueDateFrom = (purchase, card) => {
      const closing = nextClosingAfter(purchase, Number(card.closingDay));
      const y = closing.getFullYear();
      const m = closing.getMonth();
      const dueMonth = Number(card.dueDay) > Number(card.closingDay) ? m : m + 1;
      return clampDay(y, dueMonth, Number(card.dueDay));
    };

    const getCreditCardName = (id) => props.creditCards.find(c => String(c.id) === String(id))?.name || "Cartão";
    const getSelectedCard = () => props.creditCards.find(c => String(c.id) === String(selectedCardId.value)) || {};

    const filteredExpenses = computed(() => {
      let filtered = props.expenses.filter(
        (e) => e.tipo === "saida" && e.tipoTransacao === "cartao-credito" && e.creditCardId
      );
      if (selectedCardId.value !== "todos") {
        filtered = filtered.filter(e => String(e.creditCardId) === String(selectedCardId.value));
      }
      return filtered;
    });

    const sortedExpenses = computed(() => {
      return [...filteredExpenses.value].sort((a, b) => new Date(b.data) - new Date(a.data));
    });

    const outstandingValue = (expense) => {
      const card = props.creditCards.find((c) => String(c.id) === String(expense.creditCardId));
      if (!card) return 0;
      const purchase = new Date(expense.data + "T00:00:00");
      const firstDue = dueDateFrom(purchase, card);
      const n = Math.max(1, Number(expense.parcelas || 1));
      const parcela = Number(expense.valor) / n;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let total = 0;
      for (let i = 0; i < n; i++) {
        const pay = new Date(firstDue.getFullYear(), firstDue.getMonth() + i, firstDue.getDate());
        if (pay >= today) total += parcela;
      }
      return total;
    };

    const totalUsed = computed(() =>
      filteredExpenses.value.reduce((acc, e) => acc + outstandingValue(e), 0)
    );

    const selectedCardLimit = computed(() => {
      if (selectedCardId.value === 'todos') {
        return props.creditCards.reduce((sum, c) => sum + Number(c.limit || 0), 0);
      }
      return Number(getSelectedCard().limit || 0);
    });

    const totalAvailable = computed(() => selectedCardLimit.value - totalUsed.value);

    const usagePercent = computed(() => {
      if (selectedCardLimit.value === 0) return 0;
      return Math.min(100, Math.round((totalUsed.value / selectedCardLimit.value) * 100));
    });

    const projection = computed(() => {
      const months = [];
      const today = new Date();
      for (let i = 0; i < projectionMonths.value; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        months.push({
          date: d,
          monthLabel: d.toLocaleDateString('pt-BR', { month: 'long', year: '2-digit' }),
          total: 0
        });
      }

      props.expenses.forEach(e => {
        if (e.tipo !== "saida" || e.tipoTransacao !== "cartao-credito" || !e.creditCardId) return;
        if (selectedCardId.value !== 'todos' && String(e.creditCardId) !== String(selectedCardId.value)) return;

        const card = props.creditCards.find(c => String(c.id) === String(e.creditCardId));
        if (!card) return;

        const purchase = new Date(e.data + "T00:00:00");
        const firstDue = dueDateFrom(purchase, card);
        const n = Math.max(1, Number(e.parcelas || 1));
        const parcela = Number(e.valor) / n;

        for (let i = 0; i < n; i++) {
          const payDate = new Date(firstDue.getFullYear(), firstDue.getMonth() + i, firstDue.getDate());
          months.forEach(m => {
            if (m.date.getFullYear() === payDate.getFullYear() && m.date.getMonth() === payDate.getMonth()) {
              m.total += parcela;
            }
          });
        }
      });
      return months;
    });

    const currentInvoiceTotal = computed(() => {
        const today = new Date();
        const currentMonthData = projection.value.find(m => 
            m.date.getFullYear() === today.getFullYear() && 
            m.date.getMonth() === today.getMonth()
        );
        return currentMonthData?.total || 0;
    });

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));

    const formatDateDetailed = (s) =>
      new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

    return {
      selectedCardId,
      projectionMonths,
      filteredExpenses,
      sortedExpenses,
      totalUsed,
      totalAvailable,
      usagePercent,
      selectedCardLimit,
      projection,
      currentInvoiceTotal,
      formatCurrency,
      formatDateDetailed,
      getCreditCardName,
      getSelectedCard
    };
  },
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
