<template>
  <div class="min-h-screen">
    <!-- TopBar: Nome do projeto, placeholder de perfil e botão para abrir o calendário -->
    <TopBar @open-modal="showModal = true" @open-calendar="showCalendar = true" />

    <!-- Conteúdo Principal: Dashboard com duas colunas -->
    <main class="main-container">
      <div class="two-columns">
        <!-- Coluna 1: DashboardLeft com saldo, gráfico, percentuais e top categorias -->
        <DashboardLeft :expenses="expenses" @open-add="showModal = true" />
        <!-- Coluna 2: Lista simples de transações -->
        <SimpleTransactionList :expenses="expenses" @view-more="viewMoreTransactions" />
      </div>
    </main>

    <!-- Modal de Lançamento -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="modal-overlay"
        @click.self="showModal = false"
      >
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Novo Lançamento</h2>
            <button @click="showModal = false" class="modal-close">&times;</button>
          </div>
          <ExpenseForm @add-expense="handleAddExpense" @close="showModal = false" />
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
          <ExpenseCalendar :expenses="expenses" />
        </div>
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

export default {
  name: "App",
  components: {
    TopBar,
    DashboardLeft,
    SimpleTransactionList,
    ExpenseForm,
    ExpenseCalendar
  },
  setup() {
    const expenses = ref([]);
    const showModal = ref(false);
    const showCalendar = ref(false);

    const handleAddExpense = (expense) => {
      // Lógica para transação parcelada ou única
      if (expense.modalidade === "parcelado" && expense.parcelas && expense.dataPrimeiraParcela) {
        const total = Number(expense.valor);
        const parcelas = Number(expense.parcelas);
        const valorParcela = total / parcelas;
        const startDate = new Date(expense.dataPrimeiraParcela);
        for (let i = 0; i < parcelas; i++) {
          const parcelaDate = new Date(startDate);
          parcelaDate.setMonth(startDate.getMonth() + i);
          const yyyy = parcelaDate.getFullYear();
          const mm = (parcelaDate.getMonth() + 1).toString().padStart(2, "0");
          const dd = parcelaDate.getDate().toString().padStart(2, "0");
          expenses.value.push({
            ...expense,
            valor: valorParcela,
            data: `${yyyy}-${mm}-${dd}`,
            parcela: i + 1,
            totalParcelas: parcelas
          });
        }
      } else {
        expenses.value.push(expense);
      }
      showModal.value = false;
    };

    const viewMoreTransactions = () => {
      console.log("Ver mais transações");
    };

    return { expenses, showModal, showCalendar, handleAddExpense, viewMoreTransactions };
  }
};
</script>

<style>
/* Layout básico */
.min-h-screen {
  min-height: 100vh;
}

/* Container principal centralizado */
.main-container {
  max-width: 100%;
  padding: 1.5rem 1rem;
}

/* Duas colunas (uma em mobile, duas a partir de 768px) */
.two-columns {
  display: grid;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .two-columns {
    grid-template-columns: 1fr 1fr;
  }
}

/* Modal Styles */
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

/* Modal header */
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

/* Transição do modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Definição de variáveis de cores */
:root {
  --cardbg: #161716;
  --mainbg: #0f0e11;
  --greenmain: #3ecf00;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
  --textgray: #aaaaaa;
}
</style>
