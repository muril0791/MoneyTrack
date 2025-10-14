<template>
  <section class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] p-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-neutral-300">Objetivos</h3>
      <button class="text-emerald-400 text-xs hover:text-emerald-300">Ver todos</button>
    </div>

    <div class="text-sm text-neutral-400">Casa na praia</div>

    <!-- barra segmentada -->
    <div
      class="h-3 rounded-md mt-2 ring-1 ring-[#2a2a2a] bg-[#141414] overflow-hidden"
      :style="segmentStyle"
    >
      <div class="h-full" :style="{ width: pct+'%' }"></div>
    </div>

    <div class="text-right text-sm text-emerald-400 mt-2">{{ currencyBR(valor) }}</div>
  </section>
</template>

<script>
export default {
  name: "ObjectivesCard",
  props: { valor: { type: Number, default: 440000 }, pct: { type: Number, default: 28 } },
  computed: {
    // cria segmentos tipo “listras” como na ref
    segmentStyle() {
      return {
        backgroundImage: `repeating-linear-gradient(90deg, #1f1f1f 0 10px, #141414 10px 20px)`,
        // preenchimento verde por cima
        '--tw-gradient-to': '#3ecf00',
        position: 'relative'
      };
    },
  },
  methods: {
    currencyBR(v) {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v||0));
    },
  },
};
</script>

<style scoped>
/* cor da parte preenchida (verde) */
div[style*="--tw-gradient-to"] > div {
  background: #3ecf00;
}
</style>
