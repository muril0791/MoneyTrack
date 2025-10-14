<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white">
    <!-- Topbar -->
    <TopBar
      @open-modal="openNewTransaction"
      @open-calendar="() => (showCalendar = true)"
      @open-credit-cards="openCreditCardsRegistrationModal"
      @open-categories="openCategoriesModal"
      @open-credit-cards-list="openCreditCardsModal"
    />

    <!-- Main -->
    <main class="max-w-screen-2xl mx-auto px-4 py-6">
      <div class="grid gap-6 md:grid-cols-2">
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

    <!-- ============ MODALS (Tailwind only) ============ -->

    <!-- Novo/Editar Lançamento -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeFormModal"
    >
      <!-- A ExpenseForm já rende o cartão interno. Só limitamos o width. -->
      <div class="w-full max-w-3xl" @click.stop>
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

    <!-- Calendário -->
    <div
      v-if="showCalendar"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showCalendar = false"
    >
      <div
        class="w-full max-w-5xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden"
        @click.stop
      >
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]"
        >
          <h2 class="text-lg font-semibold tracking-tight">Calendário</h2>
          <button
            class="h-9 w-9 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
            @click="showCalendar = false"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div class="p-4">
          <ExpenseCalendar :expenses="expenses" />
        </div>
      </div>
    </div>

    <!-- Detalhe do Lançamento -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeDetailModal"
    >
      <div
        class="w-full max-w-3xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden"
        @click.stop
      >
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]"
        >
          <h2 class="text-lg font-semibold tracking-tight">Detalhes</h2>
          <button
            class="h-9 w-9 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
            @click="closeDetailModal"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div class="p-4">
          <ExpenseList
            :expenses="[selectedExpense]"
            @edit-expense="handleEditExpense"
            @delete-expense="handleDeleteExpense"
          />
        </div>
      </div>
    </div>

    <!-- Categorias (CRUD) -->
    <div
      v-if="showCategoriesModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeCategoriesModal"
    >
      <div
        class="w-full max-w-xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden"
        @click.stop
      >
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]"
        >
          <h2 class="text-lg font-semibold tracking-tight">Categorias</h2>
          <button
            class="h-9 w-9 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
            @click="closeCategoriesModal"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div class="p-4">
          <CategoriasScreen
            :categories="categories"
            @close="closeCategoriesModal"
          />
        </div>
      </div>
    </div>

    <!-- Lista de Cartões (Resumo de gastos/limite) -->
    <div
      v-if="showCreditCardsModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeCreditCardsModal"
    >
      <div
        class="w-full max-w-3xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden"
        @click.stop
      >
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]"
        >
          <h2 class="text-lg font-semibold tracking-tight">Cartões</h2>
          <button
            class="h-9 w-9 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
            @click="closeCreditCardsModal"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div class="p-4">
          <CreditCardList
            :creditCards="creditCards"
            :expenses="expenses"
            @close="closeCreditCardsModal"
          />
        </div>
      </div>
    </div>

    <!-- Cadastro de Cartões -->
    <div
      v-if="showCreditCardsRegistrationModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeCreditCardsRegistrationModal"
    >
      <div
        class="w-full max-w-xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden"
        @click.stop
      >
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]"
        >
          <h2 class="text-lg font-semibold tracking-tight">
            Cadastro de Cartões
          </h2>
          <button
            class="h-9 w-9 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
            @click="closeCreditCardsRegistrationModal"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div class="p-4">
          <CartoesScreen @close="closeCreditCardsRegistrationModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useMainStore } from "../stores/store";

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
  name: "Home",
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
    const store = useMainStore();

    onMounted(() => {
      store.fetchExpenses();
      store.fetchCategories();
      store.fetchCreditCards();
    });

    const expenses = computed(() => store.expenses);
    const categories = computed(() => store.categories);
    const creditCards = computed(() => store.creditCards);

    const showModal = ref(false);
    const showCalendar = ref(false);
    const showDetailModal = ref(false);
    const showCategoriesModal = ref(false);
    const showCreditCardsModal = ref(false);
    const showCreditCardsRegistrationModal = ref(false);

    const editingExpense = ref(null);
    const selectedExpense = ref(null);

    const currentPage = ref(1);
    const itemsPerPage = 5;
    const totalPages = computed(() =>
      Math.ceil(expenses.value.length / itemsPerPage)
    );
    const paginatedExpenses = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return expenses.value.slice(start, start + itemsPerPage);
    });
    const changePage = (page) => (currentPage.value = page);

    // Modal handlers
    const openNewTransaction = () => {
      editingExpense.value = null;
      showModal.value = true;
    };
    const closeFormModal = () => {
      showModal.value = false;
      editingExpense.value = null;
    };

    const handleAddExpense = (expense) => {
      if (editingExpense.value) store.updateExpense(expense);
      else store.addExpense(expense);
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

    const openCategoriesModal = () => (showCategoriesModal.value = true);
    const closeCategoriesModal = () => (showCategoriesModal.value = false);

    const openCreditCardsModal = () => (showCreditCardsModal.value = true);
    const closeCreditCardsModal = () => (showCreditCardsModal.value = false);

    const openCreditCardsRegistrationModal = () =>
      (showCreditCardsRegistrationModal.value = true);
    const closeCreditCardsRegistrationModal = () =>
      (showCreditCardsRegistrationModal.value = false);

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
      openCreditCardsModal,
      closeCreditCardsModal,
      openCreditCardsRegistrationModal,
      closeCreditCardsRegistrationModal,
    };
  },
};
</script>
