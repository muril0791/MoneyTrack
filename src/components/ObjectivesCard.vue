<template>
  <div class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] px-4 py-5 overflow-hidden relative group">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h3 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-bold">Minhas Metas</h3>
      </div>
      
      <div class="flex items-center gap-1.5">
        <!-- Compact Navigation -->
        <template v-if="goals.length > 1">
          <button 
            @click.stop="prev" 
            class="w-7 h-7 rounded-lg bg-[#222] hover:bg-[#2a2a2a] flex items-center justify-center text-neutral-400 transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button 
            @click.stop="next" 
            class="w-7 h-7 rounded-lg bg-[#222] hover:bg-[#2a2a2a] flex items-center justify-center text-neutral-400 transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </template>

        <button 
          @click="$emit('open-new-goal')"
          class="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white transition-all flex items-center justify-center"
        >
          <span class="text-lg leading-none">+</span>
        </button>
      </div>
    </div>

    <div 
      v-if="goals.length > 0" 
      class="relative cursor-grab active:cursor-grabbing select-none"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <transition :name="transitionName" mode="out-in">
        <div :key="currentIndex" class="space-y-5 pointer-events-none sm:pointer-events-auto">
          <div class="flex justify-between items-start">
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex items-center gap-2">
                <h4 class="text-white font-semibold text-lg truncate">{{ currentGoal.title }}</h4>
                <div class="flex gap-1">
                  <button @click.stop="$emit('edit-goal', currentGoal)" class="p-1 text-neutral-500 hover:text-emerald-400 transition-colors pointer-events-auto">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button @click.stop="$emit('delete-goal', currentGoal.id)" class="p-1 text-neutral-500 hover:text-rose-400 transition-colors pointer-events-auto">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <p v-if="currentGoal.endDate" class="text-neutral-500 text-[10px] uppercase tracking-wider mt-0.5">
                Até {{ new Date(currentGoal.endDate).toLocaleDateString('pt-BR') }}
              </p>
              <p class="text-neutral-500 text-xs mt-2">
                Faltam 
                <span class="text-white font-medium">R$ {{ (currentGoal.targetAmount - currentGoal.currentAmount).toLocaleString('pt-BR') }}</span> 
                para o objetivo
              </p>
            </div>
            <div class="text-right">
              <div class="text-emerald-400 font-bold text-xl">{{ progressPercent }}%</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="h-2.5 w-full bg-[#222] rounded-full overflow-hidden ring-1 ring-white/5">
              <div 
                class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-500 px-1">
              <span>Guardado: R$ {{ currentGoal.currentAmount.toLocaleString('pt-BR') }}</span>
              <span>Alvo: R$ {{ currentGoal.targetAmount.toLocaleString('pt-BR') }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              @click="$emit('add-value', currentGoal)"
              class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              Guardar Dinheiro
            </button>
          </div>
        </div>
      </transition>

      <!-- Pagination Dots -->
      <div v-if="goals.length > 1" class="flex justify-center gap-1.5 mt-4">
        <button 
          v-for="(_, index) in goals" :key="index"
          @click="currentIndex = index"
          class="w-1.5 h-1.5 rounded-full transition-all hover:bg-neutral-500"
          :class="index === currentIndex ? 'bg-emerald-500 w-4' : 'bg-[#333]'"
        ></button>
      </div>
    </div>

    <div v-else class="py-8 text-center border-2 border-dashed border-[#2a2a2a] rounded-2xl mt-2">
      <p class="text-xs text-neutral-500">Nenhum plano ativo no momento.</p>
      <button 
        @click="$emit('open-new-goal')"
        class="text-emerald-500 text-xs font-bold mt-2 hover:underline"
      >
        Criar meu primeiro plano
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  goals: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['open-new-goal', 'add-value']);

const currentIndex = ref(0);
const transitionName = ref('fade-slide-next');
const startX = ref(0);
const startY = ref(0);
const isDragging = ref(false);

const currentGoal = computed(() => props.goals[currentIndex.value] || {});

const progressPercent = computed(() => {
  if (!currentGoal.value.targetAmount) return 0;
  const p = (currentGoal.value.currentAmount / currentGoal.value.targetAmount) * 100;
  return Math.min(Math.round(p), 100);
});

const next = () => {
  if (props.goals.length <= 1) return;
  transitionName.value = 'fade-slide-next';
  currentIndex.value = (currentIndex.value + 1) % props.goals.length;
};

const prev = () => {
  if (props.goals.length <= 1) return;
  transitionName.value = 'fade-slide-prev';
  currentIndex.value = (currentIndex.value - 1 + props.goals.length) % props.goals.length;
};

// Swipe Logic (Refined)
const handleTouchStart = (e) => {
  startX.value = e.touches[0].clientX;
  startY.value = e.touches[0].clientY;
  isDragging.value = true;
};

const handleTouchEnd = (e) => {
  if (!isDragging.value) return;
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const diffX = startX.value - endX;
  const diffY = startY.value - endY;

  // Only trigger if horizontal movement is dominant and meets threshold
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
    if (diffX > 0) next();
    else prev();
  }
  isDragging.value = false;
};

const handleMouseDown = (e) => {
  startX.value = e.clientX;
  startY.value = e.clientY;
  isDragging.value = true;
};

const handleMouseUp = (e) => {
  if (!isDragging.value) return;
  const endX = e.clientX;
  const endY = e.clientY;
  const diffX = startX.value - endX;
  const diffY = startY.value - endY;

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
    if (diffX > 0) next();
    else prev();
  }
  isDragging.value = false;
};
</script>

<style scoped>
/* Next Transition (Slide Left) */
.fade-slide-next-enter-active,
.fade-slide-next-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-next-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-next-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Prev Transition (Slide Right) */
.fade-slide-prev-enter-active,
.fade-slide-prev-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-slide-prev-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
