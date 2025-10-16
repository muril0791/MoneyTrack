<template>
  <header class="px-5 pt-3">
  
    <div class="md:hidden">
      <div
        class="w-full flex items-center justify-between rounded-2xl bg-[#242424] ring-1 ring-[#2d2d2d] px-2 py-2 gap-2"
      >
      
        <div aria-label="Logo" class="select-none rounded-xl px-2 py-1">
          <img src="../assets/logo.svg" class="block h-7 w-auto" />
        </div>

       
        <nav class="flex items-center gap-1">
          <button
            type="button"
            @click="$emit('open-credit-cards-list')"
            class="px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition whitespace-nowrap"
          >
            Cartões
          </button>

          <div class="relative" ref="dropdownRefMobile">
            <button
              type="button"
              @click="toggleDropdownMobile"
              class="px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition inline-flex items-center gap-2 whitespace-nowrap"
            >
              Cadastros
              <svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
              </svg>
            </button>

            <div
              v-if="dropdownOpenMobile"
              class="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] shadow-2xl p-2 z-50"
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

       
        <div class="relative" ref="profileRefMobile">
          <button
            type="button"
            class="w-9 h-9 rounded-full bg-neutral-300 text-neutral-900 font-bold flex items-center justify-center"
            @click="toggleProfile"
            aria-label="Abrir menu do usuário"
          >
            {{ initials }}
          </button>

          <div
            v-if="profileOpen"
            class="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#1b1b1b] ring-1 ring-[#2a2a2a] shadow-2xl p-3 z-50"
          >
            <div class="flex items-center gap-3 px-1">
              <div class="w-9 h-9 rounded-full bg-neutral-300 text-neutral-900 font-bold flex items-center justify-center">
                {{ initials }}
              </div>
              <div class="truncate">
                <div class="text-[13px] text-neutral-400">Logado como</div>
                <div class="text-[14px] font-semibold text-neutral-100 truncate">
                  {{ displayName }}
                </div>
              </div>
            </div>
            <div class="mt-3 border-t border-[#2a2a2a] pt-3">
              <button
                type="button"
                @click="logout"
                class="w-full px-3 py-2 rounded-xl border border-[#3ecf00] text-neutral-200 hover:bg-emerald-400 hover:text-black transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div class="hidden md:flex items-center gap-3">
      <div class="flex-1 flex items-center justify-between rounded-2xl bg-[#242424] ring-1 ring-[#2d2d2d] px-3 py-2 max-h-15 min-h-15">
        <div class="flex items-center gap-3">
          <div aria-label="Logo" class="select-none rounded-xl text-neutral-900 font-semibold px-4 py-2">
            <img src="../assets/logo.svg" class="bg-[#242424]">
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

      <div class="flex items-center gap-3 rounded-2xl bg-[#242424] ring-1 ring-[#2d2d2d] pl-2 pr-4 py-2 max-h-15 min-h-15">
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
      dropdownOpenMobile: false,  
      profileOpen: false,          
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
    
    toggleDropdownMobile() {
      this.dropdownOpenMobile = !this.dropdownOpenMobile;
    },
    
    toggleProfile() {
      this.profileOpen = !this.profileOpen;
    },
    closeAllMenus() {
      this.dropdownOpen = false;
      this.dropdownOpenMobile = false;
      this.profileOpen = false;
    },
    onDocumentClick(e) {
      const desktopMenu = this.$refs.dropdownRef;
      const mobileMenu = this.$refs.dropdownRefMobile;
      const profileMenu = this.$refs.profileRefMobile;

      const clickedInsideDesktop = desktopMenu && desktopMenu.contains(e.target);
      const clickedInsideMobile = mobileMenu && mobileMenu.contains(e.target);
      const clickedInsideProfile = profileMenu && profileMenu.contains(e.target);

      if (!clickedInsideDesktop) this.dropdownOpen = false;
      if (!clickedInsideMobile) this.dropdownOpenMobile = false;
      if (!clickedInsideProfile) this.profileOpen = false;
    },
    onEsc(e) {
      if (e.key === "Escape") this.closeAllMenus();
    },

    openCreditCards() {
      this.$emit("open-credit-cards");
      this.closeAllMenus();
    },
    openCreditCardsList() {
      this.$emit("open-credit-cards-list");
      this.closeAllMenus();
    },
    openCategories() {
      this.$emit("open-categories");
      this.closeAllMenus();
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
    },
  },
};
</script>
