<template>
  <div class="app-container">
    <!-- TopBar com menu de cadastros -->
    <TopBar
      @open-modal="openNewTransaction"
      @open-calendar="(showCalendar = true)"
      @open-credit-cards="openCreditCardsRegistrationModal"
      @open-categories="openCategoriesModal"
      @open-credit-cards-list="openCreditCardsModal"
    />

    <!-- Conteúdo Principal: Dashboard com duas colunas -->
    <main class="main-container">
      <div class="two-columns">
        <DashboardLeft :expenses="expenses" @open-add="openNewTransaction" />
        <SimpleTransactionList
          :expenses="paginatedExpenses"
          @open-detail="openDetail"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="changePage"
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
          <!-- Enviamos as categorias e os cartões para o formulário -->
          <ExpenseForm
            :editingExpense="editingExpense"
            :categories="categories"
            :creditCards="creditCards"
            @add-expense="handleAddExpense"
            @close="closeFormModal"
            @open-categories="openCategoriesModal"
          />
        </div>
      </div>
    </transition>

    <!-- Modal do Calendário -->
    <transition name="modal">
      <div v-if="showCalendar" class="modal-overlay" @click.self="showCalendar = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Calendário</h2>
            <button @click="showCalendar = false" class="modal-close">&times;</button>
          </div>
          <ExpenseCalendar :expenses="expenses" />
        </div>
      </div>
    </transition>

    <!-- Modal de Lista Detalhada (para visualizar lançamentos de um dia) -->
    <transition name="modal">
      <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
        <div class="modal-content" @click.stop>
          <ExpenseList
            :expenses="[selectedExpense]"
            @edit-expense="handleEditExpense"
            @delete-expense="handleDeleteExpense"
          />
        </div>
      </div>
    </transition>

    <!-- Modal de Cadastro de Categorias -->
    <transition name="modal">
      <div v-if="showCategoriesModal" class="modal-overlay" @click.self="closeCategoriesModal">
        <div class="modal-content" @click.stop>
          <CategoriasScreen
            :categories="categories"
            @update-categories="updateCategories"
            @close="closeCategoriesModal"
          />
        </div>
      </div>
    </transition>

    <!-- Modal de Listagem de Cartões de Crédito -->
    <transition name="modal">
      <div v-if="showCreditCardsModal" class="modal-overlay" @click.self="closeCreditCardsModal">
        <div class="modal-content" @click.stop>
          <CreditCardList
            :creditCards="creditCards"
            :expenses="expenses"
            @close="closeCreditCardsModal"
          />
        </div>
      </div>
    </transition>

    <!-- Modal de Cadastro de Cartões de Crédito -->
    <transition name="modal">
      <div v-if="showCreditCardsRegistrationModal" class="modal-overlay" @click.self="closeCreditCardsRegistrationModal">
        <div class="modal-content" @click.stop>
          <CartoesScreen
            @update-credit-cards="updateCreditCards"
            @close="closeCreditCardsRegistrationModal"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useMainStore } from "../stores/store"; // Nossa store do Pinia
import TopBar from "../components/TopBar.vue";
import DashboardLeft from "../components/DashboardLeft.vue";
import SimpleTransactionList from "../components/SimpleTransactionList.vue";
import ExpenseForm from "../components/ExpenseForm.vue";
import ExpenseCalendar from "../components/ExpenseCalendar.vue";
import ExpenseList from "../components/ExpenseList.vue";
import CategoriasScreen from "../components/CategoriasScreen.vue";
import CartoesScreen from "../components/CartoesScreen.vue";
import CreditCardList from "../components/CreditCardList.vue";

export default {
  name: "App",
  components: {
    TopBar,
    DashboardLeft,
    SimpleTransactionList,
    ExpenseForm,
    ExpenseCalendar,
    ExpenseList,
    CategoriasScreen,
    CartoesScreen,
    CreditCardList,
  },
  setup() {
    // Acessa o store global
    const store = useMainStore();

    // Para facilitar, definimos computed properties para acessar os estados do store
    const expenses = computed(() => store.expenses);
    const categories = computed(() => store.categories);
    const creditCards = computed(() => store.creditCards);

    // Gerenciamento de modais e edição local (não centralizado no store)
    const showModal = ref(false);
    const showCalendar = ref(false);
    const showDetailModal = ref(false);
    const showCategoriesModal = ref(false);
    const showCreditCardsModal = ref(false);
    const showCreditCardsRegistrationModal = ref(false);

    const editingExpense = ref(null);
    const selectedExpense = ref(null);

    // Paginação para a lista simples
    const currentPage = ref(1);
    const itemsPerPage = 5;
    const totalPages = computed(() =>
      Math.ceil(store.expenses.length / itemsPerPage)
    );
    const paginatedExpenses = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return store.expenses.slice(start, start + itemsPerPage);
    });
    const changePage = (page) => {
      currentPage.value = page;
    };

    // Métodos para modais e transações
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
        store.updateExpense(expense);
      } else {
        store.addExpense(expense);
      }
      closeFormModal();
    };

    const handleEditExpense = (expense) => {
      editingExpense.value = expense;
      showModal.value = true;
      closeDetailModal();
    };

    const handleDeleteExpense = (expense) => {
      store.removeExpense(expense.id);
      closeDetailModal();
    };

    const openDetail = (expense) => {
      selectedExpense.value = expense;
      showDetailModal.value = true;
    };

    const closeDetailModal = () => {
      showDetailModal.value = false;
      selectedExpense.value = null;
    };

    // Para categorias
    const openCategoriesModal = () => {
      showCategoriesModal.value = true;
    };
    const closeCategoriesModal = () => {
      showCategoriesModal.value = false;
    };
    const updateCategories = (newCategories) => {
      store.updateCategories(newCategories);
    };

    // Para cartões de crédito
    const openCreditCardsModal = () => {
      showCreditCardsModal.value = true;
    };
    const closeCreditCardsModal = () => {
      showCreditCardsModal.value = false;
    };
    const openCreditCardsRegistrationModal = () => {
      showCreditCardsRegistrationModal.value = true;
    };
    const closeCreditCardsRegistrationModal = () => {
      showCreditCardsRegistrationModal.value = false;
    };
    const updateCreditCards = (newCards) => {
      // Aqui substituímos o array inteiro; também poderia ser feita via ação individual
      store.creditCards = newCards;
    };

    return {
      expenses,
      categories,
      creditCards,
      paginatedExpenses,
      currentPage,
      totalPages,
      changePage,
      showModal,
      showCalendar,
      showDetailModal,
      showCategoriesModal,
      showCreditCardsModal,
      showCreditCardsRegistrationModal,
      editingExpense,
      selectedExpense,
      openNewTransaction,
      closeFormModal,
      handleAddExpense,
      handleEditExpense,
      handleDeleteExpense,
      openDetail,
      closeDetailModal,
      openCategoriesModal,
      closeCategoriesModal,
      updateCategories,
      openCreditCardsModal,
      closeCreditCardsModal,
      openCreditCardsRegistrationModal,
      closeCreditCardsRegistrationModal,
      updateCreditCards,
    };
  },
};
</script>

<style>
:root {
  --cardbg: #161716;
  --mainbg: #0f0e11;
  --greenmain: #3ecf00;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
  --textgray: #aaaaaa;
}

.app-container {
  background-color: var(--mainbg);
  min-height: 100vh;
}

/* Container Principal */
.main-container {
  max-width: 96rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Duas Colunas Responsivas */
.two-columns {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .two-columns {
    grid-template-columns: 1fr 1fr;
  }
}

/* Modal Overlay e Conteúdo */
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
  width: 90%;
  max-width: 50rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* Modal Header */
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

/* Transições do Modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
