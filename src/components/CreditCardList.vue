<template>
  <div class="w-full max-w-3xl">
    <div
      class="bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] overflow-hidden"
    >
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]"
      >
        <h2 class="text-lg md:text-xl font-semibold tracking-tight">
          Resumo de Cartões de Crédito
        </h2>
        <button
          class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#232323] hover:bg-[#2b2b2b] transition"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="p-6 grid gap-6">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <label for="cardFilter" class="text-sm text-neutral-300"
            >Filtrar por cartão:</label
          >
          <select
            id="cardFilter"
            v-model="selectedCardId"
            @change="applyFilter"
            class="w-full md:w-1/2 bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-neutral-200 outline-none transition"
          >
            <option value="todos">Todos</option>
            <option v-for="card in creditCards" :key="card.id" :value="card.id">
              {{ card.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            class="bg-[#151515] border border-[#2a2a2a] rounded-xl p-4 text-center"
          >
            <p class="text-sm text-neutral-400">Total Usado</p>
            <p class="text-lg font-semibold text-red-400 mt-1">
              {{ formatCurrency(totalUsed) }}
            </p>
          </div>
          <div
            class="bg-[#151515] border border-[#2a2a2a] rounded-xl p-4 text-center"
          >
            <p class="text-sm text-neutral-400">Limite Disponível</p>
            <p class="text-lg font-semibold text-emerald-400 mt-1">
              {{ formatCurrency(totalAvailable) }}
            </p>
          </div>
          <div
            class="bg-[#151515] border border-[#2a2a2a] rounded-xl p-4 text-center"
          >
            <p class="text-sm text-neutral-400">Próximo Vencimento</p>
            <p class="text-lg font-semibold text-neutral-300 mt-1">
              {{ formatCurrency(totalNextDue) }}
            </p>
          </div>
        </div>
        <div class="grid gap-3">
          <h3 class="text-sm uppercase tracking-wider text-neutral-400">
            Transações
          </h3>
          <div
            v-if="filteredExpenses.length === 0"
            class="text-sm text-neutral-400 bg-[#151515] border border-dashed border-[#2a2a2a] rounded-xl p-6 text-center"
          >
            Nenhuma transação encontrada.
          </div>
          <ul
            v-else
            class="divide-y divide-[#232323] rounded-xl overflow-hidden ring-1 ring-[#232323]"
          >
            <li
              v-for="(expense, index) in filteredExpenses"
              :key="index"
              class="bg-[#161616] p-4 flex flex-col sm:flex-row sm:justify-between gap-2"
            >
              <div class="min-w-0">
                <p class="text-[15px] font-medium">
                  Valor:
                  <span class="text-neutral-200">{{
                    formatCurrency(expense.valor)
                  }}</span>
                </p>
                <p class="text-sm text-neutral-400">
                  Data: {{ formatData(expense.data) }}
                </p>
                <p class="text-sm text-neutral-400">
                  Pagamento: {{ computePaymentDate(expense) }}
                </p>
                <p v-if="expense.parcelas" class="text-sm text-neutral-400">
                  Parcelas: {{ expense.parcelas }}
                </p>
              </div>
              <div class="text-right sm:text-left">
                <p class="text-sm text-neutral-400">
                  Limite disponível:
                  <span class="text-emerald-400">{{
                    formatCurrency(computeAvailableLimit(expense))
                  }}</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-[#2a2a2a] flex justify-end">
        <button
          class="px-4 py-2 rounded-lg bg-[#232323] hover:bg-[#2b2b2b] transition"
          @click="$emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";

export default {
  name: "CreditCardList",
  props: {
    creditCards: { type: Array, required: true },
    expenses: { type: Array, required: true },
  },
  setup(props) {
    const selectedCardId = ref("todos");
    const applyFilter = () => {};

    const clampDay = (y, m, d) => {
      const last = new Date(y, m + 1, 0).getDate();
      return new Date(y, m, Math.min(d, last));
    };
    const nextClosingAfter = (purchase, closingDay) => {
      const y = purchase.getFullYear();
      const m = purchase.getMonth();
      const closeThis = clampDay(y, m, closingDay);
      if (purchase.getDate() >= closeThis.getDate())
        return clampDay(y, m + 1, closingDay);
      return closeThis;
    };
    const dueDateFrom = (purchase, card) => {
      const closing = nextClosingAfter(purchase, Number(card.closingDay));
      const y = closing.getFullYear();
      const m = closing.getMonth();
      const dueMonth =
        Number(card.dueDay) > Number(card.closingDay) ? m : m + 1;
      return clampDay(y, dueMonth, Number(card.dueDay));
    };

    const filteredExpenses = computed(() => {
      let filtered = props.expenses.filter(
        (expense) =>
          expense.tipo === "saida" &&
          expense.tipoTransacao === "cartao-credito" &&
          expense.creditCardId
      );
      if (selectedCardId.value !== "todos") {
        filtered = filtered.filter(
          (expense) => expense.creditCardId === selectedCardId.value
        );
      }
      return filtered;
    });

    const computePaymentDate = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return "";
      const purchase = new Date(expense.data);
      const first = dueDateFrom(purchase, card);
      return first.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    const outstandingValue = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return 0;
      const purchase = new Date(expense.data);
      const firstDue = dueDateFrom(purchase, card);
      const n = Math.max(1, Number(expense.parcelas || 1));
      const parcela = Number(expense.valor) / n;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let total = 0;
      for (let i = 0; i < n; i++) {
        const pay = new Date(
          firstDue.getFullYear(),
          firstDue.getMonth() + i,
          firstDue.getDate()
        );
        if (pay >= today) total += parcela;
      }
      return total;
    };

    const totalUsed = computed(() =>
      filteredExpenses.value.reduce((acc, e) => acc + outstandingValue(e), 0)
    );

    const computeAvailableLimit = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return 0;
      const used = filteredExpenses.value
        .filter((exp) => exp.creditCardId === card.id)
        .reduce((sum, exp) => sum + outstandingValue(exp), 0);
      return card.limit - used;
    };

    const totalAvailable = computed(() => {
      if (selectedCardId.value !== "todos") {
        const card = props.creditCards.find(
          (c) => c.id === selectedCardId.value
        );
        if (card) return card.limit - totalUsed.value;
        return 0;
      }
      return props.creditCards.reduce((acc, card) => {
        const used = filteredExpenses.value
          .filter((exp) => exp.creditCardId === card.id)
          .reduce((s, e) => s + outstandingValue(e), 0);
        return acc + (card.limit - used);
      }, 0);
    });

    const totalNextDue = computed(() => totalUsed.value);

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));
    const formatData = (s) =>
      new Date(s).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    return {
      selectedCardId,
      applyFilter,
      filteredExpenses,
      totalUsed,
      totalAvailable,
      totalNextDue,
      formatCurrency,
      formatData,
      computePaymentDate,
      computeAvailableLimit,
    };
  },
};
</script>
