<template>
  <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup 
      name="toast"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-12 opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-12 opacity-0"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto min-w-[280px] max-w-md bg-[#1b1b1b] border border-white/5 rounded-2xl p-4 shadow-2xl flex items-start gap-4 ring-1 ring-white/5"
      >
        <!-- Icon based on type -->
        <div 
          :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg',
            toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
          ]"
        >
          <svg v-if="toast.type === 'success'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 pt-0.5">
          <p class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
            {{ toast.type === 'success' ? 'Sucesso' : 'Atenção' }}
          </p>
          <p class="text-sm font-bold text-white leading-snug">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button 
          @click="store.removeToast(toast.id)"
          class="text-neutral-600 hover:text-white transition-colors p-1"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const toasts = computed(() => store.toasts);
</script>

<style scoped>
.toast-move {
  transition: all 0.3s ease;
}
</style>
