<template>
  <div class="space-y-4 bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] overflow-hidden p-6">
    <div class="expense-edit-container">
      <h3 class="expense-edit-title">Editar despesa</h3>

      <div class="form-group">
        <label for="nome">Transação	</label>
        <input
          type="text"
          id="nome"
          v-model="editableExpense.descricao"
          placeholder="Ex: Salário, Moradia, Mercado..."
        />
      </div>

      <div class="form-group">
        <label for="valor">Valor</label>
        <input
          type="text"
          id="valor"
          v-model="editableExpense.valor"
          placeholder="R$ 0,00"
        />
      </div>

      <div class="button-group">
        <button class="save-btn" @click="saveExpense">Salvar</button>
        <button class="delete-btn" @click="deleteExpense">Excluir</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpenseEdit",
  props: {
    expense: Object,
  },
  data() {
    return {
      editableExpense: {
        descricao: this.expense.descricao || '',
        valor: this.expense.valor || '',
      },
    };
  },
  methods: {
    saveExpense() {
      //editar no BD
    },
    deleteExpense() {
      // deletar despesa no BD
    },
  },
};
</script>

<style scoped>

.expense-edit-container {
  background-color: #1b1b1b;
  border-radius: 8px;
  width: 100%;
  color: #FFF;
}

.expense-edit-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #FFF;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem; 
  background-color: #151515;
  border: 1px solid #2a2a2a;
  border-radius: 0.5rem;
  color: #FFF;
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  gap: 5px;
}

.save-btn {
  background-color: #10b981; 
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
.save-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #e93030;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
.delete-btn:hover {
  background-color: #d32f2f;
}
</style>
