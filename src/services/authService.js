import api from '@/api';

const getStorage = (remember = true) => (remember ? localStorage : sessionStorage);

export async function signUp({ email, password, username, remember = true }) {
  const { data } = await api.post('/auth/signup', { email, password, displayName: username });
  const storage = getStorage(remember);
  storage.setItem('userToken', data.access_token);
  storage.setItem('refreshToken', data.refresh_token);
  return data.user;
}

export async function signIn({ email, password, remember = true }) {
  const { data } = await api.post('/auth/login', { email, password });
  const storage = getStorage(remember);
  storage.setItem('userToken', data.access_token);
  storage.setItem('refreshToken', data.refresh_token);
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
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/auth/profile', payload);
  // Profile update keeps whatever storage was being used
  const storage = localStorage.getItem('userToken') ? localStorage : sessionStorage;
  storage.setItem('userToken', data.access_token);
  storage.setItem('refreshToken', data.refresh_token);
  return data.user;
}

export default { signUp, signIn, signOut, updateProfile };
