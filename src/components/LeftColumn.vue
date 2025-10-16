<template>
  <div class="space-y-6">
    <div class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] overflow-hidden">
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]"
      >
        <h3>Transações</h3>
        <button
          class="bg-emerald-500 text-white rounded-xl px-3 py-2 font-bold inline-flex items-center gap-1"
          @click="$emit('add-transaction')"
        >
          Adicionar <span>＋</span>
        </button>
      </div>
    </div>

    <div class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] overflow-hidden">
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]"
      >
        <h3>Cartões</h3>
        <button class="text-emerald-300 text-sm" @click="$emit('open-cards')">
          Ver todos
        </button>
      </div>

      <div class="p-4">
        <div v-if="!hasAnyCard" class="text-neutral-400 text-sm">
          Nenhum cartão cadastrado.
        </div>

        <div
          v-else
          class="relative h-[150px] rounded-[14px] p-4 text-zinc-100 bg-gradient-to-br from-zinc-600 via-zinc-700 to-zinc-600 border border-zinc-600 overflow-hidden shadow-lg"
        >
          <div class="font-semibold opacity-90 tracking-[0.2px] mb-4">
            {{ currentCard.name }}
          </div>
          <div class="text-[22px] font-extrabold tracking-[0.1em] mb-4">
            {{ formattedNumber }}
          </div>
          <div
            class="flex items-end justify-between absolute left-4 right-4 bottom-3"
          >
            <div>
              <span class="text-[11px] text-zinc-300/80">Limite</span>
              <span class="block mt-0.5 text-[13px] font-bold">{{
                money(currentCard.limit)
              }}</span>
            </div>
            <div>
              <span class="text-[11px] text-zinc-300/80">Validade</span>
              <span class="block mt-0.5 text-[13px] font-bold">{{
                expiry
              }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap md:flex-nowrap gap-2">
          <button
            class="bg-emerald-500 text-white rounded-xl px-3 py-2 font-bold"
            @click="$emit('open-cards')"
          >
            Add Cartão
          </button>
          <button
            class="bg-[#2a1313] text-red-200 rounded-xl px-3 py-2 font-semibold"
            @click="$emit('remove-card')"
          >
            Remover
          </button>
        </div>
      </div>
    </div>

    <div class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] overflow-hidden">
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]"
      >
        <h3>Objetivos</h3>
        <button class="text-emerald-300 text-sm">Ver todos</button>
      </div>
      <div class="p-4">
        <div
          class="h-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg overflow-hidden"
        >
          <div class="h-full bg-emerald-500 w-[38%]"></div>
        </div>
        <div class="mt-1 text-right text-emerald-400 text-sm">R$ 440.000</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftColumn",
  emits: ["add-transaction", "open-cards", "remove-card"],
  
  props: {
    hasCards: { type: Boolean, default: undefined },
    creditCards: { type: Array, default: () => [] },
  },
  computed: {
    hasAnyCard() {
      
      return (
        (this.creditCards && this.creditCards.length > 0) ||
        (typeof this.hasCards === "boolean" ? this.hasCards : false)
      );
    },
    currentCard() {
      
      return (
        this.creditCards?.[0] || {
          name: "Cartão",
          limit: 0,
          dueDay: 12,
          id: "seed",
        }
      );
    },
    formattedNumber() {
      
      const seed = `${this.currentCard.id || ""}|${
        this.currentCard.name || ""
      }`;
      let x = 0;
      for (const c of seed) x = (x * 31 + c.charCodeAt(0)) >>> 0;
      let digits = "";
      for (let i = 0; i < 16; i++) {
        x = (1103515245 * x + 12345) >>> 0;
        digits += String(x).slice(-1);
      }
      return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    },
    expiry() {
     
      const m = this.currentCard?.dueDay
        ? this.currentCard.dueDay % 12 || 12
        : 12;
      return `${String(m).padStart(2, "0")}/38`;
    },
  },
  methods: {
    money(v) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));
    },
  },
};
</script>
