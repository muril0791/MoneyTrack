<template>
  <div class="space-y-8 bg-green-900">
    <button
      @click="$emit('open-modal')"
      class="bg-greenmain hover:bg-green-600 text-white px-4 py-2 rounded-md"
    >
      Novo Lançamento
    </button>
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-cardbg rounded p-4 shadow">
        <h3 class="text-sm font-bold text-textgray">Saldo</h3>
        <p class="text-2xl font-semibold text-greenmain">
          R$ {{ totalEntradas.toFixed(2) }}
        </p>
      </div>
      <div class="bg-cardbg rounded p-4 shadow">
        <h3 class="text-sm font-bold text-textgray">Despesas</h3>
        <p class="text-2xl font-semibold text-redmain">
          R$ {{ totalSaidas.toFixed(2) }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-lg font-bold text-textgray mb-4">
          Gastos por categoria
        </h3>
        <ExpensePieChart :expenses="expenses" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-textgray mb-4">Transações</h3>
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
