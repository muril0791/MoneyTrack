import api from '@/api';

export async function listCreditCards() {
  const { data } = await api.get('/credit-cards');
  return data.map(mapCard);
}

export async function createCreditCard(payload) {
  const { data } = await api.post('/credit-cards', {
    name: payload.name,
    limit: payload.limit,
    closingDay: payload.closingDay,
    dueDay: payload.dueDay,
  });
  return mapCard(data);
}

export async function updateCreditCard(id, payload) {
  const { data } = await api.patch(`/credit-cards/${id}`, {
    name: payload.name,
    limit: payload.limit,
    closingDay: payload.closingDay,
    dueDay: payload.dueDay,
  });
  return mapCard(data);
}

export async function removeCreditCard(id) {
  await api.delete(`/credit-cards/${id}`);
}

function mapCard(row) {
  return {
    id: row._id,
    name: row.name,
    limit: Number(row.limit),
    closingDay: Number(row.closingDay),
    dueDay: Number(row.dueDay),
    created_at: row.createdAt,
  }
}
