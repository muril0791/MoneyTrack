<template>
  <div class="finance-list-container">
    <!-- Barra Superior: Título + Botão Adicionar -->
    <div class="finance-list-header">
      <h2 class="finance-list-title">Transações</h2>
      <button class="finance-add-button" @click="$emit('add-transaction')">
        Adicionar Transação
      </button>
    </div>

    <!-- Tabela de Lançamentos -->
    <div class="finance-table-wrapper">
      <table class="finance-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Modalidade</th>
            <th>Parcelas</th>
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
            <!-- Data formatada -->
            <td>{{ formatData(expense.data) }}</td>
            
            <!-- Tipo (Entrada / Saída) -->
            <td>
              <span
                :class="{
                  'tipo-entrada': expense.tipo === 'entrada',
                  'tipo-saida': expense.tipo === 'saida'
                }"
              >
                {{ formatTipo(expense.tipo) }}
              </span>
            </td>
            
            <!-- Modalidade -->
            <td class="capitalize">{{ expense.modalidade }}</td>
            
            <!-- Parcelas -->
            <td>{{ formatParcelas(expense) }}</td>
            
            <!-- Valor formatado -->
            <td>{{ formatValor(expense.valor) }}</td>
            
            <!-- Descrição -->
            <td>{{ expense.descricao }}</td>
            
            <!-- Pagamento -->
            <td>{{ expense.pagamento }}</td>
            
            <!-- Categoria -->
            <td>{{ expense.categoria }}</td>
            
            <!-- Status (Completed / Pending) -->
            <td>
              <span
                :class="{
                  'status-positive': expense.tipo === 'entrada',
                  'status-negative': expense.tipo === 'saida'
                }"
              >
                {{ expense.tipo === 'entrada' ? 'Completed' : 'Pending' }}
              </span>
            </td>
            
            <!-- Ações -->
            <td class="finance-actions">
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
  emits: ["add-transaction", "edit-expense", "delete-expense"],
  methods: {
    // Botão "Editar"
    editExpense(expense) {
      this.$emit("edit-expense", expense);
    },
    // Botão "Excluir"
    deleteExpense(expense) {
      this.$emit("delete-expense", expense);
    },
    // Formato do tipo (Entrada / Saída)
    formatTipo(tipo) {
      if (tipo === "entrada") return "Entrada";
      if (tipo === "saida") return "Saída";
      return tipo;
    },
    // Formato da data (ex.: "28 de março de 2023")
    formatData(dataStr) {
      if (!dataStr) return "";
      const dataObj = new Date(dataStr);
      return dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    },
    // Formato do valor (ex.: "R$ 75,00")
    formatValor(valor) {
      if (!valor) return "";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    },
    // Formato das parcelas
    formatParcelas(expense) {
      // Se for "saida" e pagamento "cartao-credito" ou modalidade "parcelado", exibe expense.parcelas + "x" se > 1
      // Caso contrário, exibe "1x"
      if (expense.tipo === "saida") {
        // Se for cartão de crédito ou "parcelado"
        if (expense.pagamento === "cartao-credito" || expense.modalidade === "parcelado") {
          return expense.parcelas && expense.parcelas > 1 ? expense.parcelas + "x" : "1x";
        }
        // Saída sem cartão => "1x"
        return "1x";
      }
      // Se for entrada, podemos retornar vazio ou "—"
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
.finance-list-container {
  background-color: var(--card-dark);
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  color: var(--text-white);
  font-family: Roboto, sans-serif;
}

/* Barra Superior */
.finance-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.finance-list-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}
.finance-add-button {
  background-color: var(--green);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}
.finance-add-button:hover {
  background-color: #36b800;
}

/* Tabela */
.finance-table-wrapper {
  overflow-x: auto;
}
.finance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.finance-table thead {
  background-color: var(--card-dark);
  text-transform: uppercase;
  font-weight: bold;
}
.finance-table th,
.finance-table td {
  padding: 0.75rem;
  border: 1px solid var(--card-dark);
  text-align: left;
}
.finance-table tbody tr:hover {
  background-color: var(--bg-main);
}

/* Tipo (Entrada / Saída) */
.tipo-entrada {
  color: var(--green);
  font-weight: bold;
}
.tipo-saida {
  color: var(--red);
  font-weight: bold;
}

/* Status (Completed / Pending) */
.status-positive {
  background-color: rgba(62,207,0,0.2);
  color: var(--green);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}
.status-negative {
  background-color: rgba(233,48,48,0.2);
  color: var(--red);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Ações */
.finance-actions {
  white-space: nowrap;
}
.finance-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  margin-right: 0.5rem;
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

/* Transformar texto em capitalize (opcional) */
.capitalize {
  text-transform: capitalize;
}
</style>
