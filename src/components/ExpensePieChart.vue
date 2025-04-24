<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export default {
  name: "ExpensePieChart",
  props: { expenses: Array },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const updateChart = () => {
      if (!chartCanvas.value) return;

      const entradas = props.expenses
        .filter((e) => e.tipo === "entrada")
        .reduce((acc, e) => acc + Number(e.valor), 0);
      const saidas = props.expenses
        .filter((e) => e.tipo === "saida")
        .reduce((acc, e) => acc + Number(e.valor), 0);

      let data, options;

      if (entradas === 0 && saidas === 0) {
        data = {
          datasets: [
            {
              data: [1],
              backgroundColor: ["#555555"],
              borderWidth: 0,
            },
          ],
        };
        options = {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
          cutout: "80%",
          maintainAspectRatio: false,
        };
      } else {
        data = {
          datasets: [
            {
              data: [entradas, saidas],
              backgroundColor: ["#3ecf00", "#e93030"],
              borderWidth: 0,
            },
          ],
        };
        options = {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#c2c3c2" },
            },
          },
          cutout: "80%",
          maintainAspectRatio: false,
        };
      }

      if (chartInstance) {
        chartInstance.data = data;
        chartInstance.options = options;
        chartInstance.update();
      } else {
        chartInstance = new Chart(chartCanvas.value, {
          type: "doughnut",
          data,
          options,
        });
      }
    };

    onMounted(updateChart);
    watch(() => props.expenses, updateChart, { deep: true });

    return { chartCanvas };
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 500px; 
  margin: 0 auto;
  padding: 1rem;
}

.chart-container canvas {
  width: 100% !important;
  height: auto !important;
}


@media (max-width: 480px) {
  .chart-container {
    max-width: 90%;
    padding: 0.5rem;
  }
}
</style>
