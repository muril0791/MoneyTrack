// src/router/router.js
import { createRouter, createWebHistory } from "vue-router";
import * as jwtDecodeImport from "jwt-decode";
const jwtDecode = jwtDecodeImport.default || jwtDecodeImport;

import Login from "../views/Login.vue";
import AppMain from "../views/Home.vue";
import Register from "../views/Register.vue";

// Função que verifica se o token expirou
function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/", name: "Home", component: AppMain, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("userToken");
  console.log("router guard - token:", token);
  if (token && isTokenExpired(token)) {
    console.log("Token expirado");
    localStorage.removeItem("userToken");
    next({ name: "Login" });
    return;
  }
  const isAuthenticated = token ? true : false;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
