
import { defineStore, createPinia } from "pinia";
import * as expenseService from "@/services/expenseService";
import * as categoryService from "@/services/categoryService";
import * as creditCardService from "@/services/creditCardService";

/**
 * Helpers para garantir que os dados estejam no formato esperado pelos componentes,
 * mesmo que algum service retorne snake_case.
 */
function normalizeCard(row) {
  if (!row) return row;
  return {
    id: row.id,
    name: row.name,
    limit: Number(row.limit ?? row["limit"] ?? 0),
    closingDay: row.closingDay ?? row.closing_day,
    dueDay: row.dueDay ?? row.due_day,
    created_at: row.created_at,
  };
}

function normalizeExpense(row) {
  if (!row) return row;
  return {
    id: row.id,
    tipo: row.tipo,
    tipoTransacao: row.tipoTransacao ?? row.tipo_transacao,
    parcelas: row.parcelas ?? null,
    data: row.data, 
    valor: Number(row.valor ?? 0),
    categoria: row.categoria ?? null, 
    descricao: row.descricao ?? "",
    creditCardId: row.creditCardId ?? row.credit_card_id ?? null,
    created_at: row.created_at,
  };
}

export const useMainStore = defineStore("main", {
  state: () => ({
    expenses: [],
    categories: [],
    creditCards: [],
  }),

  actions: {
    
    async fetchExpenses() {
      try {
        const list = await expenseService.listExpenses();
        this.expenses = (list || []).map(normalizeExpense);
      } catch (error) {
        console.error("Erro ao buscar Expenses:", error);
      }
    },

    async addExpense(expense) {
      try {
        const created = await expenseService.createExpense(expense);
        this.expenses.unshift(normalizeExpense(created));
      } catch (error) {
        console.error("Erro ao adicionar Expense:", error);
      }
    },

    async updateExpense(expense) {
      try {
        const updated = await expenseService.updateExpense(expense.id, expense);
        const norm = normalizeExpense(updated);
        const index = this.expenses.findIndex((e) => e.id === expense.id);
        if (index !== -1) this.expenses[index] = norm;
      } catch (error) {
        console.error("Erro ao atualizar Expense:", error);
      }
    },

    async removeExpense(expenseId) {
      try {
        await expenseService.removeExpense(expenseId);
        this.expenses = this.expenses.filter((e) => e.id !== expenseId);
      } catch (error) {
        console.error("Erro ao remover Expense:", error);
      }
    },

    
    async fetchCategories() {
      try {
        const list = await categoryService.listCategories();
       
        this.categories = list || [];
      } catch (error) {
        console.error("Erro ao buscar Categories:", error);
      }
    },

    async addCategory(category) {
      try {
        const created = await categoryService.createCategory(category);
        this.categories.unshift(created);
      } catch (error) {
        console.error("Erro ao adicionar Category:", error);
      }
    },

    async updateCategory(category) {
      try {
        const updated = await categoryService.updateCategory(category.id, category);
        const index = this.categories.findIndex((c) => c.id === category.id);
        if (index !== -1) this.categories[index] = updated;
      } catch (error) {
        console.error("Erro ao atualizar Category:", error);
      }
    },

    async removeCategory(categoryId) {
      try {
        await categoryService.removeCategory(categoryId);
        this.categories = this.categories.filter((c) => c.id !== categoryId);
      } catch (error) {
        console.error("Erro ao remover Category:", error);
      }
    },

    
    async fetchCreditCards() {
      try {
        const rows = await creditCardService.listCreditCards();
       
        this.creditCards = (rows || []).map(normalizeCard);
      } catch (error) {
        console.error("Erro ao buscar Credit Cards:", error);
      }
    },

    async addCreditCard(card) {
      try {
        const created = await creditCardService.createCreditCard(card);
        this.creditCards.unshift(normalizeCard(created));
      } catch (error) {
        console.error("Erro ao adicionar Credit Card:", error);
      }
    },

    async updateCreditCard(card) {
      try {
        const updated = await creditCardService.updateCreditCard(card.id, card);
        const norm = normalizeCard(updated);
        const index = this.creditCards.findIndex((c) => c.id === card.id);
        if (index !== -1) this.creditCards[index] = norm;
      } catch (error) {
        console.error("Erro ao atualizar Credit Card:", error);
      }
    },

    async removeCreditCard(cardId) {
      try {
        await creditCardService.removeCreditCard(cardId);
        this.creditCards = this.creditCards.filter((c) => c.id !== cardId);
      } catch (error) {
        console.error("Erro ao remover Credit Card:", error);
      }
    },
  },
});

export const pinia = createPinia();
