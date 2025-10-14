<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth" class="calendar-nav">&lt;</button>
      <h2 class="calendar-title">{{ monthYear }}</h2>
      <button @click="nextMonth" class="calendar-nav">&gt;</button>
    </div>
    <table class="calendar-table">
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
            class="calendar-cell"
            @click="openDay(day)"
          >
            <div v-if="day.date" class="calendar-day">
              {{ day.date.getDate() }}
            </div>
            <div v-if="day.summary" class="calendar-summary">
              <div v-if="day.summary.entrada" class="summary-entrada">
                +{{ day.summary.entrada.toFixed(2) }}
              </div>
              <div v-if="day.summary.saida" class="summary-saida">
                -{{ day.summary.saida.toFixed(2) }}
              </div>
              <div v-if="day.summary.creditLaunch" class="credit-launch">
                {{ day.summary.creditLaunch.toFixed(2) }}
              </div>
              <div v-if="day.summary.creditPayment" class="credit-payment">
                {{ day.summary.creditPayment.toFixed(2) }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ExpenseCalendar",
  props: { expenses:Array, creditCards:Array, compact:{type:Boolean, default:false} },
  data() {
    return {
      currentDate: new Date(),
      weekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    };
  },
  computed: {
    monthYear() {
      return this.currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
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

      const dayExpenses = this.expenses.filter((e) => e.data === dateStr);
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
                // quando parcelado, usamos a própria data como 1ª parcela
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

              // dia da compra
              if (dateStr === this.formatDate(purchase)) {
                creditLaunch += Number(expense.valor);
              }

              // cada vencimento (todas as parcelas)
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
/* Mantive sua lógica, só refinei a “pele” para bater com o mock */
.calendar-container{ padding:1rem; background:#1b1b1b; border:1px solid #2a2a2a; border-radius:16px; color:#c2c3c2; }
.calendar-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
.calendar-title{ font-size:1rem; font-weight:600; text-transform:capitalize; }
.calendar-nav{ background:#232323; border:1px solid #2a2a2a; border-radius:8px; padding:.25rem .6rem; }
.calendar-nav:hover{ background:#2a2a2a; }
.calendar-table{ width:100%; border-collapse:collapse; text-align:center; }
.calendar-th{ padding:.35rem 0; color:#a7a7a7; font-size:.8rem; }
.calendar-table td{ height:38px; border-top:1px solid #222; border-bottom:1px solid #222; }
.calendar-day{ font-weight:600; color:#d2d2d2; font-size:.85rem; }
.calendar-summary{ margin-top:.2rem; font-size:.7rem; }

:deep(.mode-bar){
  display:flex; gap:8px; background:#232323; border-radius:999px; padding:4px; margin-top:10px;
}
:deep(.mode-bar > button){
  padding:.35rem .9rem; border-radius:999px; background:transparent; color:#e5e5e5; border:none;
}
:deep(.mode-bar > button.active){ background:#22c55e; color:#0f0f0f; }
</style>