<template>
  <header class="topbar">
    <div class="topbar__left">
      <h1 class="topbar__title">moneyTRACK</h1>
    </div>
    <div class="topbar__right">
      <button @click="$emit('open-calendar')" class="topbar__button">
        {{ currentMonth }}
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "TopBar",
  computed: {
    currentMonth() {
      return new Date().toLocaleString("pt-BR", { month: "long" });
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
  gap: 2rem;
}

.topbar__title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3ecf00;
  margin: 0;
}

/* .topbar__right {} */

.topbar__button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #161716;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.topbar__button:hover {
  color: #434343;
}
</style>
