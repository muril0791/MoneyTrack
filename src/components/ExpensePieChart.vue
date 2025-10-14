<template>
  <div ref="wrap" class="w-full h-72 lg:h-80 font-sans">
    <canvas ref="cv"></canvas>

    <!-- legenda simples -->
    <div class="mt-3 flex items-center gap-6 justify-center text-xs text-neutral-300">
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full" :style="{ background: colorIn }"></span>
        Entrada
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full" :style="{ background: colorOut }"></span>
        Saída
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Chart, DoughnutController, ArcElement, Tooltip } from "chart.js";
Chart.register(DoughnutController, ArcElement, Tooltip);

export default {
  name: "ExpensePieChart",
  props: { expenses: { type: Array, default: () => [] } },
  setup(props) {
    const wrap = ref(null);
    const cv = ref(null);
    let chart, ro;

    const colorIn = "#3ecf00";   
    const colorOut = "#e93030"; 
    const ringBg = "#2a2a2a";

    const safeDPR = () => Math.min(window.devicePixelRatio || 1, 2);

    const measure = () => {
      const w = Math.max(wrap.value?.clientWidth || 0, 120);
      const h = Math.max(wrap.value?.clientHeight || 0, 120);
      const dpr = safeDPR();
      cv.value.width = Math.floor(w * dpr);
      cv.value.height = Math.floor(h * dpr);
      cv.value.style.width = w + "px";
      cv.value.style.height = h + "px";
      return { w, h, dpr };
    };

    const getData = () => {
      const entradas = props.expenses
        .filter(e => e.tipo === "entrada")
        .reduce((a, b) => a + Number(b.valor || 0), 0);
      const saidas = props.expenses
        .filter(e => e.tipo === "saida")
        .reduce((a, b) => a + Number(b.valor || 0), 0);
      const total = entradas + saidas;
      return { entradas, saidas, total };
    };

    const money = (v) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
        .format(Number(v || 0));

    const draw = () => {
      if (!cv.value || !wrap.value) return;

      const { dpr } = measure();
      const { entradas, saidas, total } = getData();

      const dataArray = total === 0 ? [1] : [entradas, saidas];
      const colors = total === 0 ? ["#444"] : [colorIn, colorOut];

      if (chart) chart.destroy();

      chart = new Chart(cv.value.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: total === 0 ? ["—"] : ["Entrada", "Saída"],
          datasets: [
            {
              data: dataArray,
              backgroundColor: colors,
              borderWidth: 0,
              hoverOffset: 2,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          devicePixelRatio: dpr,
          animation: { duration: 250 },
          plugins: { legend: { display: false }, tooltip: { enabled: true } },
          cutout: "80%",               
          elements: { arc: { borderRadius: 0 } }, 
        },
        plugins: [
        
          {
            id: "track",
            beforeDraw(c) {
              const { ctx, chartArea } = c;
              const arc = c.getDatasetMeta(0)?.data?.[0];
              if (!arc || !chartArea) return;
              const r = Math.min(chartArea.width, chartArea.height) / 2 - 6;
              ctx.save();
              ctx.lineWidth = 18;
              ctx.strokeStyle = ringBg;
              ctx.beginPath();
              ctx.arc(arc.x, arc.y, r, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            },
          },
    
          {
            id: "segmentShadow",
            beforeDatasetDraw(c, args) {
              const { ctx } = c;
              ctx.save();
              ctx.shadowColor = "rgba(0,0,0,.35)";
              ctx.shadowBlur = 12;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 2;
            },
            afterDatasetDraw(c) {
              c.ctx.restore();
            },
          },
        
          {
            id: "centerText",
            afterDraw(c) {
              const { ctx } = c;
              const meta = c.getDatasetMeta(0);
              const arc = meta?.data?.[0];
              if (!arc) return;
              const { entradas, saidas, total } = getData();
              const pctEntrada = total ? Math.round((entradas / total) * 100) : 0;

              ctx.save();
              ctx.fillStyle = "#e5e5e5";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              ctx.font = "600 16px Inter, ui-sans-serif, system-ui";
              ctx.fillText("Total", arc.x, arc.y - 12);

              ctx.font = "700 20px Inter, ui-sans-serif, system-ui";
              ctx.fillText(money(total), arc.x, arc.y + 12);

              if (total) {
                ctx.font = "600 12px Inter, ui-sans-serif, system-ui";
                ctx.fillStyle = "#9ca3af";
                ctx.fillText(`${pctEntrada}% entrada`, arc.x, arc.y + 34);
              }

              ctx.restore();
            },
          },
        ],
      });
    };

    const debounce = (fn, ms = 120) => {
      let t;
      return () => {
        clearTimeout(t);
        t = setTimeout(fn, ms);
      };
    };
    const schedule = debounce(draw);

    onMounted(() => {
      draw();
      if ("ResizeObserver" in window) {
        ro = new ResizeObserver(schedule);
        ro.observe(wrap.value);
      }
      window.addEventListener("orientationchange", schedule);
    });

    onBeforeUnmount(() => {
      if (chart) chart.destroy();
      if (ro) ro.disconnect();
      window.removeEventListener("orientationchange", schedule);
    });

    watch(
      () => props.expenses,
      () => draw(),
      { deep: true }
    );

    return { wrap, cv, colorIn, colorOut };
  },
};
</script>
