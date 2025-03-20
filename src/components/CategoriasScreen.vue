<template>
  <div class="categorias-screen">
    <h2 class="title">Cadastro de Categorias</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="categoryName">Nome da Categoria</label>
        <input
          type="text"
          id="categoryName"
          v-model="categoryForm.name"
          placeholder="Digite o nome da categoria"
          required
        />
      </div>
      <div class="form-group">
        <label for="categoryType">Tipo da Categoria</label>
        <select id="categoryType" v-model="categoryForm.type" required class="form-input">
          <option disabled value="">Selecione</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
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

    <div class="categories-list">
      <h3 class="list-title">Categorias Cadastradas</h3>
      <ul>
        <li v-for="cat in categories" :key="cat.id" class="list-item">
          <span class="item-name">{{ cat.name }} ({{ cat.type }})</span>
          <div class="item-actions">
            <button class="btn-edit" @click="editCategory(cat)">Editar</button>
            <button class="btn-delete" @click="deleteCategory(cat.id)">Excluir</button>
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
  name: "CategoriasScreen",
  emits: ["close"],
  setup() {
    const store = useMainStore();
    const { categories } = storeToRefs(store);
    const categoryForm = ref({ name: "", type: "" });
    const isEditing = ref(false);
    const editingId = ref(null);

    const handleSubmit = async () => {
      if (isEditing.value && editingId.value) {
        await store.updateCategory({ ...categoryForm.value, id: editingId.value });
      } else {
        await store.addCategory({ ...categoryForm.value });
      }
      resetForm();
    };

    const editCategory = (cat) => {
      isEditing.value = true;
      editingId.value = cat.id;
      categoryForm.value = { name: cat.name, type: cat.type };
    };

    const deleteCategory = async (catId) => {
      await store.removeCategory(catId);
    };

    const cancelEdit = () => {
      resetForm();
    };

    const resetForm = () => {
      categoryForm.value = { name: "", type: "" };
      isEditing.value = false;
      editingId.value = null;
    };

    return {
      categories,
      categoryForm,
      isEditing,
      handleSubmit,
      editCategory,
      deleteCategory,
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

.categorias-screen {
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

.categories-list {
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

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.25rem 0.5rem;
  background-color: var(--mainbg);
  border: 1px solid var(--cardbg);
  border-radius: 4px;
  color: var(--textwhite);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.page-btn.active,
.page-btn:hover {
  background-color: var(--cardbg);
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
