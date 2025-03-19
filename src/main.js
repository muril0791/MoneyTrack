// src/main.js
import { createApp } from "vue";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { pinia } from "./stores/store"; // Certifique-se de que o caminho está correto
import router from "./router/router";
import "./index.css";
import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(router).use(pinia).use(vuetify).mount("#app");
