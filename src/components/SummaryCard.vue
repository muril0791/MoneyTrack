<template>
  <section class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] px-6 py-6 font-sans">
    <!-- cabeçalho -->
    <div class="flex items-start justify-between">
      <h3 class="text-[15px] text-neutral-300">Saldo total</h3>

      <!-- badge do total -->
      <span
        :class="[
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none',
          pctChange >= 0
            ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
            : 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30',
        ]"
      >
        {{ Math.abs(pctChange).toFixed(1) }}%
        <svg
          v-if="pctChange >= 0"
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

    <!-- cifra grande -->
    <div class="mt-3 flex items-baseline gap-2">
      <span class="text-neutral-400 text-[1.05rem] font-medium">R$</span>
      <span
        class="text-[3.5rem] sm:text-[3.5rem] leading-none font-semibold tracking-tight text-neutral-100"
      >
        {{ formatCurrency(balance) }}
      </span>
    </div>

    <!-- métricas -->
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
      <!-- Entrada -->
      <div>
        <p class="text-neutral-400 text-[23px]">Entrada</p>
        <p class="mt-1 flex items-baseline gap-2">
          <span class="text-neutral-400 text-[23px] font-medium">R$</span>
          <span class="text-[2.35rem] font-semibold">{{
            numberOnly(totalIn)
          }}</span>
        </p>
      </div>

      <!-- Saída -->
      <div>
        <p class="text-neutral-400 text-[23px]">Saida</p>
        <p class="mt-1 flex items-baseline gap-2">
          <span class="text-neutral-400 text-[23px] font-medium">R$</span>
          <span class="text-[2.35rem] font-semibold">{{
            numberOnly(totalOut)
          }}</span>
        </p>
      </div>

      <!-- Balanço + badge pequeno à direita do rótulo -->
      <div>
        <div class="flex items-center gap-2">
          <p class="text-neutral-400 text-[23px]">Balanço</p>
          <span
            :class="[
              'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
              pctChange >= 0
                ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30',
            ]"
          >
            {{ Math.abs(pctChange).toFixed(1) }}%
            <svg
              v-if="pctChange >= 0"
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
        <p class="mt-1 flex items-baseline gap-2">
          <span class="text-neutral-400 text-[23px] font-medium">R$</span>
          <span class="text-[2.35rem] font-semibold">{{
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
  props: { expenses: { type: Array, required: true } },
  setup(props) {
    // agrupa por mês
    const monthOf = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const groupByMonth = computed(() => {
      const map = {};
      props.expenses.forEach((e) => {
        const m = monthOf(new Date(e.data));
        if (!map[m]) map[m] = { in: 0, out: 0 };
        if (e.tipo === "entrada") map[m].in += Number(e.valor) || 0;
        if (e.tipo === "saida") map[m].out += Number(e.valor) || 0;
      });
      return map;
    });

    const nowKey = monthOf(new Date());
    const prevKey = (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      return monthOf(d);
    })();

    const totalsNow = computed(
      () => groupByMonth.value[nowKey] || { in: 0, out: 0 }
    );
    const totalsPrev = computed(
      () => groupByMonth.value[prevKey] || { in: 0, out: 0 }
    );

    const totalIn = computed(() => totalsNow.value.in);
    const totalOut = computed(() => totalsNow.value.out);
    const balance = computed(() => totalIn.value - totalOut.value);

    // variação percentual do balanço contra o mês anterior
    const pctChange = computed(() => {
      const curr = totalsNow.value.in - totalsNow.value.out;
      const prev = totalsPrev.value.in - totalsPrev.value.out;
      if (!prev) return curr ? 100 : 0;
      return ((curr - prev) / Math.abs(prev)) * 100;
    });

    // helpers de formatação
    const currencyBR = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR").format(Number(v || 0));

    // apenas os dígitos (sem "R$")
    const numberOnly = (v) =>
      new Intl.NumberFormat("pt-BR").format(Number(v || 0));

    return {
      totalIn,
      totalOut,
      balance,
      pctChange,
      currencyBR,
      formatCurrency,
      numberOnly,
    };
  },
};
</script>
