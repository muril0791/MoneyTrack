// src/store.js
import { defineStore, createPinia } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    expenses: [],
    categories: [
      // Categorias de Entrada
      { id: "salario", name: "Salário", type: "entrada" },
      { id: "venda", name: "Venda", type: "entrada" },
      { id: "devolucao", name: "Devolução", type: "entrada" },
      { id: "emprestimo", name: "Empréstimo", type: "entrada" },
      { id: "investimentos", name: "Investimentos", type: "entrada" },
      { id: "premiacoes", name: "Premiações", type: "entrada" },
      { id: "outros-entrada", name: "Outros", type: "entrada" },
      // Categorias de Saída
      { id: "lazer", name: "Lazer", type: "saida" },
      { id: "mercado", name: "Mercado", type: "saida" },
      { id: "compras", name: "Compras", type: "saida" },
      { id: "saude", name: "Saúde", type: "saida" },
      { id: "educacao", name: "Educação", type: "saida" },
      { id: "transporte", name: "Transporte", type: "saida" },
      { id: "moradia", name: "Moradia", type: "saida" },
      { id: "outros-saida", name: "Outros", type: "saida" },
    ],
    creditCards: [],
  }),
  actions: {
    // Lançamentos
    addExpense(expense) {
      this.expenses.push(expense);
    },
    updateExpense(updatedExpense) {
      const index = this.expenses.findIndex((e) => e.id === updatedExpense.id);
      if (index !== -1) {
        this.expenses[index] = updatedExpense;
      }
    },
    removeExpense(expenseId) {
      this.expenses = this.expenses.filter((e) => e.id !== expenseId);
    },
    // Categorias
    updateCategories(newCategories) {
      this.categories = newCategories;
    },
    // Cartões de Crédito
    addCreditCard(card) {
      this.creditCards.push(card);
    },
    updateCreditCard(updatedCard) {
      const index = this.creditCards.findIndex((c) => c.id === updatedCard.id);
      if (index !== -1) {
        this.creditCards[index] = updatedCard;
      }
    },
    removeCreditCard(cardId) {
      this.creditCards = this.creditCards.filter((c) => c.id !== cardId);
    },
  },
});

// Crie o Pinia para ser usado na aplicação
export const pinia = createPinia();
