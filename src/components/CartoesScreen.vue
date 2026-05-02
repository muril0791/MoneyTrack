<template>
  <div class="w-full max-w-xl mx-auto font-sans">
    <div class="bg-[#1b1b1b] rounded-3xl shadow-2xl ring-1 ring-[#2a2a2a] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-[#2a2a2a]">
        <div class="space-y-1">
          <h2 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-semibold">Configurações</h2>
          <h3 class="text-xl font-semibold text-white">Cartões de Crédito</h3>
        </div>
        <button
          @click="$emit('close')"
          class="text-neutral-500 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-8 space-y-8">
        <!-- Form Section -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2 space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Nome do Cartão</label>
              <input
                v-model="cardForm.name"
                type="text"
                required
                placeholder="Ex: Nubank, Inter, Santander..."
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Limite (R$)</label>
              <input
                v-model.number="cardForm.limit"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0,00"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1 text-center block">Fechamento</label>
                <input
                  v-model.number="cardForm.closingDay"
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Dia"
                  class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] text-center outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1 text-center block">Vencimento</label>
                <input
                  v-model.number="cardForm.dueDay"
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="Dia"
                  class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] text-center outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl py-3.5 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <span v-if="!submitting">{{ isEditing ? "Atualizar Cartão" : "Adicionar Cartão" }}</span>
              <span v-else>Salvando...</span>
            </button>
            <button
              v-if="isEditing"
              @click="cancelEdit"
              type="button"
              class="px-6 py-3.5 rounded-xl border border-[#2a2a2a] text-neutral-400 font-semibold hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>

        <!-- List Section -->
        <div class="space-y-4">
          <h3 class="text-neutral-500 text-[11px] uppercase tracking-widest font-semibold ml-1">Cartões Cadastrados</h3>

          <div v-if="creditCards.length === 0" class="text-center py-10 border border-dashed border-[#2a2a2a] rounded-2xl bg-[#151515]">
            <p class="text-neutral-500 text-sm">Nenhum cartão cadastrado.</p>
          </div>

          <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="card in creditCards"
              :key="card.id"
              class="flex items-center justify-between bg-[#151515] border border-[#2a2a2a] rounded-2xl p-4 hover:ring-1 hover:ring-emerald-500/30 transition-all"
            >
              <div class="flex items-center gap-4">
                <span class="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-800 text-emerald-400 ring-1 ring-white/5">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </span>
                <div>
                  <p class="text-[14px] font-semibold text-white uppercase tracking-wide">{{ card.name }}</p>
                  <p class="text-[10px] text-neutral-500 uppercase tracking-widest">
                    Limite: <span class="text-neutral-300">{{ formatCurrency(card.limit) }}</span> • Venc: {{ card.dueDay }}
                  </p>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  @click="editCard(card)"
                  class="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-emerald-400 transition-all"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  @click="deleteCard(card.id)"
                  class="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-rose-400 transition-all"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-4 border-t border-[#2a2a2a] bg-[#151515]/50 flex justify-end">
        <button
          @click="$emit('close')"
          class="text-[12px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-all"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useMainStore } from "../stores/store";
import { storeToRefs } from "pinia";

export default {
  name: "CartoesScreen",
  emits: ["close"],
  setup() {
    const store = useMainStore();
    const { creditCards } = storeToRefs(store);

    const cardForm = ref({
      name: "",
      limit: 0,
      closingDay: null,
      dueDay: null,
    });
    const isEditing = ref(false);
    const editingId = ref(null);
    const submitting = ref(false);

    const resetForm = () => {
      cardForm.value = { name: "", limit: 0, closingDay: null, dueDay: null };
      isEditing.value = false;
      editingId.value = null;
      submitting.value = false;
    };

    const handleSubmit = async () => {
      if (submitting.value) return;
      const name = String(cardForm.value.name || "")
        .trim()
        .slice(0, 80);
      const limit = Math.max(0, Number(cardForm.value.limit || 0));
      const closingDay = Math.min(
        31,
        Math.max(1, Number(cardForm.value.closingDay || 0))
      );
      const dueDay = Math.min(
        31,
        Math.max(1, Number(cardForm.value.dueDay || 0))
      );
      if (!name || !closingDay || !dueDay || Number.isNaN(limit)) return;

      submitting.value = true;
      try {
        const payload = { name, limit, closingDay, dueDay };
        if (isEditing.value && editingId.value) {
          await store.updateCreditCard({ ...payload, id: editingId.value });
        } else {
          await store.addCreditCard(payload);
        }
        resetForm();
      } finally {
        submitting.value = false;
      }
    };

    const editCard = (card) => {
      if (submitting.value) return;
      isEditing.value = true;
      editingId.value = card.id;
      cardForm.value = {
        name: String(card.name ?? "").slice(0, 80),
        limit: Number(card.limit ?? 0),
        closingDay: card.closingDay ?? null,
        dueDay: card.dueDay ?? null,
      };
    };

    const deleteCard = async (cardId) => {
      if (submitting.value) return;
      submitting.value = true;
      try {
        await store.removeCreditCard(cardId);
        if (editingId.value === cardId) resetForm();
      } finally {
        submitting.value = false;
      }
    };

    const cancelEdit = () => resetForm();

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));

    return {
      creditCards,
      cardForm,
      isEditing,
      submitting,
      handleSubmit,
      editCard,
      deleteCard,
      cancelEdit,
      formatCurrency,
    };
  },
};
</script>
