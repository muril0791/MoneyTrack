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
            <p style=" font-family: Teko; font-weight: 500; ">R$ {{ totalEntradas.toFixed(2) }}</p>
          </div>
          <div class="total-box">
            <p>Saídas</p>
            <p style=" font-family: Teko; font-weight: 500; ">R$ {{ totalSaidas.toFixed(2) }}</p>
          </div>
        </div>
        <div class="top-categories">
          <h3 class="top-title">Top 5 Gastos por Categoria</h3>
          <div v-for="(cat, index) in top5Categories" :key="index" class="category-bar">
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
    expenses: { type: Array, required: true }
  },
  computed: {
    saldo() {
      const entradas = this.expenses
        .filter(e => e.tipo === "entrada")
        .reduce((sum, e) => sum + Number(e.valor), 0);
      const saidas = this.expenses
        .filter(e => e.tipo === "saida")
        .reduce((sum, e) => sum + Number(e.valor), 0);
      return entradas - saidas;
    },
    totalEntradas() {
      return this.expenses
        .filter(e => e.tipo === "entrada")
        .reduce((sum, e) => sum + Number(e.valor), 0);
    },
    totalSaidas() {
      return this.expenses
        .filter(e => e.tipo === "saida")
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
        .filter(e => e.tipo === "saida")
        .forEach(e => {
          categoryTotals[e.categoria] = (categoryTotals[e.categoria] || 0) + Number(e.valor);
        });
      const totalSaidas = this.totalSaidas;
      const categories = Object.keys(categoryTotals).map(cat => ({
        category: cat,
        total: categoryTotals[cat],
        percent: totalSaidas ? ((categoryTotals[cat] / totalSaidas) * 100).toFixed(0) : 0
      }));
      categories.sort((a, b) => b.total - a.total);
      return categories.slice(0, 5);
    }
  }
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


.dashboard-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Quicksand'
}


.saldo-box {
  background-color: var(--cardbg);
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
}
.saldo-info h3 {
  color: var(--textwhite);
  font-size: 1.125rem;
  margin: 0;
}
.saldo-info p {
  color: #fff;
  font-size: 2rem;
  font-family: "Teko", sans-serif;
  margin: 0;
}
.saldo-box button {
  background-color: var(--greenmain);
  color: #fff;
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
  flex-wrap: wrap; 
  justify-content: space-between;
}


.vertical-box {
  background-color: var(--cardbg);
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  width: 48%; 
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


@media (max-width: 768px) {
  .vertical-box {
    width: 100%;
  }
}


.vertical-box h3 {
  color: var(--textwhite);
  font-size: 1.125rem;
  margin: 0;
}


.percentages {
  display: flex;
  justify-content: space-around;
}
.percentage-box p:first-child {
  font-size: 0.75rem;
  color: var(--textgray);
  margin: 0;
}
.percentage-box p:last-child {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: var(--textwhite);
}


.totals {
  display: flex;
  gap: 1rem;
}
.total-box {
  flex: 1;
  background-color: var(--mainbg);
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  color: var(--textwhite);
}
.total-box p:first-child {
  font-size: 0.75rem;
  color: var(--textgray);
  margin: 0;
}
.total-box p:last-child {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}


.top-categories .top-title {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--textwhite);
  margin: 0;
  font-family: "Quicksand", sans-serif;
  font-optical-sizing: auto;
}
.category-bar {
  margin-bottom: 0.5rem;
}
.category-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--textwhite);
  margin-bottom: 0.25rem;
}
.bar {
  width: 100%;
  background-color: var(--mainbg);
  height: 0.5rem;
  border-radius: 4px;
}
.bar-fill {
  height: 100%;
  background-color: var(--redmain);
  border-radius: 4px;
}


.vertical-box canvas {
  max-width: 100%;
  height: auto;
}
</style>
