<template>
  <div class="overflow-x-auto">
    <div class="flex justify-between items-center mb-4">
      <button
        @click="prevMonth"
        class="bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
      >
        &lt;
      </button>
      <h2 class="text-lg font-bold capitalize text-gray-200">
        {{ monthYear }}
      </h2>
      <button
        @click="nextMonth"
        class="bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
      >
        &gt;
      </button>
    </div>
    <table class="min-w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-700 text-gray-200">
          <th
            v-for="day in weekDays"
            :key="day"
            class="px-2 py-1 border border-gray-600"
          >
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in calendar" :key="index">
          <td
            v-for="day in week"
            :key="day.date"
            class="h-20 border border-gray-600 relative p-2 cursor-pointer hover:bg-gray-800"
            @click="openDay(day)"
          >
            <div
              v-if="day.date"
              class="absolute top-1 left-1 text-xs font-semibold text-gray-300"
            >
              {{ day.date.getDate() }}
            </div>
            <div v-if="day.summary" class="mt-6 text-xs">
              <div class="text-greenmain" v-if="day.summary.entrada">
                +{{ day.summary.entrada.toFixed(2) }}
              </div>
              <div class="text-redmain" v-if="day.summary.saida">
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

      for (let i = startDay; i < 7; i++) {
        week[i] = {
          date: new Date(year, month, dayCounter),
          summary: this.getDaySummary(dayCounter),
        };
        dayCounter++;
      }
      weeks.push(week);

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
        new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          day
        )
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
