<template>
  <!-- Seção com background e sombra -->
  <div class="bg-gray-50 p-6 rounded-md shadow">
    <!-- Cabeçalho da seção -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0"
    >
      <h2 class="text-2xl font-bold text-gray-800">Transações</h2>
      <div class="flex space-x-2">
        <!-- Botão de Filtros -->
        <button
          class="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Filtros
        </button>
        <!-- Botão "Adicionar Manualmente" foi removido -->
      </div>
    </div>

    <!-- Barra de Busca -->
    <div class="mb-4">
      <input
        type="text"
        class="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/2"
        placeholder="Buscar"
      />
    </div>

    <!-- Tabela de Lançamentos -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full table-auto border-collapse">
        <thead class="bg-gray-100 text-gray-600 text-sm uppercase font-bold">
          <tr>
            <th class="px-4 py-3 text-left">Data</th>
            <th class="px-4 py-3 text-left">Tipo</th>
            <th class="px-4 py-3 text-left">Modalidade</th>
            <th class="px-4 py-3 text-left">Valor</th>
            <th class="px-4 py-3 text-left">Descrição</th>
            <th class="px-4 py-3 text-left">Pagamento</th>
            <th class="px-4 py-3 text-left">Categoria</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr
            v-for="(expense, index) in expenses"
            :key="index"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-3">{{ expense.data }}</td>
            <td class="px-4 py-3 capitalize">{{ expense.tipo }}</td>
            <td class="px-4 py-3 capitalize">{{ expense.modalidade }}</td>
            <td class="px-4 py-3">R$ {{ Number(expense.valor).toFixed(2) }}</td>
            <td class="px-4 py-3">{{ expense.descricao }}</td>
            <td class="px-4 py-3">{{ expense.pagamento }}</td>
            <td class="px-4 py-3">{{ expense.categoria }}</td>
            <td class="px-4 py-3">
              <!-- Exemplo de Status -->
              <span
                v-if="expense.tipo === 'entrada'"
                class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold"
              >
                Completed
              </span>
              <span
                v-else
                class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold"
              >
                Pending
              </span>
            </td>
            <td class="px-4 py-3">
              <!-- Botões de Ação (Editar/Excluir) -->
              <button
                class="text-blue-600 hover:text-blue-800 mr-2 text-sm font-medium"
                @click="editExpense(expense)"
              >
                Editar
              </button>
              <button
                class="text-red-600 hover:text-red-800 text-sm font-medium"
                @click="deleteExpense(expense)"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação Exemplo -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4"
    >
      <p class="text-sm text-gray-600">
        Mostrando 1 a {{ expenses.length }} de {{ expenses.length }} resultados
      </p>
      <div class="space-x-1 mt-2 sm:mt-0">
        <button
          class="px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
        >
          1
        </button>
        <button
          class="px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
        >
          2
        </button>
        <button
          class="px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
        >
          3
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpenseList",
  props: {
    expenses: {
      type: Array,
      required: true,
    },
  },
  methods: {
    editExpense(expense) {
      this.$emit("edit-expense", expense);
    },
    deleteExpense(expense) {
      this.$emit("delete-expense", expense);
    },
  },
};
</script>

<style scoped>
/* Ajustes adicionais de layout, se necessário */
</style>
