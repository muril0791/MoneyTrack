import api from "../api";

export function getCreditCards() {
  return api.get("/credit-cards");
}

export function addCreditCard(data) {
  return api.post("/credit-cards", data);
}

export function updateCreditCard(id, data) {
  return api.put(`/credit-cards/${id}`, data);
}

export function deleteCreditCard(id) {
  return api.delete(`/credit-cards/${id}`);
}

// Default export
export default {
  getCreditCards,
  addCreditCard,
  updateCreditCard,
  deleteCreditCard,
};
