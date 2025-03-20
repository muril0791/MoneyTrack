// src/services/creditCardService.js
import api from "../api";

const creditCardService = {
  async getCreditCards() {
    const response = await api.get("/credit-cards");
    return response.data;
  },
  async addCreditCard(card) {
    const response = await api.post("/credit-cards", card);
    return response.data;
  },
  async updateCreditCard(card) {
    const response = await api.put(`/credit-cards/${card.id}`, card);
    return response.data;
  },
  async deleteCreditCard(cardId) {
    const response = await api.delete(`/credit-cards/${cardId}`);
    return response.data;
  },
};

export default creditCardService;
