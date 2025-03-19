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
      <div class="form-buttons">
        <button type="submit" class="btn">
          {{ isEditing ? "Atualizar" : "Adicionar" }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          class="btn-cancel"
          @click="cancelEdit"
        >
          Cancelar
        </button>
      </div>
    </form>
    <div class="cards-list">
      <h3 class="list-title">Cartões Cadastrados</h3>
      <ul>
        <li v-for="(card, index) in cards" :key="index" class="list-item">
          <span class="item-name">{{ card.name }} - R$ {{ card.limit.toFixed(2) }}</span>
          <div class="item-actions">
            <button class="btn-edit" @click="editCard(index)">Editar</button>
            <button class="btn-delete" @click="deleteCard(index)">Excluir</button>
          </div>
        </li>
      </ul>
    </div>
    <button class="btn-close" @click="$emit('close')">Fechar</button>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "CartoesScreen",
  emits: ["close"],
  setup() {
    const cards = ref([]);
    const cardForm = ref({
      name: "",
      limit: 0
    });
    const isEditing = ref(false);
    const editingIndex = ref(null);

    const handleSubmit = () => {
      if (isEditing.value && editingIndex.value !== null) {
        cards.value[editingIndex.value] = { ...cardForm.value };
      } else {
        cards.value.push({ ...cardForm.value });
      }
      resetForm();
    };

    const editCard = (index) => {
      cardForm.value = { ...cards.value[index] };
      isEditing.value = true;
      editingIndex.value = index;
    };

    const deleteCard = (index) => {
      cards.value.splice(index, 1);
      if (editingIndex.value === index) {
        resetForm();
      }
    };

    const cancelEdit = () => {
      resetForm();
    };

    const resetForm = () => {
      cardForm.value.name = "";
      cardForm.value.limit = 0;
      isEditing.value = false;
      editingIndex.value = null;
    };

    return {
      cards,
      cardForm,
      isEditing,
      handleSubmit,
      editCard,
      deleteCard,
      cancelEdit
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
  margin-bottom: 1rem;
  background-color: var(--mainbg);
  border: 1px solid #2b2c2f;
  color: var(--textwhite);
  border-radius: 4px;
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
