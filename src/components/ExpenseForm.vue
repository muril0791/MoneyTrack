<template>
  <div class="bg-cardbg max-w-2xl mx-auto rounded shadow-xl p-6 relative text-textwhite">
    <!-- Barra de Progresso -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-2">
        <!-- Passo 1 -->
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full"
          :class="currentStep >= 1 ? 'bg-greenmain text-white' : 'bg-gray-700 text-gray-400'"
        >
          1
        </div>
        <div class="w-16 h-1" :class="currentStep >= 2 ? 'bg-greenmain' : 'bg-gray-700'"></div>
        <!-- Passo 2 -->
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full"
          :class="currentStep >= 2 ? 'bg-greenmain text-white' : 'bg-gray-700 text-gray-400'"
        >
          2
        </div>
        <div class="w-16 h-1" :class="currentStep >= 3 ? 'bg-greenmain' : 'bg-gray-700'"></div>
        <!-- Passo 3 -->
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full"
          :class="currentStep >= 3 ? 'bg-greenmain text-white' : 'bg-gray-700 text-gray-400'"
        >
          3
        </div>
      </div>
      <div class="text-sm font-medium text-gray-400">
        {{ stepTitle }}
      </div>
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl font-bold"
        @click="$emit('close')"
      >
        &times;
      </button>
    </div>

    <!-- Formulário multi-etapas -->
    <form @submit.prevent="handleSubmit">
      <!-- Passo 1: Tipo, Modalidade e Data -->
      <div v-if="currentStep === 1" class="space-y-4">
        <h2 class="text-lg font-bold">Tipo, Modalidade e Data</h2>
        <div>
          <label class="block mb-1 font-medium text-gray-300">Tipo de Transação</label>
          <select
            v-model="form.tipo"
            required
            class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
          >
            <option disabled value="">Selecione</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 font-medium text-gray-300">Modalidade</label>
          <select
            v-model="form.modalidade"
            required
            class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
          >
            <option disabled value="">Selecione</option>
            <option value="avulso">Avulso</option>
            <option value="fixo">Fixo</option>
            <option value="parcelado">Parcelado</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 font-medium text-gray-300">Data do Lançamento</label>
          <input
            v-model="form.data"
            type="date"
            required
            class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
          />
        </div>
      </div>

      <!-- Passo 2: Detalhes -->
      <div v-if="currentStep === 2" class="space-y-4">
        <h2 class="text-lg font-bold">Detalhes da Transação</h2>
        <div>
          <label class="block mb-1 font-medium text-gray-300">Valor</label>
          <input
            v-model.number="form.valor"
            type="number"
            step="0.01"
            required
            class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium text-gray-300">Descrição</label>
          <input
            v-model="form.descricao"
            type="text"
            required
            class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
          />
        </div>
        <template v-if="form.tipo === 'entrada'">
          <div>
            <label class="block mb-1 font-medium text-gray-300">Fonte da Entrada</label>
            <input
              v-model="form.fonteEntrada"
              type="text"
              placeholder="Ex: Salário, Venda, etc."
              class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
            />
          </div>
        </template>
        <template v-else-if="form.tipo === 'saida'">
          <div>
            <label class="block mb-1 font-medium text-gray-300">Forma de Pagamento</label>
            <select
              v-model="form.pagamento"
              required
              class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
            >
              <option disabled value="">Selecione</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao-credito">Cartão de Crédito</option>
              <option value="cartao-debito">Cartão de Débito</option>
            </select>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-300">Categoria</label>
            <select
              v-model="form.categoria"
              required
              class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
            >
              <option disabled value="">Selecione</option>
              <option value="alimentacao">Alimentação</option>
              <option value="transporte">Transporte</option>
              <option value="lazer">Lazer</option>
              <option value="saude">Saúde</option>
              <option value="outros">Outros</option>
            </select>
          </div>
        </template>
        <template v-if="form.modalidade === 'fixo'">
          <div>
            <label class="block mb-1 font-medium text-gray-300">Periodicidade</label>
            <select
              v-model="form.periodicidade"
              class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
            >
              <option disabled value="">Selecione</option>
              <option value="mensal">Mensal</option>
              <option value="semanal">Semanal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </template>
        <template v-if="form.modalidade === 'parcelado'">
          <div>
            <label class="block mb-1 font-medium text-gray-300">Número de Parcelas</label>
            <input
              v-model.number="form.parcelas"
              type="number"
              min="2"
              class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-300">Data da Primeira Parcela</label>
            <input
              v-model="form.dataPrimeiraParcela"
              type="date"
              class="w-full border border-gray-600 bg-transparent rounded px-3 py-2 text-textwhite focus:outline-none focus:ring-2 focus:ring-greenmain"
            />
          </div>
        </template>
      </div>

      <!-- Passo 3: Revisão Final -->
      <div v-if="currentStep === 3" class="space-y-4">
        <h2 class="text-lg font-bold">Revisão Final</h2>
        <div class="bg-gray-800 p-4 rounded border border-gray-700 text-sm">
          <p><strong>Tipo:</strong> {{ form.tipo }}</p>
          <p><strong>Modalidade:</strong> {{ form.modalidade }}</p>
          <p><strong>Data:</strong> {{ form.data }}</p>
          <p><strong>Valor:</strong> {{ form.valor }}</p>
          <p><strong>Descrição:</strong> {{ form.descricao }}</p>
          <template v-if="form.tipo === 'entrada'">
            <p><strong>Fonte da Entrada:</strong> {{ form.fonteEntrada }}</p>
          </template>
          <template v-else>
            <p><strong>Forma de Pagamento:</strong> {{ form.pagamento }}</p>
            <p><strong>Categoria:</strong> {{ form.categoria }}</p>
          </template>
          <template v-if="form.modalidade === 'fixo'">
            <p><strong>Periodicidade:</strong> {{ form.periodicidade }}</p>
          </template>
          <template v-if="form.modalidade === 'parcelado'">
            <p><strong>Número de Parcelas:</strong> {{ form.parcelas }}</p>
            <p><strong>Data Primeira Parcela:</strong> {{ form.dataPrimeiraParcela }}</p>
          </template>
        </div>
      </div>

      <!-- Botões de Navegação -->
      <div class="flex justify-between mt-6">
        <button
          v-if="currentStep > 1"
          type="button"
          @click="prevStep"
          class="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
        >
          Voltar
        </button>
        <button
          v-if="currentStep < 3"
          type="button"
          @click="nextStep"
          class="ml-auto px-4 py-2 bg-greenmain text-white rounded hover:bg-green-600"
        >
          Próximo
        </button>
        <button
          v-if="currentStep === 3"
          type="submit"
          class="ml-auto px-4 py-2 bg-greenmain text-white rounded hover:bg-green-600"
        >
          Confirmar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";

export default {
  name: "ExpenseForm",
  emits: ["add-expense", "close"],
  setup(_, { emit }) {
    const currentStep = ref(1);
    const form = reactive({
      tipo: "",
      modalidade: "",
      data: "",
      valor: null,
      descricao: "",
      fonteEntrada: "",
      pagamento: "",
      categoria: "",
      periodicidade: "",
      parcelas: null,
      dataPrimeiraParcela: ""
    });
    const stepTitle = computed(() => {
      if (currentStep.value === 1) return "Tipo, Modalidade e Data";
      if (currentStep.value === 2) return "Detalhes da Transação";
      if (currentStep.value === 3) return "Revisão Final";
      return "";
    });
    const nextStep = () => {
      if (currentStep.value < 3) currentStep.value++;
    };
    const prevStep = () => {
      if (currentStep.value > 1) currentStep.value--;
    };
    const handleSubmit = () => {
      emit("add-expense", { ...form });
      currentStep.value = 1;
      Object.assign(form, {
        tipo: "",
        modalidade: "",
        data: "",
        valor: null,
        descricao: "",
        fonteEntrada: "",
        pagamento: "",
        categoria: "",
        periodicidade: "",
        parcelas: null,
        dataPrimeiraParcela: ""
      });
    };
    return {
      currentStep,
      form,
      stepTitle,
      nextStep,
      prevStep,
      handleSubmit
    };
  }
};
</script>
