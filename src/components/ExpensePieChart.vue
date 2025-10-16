<template>
  <div ref="wrap" class="w-full  font-sans">
    <canvas ref="cv"></canvas>

    <div class="mt-10 flex flex-wrap justify-center gap-4 text-xs text-neutral-300">
      <div v-for="(label, i) in currentLabels" :key="i" class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: currentColors[i] }"></span>
        {{ label }}
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
  props: {
    expenses: { type: Array, default: () => [] },
    categories: { type: Array, default: () => [] },
  },
  setup(props) {
    const wrap = ref(null);
    const cv = ref(null);
    let chart, ro;

    const ringBg = "#2a2a2a";
    const currentLabels = ref([]);
    const currentColors = ref([]);

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
      const categorias = {};
      props.expenses.forEach((e) => {
        if (!e.categoria) return;
        const catId = e.categoria;
        const valor = Number(e.valor || 0);
        if (!categorias[catId]) categorias[catId] = 0;
        categorias[catId] += valor;
      });

      const labels = Object.keys(categorias).map((id) => {
        const cat = props.categories.find((c) => String(c.id) === id);
        return cat?.name || "Sem categoria";
      });
      const values = Object.values(categorias);
      return { labels, values };
    };

    const generateColors = (count) => {
      const baseColors = [
        "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899",
        "#22d3ee", "#14b8a6", "#f97316", "#84cc16", "#eab308", "#e11d48"
      ];
      return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
    };

    const money = (v) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
        .format(Number(v || 0));

    const draw = () => {
      if (!cv.value || !wrap.value) return;

      const { dpr } = measure();
      const { labels, values } = getData();
      const total = values.reduce((a, b) => a + b, 0);
      const dataArray = total === 0 ? [1] : values;
      const colors = total === 0 ? ["#444"] : generateColors(values.length);

      currentLabels.value = labels;
      currentColors.value = colors;

      if (chart) chart.destroy();

      chart = new Chart(cv.value.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: total === 0 ? ["—"] : labels,
          datasets: [
            {
              data: dataArray,
              backgroundColor: colors,
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          devicePixelRatio: dpr,
          animation: { duration: 250 },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  return `${label}: ${money(value)}`;
                },
              },
            },
          },
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
    watch(
      () => props.categories,
      () => draw(),
      { deep: true }
    );

    return { wrap, cv, currentColors, currentLabels };
  },
};
</script>
