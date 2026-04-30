import api from '@/api';

export async function listCategories() {
  const { data } = await api.get('/categories');
  return data.map(mapCategory);
}

export async function createCategory(payload) {
  const { data } = await api.post('/categories', {
    name: payload.name,
    type: payload.type,
    color: payload.color || null,
  });
  return mapCategory(data);
}

export async function updateCategory(id, payload) {
  const { data } = await api.patch(`/categories/${id}`, {
    name: payload.name,
    type: payload.type,
    color: payload.color || null,
  });
  return mapCategory(data);
}

export async function removeCategory(id) {
  await api.delete(`/categories/${id}`);
}

function mapCategory(row) {
  return {
    id: row._id,
    name: row.name,
    type: row.type,
    color: row.color,
    created_at: row.createdAt,
  }
}
