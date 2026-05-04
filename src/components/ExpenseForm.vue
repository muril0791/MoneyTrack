<template>
  <div class="text-white font-sans w-full">
    <!-- Close Button (Absolute) -->
    <button 
      @click="$emit('close')" 
      class="absolute top-6 right-8 text-neutral-500 hover:text-white transition-colors z-10"
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>

    <transition name="fade-slide" mode="out-in">
      <!-- Step 0: Type Selection -->
      <section
        v-if="currentStep === 0"
        key="step0"
        class="flex flex-col space-y-10 bg-[#1b1b1b] rounded-[32px] shadow-2xl ring-1 ring-[#2a2a2a] px-6 py-8 md:px-10 md:py-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <div class="space-y-2 text-center">
          <h2 class="text-emerald-500 text-[11px] uppercase tracking-[0.4em] font-bold">Nova Transação</h2>
          <h3 class="text-3xl font-semibold tracking-tight text-white">O que vamos registrar?</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full mx-auto">
          <!-- Card Entrada -->
          <button
            type="button"
            @click="selectType('entrada')"
            class="group flex items-center gap-4 md:gap-6 rounded-[28px] bg-[#151515] ring-1 ring-white/5 p-5 md:p-8 text-left transition-all duration-300 hover:ring-emerald-500/50 hover:bg-[#181818] hover:scale-[1.03] active:scale-95 shadow-2xl"
          >
            <div class="flex h-12 w-12 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </div>
            <div>
              <div class="font-bold text-[18px] md:text-[20px] uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">Entrada</div>
              <div class="text-[13px] text-neutral-500 mt-1 leading-relaxed">Salário, Pix ou rendas.</div>
            </div>
          </button>

          <!-- Card Saída -->
          <button
            type="button"
            @click="selectType('saida')"
            class="group flex items-center gap-4 md:gap-6 rounded-[28px] bg-[#151515] ring-1 ring-white/5 p-5 md:p-8 text-left transition-all duration-300 hover:ring-rose-500/50 hover:bg-[#181818] hover:scale-[1.03] active:scale-95 shadow-2xl"
          >
            <div class="flex h-12 w-12 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
              <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
            <div>
              <div class="font-bold text-[18px] md:text-[20px] uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors">Saída</div>
              <div class="text-[13px] text-neutral-500 mt-1 leading-relaxed">Compras, lazer ou contas.</div>
            </div>
          </button>
        </div>
      </section>

      <!-- Step 1: Form Details -->
      <section
        v-else-if="currentStep === 1"
        key="step1"
        class="bg-[#1b1b1b] rounded-3xl shadow-2xl ring-1 ring-[#2a2a2a] overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div class="px-6 md:px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
          <div class="space-y-1">
            <h2 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-semibold">Dados do Lançamento</h2>
            <h3 class="text-xl font-semibold text-white">Preencha os detalhes</h3>
          </div>
          <span :class="form.tipo === 'entrada' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'" 
                class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1">
            {{ form.tipo === "entrada" ? "Entrada" : "Saída" }}
          </span>
        </div>

        <div class="p-6 md:p-8 pt-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div class="grid gap-6 sm:grid-cols-2">
            <!-- Amount Input -->
            <div class="space-y-2 sm:col-span-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Valor</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">R$</span>
                <input
                  v-model="valorDisplay"
                  type="text"
                  required
                  placeholder="0,00"
                  class="w-full bg-[#151515] border border-[#2a2a2a] rounded-2xl pl-12 pr-4 py-4 text-2xl font-semibold outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
                />
              </div>
            </div>

            <!-- Transaction Type -->
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Método</label>
              <select
                v-model="form.tipoTransacao"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option disabled value="">Selecione</option>
                <template v-if="form.tipo === 'entrada'">
                  <option value="dinheiro">Dinheiro</option>
                  <option value="deposito">Depósito</option>
                  <option value="pix">Pix</option>
                  <option value="transferencia">Transferência</option>
                </template>
                <template v-else>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">Pix</option>
                  <option value="cartao-debito">Cartão de Débito</option>
                  <option value="cartao-credito">Cartão de Crédito</option>
                </template>
              </select>
            </div>

            <!-- Date -->
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Data</label>
              <input
                v-model="form.data"
                type="date"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all color-scheme-dark"
              />
            </div>

            <!-- Credit Card (Conditional) -->
            <template v-if="form.tipo === 'saida' && form.tipoTransacao === 'cartao-credito'">
              <div class="space-y-2">
                <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Cartão</label>
                <select v-model="form.creditCardId" class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all">
                  <option disabled value="">Selecione</option>
                  <option v-for="card in creditCards" :key="card.id" :value="card.id">{{ card.name }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Parcelas</label>
                <input v-model.number="form.parcelas" type="number" min="1" placeholder="1" class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
              </div>
            </template>

            <!-- Category -->
            <div class="space-y-2 sm:col-span-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Categoria</label>
              <select
                v-model="form.categoria"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option disabled value="">Selecione uma categoria</option>
                <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                <option value="adicionar" class="text-emerald-400">+ Adicionar nova categoria</option>
              </select>
            </div>

            <!-- Description -->
            <div class="space-y-2 sm:col-span-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Descrição (Opcional)</label>
              <input
                v-model="form.descricao"
                type="text"
                placeholder="Ex: Almoço de domingo"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <!-- Error Feedback -->
          <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-bold text-center mt-4">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              @click="goBackToStep0"
              class="flex-1 px-6 py-4 rounded-2xl border border-[#2a2a2a] text-neutral-400 font-semibold hover:bg-white/5 hover:text-white transition-all"
            >
              Voltar
            </button>
            <button
              @click="nextStep"
              class="flex-[2] px-6 py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
            >
              Revisar Lançamento
            </button>
          </div>
        </div>
      </section>

      <!-- Step 2: Review -->
      <section
        v-else-if="currentStep === 2"
        key="step2"
        class="bg-[#1b1b1b] rounded-3xl shadow-2xl ring-1 ring-[#2a2a2a] overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div class="px-6 md:px-8 pt-8 pb-4 shrink-0">
          <h2 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-semibold">Tudo pronto!</h2>
          <h3 class="text-xl font-semibold text-white">Revise as informações</h3>
        </div>

        <div class="p-6 md:p-8 space-y-4 overflow-y-auto custom-scrollbar">
          <div class="bg-[#151515] rounded-2xl p-6 space-y-4 border border-[#2a2a2a]">
            <ItemRow label="Tipo" :text="labelTipo" />
            <ItemRow label="Valor" :text="money(form.valor)" class="text-xl font-bold text-emerald-400" />
            <ItemRow label="Método" :text="labelTransacao" />
            <ItemRow label="Categoria" :text="selectedCategoryName" />
            <ItemRow label="Data" :text="brDate(form.data)" />
            <ItemRow v-if="form.descricao" label="Descrição" :text="form.descricao" />
          </div>

          <!-- Error Feedback -->
          <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-bold text-center mt-4">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="prevStep"
              class="flex-1 px-6 py-4 rounded-2xl border border-[#2a2a2a] text-neutral-400 font-semibold hover:bg-white/5 transition-all"
            >
              Ajustar
            </button>
            <button
              @click="handleSubmit"
              :disabled="submitting"
              class="flex-[2] px-6 py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <span v-if="!submitting">Confirmar e Salvar</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Salvando...
              </span>
            </button>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, h } from "vue";
import { useMainStore } from "@/stores/store";

const ItemRow = (props) =>
  h(
    "div",
    {
      class:
        "flex items-center justify-between border border-dashed border-[#2a2a2a] rounded-lg px-3 py-2 bg-[#171717]",
    },
    [
      h("span", { class: "text-neutral-400 text-sm" }, props.label),
      h(
        "span",
        { class: "font-semibold truncate max-w-[60%] text-right" },
        String(props.text ?? "")
      ),
    ]
  );
ItemRow.props = { label: String, text: [String, Number] };

export default {
  name: "ExpenseForm",
  components: { ItemRow },
  emits: ["close", "open-categories"],
  props: {
    editingExpense: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    creditCards: { type: Array, default: () => [] },
  },
  setup(props, { emit }) {
    const store = useMainStore();
    const currentStep = ref(0);
    const submitting = ref(false);
    const error = ref("");

    const form = reactive({
      tipo: "",
      tipoTransacao: "",
      parcelas: null,
      data: "",
      valor: null,
      categoria: "",
      descricao: "",
      creditCardId: "",
      dataPrimeiraParcela: "",
    });

    const valorDisplay = ref("");
    
    const parseValueBR = (val) => {
      if (!val) return 0;
      // Remove thousands dots, then replace decimal comma with dot
      const clean = String(val).replace(/\./g, "").replace(",", ".");
      return parseFloat(clean) || 0;
    };

    watch(valorDisplay, (v) => {
      form.valor = parseValueBR(v);
    });

    // To handle initial value if editing
    watch(() => props.editingExpense, (exp) => {
      if (exp) valorDisplay.value = String(exp.valor || "").replace(".", ",");
    }, { immediate: true });

    watch(
      () => form.categoria,
      (v) => {
        if (v === "adicionar") {
          emit("open-categories");
          form.categoria = "";
        }
      }
    );

    const selectType = (tipo) => {
      form.tipo = tipo === "entrada" ? "entrada" : "saida";
      currentStep.value = 1;
    };

    const computeFirstPaymentDate = () => {
      if (
        !(
          form.tipo === "saida" &&
          form.tipoTransacao === "cartao-credito" &&
          form.parcelas &&
          form.parcelas > 1
        )
      ) {
        form.dataPrimeiraParcela = "";
        return;
      }
      if (!form.data) {
        form.dataPrimeiraParcela = "";
        return;
      }
      const d = new Date(form.data + "T00:00:00");
      form.dataPrimeiraParcela = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const nextStep = () => {
      error.value = "";
      if (currentStep.value !== 1) return;
      
      const tipo = form.tipo === "entrada" ? "entrada" : "saida";
      let tipoTransacao = form.tipoTransacao;
      const valor = Math.max(0, Number(form.valor || 0));
      const dataStr = form.data;
      const categoria = form.categoria;

      if (!valor || valor <= 0) {
        error.value = "O valor deve ser maior que zero.";
        return;
      }
      if (!tipoTransacao) {
        error.value = "Selecione o método de transação.";
        return;
      }
      if (!dataStr) {
        error.value = "Selecione uma data válida.";
        return;
      }
      if (!categoria) {
        error.value = "Selecione uma categoria.";
        return;
      }

      const catOk = props.categories.some(
        (c) => c.id === categoria && c.type === tipo
      );
      if (!catOk) {
        error.value = "Categoria inválida para este tipo de transação.";
        return;
      }

      if (tipo === "saida" && tipoTransacao === "cartao-credito" && !form.creditCardId) {
        error.value = "Selecione um cartão de crédito.";
        return;
      }

      // Sync form values
      form.tipo = tipo;
      form.tipoTransacao = tipoTransacao;
      form.valor = valor;
      form.descricao = String(form.descricao || "").slice(0, 140).trim();
      
      let parcelaInt = form.parcelas ? Math.floor(Number(form.parcelas)) : null;
      if (!parcelaInt || parcelaInt < 2) parcelaInt = null;
      form.parcelas = parcelaInt;

      if (tipo === "saida" && tipoTransacao === "cartao-credito") {
        computeFirstPaymentDate();
      } else {
        form.dataPrimeiraParcela = "";
      }

      currentStep.value = 2;
    };

    const prevStep = () => {
      if (currentStep.value > 0) currentStep.value--;
    };

    const goBackToStep0 = () => {
      Object.assign(form, {
        tipo: "",
        tipoTransacao: "",
        parcelas: null,
        data: "",
        valor: null,
        categoria: "",
        descricao: "",
        creditCardId: "",
        dataPrimeiraParcela: "",
      });
      currentStep.value = 0;
      submitting.value = false;
      error.value = "";
    };

    const handleSubmit = async () => {
      if (submitting.value) return;
      error.value = "";

      const payloadBase = {
        tipo: form.tipo,
        tipoTransacao: form.tipoTransacao,
        valor: form.valor,
        data: form.data,
        categoria: form.categoria,
        descricao: form.descricao,
      };

      let payload = { ...payloadBase };

      if (form.tipo === "saida" && form.tipoTransacao === "cartao-credito") {
        payload.creditCardId = form.creditCardId;
        payload.parcelas = form.parcelas;
        if (form.parcelas && form.parcelas > 1) {
          payload.data = form.dataPrimeiraParcela || form.data;
        }
      }

      submitting.value = true;
      try {
        if (props.editingExpense?.id) {
          await store.updateExpense({ ...payload, id: props.editingExpense.id });
        } else {
          await store.addExpense(payload);
        }
        
        emit("close");
        goBackToStep0();
      } catch (err) {
        error.value = "Ocorreu um erro ao salvar. Verifique sua conexão.";
        console.error("Erro no form:", err);
      } finally {
        submitting.value = false;
      }
    };

    const filteredCategories = computed(() =>
      props.categories.filter((cat) => cat.type === form.tipo)
    );
    const selectedCategoryName = computed(
      () => props.categories.find((c) => c.id === form.categoria)?.name || ""
    );
    const getCreditCardName = (id) =>
      props.creditCards.find((c) => c.id === id)?.name || "";

    const money = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));
    const brDate = (s) =>
      s
        ? new Date(s + "T00:00:00").toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
    const labelTipo = computed(() =>
      form.tipo === "entrada" ? "Entrada" : "Saída"
    );
    const labelTransacao = computed(() => {
      const map = {
        dinheiro: "Dinheiro",
        deposito: "Depósito",
        pix: "Pix",
        transferencia: "Transferência",
        "cartao-debito": "Cartão de Débito",
        "cartao-credito": "Cartão de Crédito",
      };
      return map[form.tipoTransacao] || form.tipoTransacao || "—";
    });

    return {
      currentStep,
      submitting,
      error,
      form,
      valorDisplay,
      selectType,
      nextStep,
      prevStep,
      goBackToStep0,
      handleSubmit,
      filteredCategories,
      selectedCategoryName,
      getCreditCardName,
      money,
      brDate,
      labelTipo,
      labelTransacao,
    };
  },
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Custom styles for date input icon in dark mode */
.color-scheme-dark {
  color-scheme: dark;
}
</style>
