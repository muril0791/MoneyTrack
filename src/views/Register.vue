<template>
  <div class="register-container">
    <h2 class="title">Cadastro de Usuário</h2>
    <form @submit.prevent="handleRegister" class="form">
      <div class="form-group">
        <label for="username">Nome de Usuário</label>
        <input
          type="text"
          id="username"
          v-model="user.username"
          placeholder="Digite seu nome de usuário"
          required
          v-trim
        />
      </div>
      <div class="form-group">
        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="user.email"
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
          v-model="user.password"
          placeholder="Digite sua senha"
          required
          minlength="6"
          v-trim
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="user.confirmPassword"
          placeholder="Confirme sua senha"
          required
          minlength="6"
          v-trim
        />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="form-buttons">
        <button type="submit" class="btn">Cadastrar</button>
      </div>
      <p class="redirect">
        Já possui conta? <router-link to="/login">Faça login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import authService from "../services/authService"

const router = useRouter()
const user = ref({ username:"", email:"", password:"", confirmPassword:"" })
const error = ref("")

async function handleRegister() {
  error.value = ""
  if (user.value.password !== user.value.confirmPassword) {
    error.value = "As senhas não conferem!"
    return
  }
  try {
    await authService.signUp({
      email: user.value.email,
      password: user.value.password,
      username: user.value.username,
    })
    router.push({ name: "Login" })
  } catch (err) {
    error.value = err?.message || "Erro no cadastro."
  }
}
</script>



<style scoped>
.register-container {
  background-color: var(--cardbg);
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
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
