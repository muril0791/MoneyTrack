<template>
  <section class="bg-[#1b1b1b] rounded-3xl ring-1 ring-[#2a2a2a] p-8">
    <div class="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-12">
      <div class="min-w-0">
        <h3 class="text-neutral-500 text-[13px] uppercase tracking-widest font-medium mb-10">Transações recentes</h3>
        
        <div class="overflow-x-auto overflow-y-auto max-h-[40rem] pr-2 custom-scrollbar relative">
          <table class="w-full text-left border-collapse min-w-[720px]">
            <thead class="sticky top-0 bg-[#1b1b1b] z-10">
              <tr class="text-neutral-500 text-[12px] uppercase font-medium tracking-widest border-b border-white/5">
                <th class="pb-4 bg-[#1b1b1b]">Transação</th>
                <th class="pb-4 bg-[#1b1b1b]">Categoria</th>
                <th class="pb-4 bg-[#1b1b1b]">Tipo</th>
                <th class="pb-4 bg-[#1b1b1b]">Valor</th>
                <th class="pb-4 bg-[#1b1b1b]">Data</th>
                <th class="pb-4 text-right bg-[#1b1b1b]">Saldo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="(e, i) in firstRows"
                :key="i"
                class="group cursor-pointer hover:bg-white/[0.02] transition-colors"
                @click="emit('open-expense-detail', e)"
              >
                <td class="py-5 pr-4">
                  <span class="text-neutral-100 font-medium text-[13px] uppercase tracking-wider">{{ e.descricao || "—" }}</span>
                </td>
                
                <td class="py-5 px-4">
                  <span
                    :class="getCategoryColor(e.categoria)"
                    class="inline-flex items-center justify-center min-w-[80px] rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider"
                  >
                    {{ categoryName(e.categoria) }}
                  </span>
                </td>

                <td class="py-5 px-4">
                  <span
                    :class="[
                      'inline-flex items-center justify-center min-w-[80px] rounded-full px-3 py-1 text-[10px] font-bold ring-1 uppercase tracking-wider',
                      e.tipo === 'entrada'
                        ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 ring-rose-500/30',
                    ]"
                  >
                    {{ e.tipo === "entrada" ? "Entrada" : "Saída" }}
                  </span>
                </td>

                <td class="py-5 px-4">
                  <span :class="['font-medium text-[16px] uppercase tracking-tight', e.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400']">
                    {{ money(e.valor) }}
                  </span>
                </td>

                <td class="py-5 px-4">
                  <span class="text-neutral-500 text-[12px] font-medium uppercase tracking-wider">{{ dateBR(e.data) }}</span>
                </td>

                <td class="py-5 pl-4 text-right">
                  <span class="text-neutral-300 font-medium text-[14px] uppercase tracking-tight">{{ money(e.runningBalance) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="firstRows.length === 0" class="py-20 text-center">
            <p class="text-neutral-500">Nenhuma transação encontrada para este período.</p>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="lg:border-l lg:border-white/5 lg:pl-10">
        <h3 class="text-neutral-500 text-[13px] uppercase tracking-widest font-medium mb-10">Distribuição</h3>
        <div class="flex flex-col items-center">
          <ExpensePieChart
            :expenses="expenses"
            :categories="categories"
            class="w-full"
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
      // Sort by date ascending to calculate running balance correctly
      const sorted = [...(props.expenses || [])].sort((a, b) => a.data.localeCompare(b.data));
      
      let currentBalance = 0;
      const mapped = sorted.map(e => {
        if (e.tipo === 'entrada') currentBalance += Number(e.valor || 0);
        else currentBalance -= Number(e.valor || 0);
        return { ...e, runningBalance: currentBalance };
      });

      // Show more transactions (up to 30) with scroll
      firstRows.value = mapped.reverse().slice(0, 30);
    };

    const money = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));

    const dateBR = (s) => {
      if (!s || typeof s !== 'string') return "—";
      const [y, m, d] = s.split("-");
      if (!y || !m || !d) return s;
      return `${d}/${m}/${y.slice(-2)}`;
    };

    const categoryName = (id) =>
      props.categories.find((c) => c.id === id)?.name || "Geral";

    const getCategoryColor = (id) => {
      const name = categoryName(id).toLowerCase();
      if (name.includes('salario') || name.includes('entrada')) return 'bg-emerald-500';
      if (name.includes('stream') || name.includes('entretenimento')) return 'bg-blue-600';
      if (name.includes('comida') || name.includes('restaurante')) return 'bg-orange-500';
      if (name.includes('transporte')) return 'bg-purple-600';
      if (name.includes('casa')) return 'bg-indigo-600';
      return 'bg-neutral-600';
    };

    watch(() => props.expenses, refreshRows, { immediate: true, deep: true });

    return { firstRows, money, dateBR, categoryName, getCategoryColor, emit };
  },
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: background 0.3s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
