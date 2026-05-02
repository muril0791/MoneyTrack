<template>
  <div
    class="min-h-screen overflow-x-hidden bg-[#0f0f0f] text-white font-sans antialiased"
  >
    <TopBar
      @open-credit-cards="openCreditCardsRegistrationModal"
      @open-categories="openCategoriesModal"
      @open-credit-cards-list="openCreditCardsModal"
    />

    <main class="mx-auto w-full px-4 md:px-8 py-3 md:py-4">
      <div class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        <div class="space-y-4 min-w-0">
          <section
            class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] p-4 md:p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-neutral-500 text-[13px] uppercase tracking-widest font-medium">Lançamentos</h3>
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
              <h3 class="text-neutral-500 text-[13px] uppercase tracking-widest font-medium">Meus Cartões</h3>
              <button
                class="text-emerald-400 text-xs"
                @click="openCreditCardsModal"
              >
                Ver todos
              </button>
            </div>
            <div v-if="creditCards.length > 0" class="mt-3 space-y-3">
              <div v-for="card in creditCards.slice(0, 3)" :key="card.id" 
                class="flex items-center justify-between p-3 rounded-xl bg-[#222] ring-1 ring-[#2d2d2d] hover:ring-emerald-500/30 transition-all group relative">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-medium text-white truncate max-w-[100px]">{{ card.name }}</div>
                    <div class="text-[10px] text-neutral-500">Fecha dia {{ card.closingDay }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="text-xs font-semibold text-neutral-300 group-hover:hidden">
                    R$ {{ card.limit.toLocaleString('pt-BR') }}
                  </div>
                  <div class="hidden group-hover:flex items-center gap-1">
                    <button @click.stop="openEditCard(card)" class="p-1 text-neutral-500 hover:text-emerald-400 transition-colors">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button @click.stop="handleDeleteCard(card.id)" class="p-1 text-neutral-500 hover:text-rose-400 transition-colors">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-xs text-neutral-500 mt-4 text-center py-4 border-2 border-dashed border-[#2a2a2a] rounded-xl">
              Nenhum cartão cadastrado.
            </p>
            <div class="mt-4 flex gap-2">
              <button
                class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl py-2.5 text-xs transition shadow-lg shadow-emerald-500/10"
                @click="openCreditCardsRegistrationModal"
              >
                Novo Cartão
              </button>
            </div>
          </section>

          <ObjectivesCard 
            :goals="goals" 
            @open-new-goal="openNewGoalModal"
            @add-value="openAddValueModal"
            @edit-goal="openEditGoalModal"
            @delete-goal="handleDeleteGoal"
          />
        </div>

        <div class="space-y-4 min-w-0">
          <div class="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
            <SummaryCard :expenses="filteredExpenses" :filter="activeFilter" />
            <section
              class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] p-4 md:p-5"
            >
              <ExpenseCalendar
                :expenses="expenses"
                :creditCards="creditCards"
                @filter-change="handleFilterChange"
              />
            </section>
          </div>

          <div class="min-w-0">
            <TransactionsAndChart
              :expenses="filteredExpenses"
              :categories="categories"
           
            @open-expense-detail="openExpenseDetail" />
          <div v-if="showExpenseDetailModal"
            class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
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
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 md:p-4"
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
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 md:p-4"
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
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 md:p-4"
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
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 md:p-4"
      @click.self="closeCreditCardsRegistrationModal"
    >
      <div class="p-3 md:p-4 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CartoesScreen :initialEditCard="selectedCardToEdit" @close="closeCreditCardsRegistrationModal" />
      </div>
    </div>

    <!-- New Goal Modal -->
    <CreateGoalModal 
      v-if="showNewGoalModal" 
      :editingGoal="editingGoal"
      @close="closeGoalModal"
      @create="handleCreateGoal"
      @update="handleUpdateGoal"
    />

    <!-- Add Value Modal -->
    <AddValueGoalModal 
      v-if="showAddValueGoalModal"
      :goal="selectedGoal"
      @close="showAddValueGoalModal = false"
      @add="handleAddValueToGoal"
    />
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
import CreateGoalModal from "@/components/CreateGoalModal.vue";
import AddValueGoalModal from "@/components/AddValueGoalModal.vue";

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
    CreateGoalModal,
    AddValueGoalModal,
  },
  setup() {
    const store = useMainStore();
    onMounted(() => {
      store.fetchExpenses();
      store.fetchCategories();
      store.fetchCreditCards();
      store.fetchGoals();
    });
    const expenses = computed(() => store.expenses);
    const categories = computed(() => store.categories);
    const creditCards = computed(() => store.creditCards);
    const showModal = ref(false);
    const showCategoriesModal = ref(false);
    const showCreditCardsModal = ref(false);
    const showCreditCardsRegistrationModal = ref(false);
    const selectedCardToEdit = ref(null);
    const showNewGoalModal = ref(false);
    const showAddValueGoalModal = ref(false);
    const selectedGoal = ref(null);
    const editingGoal = ref(null);
    const editingExpense = ref(null);
    const activeFilter = ref({ mode: 'month', currentDate: new Date(), selectedDate: new Date() });
    
    const goals = computed(() => store.goals);

    const filteredExpenses = computed(() => {
      const { mode, currentDate, selectedDate } = activeFilter.value;
      if (mode === 'all') return store.expenses;

      return store.expenses.filter(e => {
        if (!e.data) return false;
        // Parse "YYYY-MM-DD" manually to avoid timezone shifts
        const [year, month, day] = e.data.split('-').map(Number);
        
        if (mode === 'day') {
          return year === selectedDate.getFullYear() &&
                 (month - 1) === selectedDate.getMonth() &&
                 day === selectedDate.getDate();
        }
        if (mode === 'month') {
          return year === currentDate.getFullYear() &&
                 (month - 1) === currentDate.getMonth();
        }
        if (mode === 'year') {
          return year === currentDate.getFullYear();
        }
        return true;
      });
    });

    const handleFilterChange = (f) => {
      activeFilter.value = f;
    };
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
    const showExpenseDetailModal = ref(false);
    const selectedExpense = ref(null);
    const openExpenseDetail = (expense) => {
      selectedExpense.value = expense;
      showExpenseDetailModal.value = true;
    };
    const closeExpenseDetail = () => {
      showExpenseDetailModal.value = false;
      selectedExpense.value = null;
    };

    const openCategoriesModal = () => (showCategoriesModal.value = true);
    const closeCategoriesModal = () => (showCategoriesModal.value = false);
    const openCreditCardsModal = () => (showCreditCardsModal.value = true);
    const closeCreditCardsModal = () => (showCreditCardsModal.value = false);
    const openCreditCardsRegistrationModal = () => {
      selectedCardToEdit.value = null;
      showCreditCardsRegistrationModal.value = true;
    };
    const closeCreditCardsRegistrationModal = () => {
      showCreditCardsRegistrationModal.value = false;
      selectedCardToEdit.value = null;
    };

    const openEditCard = (card) => {
      selectedCardToEdit.value = card;
      showCreditCardsRegistrationModal.value = true;
    };

    const handleDeleteCard = async (cardId) => {
      if (confirm('Tem certeza que deseja excluir este cartão? Todas as transações vinculadas a ele ficarão sem cartão.')) {
        await store.removeCreditCard(cardId);
      }
    };

    const handleCreateGoal = async (goalData) => {
      await store.addGoal(goalData);
      showNewGoalModal.value = false;
    };

    const handleUpdateGoal = async (goalData) => {
      await store.updateGoal(goalData.id, goalData);
      closeGoalModal();
    };

    const openNewGoalModal = () => {
      editingGoal.value = null;
      showNewGoalModal.value = true;
    };

    const openEditGoalModal = (goal) => {
      editingGoal.value = goal;
      showNewGoalModal.value = true;
    };

    const closeGoalModal = () => {
      showNewGoalModal.value = false;
      editingGoal.value = null;
    };

    const handleDeleteGoal = async (goalId) => {
      if (confirm('Tem certeza que deseja excluir esta meta?')) {
        await store.removeGoal(goalId);
      }
    };

    const openAddValueModal = (goal) => {
      selectedGoal.value = goal;
      showAddValueGoalModal.value = true;
    };

    const handleAddValueToGoal = async ({ goalId, value }) => {
      await store.addValueToGoal(goalId, value);
      showAddValueGoalModal.value = false;
      selectedGoal.value = null;
    };
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
      closeExpenseDetail,
      filteredExpenses,
      handleFilterChange,
      activeFilter,
      goals,
      showNewGoalModal,
      showAddValueGoalModal,
      selectedGoal,
      editingGoal,
      handleCreateGoal,
      handleUpdateGoal,
      openNewGoalModal,
      openEditGoalModal,
      closeGoalModal,
      handleDeleteGoal,
      openAddValueModal,
      handleAddValueToGoal,
      selectedCardToEdit,
      openEditCard,
      handleDeleteCard
    };
  },
};
</script>
