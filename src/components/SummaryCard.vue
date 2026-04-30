<template>
  <section
    class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] px-4 sm:px-6 py-5 font-sans"
  >
    <div class="flex items-start justify-between">
      <h3 class="text-[15px] text-neutral-300">Saldo no período</h3>
      <span
        :class="badgeClass"
        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none"
      >
        {{ badgeText }}
        <svg
          v-if="isUp"
          class="w-3 h-3"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 4l6 6h-4v10h-4V10H6l6-6z" />
        </svg>
        <svg v-else class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l-6-6h4V4h4v10h4l-6 6z" />
        </svg>
      </span>
    </div>

    <div class="mt-3 flex items-end gap-2 min-w-0">
      <span class="text-neutral-400 text-base sm:text-lg font-medium">R$</span>
      <span
        class="block max-w-full whitespace-nowrap overflow-hidden text-ellipsis text-5xl md:text-6xl lg:text-7xl leading-none font-semibold tracking-tight text-neutral-100"
      >
        {{ formatCurrency(balance) }}
      </span>
    </div>

    <div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
      <div>
        <p class="text-neutral-400 text-lg sm:text-xl">Entrada</p>
        <p class="mt-1 flex items-end gap-2">
          <span class="text-neutral-400 text-lg sm:text-xl font-medium"
            >R$</span
          >
          <span class="text-2xl sm:text-3xl md:text-4xl font-semibold text-emerald-400">{{
            numberOnly(totalIn)
          }}</span>
        </p>
      </div>

      <div>
        <p class="text-neutral-400 text-lg sm:text-xl">Saída</p>
        <p class="mt-1 flex items-end gap-2">
          <span class="text-neutral-400 text-lg sm:text-xl font-medium"
            >R$</span
          >
          <span class="text-2xl sm:text-3xl md:text-4xl font-semibold text-rose-400">{{
            numberOnly(totalOut)
          }}</span>
        </p>
      </div>

      <div>
        <div class="flex items-center gap-2">
          <p class="text-neutral-400 text-lg sm:text-xl">Balanço</p>
        </div>
        <p class="mt-1 flex items-end gap-2">
          <span class="text-neutral-400 text-lg sm:text-xl font-medium"
            >R$</span
          >
          <span class="text-2xl sm:text-3xl md:text-4xl font-semibold">{{
            numberOnly(balance)
          }}</span>
        </p>
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
    
    // Simplificando o badge para mostrar o estado do período selecionado
    const badgeText = computed(() => {
      return isUp.value ? "Positivo" : "Negativo";
    });

    const badgeClass = computed(() =>
      isUp.value
        ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
        : "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
    );

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR").format(Number(v || 0));
      
    const numberOnly = (v) =>
      new Intl.NumberFormat("pt-BR").format(Number(v || 0));

    return {
      totalIn,
      totalOut,
      balance,
      isUp,
      badgeText,
      badgeClass,
      formatCurrency,
      numberOnly,
    };
  },
};
</script>
