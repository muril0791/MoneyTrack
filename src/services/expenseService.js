// src/services/expenseService.js
import api from "../api";

const expenseService = {
  async getExpenses() {
    const response = await api.get("/expenses");
    return response.data;
  },
  async addExpense(expense) {
    const response = await api.post("/expenses", expense);
    return response.data;
  },
  async updateExpense(expense) {
    // expense.id é usado para atualizar
    const response = await api.put(`/expenses/${expense.id}`, expense);
    return response.data;
  },
  async deleteExpense(expenseId) {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  },
};

export default expenseService;
