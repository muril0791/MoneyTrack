// src/stores/store.js
import { defineStore, createPinia } from "pinia";
import expenseService from "../services/expenseService";
import categoryService from "../services/categoryService";
import creditCardService from "../services/creditCardService";

export const useMainStore = defineStore("main", {
  state: () => ({
    expenses: [],
    categories: [],
    creditCards: [],
  }),

  actions: {
    
    async fetchExpenses() {
      try {
        const res = await expenseService.getExpenses();
        this.expenses = res.data;      
      } catch (error) {
        console.error("Erro ao buscar Expenses:", error);
      }
    },
    async addExpense(expense) {
      try {
        const res = await expenseService.addExpense(expense);
        this.expenses.push(res.data);  
      } catch (error) {
        console.error("Erro ao adicionar Expense:", error);
      }
    },
    async updateExpense(expense) {
      try {
        const res = await expenseService.updateExpense(expense.id, expense);
        const index = this.expenses.findIndex((e) => e._id === expense.id);
        if (index !== -1) this.expenses[index] = res.data;
      } catch (error) {
        console.error("Erro ao atualizar Expense:", error);
      }
    },
    async removeExpense(expenseId) {
      try {
        await expenseService.deleteExpense(expenseId);
        this.expenses = this.expenses.filter((e) => e._id !== expenseId);
      } catch (error) {
        console.error("Erro ao remover Expense:", error);
      }
    },

    
    async fetchCategories() {
      try {
        const res = await categoryService.getCategories();
        this.categories = res.data;    
      } catch (error) {
        console.error("Erro ao buscar Categories:", error);
      }
    },
    async addCategory(category) {
      try {
        const res = await categoryService.addCategory(category);
        this.categories.push(res.data);
      } catch (error) {
        console.error("Erro ao adicionar Category:", error);
      }
    },
    async updateCategory(category) {
      try {
        const res = await categoryService.updateCategory(category.id, category);
        const index = this.categories.findIndex((c) => c._id === category.id);
        if (index !== -1) this.categories[index] = res.data;
      } catch (error) {
        console.error("Erro ao atualizar Category:", error);
      }
    },
    async removeCategory(categoryId) {
      try {
        await categoryService.deleteCategory(categoryId);
        this.categories = this.categories.filter((c) => c._id !== categoryId);
      } catch (error) {
        console.error("Erro ao remover Category:", error);
      }
    },

   
    async fetchCreditCards() {
      try {
        const res = await creditCardService.getCreditCards();
        this.creditCards = res.data;
      } catch (error) {
        console.error("Erro ao buscar Credit Cards:", error);
      }
    },
    async addCreditCard(card) {
      try {
        const res = await creditCardService.addCreditCard(card);
        this.creditCards.push(res.data);
      } catch (error) {
        console.error("Erro ao adicionar Credit Card:", error);
      }
    },
    async updateCreditCard(card) {
      try {
        const res = await creditCardService.updateCreditCard(
          card.id,
          card
        );
        const index = this.creditCards.findIndex((c) => c._id === card.id);
        if (index !== -1) this.creditCards[index] = res.data;
      } catch (error) {
        console.error("Erro ao atualizar Credit Card:", error);
      }
    },
    async removeCreditCard(cardId) {
      try {
        await creditCardService.deleteCreditCard(cardId);
        this.creditCards = this.creditCards.filter(
          (c) => c._id !== cardId
        );
      } catch (error) {
        console.error("Erro ao remover Credit Card:", error);
      }
    },
  },
});

export const pinia = createPinia();
