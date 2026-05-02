import api from '@/api';

export default {
  async getAll() {
    const { data } = await api.get('/goals');
    return data;
  },

  async create(goalData) {
    const { data } = await api.post('/goals', goalData);
    return data;
  },

  async addValue(id, value) {
    const { data } = await api.patch(`/goals/${id}/add`, { value });
    return data;
  },

  async update(id, goalData) {
    const { data } = await api.patch(`/goals/${id}`, goalData);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/goals/${id}`);
    return data;
  }
};
