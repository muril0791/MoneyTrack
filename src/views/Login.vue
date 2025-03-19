<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input id="email" type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <button type="submit">Entrar</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();

    const simulateLogin = async (email, password) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === "usuario@exemplo.com" && password === "123456") {
            resolve({ token: "jwt-token-exemplo", user: { email } });
          } else {
            reject(new Error("Credenciais inválidas"));
          }
        }, 1000);
      });
    };

    const handleLogin = async () => {
      errorMessage.value = "";
      try {
        const response = await simulateLogin(email.value, password.value);

        localStorage.setItem("userToken", response.token);

        router.push({ name: "Home" });
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #161716;
  color: #c2c3c2;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #0f0e11;
  border-radius: 4px;
  background-color: #0f0e11;
  color: #c2c3c2;
}
button {
  padding: 0.5rem 1rem;
  background-color: #3ecf00;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background-color: #36b800;
}
.error {
  color: #e93030;
  margin-top: 1rem;
}
</style>
