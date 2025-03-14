<template>
  <div class="dashboard-left">
    <div class="saldo-box">
      <div class="saldo-info">
        <h3>Saldo</h3>
        <p>R$ {{ saldo.toFixed(2) }}</p>
      </div>
      <button @click="$emit('open-add')">Adicionar Transação</button>
    </div>

    <div class="vertical-container">
      <div class="vertical-box vertical-box-1">
        <h3>Gastos por Categoria</h3>
        <ExpensePieChart :expenses="expenses" />
        <div class="percentages">
          <div class="percentage-box">
            <p>Ganhos</p>
            <p>{{ percentGanhos }}%</p>
          </div>
          <div class="percentage-box">
            <p>Despesas</p>
            <p>{{ percentDespesas }}%</p>
          </div>
          <div class="percentage-box">
            <p>Investimentos</p>
            <p>{{ percentInvestimentos }}%</p>
          </div>
        </div>
      </div>

      <div class="vertical-box vertical-box-2">
        <div class="totals">
          <div class="total-box">
            <p>Entradas</p>
            <p>R$ {{ totalEntradas.toFixed(2) }}</p>
          </div>
          <div class="total-box">
            <p>Saídas</p>
            <p>R$ {{ totalSaidas.toFixed(2) }}</p>
          </div>
        </div>
        <div class="top-categories">
          <h3 class="top-title">Top 5 Gastos por Categoria</h3>
          <div
            v-for="(cat, index) in top5Categories"
            :key="index"
            class="category-bar"
          >
            <div class="category-info">
              <span>{{ cat.category }}</span>
              <span>{{ cat.percent }}%</span>
            </div>
            <div class="bar">
              <div :style="{ width: cat.percent + '%' }" class="bar-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExpensePieChart from "./ExpensePieChart.vue";
export default {
  name: "DashboardLeft",
  components: { ExpensePieChart },
  props: {
    expenses: { type: Array, required: true },
  },
  computed: {
    saldo() {
      const entradas = this.expenses
        .filter((e) => e.tipo === "entrada")
        .reduce((sum, e) => sum + Number(e.valor), 0);
      const saidas = this.expenses
        .filter((e) => e.tipo === "saida")
        .reduce((sum, e) => sum + Number(e.valor), 0);
      return entradas - saidas;
    },
    totalEntradas() {
      return this.expenses
        .filter((e) => e.tipo === "entrada")
        .reduce((sum, e) => sum + Number(e.valor), 0);
    },
    totalSaidas() {
      return this.expenses
        .filter((e) => e.tipo === "saida")
        .reduce((sum, e) => sum + Number(e.valor), 0);
    },
    percentGanhos() {
      const total = this.totalEntradas + this.totalSaidas;
      return total ? ((this.totalEntradas / total) * 100).toFixed(0) : 0;
    },
    percentDespesas() {
      const total = this.totalEntradas + this.totalSaidas;
      return total ? ((this.totalSaidas / total) * 100).toFixed(0) : 0;
    },
    percentInvestimentos() {
      return 0;
    },
    top5Categories() {
      const categoryTotals = {};
      this.expenses
        .filter((e) => e.tipo === "saida")
        .forEach((e) => {
          if (categoryTotals[e.categoria]) {
            categoryTotals[e.categoria] += Number(e.valor);
          } else {
            categoryTotals[e.categoria] = Number(e.valor);
          }
        });
      const totalSaidas = this.totalSaidas;
      const categories = Object.keys(categoryTotals).map((cat) => ({
        category: cat,
        total: categoryTotals[cat],
        percent: totalSaidas
          ? ((categoryTotals[cat] / totalSaidas) * 100).toFixed(0)
          : 0,
      }));
      categories.sort((a, b) => b.total - a.total);
      return categories.slice(0, 5);
    },
  },
};
</script>

<style scoped>
.dashboard-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.saldo-box {
  background-color: #161716;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.saldo-info h3 {
  color: #c2c3c2;
  font-size: 1.125rem;
  margin: 0;
}
.saldo-info p {
  color: #ffffff;
  font-size: 2rem;
  font-family: "Teko", sans-serif;
  font-optical-sizing: auto;
  margin: 0;
}
.saldo-box button {
  background-color: #3ecf00;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.saldo-box button:hover {
  background-color: #36b800;
}

.vertical-container {
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  gap: 0;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .vertical-container {
    flex-direction: column;
  }
}

.vertical-box {
  background-color: #161716;
  padding: 1rem;
  border-radius: 4px;
  width: 48%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.vertical-box h3 {
  color: #c2c3c2;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.percentages {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}
.percentage-box {
  text-align: center;
}
.percentage-box p:first-child {
  font-size: 0.75rem;
  color: #c2c3c2;
  margin: 0;
}
.percentage-box p:last-child {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.totals {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.total-box {
  flex: 1;
  background-color: #0f0e11;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}
.total-box p:first-child {
  font-size: 0.75rem;
  color: #c2c3c2;
  margin: 0;
}
.total-box p:last-child {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}
.top-categories h3 {
  font-size: 0.875rem;
  font-weight: bold;
  color: #c2c3c2;
  margin-bottom: 0.5rem;
}
.category-bar {
  margin-bottom: 0.5rem;
}
.category-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #c2c3c2;
  margin-bottom: 0.25rem;
}
.bar {
  width: 100%;
  background-color: #0f0e11;
  height: 0.5rem;
  border-radius: 4px;
}
.bar-fill {
  height: 100%;
  background-color: #e93030;
  border-radius: 4px;
}
</style>
