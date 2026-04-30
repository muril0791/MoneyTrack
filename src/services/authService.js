import api from '@/api';

export async function signUp({ email, password, username }) {
  const { data } = await api.post('/auth/signup', { email, password, displayName: username });
  localStorage.setItem('userToken', data.access_token);
  return data.user;
}

export async function signIn({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('userToken', data.access_token);
  return data.user;
}

export async function signOut() {
  localStorage.removeItem('userToken');
}

export default { signUp, signIn, signOut };
