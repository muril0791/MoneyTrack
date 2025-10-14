<template>

  <div class="bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] overflow-hidden">

    <div class="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
      <h2 class="text-lg md:text-xl font-semibold tracking-tight">Cartões de crédito</h2>
      <button
        class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#232323] hover:bg-[#2b2b2b] transition"
        @click="$emit('close')" aria-label="Fechar modal">
        ✕
      </button>
    </div>


    <div class="p-6 grid gap-6">

      <form @submit.prevent="handleSubmit" class="grid gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1 md:col-span-2">
            <label for="cardName" class="block text-sm text-neutral-300 mb-1">Nome do cartão</label>
            <input id="cardName" v-model="cardForm.name" type="text" required
              placeholder="Ex.: Nubank, Inter, Santander..."
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none
                       focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-neutral-500 transition" />
          </div>

          <div>
            <label for="cardLimit" class="block text-sm text-neutral-300 mb-1">Limite (R$)</label>
            <input id="cardLimit" v-model.number="cardForm.limit" type="number" min="0" step="0.01" required
              placeholder="0,00"
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none
                       [appearance:textfield] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition" />
          </div>

          <div>
            <label for="closingDay" class="block text-sm text-neutral-300 mb-1">Dia de fechamento</label>
            <input id="closingDay" v-model.number="cardForm.closingDay" type="number" min="1" max="31" required
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none
                       [appearance:textfield] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition" />
          </div>

          <div>
            <label for="dueDay" class="block text-sm text-neutral-300 mb-1">Dia de vencimento</label>
            <input id="dueDay" v-model.number="cardForm.dueDay" type="number" min="1" max="31" required
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none
                       [appearance:textfield] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition" />
          </div>
        </div>

        <div class="flex gap-3 pt-1">
          <button type="submit" class="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold
                     rounded-lg py-3 transition shadow-md shadow-emerald-500/10">
            {{ isEditing ? 'Atualizar' : 'Adicionar' }}
          </button>

          <button v-if="isEditing" type="button" @click="cancelEdit"
            class="px-4 py-3 rounded-lg bg-[#262626] hover:bg-[#2f2f2f] text-neutral-200 font-medium transition">
            Cancelar
          </button>
        </div>
      </form>


      <div class="grid gap-3">
        <h3 class="text-sm uppercase tracking-wider text-neutral-400">Cartões cadastrados</h3>

        <div v-if="creditCards.length === 0" class="text-sm text-neutral-400 bg-[#151515] border border-dashed border-[#2a2a2a]
                   rounded-xl p-6 text-center">
          Nenhum cartão cadastrado ainda.
        </div>

        <ul v-else class="divide-y divide-[#232323] rounded-xl overflow-hidden ring-1 ring-[#232323]">
          <li v-for="card in creditCards" :key="card.id"
            class="flex items-center justify-between gap-4 bg-[#161616] px-4 py-3">
            <div class="min-w-0">
              <p class="font-medium truncate">{{ card.name }}</p>
              <p class="text-sm text-neutral-400">
                Limite:
                <span class="text-neutral-200">{{ formatCurrency(card.limit) }}</span>
                • Fechamento: <span class="text-neutral-200">{{ card.closingDay }}</span>
                • Venc.: <span class="text-neutral-200">{{ card.dueDay }}</span>
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button class="px-3 py-2 rounded-md bg-[#232323] hover:bg-[#2b2b2b] text-sm font-medium transition"
                @click="editCard(card)">
                Editar
              </button>
              <button
                class="px-3 py-2 rounded-md bg-[#2a1313] hover:bg-[#341616] text-sm font-medium text-red-300 transition"
                @click="deleteCard(card.id)">
                Excluir
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>


    <div class="px-6 py-4 border-t border-[#2a2a2a] flex justify-end">
      <button class="px-4 py-2 rounded-lg bg-[#232323] hover:bg-[#2b2b2b] transition" @click="$emit('close')">
        Fechar
      </button>
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

    const resetForm = () => {
      cardForm.value = { name: "", limit: 0, closingDay: null, dueDay: null };
      isEditing.value = false;
      editingId.value = null;
    };

    const handleSubmit = async () => {
      if (isEditing.value && editingId.value) {
        await store.updateCreditCard({ ...cardForm.value, id: editingId.value });
      } else {
        await store.addCreditCard({ ...cardForm.value });
      }
      resetForm();
    };

    const editCard = (card) => {
      isEditing.value = true;
      editingId.value = card.id;
      cardForm.value = {
        name: card.name ?? "",
        limit: Number(card.limit ?? 0),
        closingDay: card.closingDay ?? null,
        dueDay: card.dueDay ?? null,
      };
    };

    const deleteCard = async (cardId) => {
      await store.removeCreditCard(cardId);
      if (editingId.value === cardId) resetForm();
    };

    const cancelEdit = () => resetForm();

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));

    return {
      creditCards,
      cardForm,
      isEditing,
      handleSubmit,
      editCard,
      deleteCard,
      cancelEdit,
      formatCurrency,
    };
  },
};
</script>
