<template>
  <header class="bg-cardbg text-fontcolor px-4 py-3 flex items-center justify-between shadow">
    <div class="flex items-center space-x-8">
      <h1 class="text-2xl font-bold text-greenmain">moneyTrack</h1>
      <!-- Placeholder para ícone de perfil no futuro -->
      <div class="hidden md:block">
        <span class="inline-block w-8 h-8 bg-gray-600 rounded-full"></span>
      </div>
    </div>
    <div>
      <button
        @click="$emit('open-calendar')"
        class="mr-4 px-4 py-2 bg-cardbg border border-greenmain text-greenmain rounded-md hover:bg-greenmain hover:text-white"
      >
        Calendário
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "TopBar"
};
</script>
