<template>
  <header class="px-5 pt-3">
    <div class="flex items-center gap-3">
      <div class="flex-1 flex items-center justify-between rounded-2xl bg-[#242424] ring-1 ring-[#2d2d2d] px-3 py-2">
        <div class="flex items-center gap-3">
          <div aria-label="Logo" class="select-none rounded-xl bg-neutral-300 text-neutral-900 font-semibold px-4 py-2 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.12)]">
            Logo
          </div>

          <nav class="flex items-center gap-1">
            <button
              type="button"
              @click="$emit('open-credit-cards-list')"
              class="px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition"
            >
              Cartões
            </button>

            <div class="relative" ref="dropdownRef">
              <button
                type="button"
                @click="toggleDropdown"
                class="px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition inline-flex items-center gap-2"
              >
                Cadastros
                <svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
                </svg>
              </button>

              <div
                v-if="dropdownOpen"
                class="absolute left-0 top-full mt-2 w-56 rounded-xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] shadow-2xl p-2 z-50"
              >
                <button class="w-full text-left px-3 py-2 rounded-lg text-neutral-200 hover:bg-white/5 transition" @click="openCreditCards">
                  Cartões de Crédito
                </button>
                <button class="w-full text-left px-3 py-2 rounded-lg text-neutral-200 hover:bg-white/5 transition" @click="openCategories">
                  Categorias
                </button>
                <button class="w-full text-left px-3 py-2 rounded-lg text-neutral-200 hover:bg-white/5 transition" @click="openCreditCardsList">
                  Lista de Cartões
                </button>
              </div>
            </div>
          </nav>
        </div>

        <button
          type="button"
          @click="logout"
          class="px-4 py-2 rounded-xl border border-[#3ecf00] text-neutral-200 hover:bg-emerald-400 hover:text-black transition"
        >
          Logout
        </button>
      </div>

      <div class="flex items-center gap-3 rounded-2xl bg-[#242424] ring-1 ring-[#2d2d2d] pl-2 pr-4 py-2">
        <div class="w-9 h-9 rounded-full bg-neutral-300 text-neutral-900 font-bold flex items-center justify-center">
          {{ initials }}
        </div>
        <div class="leading-tight">
          <div class="text-[11px] text-neutral-400">Bem vindo de volta!</div>
          <div class="text-[15px] font-semibold text-emerald-400 truncate max-w-[210px]">
            {{ displayName }}
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<script>
import { supabase } from "@/lib/supabase";

export default {
  name: "TopBar",
  emits: ["open-credit-cards", "open-categories", "open-credit-cards-list"],
  data() {
    return {
      dropdownOpen: false,
      userMeta: { display_name: "", email: "" },
    };
  },
  computed: {
    displayName() {
      return this.userMeta.display_name || (this.userMeta.email?.split("@")[0] ?? "Usuário");
    },
    initials() {
      const name = this.displayName.trim();
      const parts = name.split(/\s+/);
      const first = (parts[0]?.[0] ?? "").toUpperCase();
      const last = (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
      return (first + last).slice(0, 2) || "U";
    },
  },
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser();
    this.userMeta = {
      display_name: user?.user_metadata?.display_name || "",
      email: user?.email || "",
    };

    
    document.addEventListener("click", this.onDocumentClick);
  
    document.addEventListener("keydown", this.onEsc);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocumentClick);
    document.removeEventListener("keydown", this.onEsc);
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    onDocumentClick(e) {
      const root = this.$refs.dropdownRef;
      if (!this.dropdownOpen) return;
      if (root && !root.contains(e.target)) {
        this.dropdownOpen = false;
      }
    },
    onEsc(e) {
      if (e.key === "Escape" && this.dropdownOpen) this.dropdownOpen = false;
    },
    openCreditCards() {
      this.$emit("open-credit-cards");
      this.closeDropdown();
    },
    openCreditCardsList() {
      this.$emit("open-credit-cards-list");
      this.closeDropdown();
    },
    openCategories() {
      this.$emit("open-categories");
      this.closeDropdown();
    },
   
    async logout() {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        if (import.meta.env.DEV) console.error(e);
      }
      const { useMainStore } = await import("@/stores/store");
      useMainStore().reset();
      this.$router.push({ name: "Login" });
    }

  },
};
</script>
