<template>
  <div class="w-full h-[100dvh] bg-[#0d0d0d] font-sans flex flex-col text-neutral-300 selection:bg-emerald-500/30 overflow-hidden">
    <!-- Main Wrapper -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      
      <!-- Filters Sidebar -->
      <aside class="w-full lg:w-80 bg-[#1b1b1b] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col shrink-0 z-20 shadow-2xl overflow-hidden">
        <div class="p-8 lg:p-10 flex flex-col h-full">
          <div class="flex items-center gap-3 mb-10">
            <div class="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <svg class="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <div>
              <h2 class="text-emerald-500 text-[9px] uppercase tracking-[0.2em] font-bold">Transaction Hub</h2>
              <h3 class="text-lg font-bold text-white tracking-tight">Relatório Detalhado</h3>
            </div>
          </div>

          <!-- Filter Sections -->
          <div class="flex-1 space-y-8 overflow-y-auto no-scrollbar">
            <!-- Filter by Type -->
            <div class="space-y-4">
              <p class="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-1">Fluxo de Caixa</p>
              <div class="grid grid-cols-1 gap-2">
                <button 
                  v-for="t in types" :key="t.id"
                  @click="filter.type = t.id"
                  :class="filter.type === t.id ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-[#121212] border-white/5 text-neutral-500 hover:bg-[#151515]'"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all"
                >
                  <div :class="t.color" class="w-1.5 h-1.5 rounded-full"></div>
                  {{ t.label }}
                </button>
              </div>
            </div>

            <!-- Filter by Category -->
            <div class="space-y-4">
              <p class="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-1">Categoria</p>
              <select 
                v-model="filter.category"
                class="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-neutral-300 outline-none focus:border-emerald-500/50 transition-all"
              >
                <option value="todas">Todas Categorias</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <!-- Filter by Method -->
            <div class="space-y-4">
              <p class="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-1">Método de Pagamento</p>
              <select 
                v-model="filter.method"
                class="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-neutral-300 outline-none focus:border-emerald-500/50 transition-all"
              >
                <option value="todos">Todos os Métodos</option>
                <option value="pix">Pix</option>
                <option value="cartao-credito">Cartão de Crédito</option>
                <option value="cartao-debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="boleto">Boleto</option>
                <option value="transferencia">Transferência</option>
              </select>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="pt-8 border-t border-white/5 mt-auto">
            <button @click="$emit('close')" class="w-full py-3.5 rounded-xl bg-[#121212] border border-white/10 text-neutral-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Sair do Relatório
            </button>
          </div>
        </div>
      </aside>

      <!-- Detailed Main Content -->
      <main class="flex-1 bg-[#0d0d0d] flex flex-col min-w-0 overflow-hidden relative">
        <!-- Toolbar / Search -->
        <header class="p-6 lg:p-8 bg-[#0d0d0d] border-b border-white/5 flex flex-col sm:flex-row items-center gap-6 z-10">
          <div class="flex-1 w-full relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Pesquisar transação..." 
              class="w-full bg-[#1b1b1b] border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium text-white outline-none focus:border-emerald-500/30 transition-all placeholder:text-neutral-700"
            />
          </div>

          <div class="flex items-center gap-4 shrink-0">
             <div class="flex flex-col">
               <p class="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Ordenação</p>
               <select 
                 v-model="sortBy"
                 class="bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-2 text-[11px] font-bold text-neutral-300 outline-none focus:border-emerald-500/50 transition-all"
               >
                 <option value="data-desc">Recentes Primeiro</option>
                 <option value="data-asc">Antigos Primeiro</option>
                 <option value="valor-desc">Maior Valor</option>
                 <option value="valor-asc">Menor Valor</option>
               </select>
             </div>
             <button @click="exportToCSV" class="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-neutral-500 hover:text-white transition-all shadow-sm" title="Exportar CSV">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
             </button>
          </div>
        </header>

        <!-- Dynamic Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-10">
          
          <!-- Summary Row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryStat label="Entradas" :value="totals.entries" color="text-emerald-500" />
            <SummaryStat label="Saídas" :value="totals.exits" color="text-rose-500" />
            <SummaryStat label="Balanço" :value="totals.balance" :color="totals.balance >= 0 ? 'text-white' : 'text-rose-400'" />
            <SummaryStat label="Transações" :value="filteredTransactions.length" suffix=" Itens" color="text-neutral-400" />
          </div>

          <!-- Extended Transaction Table -->
          <div class="space-y-4">
            <div v-if="filteredTransactions.length === 0" class="py-40 flex flex-col items-center justify-center border border-white/5 rounded-[40px] bg-[#1b1b1b]/20">
               <div class="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center mb-6 border border-white/5">
                 <svg class="w-8 h-8 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"/></svg>
               </div>
               <p class="text-neutral-600 text-lg font-bold">Nenhum detalhe encontrado para os filtros atuais.</p>
            </div>

            <div v-else class="bg-[#1b1b1b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr class="bg-black/40 text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                      <th class="px-6 py-5">Data</th>
                      <th class="px-6 py-5">Descrição</th>
                      <th class="px-6 py-5">Tipo</th>
                      <th class="px-6 py-5">Categoria</th>
                      <th class="px-6 py-5">Método / Origem</th>
                      <th class="px-6 py-5 text-right">Valor</th>
                      <th class="px-6 py-5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/[0.03]">
                    <tr 
                      v-for="tx in filteredTransactions" :key="tx.id"
                      class="group hover:bg-white/[0.03] transition-all duration-200"
                    >
                      <!-- Data Column -->
                      <td class="px-6 py-6 whitespace-nowrap">
                        <p class="text-[12px] font-bold text-neutral-400">{{ formatDateDetailed(tx.data) }}</p>
                        <p class="text-[9px] text-neutral-700 mt-0.5 font-mono">{{ formatTime(tx.created_at) }}</p>
                      </td>

                      <!-- Description Column -->
                      <td class="px-6 py-6">
                        <div class="flex flex-col gap-1">
                          <span class="text-[14px] font-bold text-white tracking-wide">{{ tx.descricao || (tx.tipo === 'entrada' ? 'Receita Geral' : 'Despesa Geral') }}</span>
                          <span v-if="tx.parcelas" class="text-[8px] bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest w-fit">
                            Parcelado {{ tx.parcelas }}x
                          </span>
                        </div>
                      </td>

                      <!-- Type Column (New Separate Column) -->
                      <td class="px-6 py-6">
                        <span :class="tx.tipo === 'entrada' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-500 ring-rose-500/20'" 
                              class="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ring-1">
                          {{ tx.tipo }}
                        </span>
                      </td>

                      <!-- Category Column -->
                      <td class="px-6 py-6">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02]" :style="{ borderColor: getCategoryColor(tx.categoria) + '33' }">
                           <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: getCategoryColor(tx.categoria) }"></div>
                           <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                             {{ getCategoryName(tx.categoria) }}
                           </span>
                        </div>
                      </td>

                      <!-- Origin Column -->
                      <td class="px-6 py-6 whitespace-nowrap">
                        <div class="flex flex-col">
                           <span class="text-[11px] font-black text-neutral-500 uppercase tracking-widest">{{ formatMethod(tx.tipoTransacao) }}</span>
                           <span class="text-[10px] text-neutral-700 font-bold mt-0.5">
                             {{ tx.tipoTransacao === 'cartao-credito' ? getCreditCardName(tx.creditCardId) : 'Saldo em Conta' }}
                           </span>
                        </div>
                      </td>

                      <!-- Value Column -->
                      <td class="px-6 py-6 text-right">
                        <p :class="tx.tipo === 'entrada' ? 'text-emerald-500' : 'text-white'" class="text-[16px] font-black tracking-tighter">
                          {{ tx.tipo === 'entrada' ? '+' : '-' }} {{ formatCurrency(tx.valor) }}
                        </p>
                        <p v-if="tx.parcelas" class="text-[9px] text-neutral-700 font-bold mt-0.5">
                          Mensal: {{ formatCurrency(tx.valor / tx.parcelas) }}
                        </p>
                      </td>

                      <!-- Actions Column -->
                      <td class="px-6 py-6 text-center">
                        <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button @click="editTransaction(tx)" class="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-500 hover:text-emerald-500 transition-colors">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </button>
                          <button @click="deleteTransaction(tx.id)" class="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-500 hover:text-rose-500 transition-colors">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import { useMainStore } from "@/stores/store";

const SummaryStat = (props) => {
  return h('div', { class: 'bg-[#1b1b1b] border border-white/5 rounded-2xl p-6 shadow-sm' }, [
    h('p', { class: 'text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-2' }, props.label),
    h('p', { class: `text-xl font-black tracking-tight ${props.color}` }, [
      typeof props.value === 'number' && !props.suffix ? 
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(props.value) : 
        `${props.value}${props.suffix || ''}`
    ])
  ]);
};

export default {
  name: "AllTransactions",
  components: { SummaryStat },
  props: {
    expenses: { type: Array, required: true },
    categories: { type: Array, required: true },
    creditCards: { type: Array, required: true }
  },
  setup(props, { emit }) {
    const store = useMainStore();
    const searchQuery = ref("");
    const sortBy = ref("data-desc");
    const filter = ref({
      type: "todos",
      category: "todas",
      method: "todos"
    });

    const types = [
      { id: 'todos', label: 'Tudo', color: 'bg-neutral-500' },
      { id: 'entrada', label: 'Entradas', color: 'bg-emerald-500' },
      { id: 'saida', label: 'Saídas', color: 'bg-rose-500' }
    ];

    const getCategoryName = (id) => props.categories.find(c => String(c.id) === String(id))?.name || "Sem Categoria";
    const getCreditCardName = (id) => props.creditCards.find(c => String(c.id) === String(id))?.name || "Cartão";

    const baseColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#22d3ee", "#14b8a6", "#f97316", "#84cc16", "#eab308", "#e11d48"];
    const getCategoryColor = (id) => {
      const index = props.categories.findIndex(c => String(c.id) === String(id));
      if (index === -1) return "#555";
      return baseColors[index % baseColors.length];
    };

    const filteredTransactions = computed(() => {
      let result = [...props.expenses];

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(tx => tx.descricao?.toLowerCase().includes(query));
      }

      if (filter.value.type !== 'todos') {
        result = result.filter(tx => tx.tipo === filter.value.type);
      }

      if (filter.value.category !== 'todas') {
        result = result.filter(tx => String(tx.categoria) === String(filter.value.category));
      }

      if (filter.value.method !== 'todos') {
        result = result.filter(tx => tx.tipoTransacao === filter.value.method);
      }

      result.sort((a, b) => {
        if (sortBy.value === 'data-desc') return new Date(b.data) - new Date(a.data);
        if (sortBy.value === 'data-asc') return new Date(a.data) - new Date(b.data);
        if (sortBy.value === 'valor-desc') return Number(b.valor) - Number(a.valor);
        if (sortBy.value === 'valor-asc') return Number(a.valor) - Number(b.valor);
        return 0;
      });

      return result;
    });

    const totals = computed(() => {
      const entries = filteredTransactions.value
        .filter(tx => tx.tipo === 'entrada')
        .reduce((sum, tx) => sum + Number(tx.valor), 0);
      
      const exits = filteredTransactions.value
        .filter(tx => tx.tipo === 'saida')
        .reduce((sum, tx) => sum + Number(tx.valor), 0);

      return {
        entries,
        exits,
        balance: entries - exits
      };
    });

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));

    const formatDateDetailed = (s) =>
      new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" });

    const formatTime = (iso) => {
      if (!iso) return "—";
      return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };

    const formatMethod = (m) => {
      const map = {
        pix: "Pix",
        "cartao-credito": "Cartão de Crédito",
        "cartao-debito": "Cartão de Débito",
        dinheiro: "Dinheiro",
        boleto: "Boleto",
        transferencia: "Transferência",
        deposito: "Depósito"
      };
      return map[m] || m || "Indefinido";
    };

    const editTransaction = (tx) => {
      emit('edit', tx);
    };

    const deleteTransaction = async (id) => {
      if (confirm("Deseja realmente excluir este lançamento?")) {
        await store.removeExpense(id);
      }
    };

    const exportToCSV = () => {
      const headers = ["Data", "Descricao", "Tipo", "Categoria", "Metodo", "Valor"];
      const rows = filteredTransactions.value.map(tx => [
        tx.data,
        tx.descricao,
        tx.tipo,
        getCategoryName(tx.categoria),
        formatMethod(tx.tipoTransacao),
        tx.valor
      ]);
      
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `extrato_moneytrack_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      store.addToast("Relatório exportado com sucesso!");
    };

    return {
      searchQuery,
      sortBy,
      filter,
      types,
      filteredTransactions,
      totals,
      formatCurrency,
      formatDateDetailed,
      formatTime,
      formatMethod,
      getCategoryName,
      getCategoryColor,
      getCreditCardName,
      editTransaction,
      deleteTransaction,
      exportToCSV
    };
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
