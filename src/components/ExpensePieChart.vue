<template>
  <div class="flex justify-center">
    <div class="max-w-md">
      <canvas ref="chartCanvas"></canvas>
    </div>
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
      
      // Calcula o total de entradas e saídas
      const entradas = props.expenses
        .filter((e) => e.tipo === "entrada")
        .reduce((acc, e) => acc + Number(e.valor), 0);
      const saidas = props.expenses
        .filter((e) => e.tipo === "saida")
        .reduce((acc, e) => acc + Number(e.valor), 0);

      let data, options;

      // Se não houver dados, exibe gráfico branco e oculta a legenda
      if (entradas === 0 && saidas === 0) {
        data = {
          datasets: [
            {
              data: [1],
              backgroundColor: ["#ffffff"]
            }
          ]
        };
        options = {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          cutout: "80%"
        };
      } else {
        data = {
          datasets: [
            {
              data: [entradas, saidas],
              backgroundColor: ["#3ecf00", "#e93030"]
            }
          ]
        };
        options = {
          responsive: true,
          plugins: {
            legend: { position: "bottom", labels: { color: "#c2c3c2" } }
          },
          cutout: "80%"
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
          options
        });
      }
    };

    onMounted(updateChart);
    watch(() => props.expenses, updateChart, { deep: true });

    return { chartCanvas };
  }
};
</script>
