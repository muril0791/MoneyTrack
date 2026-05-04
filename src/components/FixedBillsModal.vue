<template>
  <div class="fixed inset-0 z-[100] bg-[#0d0d0d] flex flex-col overflow-hidden">
    <!-- Hub Header -->
    <header class="shrink-0 bg-[#0d0d0d] border-b border-white/5 px-6 md:px-10 py-6 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-white font-bold text-xl tracking-tight">Gestão de Contas Fixas</h2>
          <p class="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black">Organização Mensal</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button 
          @click="openAddForm"
          class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <span class="text-lg leading-none">+</span> Nova Conta
        </button>
        <button 
          @click="$emit('close')" 
          class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Hub Content -->
    <main class="flex-1 overflow-hidden flex flex-col md:flex-row">
      <!-- Sidebar / List -->
      <div class="w-full md:w-[450px] border-r border-white/5 flex flex-col bg-[#0d0d0d]">
        <div class="p-6 border-b border-white/5 bg-[#121212]/30">
          <h3 class="text-neutral-500 text-[10px] uppercase tracking-widest font-black mb-1">Suas Contas</h3>
          <p class="text-xs text-neutral-600">Gerencie seus compromissos recorrentes</p>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <div v-if="fixedBills.length === 0" class="py-20 text-center px-6">
            <p class="text-neutral-600 text-sm italic">Nenhuma conta cadastrada.</p>
          </div>

          <div 
            v-for="bill in fixedBills" 
            :key="bill.id" 
            @click="editBill(bill)"
            class="group p-4 bg-[#161616] border border-white/5 rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm relative overflow-hidden"
            :class="{'ring-2 ring-emerald-500/50 bg-emerald-500/5': editingId === bill.id}"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center"
                  :class="bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-white font-bold text-sm tracking-tight">{{ bill.title }}</h4>
                  <p class="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Dia {{ bill.dueDay }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-white">R$ {{ bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
                <p class="text-[9px] uppercase font-black tracking-widest mt-1" :class="bill.status === 'paid' ? 'text-emerald-500' : 'text-rose-500'">
                  {{ bill.status === 'paid' ? 'Pago' : 'Pendente' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail / Form Area -->
      <div class="flex-1 bg-[#121212]/50 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <transition name="fade-scale" mode="out-in">
          <!-- Form View -->
          <div v-if="showForm || editingId" :key="editingId || 'new'" class="w-full max-w-xl bg-[#1b1b1b] border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl relative">
            <div class="mb-8">
              <span class="text-emerald-500 text-[10px] uppercase tracking-[0.3em] font-black">{{ editingId ? 'Edição' : 'Novo Registro' }}</span>
              <h3 class="text-2xl font-bold text-white tracking-tight mt-1">{{ editingId ? 'Detalhes da Conta' : 'Nova Conta Fixa' }}</h3>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Descrição</label>
                  <input v-model="form.title" type="text" placeholder="Ex: Aluguel" class="w-full bg-[#151515] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Valor (R$)</label>
                  <input v-model="valorDisplay" type="text" placeholder="0,00" class="w-full bg-[#151515] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-bold" />
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Vencimento</label>
                  <input v-model.number="form.dueDay" type="number" min="1" max="31" class="w-full bg-[#151515] border border-white/5 rounded-xl px-4 py-4 text-white text-center outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Tipo</label>
                  <select v-model="form.isVariable" class="w-full bg-[#151515] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer">
                    <option :value="false">Fixo</option>
                    <option :value="true">Variável</option>
                  </select>
                </div>
                <div class="space-y-2 col-span-2 md:col-span-1">
                  <label class="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Parcelas</label>
                  <input v-model.number="form.totalInstallments" type="number" placeholder="Opcional" class="w-full bg-[#151515] border border-white/5 rounded-xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
              </div>

              <div class="flex flex-col gap-3 pt-4">
                <button @click="saveBill" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-xs uppercase tracking-widest">
                  {{ editingId ? 'Salvar Alterações' : 'Cadastrar Conta' }}
                </button>
                
                <div class="grid grid-cols-2 gap-3" v-if="editingId">
                  <button 
                    @click="confirmPayment(getSelectedBill())" 
                    :disabled="getSelectedBill()?.status === 'paid'"
                    class="bg-white/5 hover:bg-emerald-500/10 text-neutral-400 hover:text-emerald-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 border border-white/5"
                  >
                    Marcar Pago
                  </button>
                  <button @click="deleteBill(editingId)" class="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20">
                    Remover Conta
                  </button>
                </div>

                <button @click="cancelEdit" class="w-full text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-colors mt-2">
                  Cancelar Operação
                </button>
              </div>
            </div>
          </div>

          <!-- Empty View -->
          <div v-else class="text-center space-y-6">
            <div class="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto border border-white/5">
              <svg class="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="space-y-2">
              <h3 class="text-xl font-bold text-white tracking-tight">Seleção Pendente</h3>
              <p class="text-sm text-neutral-600 max-w-[280px] mx-auto leading-relaxed">Selecione uma conta ao lado para gerenciar ou crie uma nova agora mesmo.</p>
            </div>
            <button @click="openAddForm" class="text-emerald-500 font-black uppercase tracking-widest text-[10px] hover:underline">Iniciar Novo Cadastro</button>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
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
  store.showConfirm({
    title: "Excluir Conta?",
    message: "Deseja realmente excluir esta conta fixa? Ela não aparecerá mais nos próximos meses.",
    onConfirm: async () => {
      await store.removeFixedBill(id);
    }
  });
};

const confirmPayment = async (bill) => {
  if (bill.isVariable) {
    // Para contas variáveis, habilitamos um modo de confirmação rápida ou usamos o valor atual do formulário
    store.showConfirm({
      title: "Confirmar Valor Variável?",
      message: `O valor atual é R$ ${bill.amount.toLocaleString('pt-BR')}. Deseja confirmar o pagamento com este valor ou ajustar no formulário antes?`,
      onConfirm: async () => {
        await store.payFixedBill(bill.id);
      }
    });
  } else {
    store.showConfirm({
      title: "Confirmar Pagamento?",
      message: `Confirmar pagamento de R$ ${bill.amount.toLocaleString('pt-BR')} para ${bill.title}?`,
      onConfirm: async () => {
        await store.payFixedBill(bill.id);
      }
    });
  }
};
const getSelectedBill = () => {
  return fixedBills.value.find(b => b.id === editingId.value);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-10px);
}
</style>
