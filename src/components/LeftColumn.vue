<template>
  <div class="space-y-6">
   
    <div class="card">
      <div class="card-header">
        <h3>Transações</h3>
        <button class="btn-green" @click="$emit('add-transaction')">
          Adicionar <span>＋</span>
        </button>
      </div>
    </div>

   
    <div class="card">
      <div class="card-header">
        <h3>Cartões</h3>
        <button class="link" @click="$emit('open-cards')">Ver todos</button>
      </div>

      <div class="p-4">
       
        <div v-if="!hasAnyCard" class="empty">Nenhum cartão cadastrado.</div>

       
        <div v-else class="cc-preview" aria-label="Prévia do cartão">
          <div class="cc-shine"></div>

          <div class="cc-name">{{ currentCard.name }}</div>

          <div class="cc-number">{{ formattedNumber }}</div>

          <div class="cc-footer">
            <div class="cc-meta">
              <span class="label">Limite</span>
              <span class="value">{{ money(currentCard.limit) }}</span>
            </div>
            <div class="cc-meta">
              <span class="label">Validade</span>
              <span class="value">{{ expiry }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button class="btn-green" @click="$emit('open-cards')">
            Add Cartão
          </button>
          <button class="btn-red" @click="$emit('remove-card')">Remover</button>
        </div>
      </div>
    </div>

   
    <div class="card">
      <div class="card-header">
        <h3>Objetivos</h3>
        <button class="link">Ver todos</button>
      </div>
      <div class="p-4">
        <div class="progress"><div class="bar" style="width: 38%"></div></div>
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

<style scoped>
.card {
  background: #1b1b1b;
  border-radius: 16px;
  border: 1px solid #2a2a2a;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #2a2a2a;
}

.btn-green {
  background: #22c55e;
  color: #fff;
  border: 0;
  border-radius: 12px;
  padding: 0.48rem 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.btn-red {
  background: #2a1313;
  color: #ffb3b3;
  border: 0;
  border-radius: 12px;
  padding: 0.48rem 0.9rem;
  font-weight: 600;
}
.link {
  color: #76eab3;
  font-size: 0.85rem;
}
.empty {
  color: #a3a3a3;
  font-size: 0.9rem;
}


.cc-preview {
  position: relative;
  height: 150px;
  border-radius: 14px;
  padding: 16px 18px;
  color: #f3f4f6;
  background: linear-gradient(160deg, #3a3a3a 0%, #2d2d2d 40%, #4b4b4b 100%);
  border: 1px solid #3a3a3a;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 10px 24px rgba(0, 0, 0, 0.25);
}
.cc-shine {
  position: absolute;
  inset: -20% -20% auto auto;
  height: 200%;
  width: 60%;
  background: radial-gradient(
    ellipse at top right,
    rgba(255, 255, 255, 0.18),
    transparent 55%
  );
  transform: rotate(-8deg);
  pointer-events: none;
}
.cc-name {
  font-weight: 600;
  opacity: 0.9;
  letter-spacing: 0.2px;
  margin-bottom: 18px;
}
.cc-number {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
  margin-bottom: 16px;
}
.cc-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 14px;
}
.cc-meta .label {
  font-size: 11px;
  color: #c0c0c0;
  opacity: 0.8;
}
.cc-meta .value {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 700;
  color: #e7e7e7;
}

.progress {
  height: 10px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
}
.bar {
  height: 100%;
  background: #22c55e;
}
</style>
