import api from "../api";

export function getExpenses() {
  return api.get("/expenses");
}

export function addExpense(data) {
  return api.post("/expenses", data);
}

export function updateExpense(id, data) {
  return api.put(`/expenses/${id}`, data);
}

export function deleteExpense(id) {
  return api.delete(`/expenses/${id}`);
}

// Default export
export default {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};
