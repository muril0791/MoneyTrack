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
            :disabled="submitting"
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-neutral-500 transition"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm text-neutral-300">Tipo de Transação</label>
          <select
            v-model="form.tipoTransacao"
            required
            :disabled="submitting"
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
              :disabled="submitting"
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
              :disabled="submitting"
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
            :disabled="submitting"
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm text-neutral-300">Categoria</label>
          <select
            v-model="form.categoria"
            required
            :disabled="submitting"
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
            maxlength="140"
            :disabled="submitting"
            class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-neutral-500 transition"
          />
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-4 py-3">
        <button
          type="button"
          :disabled="submitting"
          class="px-4 py-2 rounded-lg border border-[#2a2a2a] bg-[#222] text-neutral-300 hover:bg-[#262626] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          @click="goBackToStep0"
        >
          Voltar
        </button>
        <button
          type="button"
          :disabled="submitting"
          class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
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
        <ItemRow label="Tipo" :text="labelTipo" />
        <ItemRow label="Valor" :text="money(form.valor)" />
        <ItemRow label="Transação" :text="labelTransacao" />
        <template
          v-if="
            form.tipo === 'saida' && form.tipoTransacao === 'cartao-credito'
          "
        >
          <ItemRow
            label="Cartão"
            :text="getCreditCardName(form.creditCardId) || '—'"
          />
          <ItemRow
            v-if="form.parcelas"
            label="Parcelas"
            :text="`${form.parcelas}x`"
          />
          <ItemRow
            v-if="form.dataPrimeiraParcela"
            label="1ª Parcela"
            :text="brDate(form.dataPrimeiraParcela)"
          />
        </template>
        <ItemRow label="Data" :text="brDate(form.data)" />
        <ItemRow label="Categoria" :text="selectedCategoryName || '—'" />
        <ItemRow label="Descrição" :text="form.descricao || '—'" />
      </div>

      <div class="flex items-center justify-end gap-2 px-4 py-3">
        <button
          type="button"
          :disabled="submitting"
          class="px-4 py-2 rounded-lg border border-[#2a2a2a] bg-[#222] text-neutral-300 hover:bg-[#262626] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          @click="prevStep"
        >
          Voltar
        </button>
        <button
          type="button"
          :disabled="submitting"
          class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-[#2a2a2a] text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          @click="handleSubmit"
        >
          <span v-if="!submitting">Confirmar</span>
          <span v-else>Salvando…</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, h } from "vue";

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
  emits: ["add-expense", "close", "open-categories"],
  props: {
    editingExpense: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    creditCards: { type: Array, default: () => [] },
  },
  setup(props, { emit }) {
    const currentStep = ref(0);
    const submitting = ref(false);

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
      if (currentStep.value !== 1) return;
      const tipo = form.tipo === "entrada" ? "entrada" : "saida";
      let tipoTransacao = form.tipoTransacao;
      const allowEntrada = ["dinheiro", "deposito", "pix", "transferencia"];
      const allowSaida = ["dinheiro", "pix", "cartao-debito", "cartao-credito"];
      if (tipo === "entrada" && !allowEntrada.includes(tipoTransacao))
        tipoTransacao = "";
      if (tipo === "saida" && !allowSaida.includes(tipoTransacao))
        tipoTransacao = "";
      const valor = Math.max(0, Number(form.valor || 0));
      const descricao = String(form.descricao || "")
        .slice(0, 140)
        .trim();
      const dataStr = form.data;
      const validDate =
        !!dataStr && !Number.isNaN(new Date(dataStr + "T00:00:00").getTime());
      let parcelaInt = form.parcelas ? Math.floor(Number(form.parcelas)) : null;
      if (!parcelaInt || parcelaInt < 2) parcelaInt = null;
      let categoria = form.categoria;
      const catOk = props.categories.some(
        (c) => c.id === categoria && c.type === tipo
      );

      if (!tipo || !valor || !tipoTransacao || !validDate || !catOk) return;

      if (tipo === "saida" && tipoTransacao === "cartao-credito") {
        if (!form.creditCardId) return;
        computeFirstPaymentDate();
      }

      form.tipo = tipo;
      form.tipoTransacao = tipoTransacao;
      form.valor = valor;
      form.descricao = descricao;
      form.parcelas = parcelaInt;
      if (!parcelaInt) form.dataPrimeiraParcela = "";

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
    };

    const handleSubmit = async () => {
      if (submitting.value) return;
      const payloadBase = {
        tipo: form.tipo === "entrada" ? "entrada" : "saida",
        tipoTransacao: form.tipoTransacao,
        valor: Math.max(0, Number(form.valor || 0)),
        data: form.data,
        categoria: form.categoria,
        descricao: String(form.descricao || "")
          .slice(0, 140)
          .trim(),
      };

      if (
        !payloadBase.tipo ||
        !payloadBase.tipoTransacao ||
        !payloadBase.valor ||
        !payloadBase.data ||
        !payloadBase.categoria
      )
        return;
      const validCat = props.categories.some(
        (c) => c.id === payloadBase.categoria && c.type === payloadBase.tipo
      );
      if (!validCat) return;

      const isCredit =
        payloadBase.tipo === "saida" &&
        payloadBase.tipoTransacao === "cartao-credito";
      let payload = { ...payloadBase };

      if (isCredit) {
        const parcelas = form.parcelas
          ? Math.max(2, Math.floor(Number(form.parcelas)))
          : null;
        if (parcelas) {
          const finalDate = form.dataPrimeiraParcela || form.data;
          payload = {
            ...payload,
            parcelas,
            data: finalDate,
            creditCardId: form.creditCardId || "",
          };
          if (!payload.creditCardId) return;
        } else {
          payload = { ...payload, creditCardId: form.creditCardId || "" };
          if (!payload.creditCardId) return;
        }
      }

      submitting.value = true;
      try {
        emit("add-expense", { ...payload });
        emit("close");
        goBackToStep0();
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
      form,
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

<style scoped></style>
