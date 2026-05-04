<template>
  <div class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="w-full max-w-2xl bg-[#1b1b1b] rounded-[32px] shadow-2xl ring-1 ring-white/5 overflow-hidden flex flex-col max-h-[90vh]" @click.stop>
      <!-- Header -->
      <div class="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#1b1b1b]/50 backdrop-blur-xl shrink-0">
        <div class="space-y-1">
          <h2 class="text-emerald-500 text-[11px] uppercase tracking-[0.3em] font-bold">Gestão Mensal</h2>
          <h3 class="text-2xl font-semibold tracking-tight text-white">Contas Fixas</h3>
        </div>
        <button 
          v-if="!showForm"
          @click="openAddForm"
          class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <span class="text-lg">+</span> Nova Conta
        </button>
        <button 
          v-else
          @click="showForm = false"
          class="text-neutral-500 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <!-- Form Section -->
        <transition name="fade-slide">
          <div v-if="showForm" class="space-y-6 mb-8 bg-[#151515] p-6 rounded-3xl border border-white/5">
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Descrição</label>
                  <input v-model="form.title" type="text" placeholder="Ex: Aluguel, Internet..." class="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Valor (R$)</label>
                  <input v-model="valorDisplay" type="text" placeholder="0,00" class="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Dia Venc.</label>
                  <input v-model.number="form.dueDay" type="number" min="1" max="31" class="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-white text-center outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Tipo</label>
                  <select v-model="form.isVariable" class="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none">
                    <option :value="false">Valor Fixo</option>
                    <option :value="true">Valor Variável</option>
                  </select>
                </div>
                <div class="space-y-2 sm:col-span-1 col-span-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Parcelas (Opcional)</label>
                  <input v-model.number="form.totalInstallments" type="number" placeholder="Ex: 12" class="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
              </div>

              <div class="flex gap-3 pt-2">
                <button @click="saveBill" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/10">
                  {{ editingId ? 'Atualizar Conta' : 'Salvar Conta' }}
                </button>
                <button v-if="editingId" @click="cancelEdit" class="px-6 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-all">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- List Section -->
        <div class="space-y-4">
          <div v-if="fixedBills.length === 0 && !showForm" class="py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-[32px]">
            <p class="text-neutral-500">Você ainda não tem contas fixas cadastradas.</p>
            <button @click="openAddForm" class="text-emerald-500 font-bold hover:underline">Adicionar a primeira</button>
          </div>

          <div v-for="bill in fixedBills" :key="bill.id" class="group relative bg-[#151515] border border-white/5 rounded-3xl p-5 hover:border-emerald-500/30 transition-all">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-4">
                <div 
                  class="w-12 h-12 rounded-2xl flex items-center justify-center ring-1 ring-white/5"
                  :class="bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'"
                >
                  <svg v-if="bill.status === 'paid'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="text-white font-semibold">{{ bill.title }}</h4>
                    <span v-if="bill.isVariable" class="text-[8px] uppercase font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded tracking-tighter">Variável</span>
                    <span v-if="bill.totalInstallments" class="text-[8px] uppercase font-bold bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded tracking-tighter">{{ bill.remainingInstallments }}/{{ bill.totalInstallments }}</span>
                  </div>
                  <p class="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                    Vence todo dia {{ bill.dueDay }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold" :class="bill.isVariable ? 'text-amber-400' : 'text-white'">
                  <span class="text-xs opacity-50 mr-0.5">R$</span>{{ bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </p>
                <p class="text-[9px] uppercase font-bold tracking-tighter" :class="bill.status === 'paid' ? 'text-emerald-500' : 'text-rose-500'">
                  {{ bill.status === 'paid' ? 'Pago' : 'Pendente' }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex gap-2">
              <button 
                v-if="bill.status !== 'paid'"
                @click="confirmPayment(bill)"
                class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold transition active:scale-95"
              >
                Confirmar Pagamento
              </button>
              <button 
                v-else
                disabled
                class="flex-1 bg-neutral-800 text-neutral-500 py-2 rounded-xl text-xs font-bold"
              >
                Pago em {{ new Date(bill.lastPaidDate).toLocaleDateString('pt-BR') }}
              </button>
              
              <div class="flex gap-2">
                <button @click="editBill(bill)" class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 transition-colors">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button @click="deleteBill(bill.id)" class="p-2 rounded-xl bg-neutral-800 hover:bg-rose-900/30 text-neutral-400 hover:text-rose-500 transition-colors">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 md:p-6 border-t border-white/5 flex justify-end bg-[#1b1b1b]/50 shrink-0">
        <button @click="$emit('close')" class="text-xs uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-all">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const fixedBills = computed(() => store.fixedBills);

const showForm = ref(false);
const editingId = ref(null);
const valorDisplay = ref("");

const form = reactive({
  title: '',
  amount: null,
  dueDay: 1,
  isVariable: false,
  totalInstallments: null
});

const parseValueBR = (val) => {
  if (!val) return 0;
  const clean = String(val).replace(/\./g, "").replace(",", ".");
  return parseFloat(clean) || 0;
};

watch(valorDisplay, (v) => {
  form.amount = parseValueBR(v);
});

onMounted(() => {
  store.fetchFixedBills();
});

const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

const resetForm = () => {
  form.title = '';
  form.amount = null;
  form.dueDay = new Date().getDate();
  form.isVariable = false;
  form.totalInstallments = null;
  editingId.value = null;
  valorDisplay.value = "";
};

const saveBill = async () => {
  if (editingId.value) {
    await store.updateFixedBill(editingId.value, { ...form });
  } else {
    await store.addFixedBill({ ...form });
  }
  showForm.value = false;
  resetForm();
};

const editBill = (bill) => {
  form.title = bill.title;
  form.amount = bill.amount;
  form.dueDay = bill.dueDay;
  form.isVariable = bill.isVariable;
  form.totalInstallments = bill.totalInstallments;
  editingId.value = bill.id;
  valorDisplay.value = String(bill.amount || "").replace(".", ",");
  showForm.value = true;
};

const cancelEdit = () => {
  showForm.value = false;
  resetForm();
};

const deleteBill = async (id) => {
  if (confirm('Deseja realmente excluir esta conta fixa?')) {
    await store.removeFixedBill(id);
  }
};

const confirmPayment = async (bill) => {
  if (bill.isVariable) {
    const newAmount = prompt(`Confirmar valor para ${bill.title}:`, String(bill.amount).replace(".", ","));
    if (newAmount !== null) {
      await store.updateFixedBill(bill.id, { amount: parseValueBR(newAmount) });
      await store.payFixedBill(bill.id);
    }
  } else {
    if (confirm(`Confirmar pagamento de R$ ${bill.amount.toLocaleString('pt-BR')} para ${bill.title}?`)) {
      await store.payFixedBill(bill.id);
    }
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 10px;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
