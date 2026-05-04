import api from '@/api';

export async function signUp({ email, password, username }) {
  const { data } = await api.post('/auth/signup', { email, password, displayName: username });
  localStorage.setItem('userToken', data.access_token);
  localStorage.setItem('refreshToken', data.refresh_token);
  return data.user;
}

export async function signIn({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('userToken', data.access_token);
  localStorage.setItem('refreshToken', data.refresh_token);
  return data.user;
}

export async function signOut() {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.error('Erro ao deslogar no servidor', e);
  } finally {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/auth/profile', payload);
  localStorage.setItem('userToken', data.access_token);
  localStorage.setItem('refreshToken', data.refresh_token);
  return data.user;
}

export default { signUp, signIn, signOut, updateProfile };
