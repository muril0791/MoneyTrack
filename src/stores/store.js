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
        const data = await expenseService.getExpenses();
        this.expenses = data;
      } catch (error) {
        console.error("Erro ao buscar Expenses:", error);
      }
    },
    async addExpense(expense) {
      try {
        const created = await expenseService.addExpense(expense);
        this.expenses.push(created);
      } catch (error) {
        console.error("Erro ao adicionar Expense:", error);
      }
    },
    async updateExpense(expense) {
      try {
        const updated = await expenseService.updateExpense(expense);
        const index = this.expenses.findIndex((e) => e.id === expense.id);
        if (index !== -1) {
          this.expenses[index] = updated;
        }
      } catch (error) {
        console.error("Erro ao atualizar Expense:", error);
      }
    },
    async removeExpense(expenseId) {
      try {
        await expenseService.deleteExpense(expenseId);
        this.expenses = this.expenses.filter((e) => e.id !== expenseId);
      } catch (error) {
        console.error("Erro ao remover Expense:", error);
      }
    },


    async fetchCategories() {
      try {
        const data = await categoryService.getCategories();
        this.categories = data;
      } catch (error) {
        console.error("Erro ao buscar Categories:", error);
      }
    },
    async addCategory(category) {
      try {
        const created = await categoryService.addCategory(category);
        this.categories.push(created);
      } catch (error) {
        console.error("Erro ao adicionar Category:", error);
      }
    },
    async updateCategory(category) {
      try {
        const updated = await categoryService.updateCategory(category);
        const index = this.categories.findIndex((c) => c.id === category.id);
        if (index !== -1) {
          this.categories[index] = updated;
        }
      } catch (error) {
        console.error("Erro ao atualizar Category:", error);
      }
    },
    async removeCategory(categoryId) {
      try {
        await categoryService.deleteCategory(categoryId);
        this.categories = this.categories.filter((c) => c.id !== categoryId);
      } catch (error) {
        console.error("Erro ao remover Category:", error);
      }
    },


    async fetchCreditCards() {
      try {
        const data = await creditCardService.getCreditCards();
        this.creditCards = data;
      } catch (error) {
        console.error("Erro ao buscar Credit Cards:", error);
      }
    },
    async addCreditCard(card) {
      try {
        const created = await creditCardService.addCreditCard(card);
        this.creditCards.push(created);
      } catch (error) {
        console.error("Erro ao adicionar Credit Card:", error);
      }
    },
    async updateCreditCard(card) {
      try {
        const updated = await creditCardService.updateCreditCard(card);
        const index = this.creditCards.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          this.creditCards[index] = updated;
        }
      } catch (error) {
        console.error("Erro ao atualizar Credit Card:", error);
      }
    },
    async removeCreditCard(cardId) {
      try {
        await creditCardService.deleteCreditCard(cardId);
        this.creditCards = this.creditCards.filter((c) => c.id !== cardId);
      } catch (error) {
        console.error("Erro ao remover Credit Card:", error);
      }
    },
  },
});

export const pinia = createPinia();
