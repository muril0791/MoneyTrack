<template>
  <div class="min-h-screen">
    <!-- TopBar -->
    <TopBar
      @open-modal="openNewTransaction"
      @open-calendar="showCalendar = true"
    />

    <!-- Conteúdo Principal: Dashboard (2 colunas) -->
    <main class="main-container">
      <div class="two-columns">
        <!-- Coluna 1: DashboardLeft -->
        <DashboardLeft :expenses="expenses" @open-add="openNewTransaction" />
        <!-- Coluna 2: Lista simples -->
        <SimpleTransactionList
          :expenses="expenses"
          @view-more="showFullList = true"
        />
      </div>
    </main>

    <!-- Modal de Lançamento (Adicionar / Editar) -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeFormModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">
              {{ editingExpense ? "Editar Lançamento" : "Novo Lançamento" }}
            </h2>
            <button @click="closeFormModal" class="modal-close">&times;</button>
          </div>
          <!-- Formulário -->
          <ExpenseForm
            :editingExpense="editingExpense"
            @add-expense="handleAddExpense"
            @close="closeFormModal"
          />
        </div>
      </div>
    </transition>

    <!-- Modal do Calendário -->
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

    <!-- Modal de Lista Detalhada (ExpenseList) -->
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

    // Armazena o item que estamos editando (ou null se for novo)
    const editingExpense = ref(null);

    // Abre o modal para criar um novo item (limpa "editingExpense")
    const openNewTransaction = () => {
      editingExpense.value = null;
      showModal.value = true;
    };

    // Fecha o modal do formulário
    const closeFormModal = () => {
      showModal.value = false;
      editingExpense.value = null;
    };

    // Adicionar ou atualizar um item
    const handleAddExpense = (expense) => {
      // Se for edição, atualiza o item existente
      if (editingExpense.value) {
        // Acha o index no array
        const index = expenses.value.indexOf(editingExpense.value);
        if (index !== -1) {
          // Atualiza os campos do item existente
          expenses.value[index] = { ...expense };
        }
      } else {
        // Adiciona um novo item sem gerar vários objetos
        // "parcelado" => Armazena 'parcelas', mas 1 item só
        expenses.value.push(expense);
      }
      closeFormModal();
    };

    // Exibe a lista completa
    const viewMoreTransactions = () => {
      showFullList.value = true;
    };

    // Editar item => abre modal com dados do item
    const handleEditExpense = (expense) => {
      editingExpense.value = expense; // Carrega o item no form
      showModal.value = true; // Abre o modal
    };

    // Excluir item => remove do array
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
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Estilos para os modais e container principal */
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

/* Variáveis de Cores */
:root {
  --cardbg: #161716;
  --mainbg: #0f0e11;
  --greenmain: #3ecf00;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
  --textgray: #aaaaaa;
}

/* Container Principal */
.main-container {
  max-width: 96rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Duas Colunas */
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
