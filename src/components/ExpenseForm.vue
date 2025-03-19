<template>
  <div class="expense-form-container">
    <!-- Passo 0: Seleção de "Entrada" ou "Saída" -->
    <div v-if="currentStep === 0" class="transaction-type-selection">
      <h2 class="modal-title">TRANSAÇÕES</h2>
      <div class="button-group">
        <button class="btn-entrada" @click="selectType('entrada')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l-5.5 9h11z"/>
            <path d="M11 13v9h2v-9h-2z"/>
          </svg>
          Entrada
        </button>
        <button class="btn-saida" @click="selectType('saida')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22l5.5-9h-11z"/>
            <path d="M13 11V2h-2v9h2z"/>
          </svg>
          Saída
        </button>
      </div>
    </div>

    <!-- Passo 1: Preenchimento dos dados -->
    <div v-else-if="currentStep === 1" class="form-step">
      <h2 class="form-heading">Preencha os Dados</h2>
      <!-- Valor -->
      <div class="form-group">
        <label class="form-label">Valor</label>
        <input
          v-model.number="form.valor"
          type="number"
          step="0.01"
          required
          class="form-input"
        />
      </div>
      <!-- Tipo de Transação -->
      <div class="form-group">
        <label class="form-label">Tipo de Transação</label>
        <select v-model="form.tipoTransacao" required class="form-input">
          <option disabled value="">Selecione</option>
          <template v-if="form.tipo === 'entrada'">
            <option value="dinheiro">Dinheiro</option>
            <option value="deposito">Depósito</option>
            <option value="pix">Pix</option>
            <option value="transferencia">Transferência</option>
          </template>
          <template v-else-if="form.tipo === 'saida'">
            <option value="dinheiro">Dinheiro</option>
            <option value="pix">Pix</option>
            <option value="cartao-debito">Cartão de Débito</option>
            <option value="cartao-credito">Cartão de Crédito</option>
          </template>
        </select>
      </div>
      <!-- Campos Condicionais para Saída com Cartão de Crédito -->
      <template v-if="form.tipo === 'saida' && form.tipoTransacao === 'cartao-credito'">
        <div class="form-group">
          <label class="form-label">Número de Parcelas</label>
          <input
            v-model.number="form.parcelas"
            type="number"
            min="2"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Data da Primeira Parcela</label>
          <input
            v-model="form.dataPrimeiraParcela"
            type="date"
            class="form-input"
          />
        </div>
      </template>
      <!-- Data -->
      <div class="form-group">
        <label class="form-label">Data</label>
        <input v-model="form.data" type="date" required class="form-input" />
      </div>
      <!-- Categoria (usa as categorias globais filtradas) -->
      <div class="form-group">
        <label class="form-label">Categoria</label>
        <select v-model="form.categoria" required class="form-input">
          <option disabled value="">Selecione</option>
          <!-- Filtra apenas as categorias com type igual a form.tipo -->
          <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
          <option value="adicionar">[Adicionar categoria]</option>
        </select>
      </div>
      <!-- Descrição (opcional) -->
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <input
          v-model="form.descricao"
          type="text"
          class="form-input"
          placeholder="Opcional"
        />
      </div>
      <div class="form-buttons">
        <button type="button" class="btn-back" @click="goBackToStep0">
          Voltar
        </button>
        <button type="button" class="btn-next" @click="nextStep">
          Próximo
        </button>
      </div>
    </div>

    <!-- Passo 2: Revisão Final -->
    <div v-else-if="currentStep === 2" class="form-step">
      <h2 class="form-heading">Revisão Final</h2>
      <div class="review-box">
        <p><strong>Tipo:</strong> {{ form.tipo }}</p>
        <p><strong>Valor:</strong> {{ form.valor }}</p>
        <p><strong>Tipo de Transação:</strong> {{ form.tipoTransacao }}</p>
        <template
          v-if="form.tipo === 'saida' && form.tipoTransacao === 'cartao-credito' && form.parcelas && form.parcelas > 1"
        >
          <p><strong>Parcelas:</strong> {{ form.parcelas }}</p>
          <p><strong>Data da Primeira Parcela:</strong> {{ form.dataPrimeiraParcela }}</p>
        </template>
        <p><strong>Data:</strong> {{ form.data }}</p>
        <p><strong>Categoria:</strong> {{ selectedCategoryName || "—" }}</p>
        <p><strong>Descrição:</strong> {{ form.descricao }}</p>
      </div>
      <div class="form-buttons">
        <button type="button" class="btn-back" @click="prevStep">
          Voltar
        </button>
        <button type="button" class="btn-confirm" @click="handleSubmit">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from "vue";
export default {
  name: "ExpenseForm",
  emits: ["add-expense", "close", "open-categories"],
  props: {
    editingExpense: { type: Object, default: null },
    categories: { type: Array, default: () => [] }
  },
  setup(props, { emit }) {
    const currentStep = ref(0);
    const form = reactive({
      tipo: "",
      tipoTransacao: "",
      parcelas: null,
      dataPrimeiraParcela: "",
      data: "",
      valor: null,
      categoria: "",
      descricao: ""
    });

    // Watch: Se o usuário selecionar a opção "adicionar", abre a modal de categorias
    watch(
      () => form.categoria,
      (newVal) => {
        if (newVal === "adicionar") {
          emit("open-categories");
          form.categoria = "";
        }
      }
    );

    const selectType = (tipo) => {
      form.tipo = tipo;
      currentStep.value = 1;
    };

    const nextStep = () => {
      if (currentStep.value < 2) currentStep.value++;
    };

    const prevStep = () => {
      if (currentStep.value > 0) currentStep.value--;
    };

    const goBackToStep0 = () => {
      Object.assign(form, {
        tipo: "",
        tipoTransacao: "",
        parcelas: null,
        dataPrimeiraParcela: "",
        data: "",
        valor: null,
        categoria: "",
        descricao: ""
      });
      currentStep.value = 0;
    };

    const handleSubmit = () => {
      if (
        form.tipo === "saida" &&
        form.tipoTransacao === "cartao-credito" &&
        form.parcelas &&
        form.parcelas > 1
      ) {
        const finalDate = form.dataPrimeiraParcela || form.data;
        emit("add-expense", {
          ...form,
          data: finalDate,
          parcelas: form.parcelas
        });
      } else {
        emit("add-expense", { ...form });
      }
      emit("close");
      currentStep.value = 0;
      Object.assign(form, {
        tipo: "",
        tipoTransacao: "",
        parcelas: null,
        dataPrimeiraParcela: "",
        data: "",
        valor: null,
        categoria: "",
        descricao: ""
      });
    };

    // Filtra categorias conforme o tipo selecionado (entrada ou saída)
    const filteredCategories = computed(() => {
      return props.categories.filter((cat) => cat.type === form.tipo);
    });

    // Exibe o nome da categoria selecionada
    const selectedCategoryName = computed(() => {
      const cat = props.categories.find((c) => c.id === form.categoria);
      return cat ? cat.name : "";
    });

    return {
      currentStep,
      form,
      selectType,
      nextStep,
      prevStep,
      goBackToStep0,
      handleSubmit,
      filteredCategories,
      selectedCategoryName,
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
  color: var(--textwhite);
}
@media (max-width: 768px) {
  .expense-form-container {
    max-width: 90%;
  }
}
.transaction-type-selection {
  text-align: center;
  margin-bottom: 1.5rem;
}
.modal-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.btn-entrada,
.btn-saida {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-entrada {
  background-color: var(--greenmain);
  color: #fff;
}
.btn-saida {
  background-color: var(--redmain);
  color: #fff;
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
  box-shadow: 0 0 0 2px rgba(62,207,0,0.3);
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
  background-color: #444;
  color: var(--textgray);
}
.btn-back:hover {
  background-color: #333;
}
.btn-next,
.btn-confirm {
  background-color: var(--greenmain);
  color: #fff;
}
.btn-next:hover,
.btn-confirm:hover {
  background-color: #36b800;
}
</style>
