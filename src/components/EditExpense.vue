<template>
  <div class="space-y-4 bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] overflow-hidden p-6">
    <div class="expense-edit-container">
      <h3 class="expense-edit-title">Editar {{ expense.tipo === 'entrada' ? 'entrada' : 'despesa' }}</h3>

      <div class="form-group">
        <label for="nome">Descrição</label>
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
          type="number"
          step="0.01"
          id="valor"
          v-model="editableExpense.valor"
          placeholder="R$ 0,00"
        />
      </div>

      <div class="button-group">
        <button class="save-btn" @click="saveExpense" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
        <button class="delete-btn" @click="deleteExpense" :disabled="loading">
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from "@/stores/store";

export default {
  name: "ExpenseEdit",
  props: {
    expense: { type: Object, required: true },
  },
  data() {
    return {
      loading: false,
      editableExpense: {
        descricao: this.expense.descricao || "",
        valor: this.expense.valor || "",
      },
    };
  },
  methods: {
    async saveExpense() {
      if (!this.editableExpense.descricao || !this.editableExpense.valor) return;
      
      this.loading = true;
      try {
        const store = useMainStore();
        await store.updateExpense({
          ...this.expense,
          descricao: this.editableExpense.descricao,
          valor: Number(this.editableExpense.valor),
        });
        this.$emit("close");
      } catch (err) {
        console.error("Erro ao atualizar:", err);
      } finally {
        this.loading = false;
      }
    },
    async deleteExpense() {
      if (!confirm("Deseja realmente excluir esta transação?")) return;
      
      this.loading = true;
      try {
        const store = useMainStore();
        await store.removeExpense(this.expense.id);
        this.$emit("close");
      } catch (err) {
        console.error("Erro ao excluir:", err);
      } finally {
        this.loading = false;
      }
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

.save-btn:disabled {
  opacity: 0.5;
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

.delete-btn:disabled {
  opacity: 0.5;
}
</style>
