// src/main.js
import { createApp } from "vue";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { pinia } from "./stores/store";
import router from "./router/router";
import "./index.css";
import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App).use(router).use(pinia).use(vuetify);

// Captura erros globais do Vue
app.config.errorHandler = (err, vm, info) => {
  console.error("Vue error handler:", err, info);
};

// Captura avisos globais
app.config.warnHandler = (msg, vm, trace) => {
  console.warn("Vue warn handler:", msg, trace);
};

// Diretiva para remover espaços em branco nos inputs ao sair do campo
app.directive("trim", {
  beforeMount(el) {
    el.addEventListener("blur", () => {
      if (el.value) {
        el.value = el.value.trim();
      }
    });
  },
});

app.mount("#app");
