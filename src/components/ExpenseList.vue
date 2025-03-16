<template>
  <div class="transactions-container">
    <!-- Cabeçalho da lista -->
    <header class="transactions-header">
      <h2 class="transactions-title">Transações</h2>
    </header>

    <!-- Tabela Responsiva -->
    <div class="table-wrapper">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>TipoTransação</th>
            <th>Parcelas</th>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(expense, index) in expenses"
            :key="index"
            class="table-row"
          >
            <td data-label="Data">{{ formatData(expense.data) }}</td>
            <td data-label="Tipo">
              <span
                :class="{
                  'tag-entrada': expense.tipo === 'entrada',
                  'tag-saida': expense.tipo === 'saida'
                }"
              >
                {{ formatTipo(expense.tipo) }}
              </span>
            </td>
            <td data-label="TipoTransação" class="capitalize">
              {{ expense.tipoTransacao }}
            </td>
            <td data-label="Parcelas">{{ formatParcelas(expense) }}</td>
            <td data-label="Valor">{{ formatValor(expense.valor) }}</td>
            <td data-label="Descrição">{{ expense.descricao || '—' }}</td>
            <td data-label="Categoria">{{ expense.categoria }}</td>
            <td data-label="Status">
              <span
                :class="{
                  'status-positive': expense.tipo === 'entrada',
                  'status-negative': expense.tipo === 'saida'
                }"
              >
                {{ expense.tipo === 'entrada' ? 'Completed' : 'Pending' }}
              </span>
            </td>
            <td data-label="Ações" class="actions-cell">
              <button class="edit-btn" @click="editExpense(expense)">Editar</button>
              <button class="delete-btn" @click="deleteExpense(expense)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
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
  emits: ["edit-expense", "delete-expense"],
  methods: {
    editExpense(expense) {
      this.$emit("edit-expense", expense);
    },
    deleteExpense(expense) {
      this.$emit("delete-expense", expense);
    },
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
      if (expense.parcelas && expense.parcelas > 1) {
        return expense.parcelas + "x";
      }
      if (expense.tipo === "saida") {
        return "1x";
      }
      return "—";
    }
  }
};
</script>

<style scoped>
/* Variáveis de cor e tipografia */
:root {
  --bg-dark: #0f0e11;        /* Fundo geral (mobile) */
  --card-dark: #161716;      /* Fundo dos cards */
  --bg-header: #1e1f23;      /* Fundo do cabeçalho da tabela */
  --border-color: #2b2c2f;   /* Cor de borda sutil */
  --green: #3ecf00;          /* Verde para entradas */
  --red: #e93030;            /* Vermelho para saídas */
  --text-white: #c2c3c2;
  --text-gray: #aaaaaa;
  --font-main: "Roboto", sans-serif;
}

/* Container Principal */
.transactions-container {
  background-color: var(--card-dark);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  color: var(--text-white);
  font-family: var(--font-main);
  width: 90%;
  margin: 0 auto;
}

/* Cabeçalho */
.transactions-header {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}
.transactions-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

/* Tabela Responsiva */
.table-wrapper {
  overflow-x: auto;
  border-radius: 6px;
  background-color: var(--bg-dark);
  box-shadow: inset 0 0 0 1px var(--border-color);
}
.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  color: var(--text-white);
}
.transactions-table thead {
  background-color: var(--bg-header);
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.04rem;
}
.transactions-table th {
  padding: 0.75rem;
  text-align: left;
  color: var(--text-gray);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.75rem;
}
.transactions-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}
.table-row:hover td {
  background-color: #1c1c1c;
}
.capitalize {
  text-transform: capitalize;
}

/* Tags para Tipo */
.tag-entrada {
  color: var(--green);
  font-weight: bold;
}
.tag-saida {
  color: var(--red);
  font-weight: bold;
}

/* Status */
.status-positive {
  background-color: rgba(62, 207, 0, 0.2);
  color: var(--green);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}
.status-negative {
  background-color: rgba(233, 48, 48, 0.2);
  color: var(--red);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Ações */
.actions-cell {
  white-space: nowrap;
}
.actions-cell button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  margin-right: 0.5rem;
  color: var(--text-gray);
  transition: color 0.2s ease;
}
.actions-cell button:hover {
  color: var(--text-white);
}
.edit-btn {
  color: var(--green);
}
.edit-btn:hover {
  color: #36b800;
}
.delete-btn {
  color: var(--red);
}
.delete-btn:hover {
  color: #d32f2f;
}

/* Responsividade para Mobile: transforma a tabela em um layout vertical */
@media (max-width: 600px) {
  .transactions-table,
  .transactions-table thead,
  .transactions-table tbody,
  .transactions-table th,
  .transactions-table td,
  .table-row {
    display: block;
    height: 70%;
  }
  .transactions-table thead {
    display: none;
  }
  .table-row {
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.5rem;
  }
  .transactions-table td {
    padding: 0.5rem;
    text-align: right;
    position: relative;
  }
  .transactions-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 40%;
    padding-left: 0.5rem;
    font-weight: bold;
    text-align: left;
    color: var(--text-gray);
  }
  /* Ajusta a célula de ações para centralizar os botões */
  .actions-cell {
    text-align: center;
  }
}
</style>
