<template>
  <div class="min-h-screen bg-gray-800">
    <!-- TopBar sem dark mode -->
    <TopBar @open-modal="showModal = true" />

    <!-- Dashboard -->
    <section class="p-6">
      <DashboardSummary :expenses="expenses" />
      <div class="mt-8 text-center">
        <button
          @click="showCalendar = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
        >
          Ver Calendário
        </button>
      </div>
    </section>

    <!-- Modal de Lançamento -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50"
        @click.self="showModal = false"
      >
        <div
          class="bg-white rounded-lg p-6 w-1/2 shadow-xl relative"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Novo Lançamento</h2>
            <button
              @click="showModal = false"
              class="text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
          </div>
          <ExpenseForm @add-expense="handleAddExpense" @close="showModal = false" />
        </div>
      </div>
    </transition>

    <!-- Modal do Calendário -->
    <transition name="modal">
      <div
        v-if="showCalendar"
        class="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50"
        @click.self="showCalendar = false"
      >
        <div
          class="bg-white rounded-lg p-6 w-1/2 shadow-xl relative"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Calendário</h2>
            <button
              @click="showCalendar = false"
              class="text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
          </div>
          <ExpenseCalendar :expenses="expenses" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import TopBar from './components/TopBar.vue'
import DashboardSummary from './components/DashboardSummary.vue'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseCalendar from './components/ExpenseCalendar.vue'

export default {
  name: 'App',
  components: { TopBar, DashboardSummary, ExpenseForm, ExpenseCalendar },
  setup() {
    const expenses = ref([])
    const showModal = ref(false)
    const showCalendar = ref(false)

    const handleAddExpense = (expense) => {
      // Lógica de parcelado
      if (expense.modalidade === 'parcelado' && expense.parcelas && expense.dataPrimeiraParcela) {
        const total = Number(expense.valor)
        const parcelas = Number(expense.parcelas)
        const valorParcela = total / parcelas
        const startDate = new Date(expense.dataPrimeiraParcela)
        for (let i = 0; i < parcelas; i++) {
          const parcelaDate = new Date(startDate)
          parcelaDate.setMonth(startDate.getMonth() + i)
          const yyyy = parcelaDate.getFullYear()
          const mm = (parcelaDate.getMonth() + 1).toString().padStart(2, '0')
          const dd = parcelaDate.getDate().toString().padStart(2, '0')
          expenses.value.push({
            ...expense,
            valor: valorParcela,
            data: `${yyyy}-${mm}-${dd}`,
            parcela: i + 1,
            totalParcelas: parcelas
          })
        }
      } else {
        expenses.value.push(expense)
      }
      showModal.value = false
    }

    return {
      expenses,
      showModal,
      showCalendar,
      handleAddExpense
    }
  },
  methods: {
  handleEditExpense(expense) {
    // Abrir modal de edição ou algo similar
    console.log('Editar', expense)
  },
  handleDeleteExpense(expense) {
    // Confirmar exclusão e remover do array
    console.log('Excluir', expense)
  }
}

}
</script>

<style>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
