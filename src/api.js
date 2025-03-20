// src/api.js
import axios from "axios";

const api = axios.create({
  // Pega a URL do backend do .env ou usa localhost:3000 como fallback
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Interceptor que adiciona o token no cabeçalho Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
