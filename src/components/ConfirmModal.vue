<template>
  <Transition name="fade">
    <div v-if="dialog.show" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="store.closeConfirm">
      <Transition name="scale">
        <div v-if="dialog.show" class="w-full max-w-sm bg-[#1b1b1b] border border-white/5 rounded-[32px] p-8 shadow-2xl ring-1 ring-white/5">
          <div class="flex flex-col items-center text-center">
            <!-- Warning Icon -->
            <div class="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-rose-500/20">
              <svg class="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 class="text-xl font-bold text-white mb-2">{{ dialog.title || 'Tem certeza?' }}</h3>
            <p class="text-neutral-400 text-sm leading-relaxed mb-8">
              {{ dialog.message }}
            </p>

            <div class="flex flex-col w-full gap-3">
              <button 
                @click="store.handleConfirm"
                class="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >
                Confirmar
              </button>
              <button 
                @click="store.closeConfirm"
                class="w-full py-4 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-bold rounded-2xl transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const dialog = computed(() => store.confirmDialog);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
