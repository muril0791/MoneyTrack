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
      <button
        type="button"
        role="tab"
        @click="mode = 'all'"
        :aria-selected="mode === 'all'"
        class="px-4 py-1.5 rounded-full text-sm transition"
        :class="
          mode === 'all'
            ? 'bg-emerald-500 text-[#0f0f0f]'
            : 'text-[#e5e5e5] hover:bg-white/5'
        "
      >
        Tudo
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
                    <div v-if="day.summary" class="flex gap-1 mt-1">
                      <div v-if="day.summary.entrada" class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20"></div>
                      <div v-if="day.summary.saida" class="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/20"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="animate-in fade-in duration-300">
        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="m in 12"
            :key="m"
            type="button"
            class="group relative text-left bg-[#151515] border border-[#252525] rounded-xl p-3 transition-all hover:border-emerald-500/30 hover:bg-[#1a1a1a]"
            :class="{ 'ring-1 ring-emerald-500/50 border-emerald-500/50': isCurrentMonth(m-1) }"
            @click="goToMonth(m - 1)"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="capitalize font-bold text-white text-[13px] tracking-tight group-hover:text-emerald-400 transition-colors">
                {{ monthNameOf(m - 1) }}
              </span>
              <span class="text-[9px] text-neutral-500 font-medium uppercase">{{ currentDate.getFullYear() }}</span>
            </div>
            
            <div class="flex items-center gap-4">
               <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span class="text-[11px] font-bold" :class="yearSummaryByMonth[m-1]?.entrada > 0 ? 'text-emerald-400' : 'text-neutral-700'">
                    {{ money(yearSummaryByMonth[m-1]?.entrada || 0).replace('R$', '').trim() }}
                  </span>
               </div>
               <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span class="text-[11px] font-bold" :class="yearSummaryByMonth[m-1]?.saida > 0 ? 'text-rose-400' : 'text-neutral-700'">
                    {{ money(yearSummaryByMonth[m-1]?.saida || 0).replace('R$', '').trim() }}
                  </span>
               </div>
            </div>

            <!-- Indicator of current month -->
            <div v-if="isCurrentMonth(m-1)" class="absolute top-1 right-1">
              <div class="w-1 h-1 rounded-full bg-emerald-500"></div>
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
  watch: {
    mode() { this.emitFilter(); },
    currentDate() { this.emitFilter(); },
    selectedDate() { this.emitFilter(); },
    expenses: { deep: true, handler() { this.emitFilter(); } }
  },
  mounted() {
    this.emitFilter();
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
      
      // We must summarize the whole list once, but filter by month in the process
      for (const e of this.expenses) {
        if (!e.data) continue;
        const [year, month, day] = e.data.split('-').map(Number);
        const purchase = new Date(year, month - 1, day);
        
        if (e.tipo === "entrada") {
          if (year === y) byMonth[month - 1].entrada += Number(e.valor || 0);
          continue;
        }

        if (e.tipo === "saida") {
          if (e.tipoTransacao === "cartao-credito" && e.creditCardId) {
            const card = this.creditCards?.find(c => String(c.id) === String(e.creditCardId));
            if (card) {
              const n = Math.max(1, Number(e.parcelas || 1));
              const parcela = Number(e.valor || 0) / n;
              const firstPay = this.dueDateFrom(purchase, card);

              if (year === y) byMonth[month - 1].creditLaunch += Number(e.valor || 0);

              for (let i = 0; i < n; i++) {
                const pay = new Date(firstPay.getFullYear(), firstPay.getMonth() + i, firstPay.getDate());
                if (pay.getFullYear() === y) {
                  byMonth[pay.getMonth()].creditPayment += parcela;
                  byMonth[pay.getMonth()].saida += parcela; // Add installment to monthly output
                }
              }
              continue;
            }
          }
          
          if (year === y) {
            byMonth[month - 1].saida += Number(e.valor || 0);
          }
        }
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
            (c) => String(c.id) === String(expense.creditCardId)
          );
          if (card) {
            const [pY, pM, pD] = expense.data.split('-').map(Number);
            const purchase = new Date(pY, pM - 1, pD);
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
        // Fallback for regular saida OR if card was not found
        saida += Number(expense.valor || 0);
      }
      return { entrada, saida, creditLaunch, creditPayment };
    },
    emitFilter() {
      this.$emit("filter-change", {
        mode: this.mode,
        currentDate: this.currentDate,
        selectedDate: this.selectedDate,
      });
    },
    isCurrentMonth(m) {
      const today = new Date();
      return (
        today.getMonth() === m &&
        today.getFullYear() === this.currentDate.getFullYear()
      );
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
