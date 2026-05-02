<template>
  <div class="w-full max-w-lg mx-auto font-sans">
    <div class="bg-[#1b1b1b] rounded-3xl shadow-2xl ring-1 ring-[#2a2a2a] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-[#2a2a2a]">
        <div class="space-y-1">
          <h2 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-semibold">Gestão</h2>
          <h3 class="text-xl font-semibold text-white">Editar Lançamento</h3>
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

      <div class="p-8 space-y-6">
        <!-- Status Badge -->
        <div class="flex justify-center">
          <span :class="expense.tipo === 'entrada' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'" 
                class="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ring-1">
            {{ expense.tipo === 'entrada' ? 'Entrada Original' : 'Saída Original' }}
          </span>
        </div>

        <div class="space-y-4">
          <!-- Description -->
          <div class="space-y-2">
            <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Descrição</label>
            <input
              type="text"
              v-model="editableExpense.descricao"
              placeholder="Ex: Salário, Moradia..."
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700 text-white"
            />
          </div>

          <!-- Value -->
          <div class="space-y-2">
            <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Valor do Lançamento</label>
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
              <input
                type="number"
                step="0.01"
                v-model.number="editableExpense.valor"
                placeholder="0,00"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl pl-12 pr-4 py-4 text-2xl font-semibold outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-white"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3 pt-4">
          <button 
            @click="saveExpense" 
            :disabled="loading"
            class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl py-4 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <span v-if="!loading">Salvar Alterações</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </span>
          </button>
          
          <button 
            @click="deleteExpense" 
            :disabled="loading"
            class="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-bold rounded-2xl py-4 transition"
          >
            Excluir Transação
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-4 border-t border-[#2a2a2a] bg-[#151515]/50 flex justify-center">
        <button
          @click="$emit('close')"
          class="text-[12px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-all"
        >
          Cancelar e Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from "@/stores/store";

export default {
  name: "ExpenseEdit",
  props: {
    expense: { type: Object, required: true },
  },
  data() {
    return {
      loading: false,
      editableExpense: {
        descricao: this.expense.descricao || "",
        valor: this.expense.valor || "",
      },
    };
  },
  methods: {
    async saveExpense() {
      if (!this.editableExpense.descricao || this.editableExpense.valor === null) return;
      
      this.loading = true;
      try {
        const store = useMainStore();
        await store.updateExpense({
          ...this.expense,
          descricao: this.editableExpense.descricao,
          valor: Number(this.editableExpense.valor),
        });
        this.$emit("close");
      } catch (err) {
        console.error("Erro ao atualizar:", err);
      } finally {
        this.loading = false;
      }
    },
    async deleteExpense() {
      if (!confirm("Deseja realmente excluir esta transação?")) return;
      
      this.loading = true;
      try {
        const store = useMainStore();
        await store.removeExpense(this.expense.id);
        this.$emit("close");
      } catch (err) {
        console.error("Erro ao excluir:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
