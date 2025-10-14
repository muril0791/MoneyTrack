<template>
  <div class="text-white">
    <section
      v-if="currentStep === 0"
      class="space-y-4 bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] overflow-hidden p-6"
    >
      <h2 class="text-2xl font-semibold tracking-tight">Transações</h2>
      <p class="text-sm text-neutral-400 -mt-2">
        Escolha um tipo para continuar
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          aria-label="Selecionar Entrada"
          @click="selectType('entrada')"
          class="group relative w-full overflow-hidden rounded-2xl bg-[#151515] ring-1 ring-[#262626] px-5 py-4 text-left shadow-lg transition hover:bg-[#191919] hover:ring-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <div class="flex items-center gap-4">
            <span
              class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-400"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
                <path d="M12 4l6 6h-4v8h-4v-8H6l6-6z" />
              </svg>
            </span>
            <div>
              <div class="font-semibold text-[15px]">Entrada</div>
              <div class="text-sm text-neutral-400 mt-0.5">
                Salário, transferências…
              </div>
            </div>
          </div>
          <span
            class="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>

        <button
          type="button"
          aria-label="Selecionar Saída"
          @click="selectType('saida')"
          class="group relative w-full overflow-hidden rounded-2xl bg-[#151515] ring-1 ring-[#262626] px-5 py-4 text-left shadow-lg transition hover:bg-[#191919] hover:ring-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          <div class="flex items-center gap-4">
            <span
              class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 ring-1 ring-rose-500/30 text-rose-400"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
                <path d="M12 20l-6-6h4V6h4v8h4l-6 6z" />
              </svg>
            </span>
            <div>
              <div class="font-semibold text-[15px]">Saída</div>
              <div class="text-sm text-neutral-400 mt-0.5">
                Compras, pagamentos…
              </div>
            </div>
          </div>
          <span
            class="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>
      </div>
    </section>

    <section
      v-else-if="currentStep === 1"
      class="border border-[#2a2a2a] bg-[#1b1b1b] rounded-2xl shadow-xl"
    >
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]"
      >
        <h3 class="font-semibold tracking-tight">Preencha os dados</h3>
        <span
          class="px-2 py-1 rounded-full border border-[#2a2a2a] bg-[#232323] text-xs"
        >
          {{ form.tipo === "entrada" ? "Entrada" : "Saída" }}
        </span>
      </div>

      <div class="grid gap-4 p-4 sm:grid-cols-2">
        <div class="space-y-1">
          <label class="text-sm text-neutral-300">Valor</label>
          <input
            v-model.number="form.valor"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0,00"
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-neutral-500 transition"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm text-neutral-300">Tipo de Transação</label>
          <select
            v-model="form.tipoTransacao"
            required
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition"
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

        <template
          v-if="
            form.tipo === 'saida' && form.tipoTransacao === 'cartao-credito'
          "
        >
          <div class="space-y-1">
            <label class="text-sm text-neutral-300">Cartão de Crédito</label>
            <select
              v-model="form.creditCardId"
              required
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition"
            >
              <option disabled value="">Selecione</option>
              <option
                v-for="card in creditCards"
                :key="card.id"
                :value="card.id"
              >
                {{ card.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm text-neutral-300">Número de Parcelas</label>
            <input
              v-model.number="form.parcelas"
              type="number"
              min="2"
              placeholder="ex.: 3"
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-neutral-500 transition"
            />
            <small class="text-neutral-400 text-xs"
              >Deixe vazio ou 1 para compra à vista.</small
            >
          </div>
        </template>

        <div class="space-y-1">
          <label class="text-sm text-neutral-300">Data</label>
          <input
            v-model="form.data"
            type="date"
            required
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm text-neutral-300">Categoria</label>
          <select
            v-model="form.categoria"
            required
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition"
          >
            <option disabled value="">Selecione</option>
            <option
              v-for="cat in filteredCategories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
            <option value="adicionar">[Adicionar categoria]</option>
          </select>
        </div>

        <div class="space-y-1 sm:col-span-2">
          <label class="text-sm text-neutral-300">Descrição</label>
          <input
            v-model="form.descricao"
            type="text"
            placeholder="Opcional"
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-neutral-500 transition"
          />
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-4 py-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-[#2a2a2a] bg-[#222] text-neutral-300 hover:bg-[#262626] hover:text-white transition"
          @click="goBackToStep0"
        >
          Voltar
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold transition"
          @click="nextStep"
        >
          Próximo
        </button>
      </div>
    </section>

    <section
      v-else-if="currentStep === 2"
      class="border border-[#2a2a2a] bg-[#1b1b1b] rounded-2xl shadow-xl"
    >
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]"
      >
        <h3 class="font-semibold tracking-tight">Revisão final</h3>
        <span
          class="px-2 py-1 rounded-full border border-[#2a2a2a] bg-[#232323] text-xs"
        >
          {{ form.tipo === "entrada" ? "Entrada" : "Saída" }}
        </span>
      </div>

      <div class="p-4 space-y-2">
        <ItemRow label="Tipo" :value="form.tipo" />
        <ItemRow
          label="Valor"
          :value="`R$ ${Number(form.valor || 0).toFixed(2)}`"
        />
        <ItemRow label="Transação" :value="form.tipoTransacao" />

        <template
          v-if="
            form.tipo === 'saida' && form.tipoTransacao === 'cartao-credito'
          "
        >
          <ItemRow
            label="Cartão"
            :value="getCreditCardName(form.creditCardId) || '—'"
          />
          <ItemRow
            v-if="form.parcelas"
            label="Parcelas"
            :value="`${form.parcelas}x`"
          />
          <ItemRow
            v-if="form.dataPrimeiraParcela"
            label="1ª Parcela"
            :value="form.dataPrimeiraParcela"
          />
        </template>

        <ItemRow label="Data" :value="form.data" />
        <ItemRow label="Categoria" :value="selectedCategoryName || '—'" />
        <ItemRow label="Descrição" :value="form.descricao || '—'" />
      </div>

      <div class="flex items-center justify-end gap-2 px-4 py-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-[#2a2a2a] bg-[#222] text-neutral-300 hover:bg-[#262626] hover:text-white transition"
          @click="prevStep"
        >
          Voltar
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold transition"
          @click="handleSubmit"
        >
          Confirmar
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, defineComponent } from "vue";

const ItemRow = defineComponent({
  props: { label: String, value: String },
  template: `
    <div class="flex items-center justify-between border border-dashed border-[#2a2a2a]
                rounded-lg px-3 py-2 bg-[#171717]">
      <span class="text-neutral-400 text-sm">{{ label }}</span>
      <span class="font-semibold">{{ value }}</span>
    </div>
  `,
});

export default {
  name: "ExpenseForm",
  components: { ItemRow },
  emits: ["add-expense", "close", "open-categories"],
  props: {
    editingExpense: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    creditCards: { type: Array, default: () => [] },
  },
  setup(props, { emit }) {
    const currentStep = ref(0);
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

    watch(
      () => form.categoria,
      (newVal) => {
        if (newVal === "adicionar") {
          emit("open-categories");
          form.categoria = "";
        }
      }
    );

    const selectType = (tipo) => {
      form.tipo = tipo;
      currentStep.value = 1;
    };

    const nextStep = () => {
      if (currentStep.value < 2) currentStep.value++;
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
    };

    const handleSubmit = () => {
      if (
        form.tipo === "saida" &&
        form.tipoTransacao === "cartao-credito" &&
        form.parcelas &&
        form.parcelas > 1
      ) {
        const finalDate = form.dataPrimeiraParcela || form.data;
        emit("add-expense", {
          ...form,
          data: finalDate,
          parcelas: form.parcelas,
        });
      } else {
        emit("add-expense", { ...form });
      }

      emit("close");
      currentStep.value = 0;
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
    };

    const filteredCategories = computed(() =>
      props.categories.filter((cat) => cat.type === form.tipo)
    );

    const selectedCategoryName = computed(() => {
      const cat = props.categories.find((c) => c.id === form.categoria);
      return cat ? cat.name : "";
    });

    const getCreditCardName = (id) => {
      const card = props.creditCards.find((c) => c.id === id);
      return card ? card.name : "";
    };

    return {
      currentStep,
      form,
      selectType,
      nextStep,
      prevStep,
      goBackToStep0,
      handleSubmit,
      filteredCategories,
      selectedCategoryName,
      getCreditCardName,
    };
  },
};
</script>

<style scoped>
</style>
