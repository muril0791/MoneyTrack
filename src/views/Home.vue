<template>
  <div
    class="min-h-screen overflow-x-hidden bg-[#0f0f0f] text-white font-sans antialiased"
  >
    <TopBar
      @open-credit-cards="openCreditCardsRegistrationModal"
      @open-categories="openCategoriesModal"
      @open-credit-cards-list="openCreditCardsModal"
    />

    <main class="mx-auto w-full px-4 md:px-8 py-4 md:py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div class="space-y-6 min-w-0">
          <section
            class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] p-4 md:p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-neutral-300">Transações</h3>
              <button
                class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-3 md:px-4 py-2 rounded-xl"
                @click="openNewTransaction"
              >
                Adicionar <span class="text-lg leading-none">+</span>
              </button>
            </div>
          </section>

          <section
            class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] p-4 md:p-5"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-neutral-300">Cartões</h3>
              <button
                class="text-emerald-400 text-xs"
                @click="openCreditCardsModal"
              >
                Ver todos
              </button>
            </div>
            <p class="text-sm text-neutral-400">Nenhum cartão cadastrado.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                class="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-2 text-sm"
                @click="openCreditCardsRegistrationModal"
              >
                Add Cartão
              </button>
              <button
                class="bg-[#2a1313] hover:bg-[#341616] text-red-300 rounded-lg px-3 py-2 text-sm"
              >
                Remover
              </button>
            </div>
          </section>
        </div>

        <div class="space-y-6 min-w-0">
          <div class="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
            <SummaryCard :expenses="expenses" />
            <section
              class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] p-4 md:p-5"
            >
              <ExpenseCalendar
                :expenses="expenses"
                :creditCards="creditCards"
              />
            </section>
          </div>

          <div class="min-w-0">
            <TransactionsAndChart
              :expenses="expenses"
              :categories="categories"
           
            @open-expense-detail="openExpenseDetail" />
          <div v-if="showExpenseDetailModal"
            class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            @click.self="closeExpenseDetail">
            <div class="w-full max-w-xl" @click.stop>
              <EditExpense :expense="selectedExpense" @close="closeExpenseDetail" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4"
      @click.self="closeFormModal"
    >
      <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto" @click.stop>
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

    <div
      v-if="showCategoriesModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4"
      @click.self="closeCategoriesModal"
    >
      <div class="p-3 md:p-4 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CategoriasScreen
          :categories="categories"
          @close="closeCategoriesModal"
        />
      </div>
    </div>

    <div
      v-if="showCreditCardsModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4"
      @click.self="closeCreditCardsModal"
    >
      <div class="p-3 md:p-4 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CreditCardList
          :creditCards="creditCards"
          :expenses="expenses"
          @close="closeCreditCardsModal"
        />
      </div>
    </div>

    <div
      v-if="showCreditCardsRegistrationModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4"
      @click.self="closeCreditCardsRegistrationModal"
    >
      <div class="p-3 md:p-4 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CartoesScreen @close="closeCreditCardsRegistrationModal" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useMainStore } from "@/stores/store";
import TopBar from "@/components/TopBar.vue";
import SummaryCard from "@/components/SummaryCard.vue";
import TransactionsAndChart from "@/components/TransactionsAndChart.vue";
import ObjectivesCard from "@/components/ObjectivesCard.vue";
import ExpenseForm from "@/components/ExpenseForm.vue";
import ExpenseCalendar from "@/components/ExpenseCalendar.vue";
import CategoriasScreen from "@/components/CategoriasScreen.vue";
import CartoesScreen from "@/components/CartoesScreen.vue";
import CreditCardList from "@/components/CreditCardList.vue";
import EditExpense from "@/components/EditExpense.vue";

export default {
  name: "Home",
  components: {
    TopBar,
    SummaryCard,
    TransactionsAndChart,
    ObjectivesCard,
    ExpenseForm,
    ExpenseCalendar,
    CategoriasScreen,
    CartoesScreen,
    CreditCardList,
    EditExpense,
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
    const showCategoriesModal = ref(false);
    const showCreditCardsModal = ref(false);
    const showCreditCardsRegistrationModal = ref(false);
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
      if (editingExpense.value) store.updateExpense(expense);
      else store.addExpense(expense);
      closeFormModal();
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
      showModal,
      showCategoriesModal,
      showCreditCardsModal,
      showCreditCardsRegistrationModal,
      editingExpense,
      openNewTransaction,
      closeFormModal,
      handleAddExpense,
      openCategoriesModal,
      closeCategoriesModal,
      openCreditCardsModal,
      closeCreditCardsModal,
      openCreditCardsRegistrationModal,
      closeCreditCardsRegistrationModal,
      showExpenseDetailModal,
      selectedExpense,
      openExpenseDetail,
      closeExpenseDetail
    };
  },
};
</script>
