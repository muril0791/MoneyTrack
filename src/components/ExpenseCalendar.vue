<template>
  <div
    class="bg-[#1b1b1b] ring-1 ring-[#2a2a2a] rounded-2xl text-[#c2c3c2] p-4"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-[15px] font-semibold">Calendario</h3>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="prev"
          class="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#232323] ring-1 ring-[#2a2a2a] hover:bg-[#2a2a2a] transition"
        >
          ‹
        </button>
        <div class="min-w-[140px] text-center">
          <span class="text-emerald-400 font-semibold capitalize select-none">
            <template v-if="mode === 'day'">{{ selectedDateLabel }}</template>
            <template v-else-if="mode === 'month'"
              >{{ monthName }} de {{ currentDate.getFullYear() }}</template
            >
            <template v-else>{{ currentDate.getFullYear() }}</template>
          </span>
        </div>
        <button
          type="button"
          @click="next"
          class="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#232323] ring-1 ring-[#2a2a2a] hover:bg-[#2a2a2a] transition"
        >
          ›
        </button>
      </div>
    </div>
    <div
      class="mb-3 bg-[#232323] rounded-full p-1 flex items-center justify-between"
      role="tablist"
    >
      <button
        type="button"
        role="tab"
        @click="mode = 'day'"
        :aria-selected="mode === 'day'"
        class="px-4 py-1.5 rounded-full text-sm transition"
        :class="
          mode === 'day'
            ? 'bg-emerald-500 text-[#0f0f0f]'
            : 'text-[#e5e5e5] hover:bg-white/5'
        "
      >
        Dia
      </button>
      <button
        type="button"
        role="tab"
        @click="mode = 'month'"
        :aria-selected="mode === 'month'"
        class="px-4 py-1.5 rounded-full text-sm transition"
        :class="
          mode === 'month'
            ? 'bg-emerald-500 text-[#0f0f0f]'
            : 'text-[#e5e5e5] hover:bg-white/5'
        "
      >
        Mês
      </button>
      <button
        type="button"
        role="tab"
        @click="mode = 'year'"
        :aria-selected="mode === 'year'"
        class="px-4 py-1.5 rounded-full text-sm transition"
        :class="
          mode === 'year'
            ? 'bg-emerald-500 text-[#0f0f0f]'
            : 'text-[#e5e5e5] hover:bg-white/5'
        "
      >
        Ano
      </button>
    </div>
    <div class="content-viewport">
      <div v-if="mode === 'day'">
        <div class="rounded-xl ring-1 ring-[#2a2a2a] p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div class="bg-[#151515] ring-1 ring-[#252525] rounded-lg p-3">
              <div class="text-neutral-400">Entrada</div>
              <div class="text-emerald-400 font-semibold mt-0.5">
                {{ money(daySummary.entrada) }}
              </div>
            </div>
            <div class="bg-[#151515] ring-1 ring-[#252525] rounded-lg p-3">
              <div class="text-neutral-400">Saída</div>
              <div class="text-rose-400 font-semibold mt-0.5">
                {{ money(daySummary.saida) }}
              </div>
            </div>
            <div class="bg-[#151515] ring-1 ring-[#252525] rounded-lg p-3">
              <div class="text-neutral-400">Compra</div>
              <div class="text-violet-300 font-semibold mt-0.5">
                {{ money(daySummary.creditLaunch) }}
              </div>
            </div>
            <div class="bg-[#151515] ring-1 ring-[#252525] rounded-lg p-3">
              <div class="text-neutral-400">Pagamento</div>
              <div class="text-amber-300 font-semibold mt-0.5">
                {{ money(daySummary.creditPayment) }}
              </div>
            </div>
          </div>
          <div
            class="mt-4 max-h-56 overflow-y-auto rounded-lg ring-1 ring-[#252525]"
          >
            <table class="w-full text-sm">
              <thead class="bg-[#171717] text-neutral-400">
                <tr>
                  <th class="text-left px-3 py-2 font-medium">Descrição</th>
                  <th class="text-left px-3 py-2 font-medium">Tipo</th>
                  <th class="text-right px-3 py-2 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#242424]">
                <tr
                  v-for="(e, i) in expensesOfSelectedDate"
                  :key="i"
                  class="bg-[#161616]"
                >
                  <td class="px-3 py-2">{{ e.descricao || "—" }}</td>
                  <td class="px-3 py-2">
                    <span
                      :class="
                        e.tipo === 'entrada'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      "
                      >{{ e.tipo }}</span
                    >
                  </td>
                  <td class="px-3 py-2 text-right">{{ money(e.valor) }}</td>
                </tr>
                <tr v-if="expensesOfSelectedDate.length === 0">
                  <td
                    colspan="3"
                    class="px-3 py-6 text-center text-neutral-500"
                  >
                    Sem lançamentos neste dia.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else-if="mode === 'month'">
        <div class="overflow-x-auto">
          <table class="w-full calendar-table select-none">
            <thead>
              <tr>
                <th v-for="day in weekDays" :key="day" class="calendar-th">
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, wIndex) in calendar" :key="wIndex">
                <td
                  v-for="(day, dIndex) in week"
                  :key="dIndex"
                  class="calendar-td"
                  :class="{
                    'opacity-60': !day.date,
                    'cursor-pointer hover:bg-white/5': !!day.date,
                  }"
                  @click="openDay(day)"
                >
                  <div v-if="day.date" class="flex flex-col items-center gap-1">
                    <div class="calendar-day">{{ day.date.getDate() }}</div>
                    <div v-if="day.summary" class="calendar-summary">
                      <div v-if="day.summary.entrada" class="summary-entrada">
                        +{{ day.summary.entrada.toFixed(2) }}
                      </div>
                      <div v-if="day.summary.saida" class="summary-saida">
                        -{{ day.summary.saida.toFixed(2) }}
                      </div>
                      <div
                        v-if="day.summary.creditLaunch"
                        class="credit-launch"
                      >
                        {{ day.summary.creditLaunch.toFixed(2) }}
                      </div>
                      <div
                        v-if="day.summary.creditPayment"
                        class="credit-payment"
                      >
                        {{ day.summary.creditPayment.toFixed(2) }}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            v-for="m in 12"
            :key="m"
            type="button"
            class="text-left bg-[#151515] ring-1 ring-[#252525] rounded-xl p-3 hover:bg-[#1a1a1a] transition"
            @click="goToMonth(m - 1)"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="capitalize font-semibold text-neutral-200">{{
                monthNameOf(m - 1)
              }}</span>
              <span class="text-xs text-neutral-500">{{
                currentDate.getFullYear()
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div class="text-neutral-400">Entrada</div>
                <div class="text-emerald-400 font-semibold mt-0.5">
                  {{ money(yearSummaryByMonth[m - 1]?.entrada || 0) }}
                </div>
              </div>
              <div>
                <div class="text-neutral-400">Saída</div>
                <div class="text-rose-400 font-semibold mt-0.5">
                  {{ money(yearSummaryByMonth[m - 1]?.saida || 0) }}
                </div>
              </div>
              <div>
                <div class="text-neutral-400">Compra</div>
                <div class="text-violet-300 font-semibold mt-0.5">
                  {{ money(yearSummaryByMonth[m - 1]?.creditLaunch || 0) }}
                </div>
              </div>
              <div>
                <div class="text-neutral-400">Pagamento</div>
                <div class="text-amber-300 font-semibold mt-0.5">
                  {{ money(yearSummaryByMonth[m - 1]?.creditPayment || 0) }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpenseCalendar",
  props: {
    expenses: { type: Array, default: () => [] },
    creditCards: { type: Array, default: () => [] },
    compact: { type: Boolean, default: false },
  },
  data() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      mode: "month",
      currentDate: new Date(today),
      selectedDate: new Date(today),
    };
  },
  computed: {
    weekDays() {
      return ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    },
    monthName() {
      return this.currentDate.toLocaleDateString("pt-BR", { month: "long" });
    },
    selectedDateLabel() {
      return this.selectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
    calendar() {
      const y = this.currentDate.getFullYear();
      const m = this.currentDate.getMonth();
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 0);
      const start = first.getDay();
      const total = last.getDate();
      const weeks = [];
      let week = new Array(7).fill({ date: null, summary: null });
      let day = 1;
      for (let i = start; i < 7; i++) {
        const dt = new Date(y, m, day);
        week[i] = { date: dt, summary: this.getDaySummaryByDate(dt) };
        day++;
      }
      weeks.push(week);
      while (day <= total) {
        week = [];
        for (let i = 0; i < 7; i++) {
          if (day <= total) {
            const dt = new Date(y, m, day);
            week.push({ date: dt, summary: this.getDaySummaryByDate(dt) });
            day++;
          } else {
            week.push({ date: null, summary: null });
          }
        }
        weeks.push(week);
      }
      return weeks;
    },
    expensesOfSelectedDate() {
      const key = this.formatDate(this.selectedDate);
      return this.expenses.filter((e) => e.data === key);
    },
    daySummary() {
      return this.summarizeList(this.expensesOfSelectedDate);
    },
    yearSummaryByMonth() {
      const y = this.currentDate.getFullYear();
      const byMonth = Array.from({ length: 12 }, () => ({
        entrada: 0,
        saida: 0,
        creditLaunch: 0,
        creditPayment: 0,
      }));
      for (const e of this.expenses) {
        const d = new Date(e.data);
        if (d.getFullYear() !== y) continue;
        const m = d.getMonth();
        const s = this.getDaySummaryByDate(d);
        byMonth[m].entrada += s.entrada;
        byMonth[m].saida += s.saida;
        byMonth[m].creditLaunch += s.creditLaunch;
        byMonth[m].creditPayment += s.creditPayment;
      }
      return byMonth;
    },
  },
  methods: {
    money(v) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));
    },
    formatDate(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    },
    monthNameOf(m) {
      return new Date(2000, m, 1).toLocaleDateString("pt-BR", {
        month: "long",
      });
    },
    prev() {
      if (this.mode === "day") {
        this.selectedDate.setDate(this.selectedDate.getDate() - 1);
        this.selectedDate = new Date(this.selectedDate);
        this.currentDate = new Date(this.selectedDate);
      } else if (this.mode === "month") {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.currentDate = new Date(this.currentDate);
      } else {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.currentDate = new Date(this.currentDate);
      }
    },
    next() {
      if (this.mode === "day") {
        this.selectedDate.setDate(this.selectedDate.getDate() + 1);
        this.selectedDate = new Date(this.selectedDate);
        this.currentDate = new Date(this.selectedDate);
      } else if (this.mode === "month") {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.currentDate = new Date(this.currentDate);
      } else {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.currentDate = new Date(this.currentDate);
      }
    },
    goToMonth(m) {
      this.currentDate = new Date(this.currentDate.getFullYear(), m, 1);
      this.mode = "month";
    },
    openDay(dayObj) {
      if (!dayObj?.date) return;
      this.selectedDate = new Date(dayObj.date);
      this.currentDate = new Date(dayObj.date);
      this.mode = "day";
      this.$emit("open-day", this.formatDate(this.selectedDate));
    },
    clampDay(y, m, d) {
      const last = new Date(y, m + 1, 0).getDate();
      return new Date(y, m, Math.min(d, last));
    },
    nextClosingAfter(purchase, closingDay) {
      const y = purchase.getFullYear();
      const m = purchase.getMonth();
      const closeThis = this.clampDay(y, m, closingDay);
      if (purchase.getDate() >= closeThis.getDate())
        return this.clampDay(y, m + 1, closingDay);
      return closeThis;
    },
    dueDateFrom(purchase, card) {
      const closing = this.nextClosingAfter(purchase, Number(card.closingDay));
      const y = closing.getFullYear();
      const m = closing.getMonth();
      const dueMonth =
        Number(card.dueDay) > Number(card.closingDay) ? m : m + 1;
      return this.clampDay(y, dueMonth, Number(card.dueDay));
    },
    getDaySummaryByDate(dateObj) {
      const key = this.formatDate(dateObj);
      const dayExpenses = this.expenses.filter((e) => e.data === key);
      return this.summarizeList(dayExpenses, dateObj);
    },
    summarizeList(list, refDate) {
      let entrada = 0,
        saida = 0,
        creditLaunch = 0,
        creditPayment = 0;
      for (const expense of list) {
        if (expense.tipo === "entrada") {
          entrada += Number(expense.valor || 0);
          continue;
        }
        if (expense.tipo !== "saida") continue;
        if (
          expense.tipoTransacao === "cartao-credito" &&
          expense.creditCardId
        ) {
          const card = this.creditCards?.find(
            (c) => c.id === expense.creditCardId
          );
          if (card) {
            const purchase = new Date(expense.data);
            const n = Math.max(1, Number(expense.parcelas || 1));
            const parcela = Number(expense.valor || 0) / n;
            const isSameDay = refDate
              ? this.formatDate(refDate) === this.formatDate(purchase)
              : true;
            if (isSameDay) creditLaunch += Number(expense.valor || 0);
            const firstPay = this.dueDateFrom(purchase, card);
            for (let i = 0; i < n; i++) {
              const pay = new Date(
                firstPay.getFullYear(),
                firstPay.getMonth() + i,
                firstPay.getDate()
              );
              const hit = refDate
                ? this.formatDate(refDate) === this.formatDate(pay)
                : false;
              if (hit) creditPayment += parcela;
            }
            continue;
          }
        }
        saida += Number(expense.valor || 0);
      }
      return { entrada, saida, creditLaunch, creditPayment };
    },
  },
};
</script>

<style scoped>
.content-viewport {
  max-height: 22rem;
  overflow-y: auto;
  padding-right: 0.25rem;
}
.content-viewport::-webkit-scrollbar {
  width: 8px;
}
.content-viewport::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 999px;
}
.content-viewport::-webkit-scrollbar-track {
  background: transparent;
}
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
.calendar-summary {
  display: grid;
  grid-auto-flow: row;
  gap: 2px;
  font-size: 0.68rem;
  line-height: 0.8rem;
}
.summary-entrada {
  color: #34d399;
}
.summary-saida {
  color: #f87171;
}
.credit-launch {
  color: #a78bfa;
}
.credit-payment {
  color: #fbbf24;
}
</style>
