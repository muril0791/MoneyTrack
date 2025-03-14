<template>
  <div class="min-h-screen">
    <TopBar
      @open-modal="openNewTransaction"
      @open-calendar="showCalendar = true"
    />

    <main class="main-container">
      <div class="two-columns">
        <DashboardLeft :expenses="expenses" @open-add="openNewTransaction" />

        <SimpleTransactionList
          :expenses="expenses"
          @view-more="showFullList = true"
        />
      </div>
    </main>

    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeFormModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">
              {{ editingExpense ? "Editar Lançamento" : "Novo Lançamento" }}
            </h2>
            <button @click="closeFormModal" class="modal-close">&times;</button>
          </div>

          <ExpenseForm
            :editingExpense="editingExpense"
            @add-expense="handleAddExpense"
            @close="closeFormModal"
          />
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="showCalendar"
        class="modal-overlay"
        @click.self="showCalendar = false"
      >
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Calendário</h2>
            <button @click="showCalendar = false" class="modal-close">
              &times;
            </button>
          </div>
          <ExpenseCalendar :expenses="expenses" />
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="showFullList"
        class="modal-overlay"
        @click.self="showFullList = false"
      >
        <ExpenseList
          :expenses="expenses"
          @add-transaction="openNewTransaction"
          @edit-expense="handleEditExpense"
          @delete-expense="handleDeleteExpense"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
import TopBar from "./components/TopBar.vue";
import DashboardLeft from "./components/DashboardLeft.vue";
import SimpleTransactionList from "./components/SimpleTransactionList.vue";
import ExpenseForm from "./components/ExpenseForm.vue";
import ExpenseCalendar from "./components/ExpenseCalendar.vue";
import ExpenseList from "./components/ExpenseList.vue";

export default {
  name: "App",
  components: {
    TopBar,
    DashboardLeft,
    SimpleTransactionList,
    ExpenseForm,
    ExpenseCalendar,
    ExpenseList,
  },
  setup() {
    const expenses = ref([]);
    const showModal = ref(false);
    const showCalendar = ref(false);
    const showFullList = ref(false);

    const editingExpense = ref(null);

    const openNewTransaction = () => {
      editingExpense.value = null;
      showModal.value = true;
    };

    const closeFormModal = () => {
      showModal.value = false;
      editingExpense.value = null;
    };

    const handleAddExpense = (expense) => {
      if (editingExpense.value) {
        const index = expenses.value.indexOf(editingExpense.value);
        if (index !== -1) {
          expenses.value[index] = { ...expense };
        }
      } else {
        expenses.value.push(expense);
      }
      closeFormModal();
    };

    const viewMoreTransactions = () => {
      showFullList.value = true;
    };

    const handleEditExpense = (expense) => {
      editingExpense.value = expense;
      showModal.value = true;
    };

    const handleDeleteExpense = (expense) => {
      expenses.value = expenses.value.filter((e) => e !== expense);
    };

    return {
      expenses,
      showModal,
      showCalendar,
      showFullList,
      editingExpense,
      openNewTransaction,
      closeFormModal,
      handleAddExpense,
      viewMoreTransactions,
      handleEditExpense,
      handleDeleteExpense,
    };
  },
};
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 50;
}

.modal-content {
  background-color: var(--cardbg);
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 50%;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--textwhite);
}

.modal-close {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--textgray);
  background: none;
  border: none;
  cursor: pointer;
}

.modal-close:hover {
  color: var(--textwhite);
}

:root {
  --cardbg: #161716;
  --mainbg: #0f0e11;
  --greenmain: #3ecf00;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
  --textgray: #aaaaaa;
}

.main-container {
  max-width: 96rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.two-columns {
  display: grid;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .two-columns {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
