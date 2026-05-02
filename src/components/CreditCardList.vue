<template>
  <div class="w-full max-w-3xl mx-auto font-sans">
    <div class="bg-[#1b1b1b] rounded-3xl shadow-2xl ring-1 ring-[#2a2a2a] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-[#2a2a2a]">
        <div class="space-y-1">
          <h2 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-semibold">Resumo Financeiro</h2>
          <h3 class="text-xl font-semibold text-white">Faturas e Limites</h3>
        </div>
        <button
          @click="$emit('close')"
          class="text-neutral-500 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-8 space-y-8">
        <!-- Filter Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151515] p-4 rounded-2xl border border-[#2a2a2a]">
          <div class="space-y-1">
            <p class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Filtrar por cartão</p>
            <p class="text-sm text-neutral-300">Escolha um cartão para detalhar</p>
          </div>
          <select
            v-model="selectedCardId"
            class="bg-[#1b1b1b] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="todos">Todos os Cartões</option>
            <option v-for="card in creditCards" :key="card.id" :value="card.id">
              {{ card.name }}
            </option>
          </select>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-5 relative overflow-hidden group">
            <p class="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-bold mb-1">Total Usado</p>
            <p class="text-2xl font-semibold text-rose-400 tracking-tight">
              <span class="text-xs opacity-50 mr-1">R$</span>{{ totalUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </p>
            <div class="absolute bottom-0 left-0 h-1 bg-rose-500/20 w-full"></div>
          </div>
          
          <div class="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-5 relative overflow-hidden group">
            <p class="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-bold mb-1">Limite Disponível</p>
            <p class="text-2xl font-semibold text-emerald-400 tracking-tight">
              <span class="text-xs opacity-50 mr-1">R$</span>{{ totalAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </p>
            <div class="absolute bottom-0 left-0 h-1 bg-emerald-500/20 w-full"></div>
          </div>

          <div class="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-5 relative overflow-hidden group">
            <p class="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-bold mb-1">Próxima Fatura</p>
            <p class="text-2xl font-semibold text-neutral-200 tracking-tight">
              <span class="text-xs opacity-50 mr-1">R$</span>{{ totalNextDue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </p>
            <div class="absolute bottom-0 left-0 h-1 bg-neutral-500/20 w-full"></div>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="space-y-4">
          <h3 class="text-neutral-500 text-[11px] uppercase tracking-widest font-semibold ml-1">Lançamentos no Cartão</h3>

          <div v-if="filteredExpenses.length === 0" class="text-center py-10 border border-dashed border-[#2a2a2a] rounded-2xl bg-[#151515]">
            <p class="text-neutral-500 text-sm">Nenhuma transação encontrada.</p>
          </div>

          <div v-else class="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="(expense, index) in filteredExpenses"
              :key="index"
              class="flex items-center justify-between bg-[#151515] border border-[#2a2a2a] rounded-2xl p-4 hover:bg-[#191919] transition-all"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-[14px] font-semibold text-white uppercase tracking-wide">{{ getCreditCardName(expense.creditCardId) }}</p>
                    <span v-if="expense.parcelas" class="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase font-bold">
                      {{ expense.parcelas }}x
                    </span>
                  </div>
                  <p class="text-[10px] text-neutral-500 uppercase tracking-widest">
                    Compra em {{ formatDataShort(expense.data) }} • Venc. {{ computePaymentDateShort(expense) }}
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-[15px] font-bold text-rose-400 tracking-tight">
                  <span class="text-[10px] opacity-60 mr-0.5">R$</span>{{ expense.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </p>
                <p class="text-[9px] text-neutral-600 uppercase font-bold tracking-tighter">
                  Limite rest.: {{ formatCurrency(computeAvailableLimit(expense)) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-4 border-t border-[#2a2a2a] bg-[#151515]/50 flex justify-end">
        <button
          @click="$emit('close')"
          class="text-[12px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-all"
        >
          Fechar Resumo
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";

export default {
  name: "CreditCardList",
  props: {
    creditCards: { type: Array, required: true },
    expenses: { type: Array, required: true },
  },
  setup(props) {
    const selectedCardId = ref("todos");

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
      const dueMonth =
        Number(card.dueDay) > Number(card.closingDay) ? m : m + 1;
      return clampDay(y, dueMonth, Number(card.dueDay));
    };

    const getCreditCardName = (id) => props.creditCards.find(c => c.id === id)?.name || "Cartão";

    const filteredExpenses = computed(() => {
      let filtered = props.expenses.filter(
        (expense) =>
          expense.tipo === "saida" &&
          expense.tipoTransacao === "cartao-credito" &&
          expense.creditCardId
      );
      if (selectedCardId.value !== "todos") {
        filtered = filtered.filter(
          (expense) => expense.creditCardId === selectedCardId.value
        );
      }
      return filtered;
    });

    const computePaymentDateShort = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return "";
      const purchase = new Date(expense.data + "T00:00:00");
      const first = dueDateFrom(purchase, card);
      return first.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    };

    const outstandingValue = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return 0;
      const purchase = new Date(expense.data + "T00:00:00");
      const firstDue = dueDateFrom(purchase, card);
      const n = Math.max(1, Number(expense.parcelas || 1));
      const parcela = Number(expense.valor) / n;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let total = 0;
      for (let i = 0; i < n; i++) {
        const pay = new Date(
          firstDue.getFullYear(),
          firstDue.getMonth() + i,
          firstDue.getDate()
        );
        if (pay >= today) total += parcela;
      }
      return total;
    };

    const totalUsed = computed(() =>
      filteredExpenses.value.reduce((acc, e) => acc + outstandingValue(e), 0)
    );

    const computeAvailableLimit = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return 0;
      const used = filteredExpenses.value
        .filter((exp) => exp.creditCardId === card.id)
        .reduce((sum, exp) => sum + outstandingValue(exp), 0);
      return card.limit - used;
    };

    const totalAvailable = computed(() => {
      if (selectedCardId.value !== "todos") {
        const card = props.creditCards.find(
          (c) => c.id === selectedCardId.value
        );
        if (card) return card.limit - totalUsed.value;
        return 0;
      }
      return props.creditCards.reduce((acc, card) => {
        const used = props.expenses
          .filter(e => e.tipo === "saida" && e.tipoTransacao === "cartao-credito" && e.creditCardId === card.id)
          .reduce((s, e) => s + outstandingValue(e), 0);
        return acc + (card.limit - used);
      }, 0);
    });

    const totalNextDue = computed(() => totalUsed.value);

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));

    const formatDataShort = (s) =>
      new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

    return {
      selectedCardId,
      filteredExpenses,
      totalUsed,
      totalAvailable,
      totalNextDue,
      formatCurrency,
      formatDataShort,
      computePaymentDateShort,
      computeAvailableLimit,
      getCreditCardName
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
  background: #2a2a2a;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #333;
}
</style>
