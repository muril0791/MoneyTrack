<template>
  <div class="login-container">
    <h2 class="title">Login</h2>
    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="credentials.email"
          placeholder="Digite seu e-mail"
          required
          pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
          v-trim
        />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          placeholder="Digite sua senha"
          required
          minlength="6"
          v-trim
        />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="form-buttons">
        <button type="submit" class="btn">Entrar</button>
      </div>
    </form>
    <p class="redirect">
      Não possui conta? <router-link to="/register">Cadastre-se</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../services/authService";

export default {
  name: "Login",
  setup() {
    const credentials = ref({ email: "", password: "" });
    const error = ref("");
    const router = useRouter();

    const handleLogin = async () => {
      error.value = "";
      try {
        const data = await authService.login(credentials.value);
        console.log("Token recebido:", data.token);
        localStorage.setItem("userToken", data.token);
        router.push("/");
      } catch (err) {
        error.value =
          err.response?.data?.message || "E-mail ou senha incorretos!";
      }
    };

    return { credentials, error, handleLogin };
  },
};
</script>

<style scoped>
.login-container {
  background-color: var(--cardbg);
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  height: 100%;
  margin: 2rem auto;
  color: var(--textwhite);
}
.title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--greenmain);
}
.form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--textgray);
}
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--mainbg);
  border-radius: 4px;
  background-color: var(--mainbg);
  color: var(--textwhite);
}
.form-buttons {
  margin-top: 1rem;
}
.btn {
  padding: 0.75rem;
  background-color: var(--greenmain);
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
}
.btn:hover {
  background-color: #36b800;
}
.error {
  color: var(--redmain);
  margin-bottom: 1rem;
  text-align: center;
}
.redirect {
  text-align: center;
  margin-top: 1rem;
  color: var(--textgray);
}
.redirect a {
  color: var(--greenmain);
  text-decoration: none;
}
</style>
