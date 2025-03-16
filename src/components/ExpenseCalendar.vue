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
  props: { expenses: Array },
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
      let weeks = [];
      let week = new Array(7).fill({ date: null, summary: null });
      let dayCounter = 1;

      // Preencher a primeira semana
      for (let i = startDay; i < 7; i++) {
        week[i] = {
          date: new Date(year, month, dayCounter),
          summary: this.getDaySummary(dayCounter),
        };
        dayCounter++;
      }
      weeks.push(week);

      // Preencher as semanas seguintes
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
      const dateStr = this.formatDate(
        new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)
      );
      const dayExpenses = this.expenses.filter((e) => e.data === dateStr);
      if (!dayExpenses.length) return null;
      const entrada = dayExpenses
        .filter((e) => e.tipo === "entrada")
        .reduce((acc, e) => acc + Number(e.valor), 0);
      const saida = dayExpenses
        .filter((e) => e.tipo === "saida")
        .reduce((acc, e) => acc + Number(e.valor), 0);
      return { entrada, saida };
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
      if (day.date) {
        this.$emit("open-day", this.formatDate(day.date));
      }
    },
  },
};
</script>

<style scoped>
:root {
  --cardbg: #161716;
  --mainbg: #0f0e11;
  --greenmain: #3ecf00;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
  --textgray: #aaaaaa;
}

.calendar-container {
  overflow-x: auto;
  padding: 1rem;
  background-color: var(--cardbg);
  border-radius: 4px;
  color: var(--textwhite);
  font-family: Roboto, sans-serif;
}

/* Cabeçalho do calendário */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.calendar-title {
  font-size: 1rem;
  font-weight: bold;
  margin: 0.5rem 0;
  text-transform: capitalize;
  color: var(--textwhite);
}
.calendar-nav {
  background-color: var(--cardbg);
  color: var(--textwhite);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.calendar-nav:hover {
  background-color: var(--greenmain);
}

/* Tabela do calendário */
.calendar-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}
.calendar-th {
  border: 1px solid var(--cardbg);
  padding: 0.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  font-weight: bold;
  background-color: var(--cardbg);
  color: var(--textwhite);
}
.calendar-table td {
  border: 1px solid var(--cardbg);
  padding: 0.5rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 4rem;
}
.calendar-table td:hover {
  background-color: var(--mainbg);
}
.calendar-day {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--textgray);
}
.calendar-summary {
  margin-top: 2.5rem;
  font-size: 0.75rem;
}
.summary-entrada {
  color: var(--greenmain);
}
.summary-saida {
  color: var(--redmain);
}

/* Responsividade para telas pequenas */
@media (max-width: 480px) {
  .calendar-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  .calendar-nav {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
  .calendar-title {
    font-size: 0.9rem;
  }
  .calendar-table td {
    height: 3.5rem;
    padding: 0.25rem;
  }
  .calendar-day {
    font-size: 0.65rem;
  }
  .calendar-summary {
    font-size: 0.65rem;
  }
}
</style>
