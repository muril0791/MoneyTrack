<template>
  <div class="dashboard-summary">
    <!-- Cabeçalho com botão de Novo Lançamento -->
    <div class="summary-header">
      <button class="new-transaction-btn" @click="$emit('open-modal')">
        Novo Lançamento
      </button>
    </div>

    <!-- Totais: Saldo e Despesas -->
    <div class="totals-container">
      <div class="total-box">
        <h3 class="total-title">Saldo</h3>
        <p class="total-value">R$ {{ totalEntradas.toFixed(2) }}</p>
      </div>
      <div class="total-box">
        <h3 class="total-title">Despesas</h3>
        <p class="total-value">R$ {{ totalSaidas.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Seções: Gráfico e Lista de Transações -->
    <div class="charts-transactions">
      <div class="chart-container">
        <h3 class="section-title">Gastos por categoria</h3>
        <ExpensePieChart :expenses="expenses" />
      </div>
      <div class="list-container">
        <h3 class="section-title">Transações</h3>
        <ExpenseList
          :expenses="expenses"
          @edit-expense="handleEditExpense"
          @delete-expense="handleDeleteExpense"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import ExpensePieChart from "./ExpensePieChart.vue";
import ExpenseList from "./ExpenseList.vue";

export default {
  name: "DashboardSummary",
  components: { ExpensePieChart, ExpenseList },
  props: { expenses: Array },
  setup(props) {
    const totalEntradas = computed(() =>
      props.expenses
        .filter(e => e.tipo === "entrada")
        .reduce((sum, e) => sum + Number(e.valor), 0)
    );
    const totalSaidas = computed(() =>
      props.expenses
        .filter(e => e.tipo === "saida")
        .reduce((sum, e) => sum + Number(e.valor), 0)
    );
    return { totalEntradas, totalSaidas };
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
}

/* Container principal do DashboardSummary */
.dashboard-summary {
  background-color: var(--mainbg);
  padding: 1rem;
  border-radius: 6px;
  color: var(--textwhite);
  font-family: Roboto, sans-serif;
}

/* Cabeçalho com botão de Novo Lançamento */
.summary-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.new-transaction-btn {
  background-color: var(--greenmain);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.new-transaction-btn:hover {
  background-color: #36b800;
}

/* Totais (Saldo e Despesas) */
.totals-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.total-box {
  flex: 1;
  min-width: 200px;
  background-color: var(--cardbg);
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.total-title {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--textgray);
  margin-bottom: 0.5rem;
}
.total-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: var(--textwhite);
}

/* Seções de Gráfico e Lista de Transações */
.charts-transactions {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .charts-transactions {
    grid-template-columns: 1fr 1fr;
  }
}

/* Bloco do Gráfico */
.chart-container,
.list-container {
  background-color: var(--cardbg);
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.section-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: var(--textgray);
}
</style>
