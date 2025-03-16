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
      // Se tiver "parcelas" > 1, mostra "Nx"
      if (expense.parcelas && expense.parcelas > 1) {
        return expense.parcelas + "x";
      }
      // Caso contrário, "1x" se for saída, ou "—" se for entrada
      if (expense.tipo === "saida") {
        return "1x";
      }
      return "—";
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

/* Container Principal */
.transaction-list {
  background-color: #161716 ;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  color: var(--text-white);
  font-family: Roboto, sans-serif;
}

/* Cabeçalho */
.transaction-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1.5px solid white;
}
.transaction-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  
}
.transaction-view-more {
  font-size: 0.75rem;
  color: var(--text-white);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: transparent;
  border: 1px solid var(--text-white);
  margin-top: 0.5rem;
}
@media (min-width: 480px) {
  .transaction-view-more {
    margin-top: 0;
  }
}
.transaction-view-more:hover {
  background-color: var(--green);
  color: #fff;
  border-color: var(--green);
}

/* Lista de itens */
.transaction-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Layout dos itens - grid para telas maiores */
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

/* Layout responsivo para telas pequenas */
@media (max-width: 480px) {
  .transaction-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .transaction-amount,
  .transaction-parcelas {
    align-self: flex-end;
  }
}

/* Ícone */
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

/* Informações da transação */
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

/* Valor */
.transaction-amount {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--text-white);
  margin-left: 1rem;
  text-align: right;
}

/* Parcelas */
.transaction-parcelas {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--text-white);
  margin-left: 1rem;
  text-align: right;
}
</style>
