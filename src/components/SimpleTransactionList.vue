<template>
  <div class="bg-[#161716] p-2 md:p-4 rounded shadow ring-1 ring-[#2a2a2a] w-full max-w-full overflow-x-hidden font-['Roboto',sans-serif] text-[#c2c3c2]">
    <header class="flex items-center justify-between mb-4 border-b border-[#c2c3c2]">
      <h2 class="text-xl font-bold">Transações</h2>
    </header>

    <div class="flex flex-col gap-2">
      <div
        v-for="(expense, index) in paginatedExpenses"
        :key="index"
        class="flex items-center gap-3 bg-[#0f0e11] hover:bg-[#151415] transition-colors p-3 rounded cursor-pointer"
        @click="openDetail(expense)"
      >
        <div class="w-10 h-10 flex items-center justify-center shrink-0">
          <span v-if="expense.tipo === 'entrada'" class="text-[#3ecf00] text-xl leading-none">↑</span>
          <span v-else class="text-[#e93030] text-xl leading-none">↓</span>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold truncate">{{ expense.descricao || formatTipo(expense.tipo) }}</p>
          <p class="text-xs opacity-90">{{ formatData(expense.data) }}</p>
        </div>

        <div class="ml-auto flex flex-col items-end gap-1 w-fit">
          <div class="text-sm font-bold">{{ formatValor(expense.valor) }}</div>
          <div class="text-xs font-semibold">{{ formatParcelas(expense) }}</div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center mt-4 gap-2">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="[
          'px-2 py-1 rounded text-xs border transition',
          currentPage === page ? 'bg-[#161716] border-[#2a2a2a]' : 'bg-[#0f0e11] border-[#2a2a2a] hover:bg-[#151515]'
        ]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleTransactionList",
  props: {
    expenses: { type: Array, required: true },
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true }
  },
  emits: ["view-more", "open-detail", "change-page"],
  methods: {
    formatTipo(tipo) {
      if (tipo === "entrada") return "Entrada";
      if (tipo === "saida") return "Saída";
      return tipo;
    },
    formatData(dataStr) {
      if (!dataStr) return "";
      const dataObj = new Date(dataStr);
      return dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    },
    formatValor(valor) {
      if (!valor) return "";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    },
    formatParcelas(expense) {
      if (expense.parcelas && expense.parcelas > 1) {
        return expense.parcelas + "x";
      }
      if (expense.tipo === "saida") {
        return "1x";
      }
      return "—";
    },
    openDetail(expense) {
      this.$emit("open-detail", expense);
    },
    changePage(page) {
      this.$emit("change-page", page);
    }
  },
  computed: {
    paginatedExpenses() {
      return this.expenses;
    }
  }
};
</script>
