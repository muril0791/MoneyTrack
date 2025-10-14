<template>
  <div
    class="text-[#c2c3c2] p-4"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-[15px] font-semibold">Calendario</h3>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="prevMonth"
          class="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#232323] ring-1 ring-[#2a2a2a] hover:bg-[#2a2a2a] transition"
          aria-label="Mês anterior"
        >
          ‹
        </button>

        <div class="min-w-[88px]">
          <span class="text-emerald-400 font-semibold capitalize text-center">
            {{ monthName }}
          </span>
        </div>

        <button
          type="button"
          @click="nextMonth"
          class="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#232323] ring-1 ring-[#2a2a2a] hover:bg-[#2a2a2a] transition"
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Week header -->
    <table class="w-full calendar-table select-none">
      <thead>
        <tr>
          <th v-for="day in weekDays" :key="day" class="calendar-th">
            {{ day }}
          </th>
        </tr>
      </thead>

      <!-- Days -->
      <tbody>
        <tr v-for="(week, wIndex) in calendar" :key="wIndex">
          <td
            v-for="(day, dIndex) in week"
            :key="dIndex"
            class="calendar-td"
            :class="{
              'opacity-60': !day.date,
              'cursor-pointer hover:bg-white/5': !!day.date
            }"
            @click="openDay(day)"
          >
            <div v-if="day.date" class="flex flex-col items-center gap-1">
              <div class="calendar-day">
                {{ day.date.getDate() }}
              </div>

              <div v-if="day.summary" class="calendar-summary">
                <div
                  v-if="day.summary.entrada"
                  class="summary-entrada"
                  title="Entradas"
                >
                  +{{ day.summary.entrada.toFixed(2) }}
                </div>
                <div
                  v-if="day.summary.saida"
                  class="summary-saida"
                  title="Saídas"
                >
                  -{{ day.summary.saida.toFixed(2) }}
                </div>
                <div
                  v-if="day.summary.creditLaunch"
                  class="credit-launch"
                  title="Compra no cartão"
                >
                  {{ day.summary.creditLaunch.toFixed(2) }}
                </div>
                <div
                  v-if="day.summary.creditPayment"
                  class="credit-payment"
                  title="Pagamento de fatura / parcela"
                >
                  {{ day.summary.creditPayment.toFixed(2) }}
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Segmented control (decorativo, mantendo compatibilidade) -->
    <div
      class="mt-3 bg-[#232323] rounded-full p-1 flex items-center justify-between"
      role="tablist"
      aria-label="Modo de visualização"
    >
      <button
        type="button"
        role="tab"
        @click="mode = 'year'"
        :aria-selected="mode==='year'"
        class="px-4 py-1.5 rounded-full text-sm transition"
        :class="
          mode==='year'
            ? 'bg-emerald-500 text-[#0f0f0f]'
            : 'text-[#e5e5e5] hover:bg-white/5'
        "
      >
        Ano
      </button>
      <button
        type="button"
        role="tab"
        @click="mode = 'month'"
        :aria-selected="mode==='month'"
        class="px-4 py-1.5 rounded-full text-sm transition"
        :class="
          mode==='month'
            ? 'bg-emerald-500 text-[#0f0f0f]'
            : 'text-[#e5e5e5] hover:bg-white/5'
        "
      >
        Mês
      </button>
      <button
        type="button"
        role="tab"
        @click="mode = 'week'"
        :aria-selected="mode==='week'"
        class="px-4 py-1.5 rounded-full text-sm transition"
        :class="
          mode==='week'
            ? 'bg-emerald-500 text-[#0f0f0f]'
            : 'text-[#e5e5e5] hover:bg-white/5'
        "
      >
        Semana
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpenseCalendar",
  props: { expenses: Array, creditCards: Array, compact: { type: Boolean, default: false } },
  data() {
    return {
      currentDate: new Date(),
      weekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      mode: "month", // UI apenas; mantém sua geração mensal
    };
  },
  computed: {
    monthYear() {
      return this.currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    },
    monthName() {
      return this.currentDate.toLocaleDateString("pt-BR", {
        month: "long",
      });
    },
    calendar() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDay = firstDay.getDay();
      const totalDays = lastDay.getDate();
      const weeks = [];
      let week = new Array(7).fill({ date: null, summary: null });
      let dayCounter = 1;

      // primeira semana
      for (let i = startDay; i < 7; i++) {
        week[i] = {
          date: new Date(year, month, dayCounter),
          summary: this.getDaySummary(dayCounter),
        };
        dayCounter++;
      }
      weeks.push(week);

      // semanas seguintes
      while (dayCounter <= totalDays) {
        week = [];
        for (let i = 0; i < 7; i++) {
          if (dayCounter <= totalDays) {
            week.push({
              date: new Date(year, month, dayCounter),
              summary: this.getDaySummary(dayCounter),
            });
            dayCounter++;
          } else {
            week.push({ date: null, summary: null });
          }
        }
        weeks.push(week);
      }
      return weeks;
    },
  },
  methods: {
    getDaySummary(day) {
      const dateObj = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
      const dateStr = this.formatDate(dateObj);

      const dayExpenses = this.expenses?.filter((e) => e.data === dateStr) ?? [];
      if (!dayExpenses.length) return null;

      let entrada = 0,
        saida = 0,
        creditLaunch = 0,
        creditPayment = 0;

      dayExpenses.forEach((expense) => {
        if (expense.tipo === "entrada") {
          entrada += Number(expense.valor);
        } else if (expense.tipo === "saida") {
          if (expense.tipoTransacao === "cartao-credito") {
            const card = this.creditCards?.find(
              (c) => c.id === expense.creditCardId
            );
            if (card) {
              const purchase = new Date(expense.data);
              const closing = Number(card.closingDay);
              const due = Number(card.dueDay);

              // 1º vencimento
              let firstPay;
              if (expense.parcelas && expense.parcelas > 1) {
                firstPay = new Date(
                  purchase.getFullYear(),
                  purchase.getMonth(),
                  purchase.getDate()
                );
              } else {
                let y = purchase.getFullYear(),
                  m = purchase.getMonth();
                m += purchase.getDate() <= closing ? 1 : 2;
                firstPay = new Date(y, m, due);
              }

              const parcela =
                expense.parcelas && expense.parcelas > 1
                  ? Number(expense.valor) / Number(expense.parcelas)
                  : Number(expense.valor);

              if (dateStr === this.formatDate(purchase)) {
                creditLaunch += Number(expense.valor);
              }

              const n = Math.max(1, Number(expense.parcelas || 1));
              for (let i = 0; i < n; i++) {
                const pay = new Date(
                  firstPay.getFullYear(),
                  firstPay.getMonth() + i,
                  firstPay.getDate()
                );
                if (dateStr === this.formatDate(pay)) creditPayment += parcela;
              }
            } else {
              saida += Number(expense.valor);
            }
          } else {
            saida += Number(expense.valor);
          }
        }
      });

      return { entrada, saida, creditLaunch, creditPayment };
    },
    formatDate(date) {
      const yyyy = date.getFullYear();
      const mm = (date.getMonth() + 1).toString().padStart(2, "0");
      const dd = date.getDate().toString().padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    prevMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.currentDate = new Date(this.currentDate);
    },
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.currentDate = new Date(this.currentDate);
    },
    openDay(day) {
      if (day.date) this.$emit("open-day", this.formatDate(day.date));
    },
  },
};
</script>

<style scoped>
/* Estrutura visual das células, próxima à referência */
.calendar-table {
  border-collapse: collapse;
}
.calendar-th {
  padding: 0.35rem 0;
  font-size: 0.8rem;
  color: #a7a7a7;
  font-weight: 500;
}
.calendar-td {
  height: 42px;
  text-align: center;
  border-top: 1px solid #202020;
  border-bottom: 1px solid #202020;
  vertical-align: middle;
}
.calendar-day {
  font-weight: 600;
  color: #d2d2d2;
  font-size: 0.9rem;
  line-height: 1rem;
}

/* mini resumos */
.calendar-summary {
  display: grid;
  grid-auto-flow: row;
  gap: 2px;
  font-size: 0.68rem;
  line-height: 0.8rem;
}
.summary-entrada {
  color: #34d399; /* emerald-400 */
}
.summary-saida {
  color: #f87171; /* red-400 */
}
.credit-launch {
  color: #a78bfa; /* purple-400 */
}
.credit-payment {
  color: #fbbf24; /* amber-400 */
}

/* capitalização do mês fica clean em diferentes locales */
:where(.capitalize) { text-transform: capitalize; }
</style>
