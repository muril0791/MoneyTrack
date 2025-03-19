<template>
  <div class="app-container">
    <!-- TopBar com menu de cadastros -->
    <TopBar
      @open-modal="openNewTransaction"
      @open-calendar="showCalendar = true"
      @open-credit-cards="openCreditCardsRegistrationModal"
      @open-categories="openCategoriesModal"
      @open-credit-cards-list="openCreditCardsModal"
    />

    <!-- Conteúdo Principal: Dashboard com duas colunas -->
    <main class="main-container">
      <div class="two-columns">
        <!-- Coluna 1: DashboardLeft -->
        <DashboardLeft :expenses="expenses" @open-add="openNewTransaction" />
        <!-- Coluna 2: Lista Simples -->
        <SimpleTransactionList
          :expenses="expensesPaginated"
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
          <!-- Passamos as categorias e os cartões para o formulário -->
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
      <div
        v-if="showCalendar"
        class="modal-overlay"
        @click.self="showCalendar = false"
      >
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Calendário</h2>
            <button @click="showCalendar = false" class="modal-close">&times;</button>
          </div>
          <!-- Passa também os cartões para o calendário para cálculo dos lançamentos de cartão -->
          <ExpenseCalendar 
            :expenses="expenses" 
            :creditCards="creditCards" 
            @open-day="openDayModal"
          />
        </div>
      </div>
    </transition>

    <!-- Modal de Lista Detalhada (ao clicar em um dia no calendário) -->
    <transition name="modal">
      <div
        v-if="showDayModal"
        class="modal-overlay"
        @click.self="closeDayModal"
      >
        <div class="modal-content" @click.stop>
          <ExpenseList
            :expenses="selectedDayExpenses"
            @edit-expense="handleEditExpense"
            @delete-expense="handleDeleteExpense"
          />
          <button class="btn-close" @click="closeDayModal">Fechar</button>
        </div>
      </div>
    </transition>

    <!-- Modal de Cadastro de Categorias -->
    <transition name="modal">
      <div
        v-if="showCategoriesModal"
        class="modal-overlay"
        @click.self="closeCategoriesModal"
      >
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
      <div
        v-if="showCreditCardsModal"
        class="modal-overlay"
        @click.self="closeCreditCardsModal"
      >
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
      <div
        v-if="showCreditCardsRegistrationModal"
        class="modal-overlay"
        @click.self="closeCreditCardsRegistrationModal"
      >
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
import TopBar from "./components/TopBar.vue";
import DashboardLeft from "./components/DashboardLeft.vue";
import SimpleTransactionList from "./components/SimpleTransactionList.vue";
import ExpenseForm from "./components/ExpenseForm.vue";
import ExpenseCalendar from "./components/ExpenseCalendar.vue";
import ExpenseList from "./components/ExpenseList.vue";
import CategoriasScreen from "./components/CategoriasScreen.vue";
import CartoesScreen from "./components/CartoesScreen.vue";
import CreditCardList from "./components/CreditCardList.vue";

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
    // Lançamentos
    const expenses = ref([]);

    // Categorias globais (padrão + criadas pelo usuário)
    const categories = ref([
      // Categorias de Entrada
      { id: "salario", name: "Salário", type: "entrada" },
      { id: "venda", name: "Venda", type: "entrada" },
      { id: "devolucao", name: "Devolução", type: "entrada" },
      { id: "emprestimo", name: "Empréstimo", type: "entrada" },
      { id: "investimentos", name: "Investimentos", type: "entrada" },
      { id: "premiacoes", name: "Premiações", type: "entrada" },
      { id: "outros-entrada", name: "Outros", type: "entrada" },
      // Categorias de Saída
      { id: "lazer", name: "Lazer", type: "saida" },
      { id: "mercado", name: "Mercado", type: "saida" },
      { id: "compras", name: "Compras", type: "saida" },
      { id: "saude", name: "Saúde", type: "saida" },
      { id: "educacao", name: "Educação", type: "saida" },
      { id: "transporte", name: "Transporte", type: "saida" },
      { id: "moradia", name: "Moradia", type: "saida" },
      { id: "outros-saida", name: "Outros", type: "saida" },
    ]);

    // Cartões de Crédito
    const creditCards = ref([]);
    const updateCreditCards = (newCards) => {
      creditCards.value = newCards;
    };

    // Atualiza categorias vindas da tela de cadastro
    const updateCategories = (newCategories) => {
      categories.value = newCategories;
    };

    // Paginação para a lista simples
    const currentPage = ref(1);
    const itemsPerPage = 5;
    const totalPages = computed(() =>
      Math.ceil(expenses.value.length / itemsPerPage)
    );
    const expensesPaginated = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return expenses.value.slice(start, start + itemsPerPage);
    });
    const changePage = (page) => {
      currentPage.value = page;
    };

    // Estados de modais
    const showModal = ref(false);
    const showCalendar = ref(false);
    const showDetailModal = ref(false);
    const showCategoriesModal = ref(false);
    const showCreditCardsModal = ref(false);
    const showCreditCardsRegistrationModal = ref(false);
    const showDayModal = ref(false);

    // Edição de lançamentos
    const editingExpense = ref(null);
    const selectedExpense = ref(null);

    // Modal para listagem de lançamentos em um dia específico
    const selectedDayExpenses = ref([]);
    const openDayModal = (date) => {
      selectedDayExpenses.value = expenses.value.filter(
        (e) => e.data === date
      );
      showDayModal.value = true;
    };
    const closeDayModal = () => {
      showDayModal.value = false;
      selectedDayExpenses.value = [];
    };

    // Funções de abertura/fechamento de modais
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

    const handleEditExpense = (expense) => {
      editingExpense.value = expense;
      showModal.value = true;
      closeDetailModal();
    };

    const handleDeleteExpense = (expense) => {
      expenses.value = expenses.value.filter((e) => e !== expense);
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

    // Modal de Categorias
    const openCategoriesModal = () => {
      showCategoriesModal.value = true;
    };
    const closeCategoriesModal = () => {
      showCategoriesModal.value = false;
    };

    // Modal de Cartões
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

    return {
      expenses,
      categories,
      creditCards,
      updateCreditCards,
      updateCategories,
      currentPage,
      totalPages,
      expensesPaginated,
      changePage,
      showModal,
      showCalendar,
      showDetailModal,
      showCategoriesModal,
      showCreditCardsModal,
      showCreditCardsRegistrationModal,
      showDayModal,
      selectedDayExpenses,
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
      openCreditCardsModal,
      closeCreditCardsModal,
      openCreditCardsRegistrationModal,
      closeCreditCardsRegistrationModal,
      openDayModal,
      closeDayModal,
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
