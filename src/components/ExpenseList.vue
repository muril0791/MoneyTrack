<template>
  <div class="expense-list">
    <div class="list-header">
      <h2 class="list-title">Transações</h2>
      <!-- Barra de Busca -->
      <div class="search-box">
        <input
          type="text"
          placeholder="Buscar"
          class="search-input"
        />
      </div>
    </div>

    <!-- Tabela de Lançamentos -->
    <div class="table-container">
      <table class="expense-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Modalidade</th>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Pagamento</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in expenses" :key="index">
            <td>{{ expense.data }}</td>
            <td class="type-cell">
              <span v-if="expense.tipo === 'entrada'" class="positive">Entrada</span>
              <span v-else class="negative">Saída</span>
            </td>
            <td class="capitalize">{{ expense.modalidade }}</td>
            <td>R$ {{ Number(expense.valor).toFixed(2) }}</td>
            <td>{{ expense.descricao }}</td>
            <td>{{ expense.pagamento }}</td>
            <td>{{ expense.categoria }}</td>
            <td>
              <span
                v-if="expense.tipo === 'entrada'"
                class="status-positive"
              >
                Completed
              </span>
              <span
                v-else
                class="status-negative"
              >
                Pending
              </span>
            </td>
            <td class="actions">
              <button class="edit-btn" @click="editExpense(expense)">Editar</button>
              <button class="delete-btn" @click="deleteExpense(expense)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação Exemplo -->
    <div class="pagination">
      <p>Mostrando 1 a {{ expenses.length }} de {{ expenses.length }} resultados</p>
      <div class="page-buttons">
        <button class="page-btn">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
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
      required: true
    }
  },
  methods: {
    editExpense(expense) {
      this.$emit("edit-expense", expense);
    },
    deleteExpense(expense) {
      this.$emit("delete-expense", expense);
    }
  }
};
</script>

<style scoped>
/* Container do componente */
.expense-list {
  background-color: #161716;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  color: #c2c3c2;
}

/* Cabeçalho da lista */
.list-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
@media (min-width: 640px) {
  .list-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.list-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #c2c3c2;
}

/* Barra de busca */
.search-box {
  margin-top: 0.5rem;
}
.search-input {
  width: 100%;
  max-width: 16rem;
  padding: 0.5rem;
  border: 1px solid #161716;
  border-radius: 4px;
  background-color: transparent;
  color: #c2c3c2;
}
.search-input:focus {
  outline: none;
  border-color: #3ecf00;
  box-shadow: 0 0 0 2px rgba(62, 207, 0, 0.3);
}

/* Tabela */
.table-container {
  overflow-x: auto;
}
.expense-table {
  width: 100%;
  border-collapse: collapse;
}
.expense-table th,
.expense-table td {
  padding: 0.75rem;
  border: 1px solid #161716;
  text-align: left;
  font-size: 0.875rem;
}
.expense-table thead {
  background-color: #161716;
  color: #c2c3c2;
  text-transform: uppercase;
  font-weight: bold;
}
.expense-table tbody tr:hover {
  background-color: #0f0e11;
}

/* Células específicas */
.type-cell span {
  font-weight: bold;
}
.positive {
  color: #3ecf00;
}
.negative {
  color: #e93030;
}

/* Status */
.status-positive {
  background-color: rgba(62, 207, 0, 0.2);
  color: #3ecf00;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}
.status-negative {
  background-color: rgba(233, 48, 48, 0.2);
  color: #e93030;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Ações */
.actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  margin-right: 0.5rem;
}
.edit-btn {
  color: #3ecf00;
}
.edit-btn:hover {
  color: #36b800;
}
.delete-btn {
  color: #e93030;
}
.delete-btn:hover {
  color: #d32f2f;
}

/* Paginação */
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  color: #c2c3c2;
  font-size: 0.875rem;
}
@media (min-width: 640px) {
  .pagination {
    flex-direction: row;
    justify-content: space-between;
  }
}
.page-buttons {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
}
.page-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid #161716;
  border-radius: 4px;
  background-color: transparent;
  color: #c2c3c2;
  cursor: pointer;
}
.page-btn:hover {
  background-color: #0f0e11;
}
</style>
