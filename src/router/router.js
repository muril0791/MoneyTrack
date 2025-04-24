import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import AppMain from "../views/Home.vue";

// Helper para decodificar manualmente o payload do JWT
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(
      decodeURIComponent(
        json
          .split("")
          .map((c) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      )
    );
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  if (!token) return true;
  const payload = parseJwt(token.trim());
  if (!payload || typeof payload.exp !== "number") {
    console.error("parseJwt falhou ou não há exp no payload");
    return true;
  }
  // exp em segundos → ms
  return payload.exp * 1000 < Date.now();
}

const routes = [
  { path: "/", name: "Home", component: AppMain, meta: { requiresAuth: true } },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
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
    return next({ name: "Login" });
  }

  const isAuthenticated = !!token;
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }
  next();
});

export default router;
