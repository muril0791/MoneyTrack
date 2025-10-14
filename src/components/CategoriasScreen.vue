<template>
  <div class="w-full max-w-xl">
    <div
      class="bg-[#1b1b1b] rounded-2xl shadow-xl ring-1 ring-[#2a2a2a] overflow-hidden"
    >
      
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]"
      >
        <h2 class="text-lg md:text-xl font-semibold tracking-tight">
          Categorias
        </h2>
        <button
          class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#232323] hover:bg-[#2b2b2b] transition"
          @click="$emit('close')"
          aria-label="Fechar modal"
        >
          ✕
        </button>
      </div>

     
      <div class="p-6 grid gap-6">
       
        <form
          @submit.prevent="handleSubmit"
          class="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div class="md:col-span-2">
            <label
              for="categoryName"
              class="block text-sm text-neutral-300 mb-1"
              >Nome</label
            >
            <input
              id="categoryName"
              v-model="categoryForm.name"
              type="text"
              required
              placeholder="Ex.: Salário, Moradia, Mercado…"
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-neutral-500 transition"
            />
          </div>

          <div>
            <label
              for="categoryType"
              class="block text-sm text-neutral-300 mb-1"
              >Tipo</label
            >
            <select
              id="categoryType"
              v-model="categoryForm.type"
              required
              class="w-full bg-[#151515] border border-[#2a2a2a] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition"
            >
              <option disabled value="">Selecione</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <div class="md:col-span-3 flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-lg py-3 transition shadow-md shadow-emerald-500/10"
            >
              {{ isEditing ? "Atualizar" : "Adicionar" }}
            </button>

            <button
              v-if="isEditing"
              type="button"
              @click="cancelEdit"
              class="px-4 py-3 rounded-lg bg-[#262626] hover:bg-[#2f2f2f] text-neutral-200 font-medium transition"
            >
              Cancelar
            </button>
          </div>
        </form>

        
        <div class="grid gap-3">
          <h3 class="text-sm uppercase tracking-wider text-neutral-400">
            Categorias cadastradas
          </h3>

          <div
            v-if="categories.length === 0"
            class="text-sm text-neutral-400 bg-[#151515] border border-dashed border-[#2a2a2a] rounded-xl p-6 text-center"
          >
            Nenhuma categoria cadastrada ainda.
          </div>

          <ul
            v-else
            class="divide-y divide-[#232323] rounded-xl overflow-hidden ring-1 ring-[#232323]"
          >
            <li
              v-for="cat in categories"
              :key="cat.id"
              class="flex items-center justify-between gap-4 bg-[#161616] px-4 py-3"
            >
              <div class="min-w-0">
                <p class="font-medium truncate">{{ cat.name }}</p>
                <p class="text-sm text-neutral-400">
                  Tipo:
                  <span
                    :class="
                      cat.type === 'entrada'
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    "
                    class="font-medium"
                  >
                    {{ cat.type }}
                  </span>
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  class="px-3 py-2 rounded-md bg-[#232323] hover:bg-[#2b2b2b] text-sm font-medium transition"
                  @click="editCategory(cat)"
                >
                  Editar
                </button>
                <button
                  class="px-3 py-2 rounded-md bg-[#2a1313] hover:bg-[#341616] text-sm font-medium text-red-300 transition"
                  @click="deleteCategory(cat.id)"
                >
                  Excluir
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      
      <div class="px-6 py-4 border-t border-[#2a2a2a] flex justify-end">
        <button
          class="px-4 py-2 rounded-lg bg-[#232323] hover:bg-[#2b2b2b] transition"
          @click="$emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>
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

    const resetForm = () => {
      categoryForm.value = { name: "", type: "" };
      isEditing.value = false;
      editingId.value = null;
    };

    const handleSubmit = async () => {
      if (isEditing.value && editingId.value) {
        await store.updateCategory({
          ...categoryForm.value,
          id: editingId.value,
        });
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
      if (editingId.value === catId) resetForm();
    };

    const cancelEdit = () => resetForm();

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
