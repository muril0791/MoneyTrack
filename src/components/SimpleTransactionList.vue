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
          <p class="transaction-description">{{ expense.descricao || expense.tipo }}</p>
          <p class="transaction-date">{{ expense.data }}</p>
        </div>
        <div class="transaction-amount">
          R$ {{ Number(expense.valor).toFixed(2) }}
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
  }
};
</script>

<style scoped>
.transaction-list {
  background-color: #161716; /* Fundo dos cards */
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  color: #c2c3c2; /* Fonte */
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom:2px solid #ffffff;
}

.transaction-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #c2c3c2;
}

.transaction-view-more {
  font-size: 0.75rem;
  color: rgb(255, 255, 255);
  cursor: pointer;
  padding: 4px;
  border-radius: 20px;
}

.transaction-view-more:hover {
  text-decoration: underline;
}

.transaction-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  background-color: #0f0e11; /* Fundo dos itens */
  padding: 0.75rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.transaction-item:hover {
  background-color: #151415;
}

.transaction-icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-left: 1rem;
  flex: 1;
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
}
</style>
