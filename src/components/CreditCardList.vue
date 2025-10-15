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
          <div class="summary-box">
            <p class="summary-label">Total Usado</p>
            <p class="summary-value text-red-400">
              {{ formatCurrency(totalUsed) }}
            </p>
          </div>
          <div class="summary-box">
            <p class="summary-label">Limite Disponível</p>
            <p class="summary-value text-emerald-400">
              {{ formatCurrency(totalAvailable) }}
            </p>
          </div>
          <div class="summary-box">
            <p class="summary-label">Próximo Vencimento</p>
            <p class="summary-value text-neutral-300">
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

    const firstPaymentDate = (expense) => {
      const card = props.creditCards.find((c) => c.id === expense.creditCardId);
      if (!card) return null;

      const d = new Date(expense.data);
     
      if (expense.parcelas && expense.parcelas > 1) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }

      const closing = Number(card.closingDay);
      const due = Number(card.dueDay);
      let y = d.getFullYear(),
        m = d.getMonth();
      m += d.getDate() <= closing ? 1 : 2;
      return new Date(y, m, due);
    };

    const computePaymentDate = (expense) => {
      const first = firstPaymentDate(expense);
      if (!first) return "";
      return first.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    const outstandingValue = (expense) => {
      const first = firstPaymentDate(expense);
      if (!first) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

     
      if (expense.parcelas && expense.parcelas > 1) {
        const parcela = Number(expense.valor) / Number(expense.parcelas);
        let total = 0;
        for (let i = 0; i < expense.parcelas; i++) {
          const pay = new Date(
            first.getFullYear(),
            first.getMonth() + i,
            first.getDate()
          );
          if (pay >= today) total += parcela;
        }
        return total;
      }
     
      return first >= today ? Number(expense.valor) : 0;
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

    const formatData = (dataStr) => {
      const dateObj = new Date(dataStr);
      return dateObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

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

<style scoped>
.summary-box {
  background-color: #151515;
  border: 1px solid #2a2a2a;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
}
.summary-label {
  font-size: 0.875rem;
  color: #a3a3a3;
}
.summary-value {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0.25rem;
}
</style>
