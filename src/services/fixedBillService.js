import api from '@/api';

export default {
  async getAll() {
    const { data } = await api.get('/fixed-bills');
    return data;
  },

  async create(billData) {
    const { data } = await api.post('/fixed-bills', billData);
    return data;
  },

  async update(id, billData) {
    const { data } = await api.patch(`/fixed-bills/${id}`, billData);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/fixed-bills/${id}`);
    return data;
  },

  async pay(id) {
    const { data } = await api.post(`/fixed-bills/${id}/pay`);
    return data;
  }
};
