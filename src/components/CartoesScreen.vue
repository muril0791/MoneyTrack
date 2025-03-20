<!-- CartoesScreen.vue -->
<template>
  <div class="cartoes-screen">
    <h2 class="title">Cadastro de Cartões de Crédito</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="cardName">Nome do Cartão</label>
        <input
          type="text"
          id="cardName"
          v-model="cardForm.name"
          placeholder="Digite o nome do cartão"
          required
        />
      </div>
      <div class="form-group">
        <label for="cardLimit">Limite do Cartão</label>
        <input
          type="number"
          id="cardLimit"
          v-model.number="cardForm.limit"
          placeholder="Digite o limite do cartão"
          required
        />
      </div>
      <div class="form-group">
        <label for="closingDay">Dia de Fechamento</label>
        <input
          type="number"
          id="closingDay"
          v-model.number="cardForm.closingDay"
          min="1"
          max="31"
          required
        />
      </div>
      <div class="form-group">
        <label for="dueDay">Dia de Vencimento</label>
        <input
          type="number"
          id="dueDay"
          v-model.number="cardForm.dueDay"
          min="1"
          max="31"
          required
        />
      </div>
      <div class="form-buttons">
        <button type="submit" class="btn">
          {{ isEditing ? "Atualizar" : "Adicionar" }}
        </button>
        <button v-if="isEditing" type="button" class="btn-cancel" @click="cancelEdit">
          Cancelar
        </button>
      </div>
    </form>

    <div class="cards-list">
      <h3 class="list-title">Cartões Cadastrados</h3>
      <ul>
        <li v-for="card in creditCards" :key="card.id" class="list-item">
          <span class="item-name">
            {{ card.name }} - R$ {{ card.limit.toFixed(2) }}<br />
            Fechamento: {{ card.closingDay }} | Vencimento: {{ card.dueDay }}
          </span>
          <div class="item-actions">
            <button class="btn-edit" @click="editCard(card)">Editar</button>
            <button class="btn-delete" @click="deleteCard(card.id)">Excluir</button>
          </div>
        </li>
      </ul>
    </div>

    <button class="btn-close" @click="$emit('close')">Fechar</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useMainStore } from "../stores/store";
import { storeToRefs } from "pinia";

export default {
  name: "CartoesScreen",
  emits: ["close"],
  setup() {
    const store = useMainStore();
    const { creditCards } = storeToRefs(store);
    const cardForm = ref({
      name: "",
      limit: 0,
      closingDay: null,
      dueDay: null,
    });
    const isEditing = ref(false);
    const editingId = ref(null);

    const handleSubmit = async () => {
      if (isEditing.value && editingId.value) {
        await store.updateCreditCard({ ...cardForm.value, id: editingId.value });
      } else {
        await store.addCreditCard({ ...cardForm.value });
      }
      resetForm();
    };

    const editCard = (card) => {
      isEditing.value = true;
      editingId.value = card.id;
      cardForm.value = { ...card };
    };

    const deleteCard = async (cardId) => {
      await store.removeCreditCard(cardId);
    };

    const cancelEdit = () => {
      resetForm();
    };

    const resetForm = () => {
      cardForm.value = { name: "", limit: 0, closingDay: null, dueDay: null };
      isEditing.value = false;
      editingId.value = null;
    };

    return {
      creditCards,
      cardForm,
      isEditing,
      handleSubmit,
      editCard,
      deleteCard,
      cancelEdit,
    };
  },
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

.cartoes-screen {
  background-color: var(--cardbg);
  padding: 1rem;
  border-radius: 8px;
  color: var(--textwhite);
  max-width: 500px;
  margin: 0 auto;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--greenmain);
  text-align: center;
}

.form {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--mainbg);
  border-radius: 4px;
  background-color: var(--mainbg);
  color: var(--textwhite);
}

.form-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  flex: 1;
  padding: 0.5rem;
  background-color: var(--greenmain);
  border: none;
  border-radius: 4px;
  color: var(--textwhite);
  cursor: pointer;
}

.btn:hover {
  background-color: #36b800;
}

.btn-cancel {
  padding: 0.5rem;
  background-color: var(--redmain);
  border: none;
  border-radius: 4px;
  color: var(--textwhite);
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #d32f2f;
}

.cards-list {
  margin-top: 1rem;
}

.list-title {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid var(--mainbg);
}

.item-actions button {
  background: none;
  border: none;
  margin-left: 0.5rem;
  color: var(--textgray);
  cursor: pointer;
}

.item-actions button:hover {
  color: var(--textwhite);
}

.btn-edit {
  color: var(--greenmain);
}

.btn-delete {
  color: var(--redmain);
}

.btn-close {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #444;
  border: none;
  border-radius: 4px;
  width: 100%;
  color: var(--textwhite);
  cursor: pointer;
}

.btn-close:hover {
  background-color: #333;
}
</style>
