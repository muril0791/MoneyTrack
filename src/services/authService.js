import api from "../api";

async function register({ username, email, password }) {
  return api.post("/auth/register", { username, email, password });
}

async function login({ email, password }) {
  const response = await api.post("/auth/login", { email, password });
  return response;
}

export default {
  register,
  login,
};
