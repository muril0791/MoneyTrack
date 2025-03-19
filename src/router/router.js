import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import AppMain from "../views/Home.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Home",
    component: AppMain,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Exemplo simples de guarda de rota
router.beforeEach((to, from, next) => {
  // Aqui você pode acessar seu Pinia store ou localStorage para verificar se o usuário está autenticado
  const isAuthenticated = localStorage.getItem("userToken") ? true : false;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
