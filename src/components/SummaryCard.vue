<template>
  <section
    class="bg-[#1b1b1b] rounded-3xl ring-1 ring-[#2a2a2a] font-sans h-full flex flex-col"
  >
    <!-- Top Section: Balance (Padded manually) -->
    <div class="w-full pt-8 px-8">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-neutral-500 text-[13px] uppercase tracking-widest font-medium">Saldo total</h3>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-baseline gap-2">
          <span class="text-neutral-500 text-3xl font-light">R$</span>
          <span class="text-7xl md:text-8xl font-light text-white tracking-tighter">
            {{ formatCurrency(balance) }}
          </span>
        </div>
        
        <!-- Main Percentage Badge -->
        <div 
          :class="isUp ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'"
          class="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold h-fit mt-4"
        >
          <span>{{ percent }}%</span>
          <svg v-if="isUp" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <svg v-else class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Spacer to push everything down -->
    <div class="flex-1"></div>

    <!-- Bottom Section: Details (Forced to the bottom with 10px margin) -->
    <div class="w-full px-8 pb-18">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-24 text-center">
        <!-- Entrada -->
        <div class="space-y-1">
          <p class="text-neutral-500 text-[12px] font-medium uppercase tracking-wider">Entrada</p>
          <p class="text-[36px] font-medium uppercase text-emerald-400">
            <span class="text-xs opacity-50 mr-1">R$</span>{{ numberOnly(totalIn) }}
          </p>
        </div>

        <!-- Saida -->
        <div class="space-y-1">
          <p class="text-neutral-500 text-[18px] font-medium uppercase tracking-wider">Saída</p>
          <p class="text-[36px] font-medium uppercase text-rose-400">
            <span class="text-xs opacity-50 mr-1">R$</span>{{ numberOnly(totalOut) }}
          </p>
        </div>

        <!-- Balanço -->
        <div class="space-y-1">
          <div class="flex items-center justify-center gap-2">
            <p class="text-neutral-500 text-[18px] font-medium uppercase tracking-wider">Balanço</p>
            <div 
              :class="isUp ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'"
              class="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
            >
              <span>{{ percent }}%</span>
              <svg v-if="isUp" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <svg v-else class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
          <p 
            class="text-[36px] font-medium uppercase"
            :class="isUp ? 'text-emerald-400' : 'text-rose-400'"
          >
            <span class="text-xs opacity-50 mr-1">R$</span>{{ numberOnly(balance) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from "vue";

export default {
  name: "SummaryCard",
  props: {
    expenses: { type: Array, required: true },
  },
  setup(props) {
    const totalIn = computed(() => {
      return props.expenses
        .filter((e) => e.tipo === "entrada")
        .reduce((sum, e) => sum + (Number(e.valor) || 0), 0);
    });

    const totalOut = computed(() => {
      return props.expenses
        .filter((e) => e.tipo === "saida")
        .reduce((sum, e) => sum + (Number(e.valor) || 0), 0);
    });

    const balance = computed(() => totalIn.value - totalOut.value);
    const isUp = computed(() => balance.value >= 0);
    
    // Calculate a dynamic percentage based on current balance vs total income
    const percent = computed(() => {
      if (totalIn.value === 0) return totalOut.value > 0 ? "100" : "0";
      const p = (Math.abs(balance.value) / totalIn.value) * 100;
      return p > 100 ? "100" : p.toFixed(1);
    });

    const badgeText = computed(() => isUp.value ? "Positivo" : "Negativo");

    const badgeClass = computed(() =>
      isUp.value
        ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
        : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"
    );

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR").format(Math.abs(Number(v || 0)));
      
    const numberOnly = (v) =>
      new Intl.NumberFormat("pt-BR").format(Number(v || 0));

    return {
      totalIn,
      totalOut,
      balance,
      isUp,
      percent,
      badgeText,
      badgeClass,
      formatCurrency,
      numberOnly,
    };
  },
};
</script>
