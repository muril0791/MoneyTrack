<template>
  <div class="credit-card-list">
    <div class="filter-section">
      <label for="cardFilter">Filtrar por Cartão:</label>
      <select id="cardFilter" v-model="selectedCardId" @change="applyFilter">
        <option value="todos">Todos</option>
        <option v-for="card in creditCards" :key="card.id" :value="card.id">
          {{ card.name }}
        </option>
      </select>
    </div>
    <div class="summary">
      <p>Total Usado: R$ {{ totalUsed.toFixed(2) }}</p>
      <p>Limite Disponível: R$ {{ totalAvailable.toFixed(2) }}</p>
      <p>Próximo Vencimento: R$ {{ totalNextDue.toFixed(2) }}</p>
    </div>
    <div class="transactions">
      <div
        v-for="(expense, index) in filteredExpenses"
        :key="index"
        class="transaction-item"
      >
        <div class="transaction-info">
          <p class="transaction-value">Valor: R$ {{ expense.valor.toFixed(2) }}</p>
          <p class="transaction-date">Data: {{ formatData(expense.data) }}</p>
          <p class="transaction-payment-date">
            Data de Pagamento: {{ computePaymentDate(expense) }}
          </p>
          <p v-if="expense.parcelas" class="transaction-installments">
            Parcelas: {{ expense.parcelas }}
          </p>
          <p class="transaction-available-limit">
            Limite Disponível: R$ {{ computeAvailableLimit(expense) }}
          </p>
        </div>
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
    expenses: { type: Array, required: true }
  },
  setup(props) {
    const selectedCardId = ref("todos");

    const applyFilter = () => {
      
    };

   
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

    
    const totalUsed = computed(() => {
      return filteredExpenses.value.reduce(
        (acc, expense) => acc + Number(expense.valor),
        0
      );
    });

    
    const totalAvailable = computed(() => {
      if (selectedCardId.value !== "todos") {
        const card = props.creditCards.find((c) => c.id === selectedCardId.value);
        if (card) {
          return card.limit - totalUsed.value;
        }
        return 0;
      } else {
        return props.creditCards.reduce((acc, card) => {
          const used = filteredExpenses.value
            .filter((exp) => exp.creditCardId === card.id)
            .reduce((sum, exp) => sum + Number(exp.valor), 0);
          return acc + (card.limit - used);
        }, 0);
      }
    });

   
    const totalNextDue = computed(() => {
      return totalUsed.value;
    });

    const formatData = (dataStr) => {
      const dateObj = new Date(dataStr);
      return dateObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };

   
    const computePaymentDate = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return "";
      const expenseDate = new Date(expense.data);
      
      let paymentDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), card.dueDay);
      if (expenseDate.getDate() > card.dueDay) {
        paymentDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth() + 1, card.dueDay);
      }
      return paymentDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };

   
    const computeAvailableLimit = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return 0;
      const used = filteredExpenses.value
        .filter((exp) => exp.creditCardId === card.id)
        .reduce((sum, exp) => sum + Number(exp.valor), 0);
      return card.limit - used;
    };

    return {
      selectedCardId,
      applyFilter,
      filteredExpenses,
      totalUsed,
      totalAvailable,
      totalNextDue,
      formatData,
      computePaymentDate,
      computeAvailableLimit,
    };
  },
};
</script>

<style scoped>
:root {
  --cardbg: #161716;
  --mainbg: #0f0e11;
  --greenmain: #3ecf00;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
  --textgray: #aaaaaa;
  --font-main: "Roboto", sans-serif;
}

.credit-card-list {
  background-color: var(--cardbg);
  padding: 1rem;
  border-radius: 8px;
  color: var(--textwhite);
  font-family: var(--font-main);
  max-width: 800px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-section select {
  padding: 0.5rem;
  border: 1px solid var(--mainbg);
  border-radius: 4px;
  background-color: var(--mainbg);
  color: var(--textwhite);
}

.summary {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  background-color: var(--mainbg);
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.transaction-info p {
  margin: 0.25rem 0;
}
</style>
