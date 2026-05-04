<template>
  <section
    class="bg-[#1b1b1b] rounded-3xl ring-1 ring-[#2a2a2a] font-sans h-full flex flex-col overflow-hidden"
  >
    <!-- Top Section: Balance & Detailed Chart -->
    <div class="w-full pt-6 px-4 flex flex-col lg:flex-row gap-4">
      <!-- Left Side: Main Balance -->
      <div class="flex-shrink-0">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-semibold">Saldo total disponível</h3>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-baseline gap-2">
            <span class="text-neutral-600 text-xl md:text-2xl font-light">R$</span>
            <span class="text-5xl md:text-8xl font-semibold text-white tracking-[-0.05em]">
              {{ formatCurrency(balance) }}
            </span>
          </div>
          
          <div 
            :class="isUp ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'"
            class="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold h-fit mt-4"
          >
            <span>{{ percent }}%</span>
            <svg v-if="isUp" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <svg v-else class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Right Side: Comparison Chart -->
      <div class="flex-1 min-h-[180px] relative mt-4 lg:mt-0">
        <canvas ref="cv"></canvas>
      </div>
    </div>

    <!-- Legend -->
    <div class="px-4 mt-2 flex justify-center lg:justify-end gap-4 md:gap-6">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full border border-white/20 bg-emerald-500"></span>
        <span class="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Entradas</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full border border-white/20 bg-rose-500"></span>
        <span class="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Saídas</span>
      </div>
    </div>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Bottom Section: Details -->
    <div class="w-full px-4 pb-6 mt-4">
      <div class="grid grid-cols-3 gap-4 md:gap-24 text-center">
        <!-- Entrada -->
        <div class="space-y-1">
          <p class="text-neutral-500 text-[11px] font-semibold uppercase tracking-widest">Entrada</p>
          <p class="text-xl md:text-[32px] font-semibold text-emerald-400 tracking-tight">
            <span class="text-[10px] md:text-sm opacity-40 mr-0.5">R$</span>{{ numberOnly(totalIn) }}
          </p>
        </div>

        <!-- Saida -->
        <div class="space-y-1">
          <p class="text-neutral-500 text-[11px] font-semibold uppercase tracking-widest">Saída</p>
          <p class="text-xl md:text-[32px] font-semibold text-rose-400 tracking-tight">
            <span class="text-[10px] md:text-sm opacity-40 mr-0.5">R$</span>{{ numberOnly(totalOut) }}
          </p>
        </div>

        <!-- Balanço -->
        <div class="space-y-1">
          <div class="flex items-center justify-center gap-2">
            <p class="text-neutral-500 text-[11px] font-semibold uppercase tracking-widest">Balanço</p>
            <div 
              :class="isUp ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'"
              class="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold"
            >
              <span>{{ percent }}%</span>
            </div>
          </div>
          <p 
            class="text-xl md:text-[32px] font-semibold tracking-tight"
            :class="isUp ? 'text-emerald-400' : 'text-rose-400'"
          >
            <span class="text-[10px] md:text-sm opacity-40 mr-0.5">R$</span>{{ numberOnly(balance) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { 
  Chart, 
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Filler,
  Tooltip
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

export default {
  name: "SummaryCard",
  props: {
    expenses: { type: Array, required: true },
    creditCards: { type: Array, default: () => [] },
    filter: { type: Object, default: () => ({ mode: 'month', currentDate: new Date() }) }
  },
  setup(props) {
    const cv = ref(null);
    let chart = null;

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
      const dueMonth = Number(card.dueDay) > Number(card.closingDay) ? m : m + 1;
      return clampDay(y, dueMonth, Number(card.dueDay));
    };

    const isSameMonth = (d1, d2) => 
      d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

    const totalIn = computed(() => {
      const { mode, currentDate } = props.filter;
      return props.expenses
        .filter((e) => {
          if (e.tipo !== "entrada") return false;
          if (mode === 'all') return true;
          const [y, m, d] = e.data.split('-').map(Number);
          const expDate = new Date(y, m - 1, d);
          return isSameMonth(expDate, currentDate);
        })
        .reduce((sum, e) => sum + (Number(e.valor) || 0), 0);
    });

    const totalOut = computed(() => {
      const { mode, currentDate } = props.filter;
      let total = 0;

      props.expenses.forEach((e) => {
        if (e.tipo !== "saida") return;
        
        if (e.tipoTransacao === "cartao-credito" && e.creditCardId) {
          const card = props.creditCards?.find(c => String(c.id) === String(e.creditCardId));
          if (card) {
            const [y, m, d] = e.data.split('-').map(Number);
            const purchase = new Date(y, m - 1, d);
            const n = Math.max(1, Number(e.parcelas || 1));
            const parcela = Number(e.valor || 0) / n;
            const firstPay = dueDateFrom(purchase, card);

            for (let i = 0; i < n; i++) {
              const payDate = new Date(firstPay.getFullYear(), firstPay.getMonth() + i, firstPay.getDate());
              if (mode === 'all' || isSameMonth(payDate, currentDate)) {
                total += parcela;
              }
            }
            return;
          }
        }
        
        // Regular expense
        const [y, m, d] = e.data.split('-').map(Number);
        const expDate = new Date(y, m - 1, d);
        if (mode === 'all' || isSameMonth(expDate, currentDate)) {
          total += Number(e.valor || 0);
        }
      });

      return total;
    });

    const balance = computed(() => totalIn.value - totalOut.value);
    const isUp = computed(() => balance.value >= 0);
    const percent = computed(() => {
      if (totalIn.value === 0) return totalOut.value > 0 ? "100" : "0";
      const p = (Math.abs(balance.value) / totalIn.value) * 100;
      return p > 100 ? "100" : p.toFixed(1);
    });

    const formatCurrency = (v) =>
      new Intl.NumberFormat("pt-BR").format(Math.abs(Number(v || 0)));
      
    const numberOnly = (v) =>
      new Intl.NumberFormat("pt-BR").format(Number(v || 0));

    const draw = () => {
      if (!cv.value) return;

      const dataIn = [];
      const dataOut = [];
      const labels = [];
      const { mode, currentDate } = props.filter;
      
      const dailyData = {};
      const monthlyData = {};

      if (mode === 'month' || mode === 'day') {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        props.expenses.forEach(e => {
          if (!e.data) return;
          
          if (e.tipo === 'entrada') {
            const [y, m, d] = e.data.split('-').map(Number);
            const expDate = new Date(y, m - 1, d);
            
            if (mode === 'month' || mode === 'day') {
              if (isSameMonth(expDate, currentDate)) {
                if (!dailyData[d]) dailyData[d] = { in: 0, out: 0 };
                dailyData[d].in += Number(e.valor || 0);
              }
            } else {
              if (y === currentDate.getFullYear()) {
                if (!monthlyData[m]) monthlyData[m] = { in: 0, out: 0 };
                monthlyData[m].in += Number(e.valor || 0);
              }
            }
            return;
          }

          // Handling Saida (including Credit Card)
          if (e.tipoTransacao === "cartao-credito" && e.creditCardId) {
            const card = props.creditCards?.find(c => String(c.id) === String(e.creditCardId));
            if (card) {
              const [y, m, d] = e.data.split('-').map(Number);
              const purchase = new Date(y, m - 1, d);
              const n = Math.max(1, Number(e.parcelas || 1));
              const parcela = Number(e.valor || 0) / n;
              const firstPay = dueDateFrom(purchase, card);

              for (let i = 0; i < n; i++) {
                const payDate = new Date(firstPay.getFullYear(), firstPay.getMonth() + i, firstPay.getDate());
                const pY = payDate.getFullYear();
                const pM = payDate.getMonth() + 1;
                const pD = payDate.getDate();

                if (mode === 'month' || mode === 'day') {
                  if (isSameMonth(payDate, currentDate)) {
                    if (!dailyData[pD]) dailyData[pD] = { in: 0, out: 0 };
                    dailyData[pD].out += parcela;
                  }
                } else {
                  if (pY === currentDate.getFullYear()) {
                    if (!monthlyData[pM]) monthlyData[pM] = { in: 0, out: 0 };
                    monthlyData[pM].out += parcela;
                  }
                }
              }
              return;
            }
          }

          // Regular expense
          const [y, m, d] = e.data.split('-').map(Number);
          const expDate = new Date(y, m - 1, d);
          if (mode === 'month' || mode === 'day') {
            if (isSameMonth(expDate, currentDate)) {
              if (!dailyData[d]) dailyData[d] = { in: 0, out: 0 };
              dailyData[d].out += Number(e.valor || 0);
            }
          } else {
            if (y === currentDate.getFullYear()) {
              if (!monthlyData[m]) monthlyData[m] = { in: 0, out: 0 };
              monthlyData[m].out += Number(e.valor || 0);
            }
          }
        });

        for (let i = 1; i <= daysInMonth; i++) {
          dataIn.push(dailyData[i]?.in || 0);
          dataOut.push(dailyData[i]?.out || 0);
          labels.push(i % 5 === 0 || i === 1 || i === daysInMonth ? i : "");
        }
      } else {
        const year = currentDate.getFullYear();
        // (expenses loop already done above)
        for (let i = 1; i <= 12; i++) {
          dataIn.push(monthlyData[i]?.in || 0);
          dataOut.push(monthlyData[i]?.out || 0);
          labels.push(new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(year, i - 1, 1)));
        }
      }

      if (chart) chart.destroy();

      const ctx = cv.value.getContext("2d");
      const gradIn = ctx.createLinearGradient(0, 0, 0, 200);
      gradIn.addColorStop(0, "rgba(16, 185, 129, 0.1)");
      gradIn.addColorStop(1, "rgba(16, 185, 129, 0)");

      const gradOut = ctx.createLinearGradient(0, 0, 0, 200);
      gradOut.addColorStop(0, "rgba(244, 63, 94, 0.1)");
      gradOut.addColorStop(1, "rgba(244, 63, 94, 0)");

      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Entradas",
              data: dataIn,
              borderColor: "#10b981",
              backgroundColor: gradIn,
              fill: true,
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: "#10b981",
              pointBorderColor: "#fff",
              pointBorderWidth: 1.5,
              pointRadius: (context) => dataIn[context.dataIndex] > 0 ? 3.5 : 0,
              pointHoverRadius: 6,
            },
            {
              label: "Saídas",
              data: dataOut,
              borderColor: "#f43f5e",
              backgroundColor: gradOut,
              fill: true,
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: "#f43f5e",
              pointBorderColor: "#fff",
              pointBorderWidth: 1.5,
              pointRadius: (context) => dataOut[context.dataIndex] > 0 ? 3.5 : 0,
              pointHoverRadius: 6,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: '#1b1b1b',
              titleColor: '#737373',
              bodyColor: '#fff',
              borderColor: '#2a2a2a',
              borderWidth: 1,
              callbacks: {
                title: (context) => {
                  const label = context[0].label;
                  if (mode === 'month' || mode === 'day') return `Dia ${label || context[0].dataIndex + 1}`;
                  return label;
                },
                label: (context) => {
                  return `${context.dataset.label}: R$ ${Number(context.raw).toLocaleString('pt-BR')}`;
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              reverse: true,
              grid: { display: false },
              ticks: { color: '#525252', font: { size: 9 }, maxRotation: 0, autoSkip: false }
            },
            y: {
              display: true,
              position: 'right',
              grid: { color: 'rgba(255,255,255,0.03)', drawTicks: false },
              ticks: { 
                color: '#525252', 
                font: { size: 9 },
                callback: (v) => v >= 1000 ? (v/1000).toFixed(0) + 'k' : v
              },
              grace: '15%'
            }
          }
        }
      });
    };

    onMounted(() => {
      draw();
      window.addEventListener('resize', draw);
    });

    onBeforeUnmount(() => {
      if (chart) chart.destroy();
      window.removeEventListener('resize', draw);
    });

    watch([() => props.expenses, () => props.filter], () => draw(), { deep: true });

    return { cv, totalIn, totalOut, balance, isUp, percent, formatCurrency, numberOnly };
  },
};
</script>
