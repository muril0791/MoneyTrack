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
          <option value="ambos">Ambos</option>
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
        <li v-for="(cat, index) in paginatedCategories" :key="cat.id" class="list-item">
          <span class="item-name">{{ cat.name }} ({{ cat.type }})</span>
          <div class="item-actions">
            <button class="btn-edit" @click="editCategory(index)">Editar</button>
            <button class="btn-delete" @click="deleteCategory(index)">Excluir</button>
          </div>
        </li>
      </ul>
    </div>
    <!-- Paginação -->
    <div class="pagination" v-if="totalPages > 1">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="['page-btn', { active: currentPage === page }]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
    <button class="btn-close" @click="emitClose">Fechar</button>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
export default {
  name: "CategoriasScreen",
  emits: ["close", "update-categories"],
  props: {
    categories: { type: Array, default: () => [] }
  },
  setup(props, { emit }) {
    // Usamos uma cópia local para permitir edição sem alterar a prop diretamente
    const localCategories = ref([...props.categories]);
    // Atualiza a cópia local sempre que a prop mudar
    watch(
      () => props.categories,
      (newVal) => {
        localCategories.value = [...newVal];
      }
    );

    // Formulário de categoria com um campo novo para o tipo
    const categoryForm = ref({ name: "", type: "" });
    const isEditing = ref(false);
    const editingIndex = ref(null);

    const handleSubmit = () => {
      if (isEditing.value && editingIndex.value !== null) {
        localCategories.value[editingIndex.value] = { ...categoryForm.value, id: localCategories.value[editingIndex.value].id };
      } else {
        // Gera um ID único simples
        const newId = Date.now().toString();
        localCategories.value.push({ ...categoryForm.value, id: newId });
      }
      resetForm();
      emit("update-categories", localCategories.value);
    };

    const editCategory = (index) => {
      categoryForm.value = { ...localCategories.value[index] };
      isEditing.value = true;
      editingIndex.value = index;
    };

    const deleteCategory = (index) => {
      localCategories.value.splice(index, 1);
      if (editingIndex.value === index) {
        resetForm();
      }
      emit("update-categories", localCategories.value);
    };

    const cancelEdit = () => {
      resetForm();
    };

    const resetForm = () => {
      categoryForm.value.name = "";
      categoryForm.value.type = "";
      isEditing.value = false;
      editingIndex.value = null;
    };

    const emitClose = () => {
      emit("close");
    };

    // Paginação
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const totalPages = computed(() => Math.ceil(localCategories.value.length / itemsPerPage.value));
    const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return localCategories.value.slice(start, start + itemsPerPage.value);
    });
    const changePage = (page) => {
      currentPage.value = page;
    };

    return {
      localCategories,
      categoryForm,
      isEditing,
      handleSubmit,
      editCategory,
      deleteCategory,
      cancelEdit,
      emitClose,
      currentPage,
      totalPages,
      paginatedCategories,
      changePage
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
