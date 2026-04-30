import api from '@/api';

export async function listExpenses() {
  const { data } = await api.get('/expenses');
  return data.map(mapExpense);
}

export async function createExpense(payload) {
  const { data } = await api.post('/expenses', {
    tipo: payload.tipo,
    tipoTransacao: payload.tipoTransacao,
    parcelas: payload.parcelas ?? null,
    data: payload.data,
    valor: payload.valor,
    categoria: payload.categoria,
    descricao: payload.descricao || null,
    creditCardId: payload.creditCardId || null,
  });
  return mapExpense(data);
}

export async function updateExpense(id, payload) {
  const { data } = await api.patch(`/expenses/${id}`, {
    tipo: payload.tipo,
    tipoTransacao: payload.tipoTransacao,
    parcelas: payload.parcelas ?? null,
    data: payload.data,
    valor: payload.valor,
    categoria: payload.categoria,
    descricao: payload.descricao || null,
    creditCardId: payload.creditCardId || null,
  });
  return mapExpense(data);
}

export async function removeExpense(id) {
  await api.delete(`/expenses/${id}`);
}

function mapExpense(row) {
  return {
    id: row._id,
    tipo: row.tipo,
    tipoTransacao: row.tipoTransacao,
    parcelas: row.parcelas,
    data: row.data,
    valor: Number(row.valor),
    categoria: row.categoria,
    descricao: row.descricao || '',
    creditCardId: row.creditCardId,
    created_at: row.createdAt,
  }
}
