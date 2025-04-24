import api from "../api";

const categoryService = {
  async getCategories() {
    const response = await api.get("/categories");
    return response.data;
  },
  async addCategory(category) {
    const response = await api.post("/categories", category);
    return response.data;
  },
  async updateCategory(category) {
    const response = await api.put(`/categories/${category.id}`, category);
    return response.data;
  },
  async deleteCategory(categoryId) {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

export default categoryService;
