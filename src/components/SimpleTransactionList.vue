<template>
  <div class="transaction-list">
    <header class="transaction-header">
      <h2 class="transaction-title">Transações</h2>
    </header>
    <div class="transaction-items">
      <div
        v-for="(expense, index) in paginatedExpenses"
        :key="index"
        class="transaction-item"
        @click="openDetail(expense)"
      >
        <div class="transaction-icon">
          <span v-if="expense.tipo === 'entrada'" class="icon-positive">↑</span>
          <span v-else class="icon-negative">↓</span>
        </div>
        <div class="transaction-info">
          <p class="transaction-description">
            {{ expense.descricao || formatTipo(expense.tipo) }}
          </p>
          <p class="transaction-date">{{ formatData(expense.data) }}</p>
        </div>
        <div class="transaction-amount">
          {{ formatValor(expense.valor) }}
        </div>
        <div class="transaction-parcelas">
          {{ formatParcelas(expense) }}
        </div>
      </div>
    </div>
  
    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="['page-btn', { active: currentPage === page }]"
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

<style scoped>
:root {
  --bg-main: #0f0e11;
  --card-dark: #161716;
  --green: #3ecf00;
  --red: #e93030;
  --text-white: #c2c3c2;
  --text-gray: #aaaaaa;
}

.transaction-list {
  background-color: #161716;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-family: "Roboto", sans-serif;
  color: var(--text-white);
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1.5px solid var(--text-white);
}

.transaction-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.transaction-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-item {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto auto;
  align-items: center;
  background-color: var(--bg-main);
  padding: 0.75rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}
.transaction-item:hover {
  background-color: #151415;
}

.transaction-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}
.icon-positive {
  color: var(--green);
  font-size: 1.25rem;
}
.icon-negative {
  color: var(--red);
  font-size: 1.25rem;
}

.transaction-info {
  margin-left: 0.5rem;
}
.transaction-description {
  font-size: 0.875rem;
  font-weight: bold;
  margin: 0;
  color: var(--text-white);
}
.transaction-date {
  font-size: 0.75rem;
  margin: 0;
  color: var(--text-white);
}

.transaction-amount {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--text-white);
  margin-left: 1rem;
  text-align: right;
}

.transaction-parcelas {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--text-white);
  margin-left: 1rem;
  text-align: right;
}


.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
}
.page-btn {
  padding: 0.25rem 0.5rem;
  background-color: var(--bg-main);
  border: 1px solid var(--card-dark);
  border-radius: 4px;
  color: var(--text-white);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.page-btn.active,
.page-btn:hover {
  background-color: var(--card-dark);
}
</style>
