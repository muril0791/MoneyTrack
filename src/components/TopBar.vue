<template>
  <header class="topbar">
    <div class="topbar__left">
      <h1 class="topbar__title">moneyTRACK</h1>
    </div>
    <div class="topbar__right">
      <button class="topbar__button" @click="$emit('open-calendar')">
        {{ currentMonth }}
      </button>
      <!-- Dropdown para Cadastros -->
      <div class="dropdown" tabindex="0" @click="toggleDropdown" @blur="closeDropdown">
        <button class="dropdown-toggle">Cadastros</button>
        <div v-if="dropdownOpen" class="dropdown-menu">
          <button class="dropdown-item" @click="openCreditCards">Cartões de Crédito</button>
          <button class="dropdown-item" @click="openCategories">Categorias</button>
          <button class="dropdown-item" @click="openCreditCardsList">Lista de Cartões de Crédito</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "TopBar",
  emits: ["open-calendar", "open-credit-cards", "open-categories","open-credit-cards-list"],
  data() {
    return {
      dropdownOpen: false,
    };
  },
  computed: {
    currentMonth() {
      return new Date().toLocaleString("pt-BR", { month: "long" });
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    openCreditCards() {
      this.$emit("open-credit-cards");
      this.closeDropdown();
    },
    openCreditCardsList() {
      this.$emit("open-credit-cards-list")
      this.closeDropdown();
    },
    openCategories() {
      this.$emit("open-categories");
      this.closeDropdown();
    },
  },
};
</script>

<style scoped>
.topbar {
  background-color: #161716;
  color: #c2c3c2;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.topbar__left {
  display: flex;
  align-items: center;
}
.topbar__title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3ecf00;
  margin: 0;
}
.topbar__right {
  display: flex;
  align-items: center;
}
.topbar__button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #161716;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid #3ecf00;
  border-radius: 4px;
}
.topbar__button:hover {
  background-color: #3ecf00;
  color: #161716;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-toggle {
  padding: 0.5rem 1rem;
  background-color: #161716;
  color: #ffffff;
  border: 1px solid #3ecf00;
  border-radius: 4px;
  cursor: pointer;
}
.dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  background-color: #161716;
  border: 1px solid #2b2c2f;
  border-radius: 4px;
  min-width: 150px;
  z-index: 10;
}
.dropdown-item {
  width: 100%;
  padding: 0.5rem;
  text-align: left;
  background: none;
  border: none;
  color: #c2c3c2;
  cursor: pointer;
  transition: background-color 0.2s;
}
.dropdown-item:hover {
  background-color: #3ecf00;
  color: #161716;
}
</style>
