// src/stores/store.js
import { defineStore, createPinia } from "pinia";
import * as expenseService from "@/services/expenseService";
import * as categoryService from "@/services/categoryService";
import * as creditCardService from "@/services/creditCardService";
import goalService from "@/services/goalService";
import fixedBillService from "@/services/fixedBillService";

function normalizeGoal(row) {
  if (!row) return row;
  return {
    id: row.id || row._id,
    title: row.title,
    targetAmount: Number(row.targetAmount ?? 0),
    currentAmount: Number(row.currentAmount ?? 0),
    color: row.color || '#10b981',
    icon: row.icon || 'target',
    deadline: row.deadline,
    created_at: row.createdAt || row.created_at,
  };
}

function normalizeFixedBill(row) {
  if (!row) return row;
  return {
    id: row.id || row._id,
    title: row.title,
    amount: Number(row.amount ?? 0),
    dueDay: Number(row.dueDay ?? 1),
    isVariable: row.isVariable || false,
    totalInstallments: row.totalInstallments || null,
    remainingInstallments: row.remainingInstallments || null,
    lastPaidDate: row.lastPaidDate,
    status: row.status || 'pending',
    created_at: row.createdAt || row.created_at,
  };
}

function normalizeCard(row) {
  if (!row) return row;
  return {
    id: row.id || row._id,
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
    id: row.id || row._id,
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
    goals: [],
    fixedBills: [],
    user: null,
  }),

  actions: {
    reset() {
      this.expenses = [];
      this.categories = [];
      this.creditCards = [];
      this.goals = [];
      this.fixedBills = [];
      this.user = null;
    },

    setUser(user) {
      this.user = user;
    },

    async fetchExpenses() {
      try {
        const list = await expenseService.listExpenses();
        this.expenses = (list || []).map(normalizeExpense);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao buscar Expenses:", error);
      }
    },

    async addExpense(expense) {
      try {
        const created = await expenseService.createExpense(expense);
        this.expenses.unshift(normalizeExpense(created));
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao adicionar Expense:", error);
      }
    },

    async updateExpense(expense) {
      try {
        const updated = await expenseService.updateExpense(expense.id, expense);
        const norm = normalizeExpense(updated);
        const index = this.expenses.findIndex((e) => e.id === expense.id);
        if (index !== -1) this.expenses[index] = norm;
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao atualizar Expense:", error);
      }
    },

    async removeExpense(expenseId) {
      try {
        await expenseService.removeExpense(expenseId);
        this.expenses = this.expenses.filter((e) => e.id !== expenseId);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao remover Expense:", error);
      }
    },

    async fetchCategories() {
      try {
        const list = await categoryService.listCategories();
        this.categories = list || [];
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao buscar Categories:", error);
      }
    },

    async addCategory(category) {
      try {
        const created = await categoryService.createCategory(category);
        this.categories.unshift(created);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao adicionar Category:", error);
      }
    },

    async updateCategory(category) {
      try {
        const updated = await categoryService.updateCategory(category.id, category);
        const index = this.categories.findIndex((c) => c.id === category.id);
        if (index !== -1) this.categories[index] = updated;
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao atualizar Category:", error);
      }
    },

    async removeCategory(categoryId) {
      try {
        await categoryService.removeCategory(categoryId);
        this.categories = this.categories.filter((c) => c.id !== categoryId);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao remover Category:", error);
      }
    },

    async fetchCreditCards() {
      try {
        const rows = await creditCardService.listCreditCards();
        this.creditCards = (rows || []).map(normalizeCard);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao buscar Credit Cards:", error);
      }
    },

    async addCreditCard(card) {
      try {
        const created = await creditCardService.createCreditCard(card);
        this.creditCards.unshift(normalizeCard(created));
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao adicionar Credit Card:", error);
      }
    },

    async updateCreditCard(card) {
      try {
        const updated = await creditCardService.updateCreditCard(card.id, card);
        const norm = normalizeCard(updated);
        const index = this.creditCards.findIndex((c) => c.id === card.id);
        if (index !== -1) this.creditCards[index] = norm;
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao atualizar Credit Card:", error);
      }
    },

    async removeCreditCard(cardId) {
      try {
        await creditCardService.removeCreditCard(cardId);
        this.creditCards = this.creditCards.filter((c) => c.id !== cardId);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao remover Credit Card:", error);
      }
    },

    async fetchGoals() {
      try {
        const rows = await goalService.getAll();
        this.goals = (rows || []).map(normalizeGoal);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao buscar Goals:", error);
      }
    },

    async addGoal(goal) {
      try {
        const created = await goalService.create(goal);
        this.goals.unshift(normalizeGoal(created));
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao adicionar Goal:", error);
      }
    },

    async addValueToGoal(goalId, value) {
      try {
        const updated = await goalService.addValue(goalId, value);
        const norm = normalizeGoal(updated);
        const index = this.goals.findIndex((g) => g.id === goalId);
        if (index !== -1) this.goals[index] = norm;
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao adicionar valor ao Goal:", error);
      }
    },

    async updateGoal(goalId, goalData) {
      try {
        const updated = await goalService.update(goalId, goalData);
        const norm = normalizeGoal(updated);
        const index = this.goals.findIndex((g) => g.id === goalId);
        if (index !== -1) this.goals[index] = norm;
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao atualizar Goal:", error);
      }
    },

    async removeGoal(goalId) {
      try {
        await goalService.delete(goalId);
        this.goals = this.goals.filter((g) => g.id !== goalId);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao remover Goal:", error);
      }
    },

    async fetchFixedBills() {
      try {
        const rows = await fixedBillService.getAll();
        this.fixedBills = rows.map(normalizeFixedBill);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao buscar Fixed Bills:", error);
      }
    },

    async addFixedBill(bill) {
      try {
        const created = await fixedBillService.create(bill);
        this.fixedBills.push(normalizeFixedBill(created));
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao adicionar Fixed Bill:", error);
      }
    },

    async updateFixedBill(id, billData) {
      try {
        const updated = await fixedBillService.update(id, billData);
        const norm = normalizeFixedBill(updated);
        const index = this.fixedBills.findIndex((b) => b.id === id);
        if (index !== -1) this.fixedBills[index] = norm;
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao atualizar Fixed Bill:", error);
      }
    },

    async removeFixedBill(id) {
      try {
        await fixedBillService.delete(id);
        this.fixedBills = this.fixedBills.filter((b) => b.id !== id);
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao remover Fixed Bill:", error);
      }
    },

    async payFixedBill(id) {
      try {
        const updated = await fixedBillService.pay(id);
        const norm = normalizeFixedBill(updated);
        const index = this.fixedBills.findIndex((b) => b.id === id);
        if (index !== -1) this.fixedBills[index] = norm;
      } catch (error) {
        if (import.meta.env.DEV) console.error("Erro ao pagar Fixed Bill:", error);
      }
    }
  },
});

export const pinia = createPinia();
