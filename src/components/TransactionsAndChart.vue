<template>
  <section class="bg-[#1b1b1b] rounded-2xl ring-1 ring-[#2a2a2a] p-5">
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      <div>
        <h3 class="text-neutral-300 mb-3">Transações</h3>
        <div
          class="overflow-x-auto md:overflow-hidden rounded-xl ring-1 ring-[#232323]"
        >
          <table class="w-full text-sm min-w-[720px]">
            <thead class="bg-[#181818] text-neutral-400">
              <tr>
                <th class="py-3 px-4 text-left font-medium">Transação</th>
                <th class="py-3 px-4 text-left font-medium">Categoria</th>
                <th class="py-3 px-4 text-left font-medium">Tipo</th>
                <th class="py-3 px-4 text-left font-medium">Valor</th>
                <th class="py-3 px-4 text-left font-medium">Data</th>
                <th class="py-3 px-4 text-left font-medium">Saldo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#232323]">
              <tr v-for="(e, i) in firstRows" :key="i" class="bg-[#161616]">
                <td class="px-4 py-3 truncate">{{ e.descricao || "—" }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-full bg-[#1d3bff21] text-[#72a4ff] px-2 py-0.5 text-xs"
                  >
                    {{ categoryName(e.categoria) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs',
                      e.tipo === 'entrada'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300',
                    ]"
                  >
                    {{ e.tipo === "entrada" ? "Entrada" : "Saída" }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ money(e.valor) }}</td>
                <td class="px-4 py-3">{{ dateBR(e.data) }}</td>
                <td class="px-4 py-3">
                  {{ e.tipo === "entrada" ? money(e.valor) : money(0) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="min-h-[180px] lg:border-l lg:border-[#262626] lg:pl-6">
        <h3 class="text-neutral-300 mb-7">Grafico</h3>
        <div class="flex flex-col items-center">
          <ExpensePieChart
            :expenses="expenses"
            :categories="categories"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, watch } from "vue";
import ExpensePieChart from "./ExpensePieChart.vue";

export default {
  name: "TransactionsAndChart",
  components: { ExpensePieChart },
  props: {
    expenses: { type: Array, required: true },
    categories: { type: Array, default: () => [] },
  },
  setup(props) {
    const firstRows = ref([]);

    const refreshRows = () => {
      firstRows.value = (props.expenses || []).slice(0, 6);
    };

    const money = (v) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(v || 0));

    const dateBR = (s) => {
      const d = new Date(s);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    };

    const categoryName = (id) =>
      props.categories.find((c) => c.id === id)?.name || "—";

    watch(() => props.expenses, refreshRows, { immediate: true, deep: true });

    return { firstRows, money, dateBR, categoryName };
  },
};
</script>
