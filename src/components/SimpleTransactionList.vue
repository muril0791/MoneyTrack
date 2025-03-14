<template>
  <div class="transaction-list">
    <div class="transaction-header">
      <h2 class="transaction-title">Transações</h2>
      <button class="transaction-view-more" @click="$emit('view-more')">
        Ver mais
      </button>
    </div>
    <div class="transaction-items">
      <div
        v-for="(expense, index) in expenses"
        :key="index"
        class="transaction-item"
      >
        <div class="transaction-icon">
          <span v-if="expense.tipo === 'entrada'" class="icon-positive">↑</span>
          <span v-else class="icon-negative">↓</span>
        </div>
        <div class="transaction-info">
          <p class="transaction-description">{{ expense.descricao || formatTipo(expense.tipo) }}</p>
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
  </div>
</template>

<script>
export default {
  name: "SimpleTransactionList",
  props: {
    expenses: { type: Array, required: true }
  },
  emits: ["view-more"],
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
    
      if (expense.tipo === "saida") {
        if (expense.pagamento === "cartao-credito" || expense.modalidade === "parcelado") {
          return expense.parcelas && expense.parcelas > 1 ? expense.parcelas + "x" : "1x";
        }
        return "1x";
      }
      return "—";
    }
  }
};
</script>

<style scoped>
.transaction-list {
  background-color: #161716;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  color: #c2c3c2;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ffffff;
}

.transaction-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #c2c3c2;
}

.transaction-view-more {
  font-size: 0.75rem;
  color: #ffffff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: transparent;
  border: 1px solid #c2c3c2;
}
.transaction-view-more:hover {
  background-color: #3ecf00;
  color: #fff;
  border-color: #3ecf00;
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
  background-color: #0f0e11;
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
  color: #3ecf00;
  font-size: 1.25rem;
}

.icon-negative {
  color: #e93030;
  font-size: 1.25rem;
}

.transaction-info {
  margin-left: 0.5rem;
}

.transaction-description {
  font-size: 0.875rem;
  font-weight: bold;
  margin: 0;
  color: #c2c3c2;
}

.transaction-date {
  font-size: 0.75rem;
  margin: 0;
  color: #c2c3c2;
}

.transaction-amount {
  font-size: 0.875rem;
  font-weight: bold;
  color: #c2c3c2;
  margin-left: 1rem;
}

.transaction-parcelas {
  font-size: 0.75rem;
  color: #c2c3c2;
  margin-left: 1rem;
  text-align: right;
  font-weight: bold;
}
</style>
