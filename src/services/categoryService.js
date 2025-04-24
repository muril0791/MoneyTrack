import api from "../api";

export function getCategories() {
  return api.get("/categories");
}

export function addCategory(data) {
  return api.post("/categories", data);
}

export function updateCategory(id, data) {
  return api.put(`/categories/${id}`, data);
}

export function deleteCategory(id) {
  return api.delete(`/categories/${id}`);
}


export default {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
