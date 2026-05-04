<template>
  <div class="w-full max-w-xl mx-auto font-sans">
    <div class="w-full max-w-xl mx-auto font-sans max-h-[95vh] flex flex-col bg-[#1b1b1b] rounded-3xl shadow-2xl ring-1 ring-[#2a2a2a] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b border-[#2a2a2a] shrink-0">
        <div class="space-y-1">
          <h2 class="text-neutral-500 text-[11px] uppercase tracking-[0.2em] font-semibold">Configurações</h2>
          <h3 class="text-xl font-semibold text-white">Categorias</h3>
        </div>
        <button
          @click="$emit('close')"
          class="text-neutral-500 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <!-- Form Section -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Nome da Categoria</label>
              <input
                v-model="categoryForm.name"
                type="text"
                required
                :disabled="submitting"
                placeholder="Ex: Supermercado, Aluguel..."
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Tipo</label>
              <select
                v-model="categoryForm.type"
                required
                :disabled="submitting"
                class="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option disabled value="">Selecione</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl py-3.5 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <span v-if="!submitting">{{ isEditing ? "Atualizar Categoria" : "Adicionar Categoria" }}</span>
              <span v-else>Salvando...</span>
            </button>
            <button
              v-if="isEditing"
              @click="cancelEdit"
              type="button"
              class="px-6 py-3.5 rounded-xl border border-[#2a2a2a] text-neutral-400 font-semibold hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>

        <!-- List Section -->
        <div class="space-y-4">
          <h3 class="text-neutral-500 text-[11px] uppercase tracking-widest font-semibold ml-1">Categorias Atuais</h3>

          <div v-if="categories.length === 0" class="text-center py-10 border border-dashed border-[#2a2a2a] rounded-2xl bg-[#151515]">
            <p class="text-neutral-500 text-sm">Nenhuma categoria cadastrada.</p>
          </div>

          <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="flex items-center justify-between bg-[#151515] border border-[#2a2a2a] rounded-2xl p-4 hover:ring-1 hover:ring-emerald-500/30 transition-all"
            >
              <div class="flex items-center gap-4">
                <span :class="cat.type === 'entrada' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'" 
                      class="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold ring-1 ring-white/5 uppercase">
                  {{ cat.name.charAt(0) }}
                </span>
                <div>
                  <p class="text-[14px] font-semibold text-white uppercase tracking-wide">{{ cat.name }}</p>
                  <p :class="cat.type === 'entrada' ? 'text-emerald-500/70' : 'text-rose-500/70'" 
                     class="text-[10px] uppercase tracking-[0.1em] font-bold">
                    {{ cat.type === 'entrada' ? 'Entrada' : 'Saída' }}
                  </p>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  @click="editCategory(cat)"
                  class="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-emerald-400 transition-all"
                  title="Editar"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  @click="deleteCategory(cat.id)"
                  class="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-rose-400 transition-all"
                  title="Excluir"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer (Optional or spacer) -->
      <div class="px-6 py-4 md:px-8 md:py-4 border-t border-[#2a2a2a] bg-[#151515]/50 flex justify-end shrink-0">
        <button
          @click="$emit('close')"
          class="text-[12px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-all"
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
    const submitting = ref(false);

    const resetForm = () => {
      categoryForm.value = { name: "", type: "" };
      isEditing.value = false;
      editingId.value = null;
      submitting.value = false;
    };

    const handleSubmit = async () => {
      if (submitting.value) return;
      const name = String(categoryForm.value.name || "")
        .trim()
        .slice(0, 80);
      const type =
        categoryForm.value.type === "entrada"
          ? "entrada"
          : categoryForm.value.type === "saida"
          ? "saida"
          : "";
      if (!name || !type) return;

      submitting.value = true;
      try {
        if (isEditing.value && editingId.value) {
          await store.updateCategory({ id: editingId.value, name, type });
        } else {
          await store.addCategory({ name, type });
        }
        resetForm();
      } finally {
        submitting.value = false;
      }
    };

    const editCategory = (cat) => {
      if (submitting.value) return;
      isEditing.value = true;
      editingId.value = cat.id;
      categoryForm.value = {
        name: String(cat.name || "").slice(0, 80),
        type: cat.type,
      };
    };

    const deleteCategory = async (catId) => {
      if (submitting.value) return;
      submitting.value = true;
      try {
        await store.removeCategory(catId);
        if (editingId.value === catId) resetForm();
      } finally {
        submitting.value = false;
      }
    };

    const cancelEdit = () => resetForm();

    return {
      categories,
      categoryForm,
      isEditing,
      editingId,
      submitting,
      handleSubmit,
      editCategory,
      deleteCategory,
      cancelEdit,
    };
  },
};
</script>
