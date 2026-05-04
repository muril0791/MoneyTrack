<template>
  <section class="bg-[#1b1b1b] rounded-3xl ring-1 ring-[#2a2a2a] px-4 py-6 shadow-2xl flex-1 min-h-0 flex flex-col">
    <div class="grid grid-cols-1 lg:grid-cols-[2.8fr_1.2fr] gap-12 flex-1 min-h-0">
      <!-- Transactions Side -->
      <div class="min-w-0 flex flex-col h-full overflow-hidden">
        <div class="flex items-center justify-between mb-8 pl-4 shrink-0">
          <h3 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-bold">Lançamentos Recentes</h3>
        </div>
        
        <div class="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar relative border border-white/5 rounded-3xl bg-black/10 min-h-0">
          <table class="w-full text-left border-collapse min-w-[780px]">
            <thead class="sticky top-0 bg-[#1b1b1b] z-10">
              <tr class="text-neutral-600 text-[9px] font-bold uppercase tracking-[0.2em] border-b border-white/5">
                <th class="py-5 px-6">Descrição</th>
                <th class="py-5 px-6">Categoria</th>
                <th class="py-5 px-6">Tipo</th>
                <th class="py-5 px-6">Valor</th>
                <th class="py-5 px-6">Data</th>
                <th class="py-5 px-6 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.03]">
              <tr
                v-for="(e, i) in firstRows"
                :key="i"
                class="group cursor-pointer hover:bg-white/[0.03] transition-all duration-200"
                @click="emit('open-expense-detail', e)"
              >
                <!-- Description -->
                <td class="py-5 px-6">
                  <span class="text-white font-bold text-[13px] tracking-wide group-hover:text-emerald-400 transition-colors">{{ e.descricao || "Lançamento Geral" }}</span>
                </td>
                
                <!-- Category -->
                <td class="py-5 px-6">
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02]" :style="{ borderColor: getCategoryColor(e.categoria) + '33' }">
                    <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: getCategoryColor(e.categoria) }"></div>
                    <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      {{ categoryName(e.categoria) }}
                    </span>
                  </div>
                </td>

                <!-- Type -->
                <td class="py-5 px-6">
                  <span
                    :class="[
                      'text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-md ring-1',
                      e.tipo === 'entrada'
                        ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 ring-rose-500/20',
                    ]"
                  >
                    {{ e.tipo }}
                  </span>
                </td>

                <!-- Value -->
                <td class="py-5 px-6">
                  <span :class="['font-black text-[15px] tracking-tighter', e.tipo === 'entrada' ? 'text-emerald-500' : 'text-white']">
                    {{ e.tipo === 'entrada' ? '+' : '-' }} {{ money(e.valor) }}
                  </span>
                </td>

                <!-- Date -->
                <td class="py-5 px-6">
                  <span class="text-neutral-500 text-[11px] font-bold uppercase tracking-widest">{{ dateBR(e.data) }}</span>
                </td>

                <!-- Balance -->
                <td class="py-5 px-6 text-right">
                  <span :class="e.runningBalance >= 0 ? 'text-neutral-300' : 'text-rose-400'" class="text-[14px] font-black tracking-tighter">
                    {{ money(e.runningBalance) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="firstRows.length === 0" class="py-32 text-center">
            <svg class="w-12 h-12 text-neutral-800 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"/></svg>
            <p class="text-neutral-600 font-bold">Nenhuma transação para exibir.</p>
          </div>
        </div>
      </div>

      <!-- Chart Side -->
      <div class="lg:border-l lg:border-white/5 lg:pl-12 flex flex-col shrink-0">
        <h3 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-bold mb-10 pl-4 shrink-0">Distribuição Mensal</h3>
        <div class="flex-1 flex items-center justify-center min-h-0">
          <ExpensePieChart
            :expenses="expenses"
            :categories="categories"
            class="w-full max-w-[280px]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, watch } from "vue";
import ExpensePieChart from "./ExpensePieChart.vue";

export default {
  name: "TransactionsAndChart",
  components: { ExpensePieChart },
  props: {
    expenses: { type: Array, required: true },
    categories: { type: Array, default: () => [] },
  },
  emits: ["open-expense-detail"],
  setup(props, { emit }) {
    const firstRows = ref([]);

    const refreshRows = () => {
      const sorted = [...(props.expenses || [])].sort((a, b) => a.data.localeCompare(b.data));
      
      let currentBalance = 0;
      const mapped = sorted.map(e => {
        if (e.tipo === 'entrada') currentBalance += Number(e.valor || 0);
        else currentBalance -= Number(e.valor || 0);
        return { ...e, runningBalance: currentBalance };
      });

      firstRows.value = mapped.reverse().slice(0, 30);
    };

    const money = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Math.abs(Number(v || 0)));

    const dateBR = (s) => {
      if (!s || typeof s !== 'string') return "—";
      const [y, m, d] = s.split("-");
      if (!y || !m || !d) return s;
      return `${d} ${new Date(s + "T00:00:00").toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}`;
    };

    const categoryName = (id) =>
      props.categories.find((c) => String(c.id) === String(id))?.name || "Geral";

    const baseColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#22d3ee", "#14b8a6", "#f97316", "#84cc16", "#eab308", "#e11d48"];
    const getCategoryColor = (id) => {
      const index = props.categories.findIndex(c => String(c.id) === String(id));
      if (index === -1) return "#555";
      return baseColors[index % baseColors.length];
    };

    watch(() => props.expenses, refreshRows, { immediate: true, deep: true });

    return { firstRows, money, dateBR, categoryName, getCategoryColor, emit };
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
</style>
