<template>
  <div class="space-y-8">
    <!-- Totais -->
    <div class="flex flex-row-reverse space-x-4 space-x-reverse">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-bold text-black">Total Entradas</h3>
        <p class="text-2xl font-semibold text-green-700">
          R$ {{ totalEntradas.toFixed(2) }}
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-bold text-black">Total Saídas</h3>
        <p class="text-2xl font-semibold text-red-700">
          R$ {{ totalSaidas.toFixed(2) }}
        </p>
      </div>
    </div>

    <!-- Seções do Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-xl font-bold mb-4 text-white">Gráfico de Transações</h3>
        <ExpensePieChart :expenses="expenses" />
      </div>
      <div>
        <h3 class="text-xl font-bold mb-4 text-white">Lista de Lançamentos</h3>
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
        .filter((e) => e.tipo === "entrada")
        .reduce((acc, e) => acc + Number(e.valor), 0)
    );
    const totalSaidas = computed(() =>
      props.expenses
        .filter((e) => e.tipo === "saida")
        .reduce((acc, e) => acc + Number(e.valor), 0)
    );
    return { totalEntradas, totalSaidas };
  },
};
</script>
