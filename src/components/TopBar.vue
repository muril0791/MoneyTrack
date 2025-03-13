<template>
  <header class="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-blue-500 shadow-lg">
    <h1 class="text-2xl font-bold text-white">MoneyTrack</h1>
    <button
      @click="$emit('open-modal')"
      class="bg-secondary hover:bg-green-500 text-white px-4 py-2 rounded-md shadow"
    >
      Novo Lançamento
    </button>
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
  </header>
</template>

<script>
export default {
  name: 'TopBar'
}
</script>
