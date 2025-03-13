<template>
  <div class="mt-8">
    <div class="flex justify-center space-x-4 mb-6">
      <button 
        :class="{'bg-primary text-white': currentTab==='grafico', 'bg-gray-800 text-white': currentTab!=='grafico'}" 
        class="px-4 py-2 rounded-md"
        @click="currentTab = 'grafico'">
        Gráfico
      </button>
      <button 
        :class="{'bg-primary text-white': currentTab==='calendario', 'bg-gray-800 text-white': currentTab!=='calendario'}" 
        class="px-4 py-2 rounded-md"
        @click="currentTab = 'calendario'">
        Calendário
      </button>
      <button 
        :class="{'bg-primary text-white': currentTab==='lista', 'bg-gray-800 text-white': currentTab!=='lista'}" 
        class="px-4 py-2 rounded-md"
        @click="currentTab = 'lista'">
        Lista
      </button>
    </div>
    <div>
      <component :is="currentComponent" :expenses="expenses" @open-day="$emit('open-day', $event)" />
    </div>
  </div>
</template>

<script>
import ExpensePieChart from "./ExpensePieChart.vue"
import ExpenseCalendar from "./ExpenseCalendar.vue"
import ExpenseList from "./ExpenseList.vue"

export default {
  name: 'ExpenseDashboard',
  props: { expenses: Array },
  data() { return { currentTab: 'grafico' } },
  computed: {
    currentComponent() {
      return this.currentTab === 'grafico' ? ExpensePieChart :
             this.currentTab === 'calendario' ? ExpenseCalendar :
             ExpenseList
    }
  }
}
</script>
