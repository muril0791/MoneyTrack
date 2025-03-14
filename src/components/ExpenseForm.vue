<template>
  <div class="expense-form-container">
   
    <div class="form-progress">
      <div class="steps">
        <div class="step" :class="{ active: currentStep >= 1 }">1</div>
        <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 2 }">2</div>
        <div class="step-line" :class="{ active: currentStep >= 3 }"></div>
        <div class="step" :class="{ active: currentStep >= 3 }">3</div>
      </div>
      <div class="step-title">{{ stepTitle }}</div>
    </div>

   
    <form @submit.prevent="handleSubmit">
     
      <div v-if="currentStep === 1" class="form-step">
        <h2 class="form-heading">Tipo, Modalidade e Data</h2>
        <div class="form-group">
          <label class="form-label">Tipo de Transação</label>
          <select v-model="form.tipo" required class="form-input">
            <option disabled value="">Selecione</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Modalidade</label>
          <select v-model="form.modalidade" required class="form-input">
            <option disabled value="">Selecione</option>
            <option value="avulso">Avulso</option>
            <option value="fixo">Fixo</option>
            <option value="parcelado">Parcelado</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Data do Lançamento</label>
          <input v-model="form.data" type="date" required class="form-input" />
        </div>
      </div>

      
      <div v-if="currentStep === 2" class="form-step">
        <h2 class="form-heading">Detalhes da Transação</h2>
        <div class="form-group">
          <label class="form-label">Valor</label>
          <input v-model.number="form.valor" type="number" step="0.01" required class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input v-model="form.descricao" type="text" required class="form-input" />
        </div>
        <template v-if="form.tipo === 'entrada'">
          <div class="form-group">
            <label class="form-label">Fonte da Entrada</label>
            <input
              v-model="form.fonteEntrada"
              type="text"
              placeholder="Ex: Salário, Venda, etc."
              class="form-input"
            />
          </div>
        </template>
        <template v-else-if="form.tipo === 'saida'">
          <div class="form-group">
            <label class="form-label">Forma de Pagamento</label>
            <select v-model="form.pagamento" required class="form-input">
              <option disabled value="">Selecione</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao-credito">Cartão de Crédito</option>
              <option value="cartao-debito">Cartão de Débito</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <select v-model="form.categoria" required class="form-input">
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
          <div class="form-group">
            <label class="form-label">Periodicidade</label>
            <select v-model="form.periodicidade" class="form-input">
              <option disabled value="">Selecione</option>
              <option value="mensal">Mensal</option>
              <option value="semanal">Semanal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </template>
        <template v-if="form.modalidade === 'parcelado'">
          <div class="form-group">
            <label class="form-label">Número de Parcelas</label>
            <input v-model.number="form.parcelas" type="number" min="2" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Data da Primeira Parcela</label>
            <input v-model="form.dataPrimeiraParcela" type="date" class="form-input" />
          </div>
        </template>
      </div>

      
      <div v-if="currentStep === 3" class="form-step">
        <h2 class="form-heading">Revisão Final</h2>
        <div class="review-box">
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

      
      <div class="form-buttons">
        <button v-if="currentStep > 1" type="button" @click="prevStep" class="btn-back">
          Voltar
        </button>
        <button v-if="currentStep < 3" type="button" @click="nextStep" class="btn-next">
          Próximo
        </button>
        <button v-if="currentStep === 3" type="submit" class="btn-confirm">
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

<style scoped>
:root {
  --cardbg: #161716;
  --mainbg: #0f0e11;
  --greenmain: #3ecf00;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
  --textgray: #aaaaaa;
}

.expense-form-container {
  background-color: var(--cardbg);
  max-width: 70%;
  margin: 0 auto;
  border-radius: 4px;
  padding: 1.5rem;
  position: relative;
  color: var(--textwhite);
}

.form-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  position: relative;
}

.steps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #444;
  color: var(--textgray);
}

.step.active {
  background-color: var(--greenmain);
  color: white;
}

.step-line {
  width: 4rem;
  height: 0.25rem;
  background-color: #444;
}

.step-line.active {
  background-color: var(--greenmain);
}

.step-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--textgray);
}

.form-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--textgray);
  cursor: pointer;
}
.form-close:hover {
  color: var(--textwhite);
}

.form-step {
  margin-bottom: 1.5rem;
}

.form-heading {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--textwhite);
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: var(--textgray);
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--cardbg);
  border-radius: 4px;
  background-color: transparent;
  color: var(--textwhite);
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--greenmain);
  box-shadow: 0 0 0 2px rgba(62, 207, 0, 0.3);
}

.review-box {
  background-color: var(--mainbg);
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid var(--cardbg);
  font-size: 0.875rem;
  color: var(--textwhite);
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.btn-back,
.btn-next,
.btn-confirm {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.btn-back {
  background-color: var(--cardbg);
  color: var(--textgray);
}
.btn-back:hover {
  background-color: var(--mainbg);
}

.btn-next,
.btn-confirm {
  background-color: var(--greenmain);
  color: white;
}
.btn-next:hover,
.btn-confirm:hover {
  background-color: #36b800;
}
</style>
