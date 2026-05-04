<template>
  <header class="px-6 pt-4 font-sans">
    <!-- Main Navbar Container -->
    <div class="flex items-center gap-4">
      <!-- Left Section: Logo and Primary Nav -->
      <div class="flex-1 flex items-center justify-between rounded-[24px] bg-[#1a1a1a]/80 backdrop-blur-xl ring-1 ring-white/5 px-4 py-2.5 shadow-2xl shadow-black/40">
        <div class="flex items-center gap-6">
          <div aria-label="Logo" class="select-none flex items-center gap-2 pl-2">
            <div class="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span class="text-black font-black text-xs">MT</span>
            </div>
            <h1 class="text-white font-bold tracking-tight text-lg hidden sm:block">Money<span class="text-emerald-500">Track</span></h1>
          </div>

          <nav class="hidden md:flex items-center gap-1">
            <button
              type="button"
              @click="$emit('open-credit-cards-list')"
              class="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition font-medium text-sm"
            >
              Faturas
            </button>
            
            <button
              type="button"
              @click="$emit('open-fixed-bills')"
              class="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition font-medium text-sm flex items-center gap-2"
            >
              Recorrentes
              <span v-if="pendingBillsCount > 0" class="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>

            <div class="relative" ref="dropdownRef">
              <button
                type="button"
                @click="toggleDropdown"
                class="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition font-medium text-sm inline-flex items-center gap-2"
              >
                Configurações
                <svg class="w-4 h-4 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
                </svg>
              </button>

              <transition name="fade-slide">
                <div v-if="dropdownOpen" class="absolute left-0 top-full mt-3 w-56 rounded-[20px] bg-[#1b1b1b] ring-1 ring-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl">
                  <button class="w-full text-left px-4 py-2.5 rounded-xl text-neutral-300 hover:bg-white/5 hover:text-white transition text-sm font-medium" @click="openCreditCards">
                    Gerenciar Cartões
                  </button>
                  <button class="w-full text-left px-4 py-2.5 rounded-xl text-neutral-300 hover:bg-white/5 hover:text-white transition text-sm font-medium" @click="openCategories">
                    Categorias
                  </button>
                </div>
              </transition>
            </div>
          </nav>
        </div>

        <!-- Right Side of Left Section: Notification & User Mini -->
        <div class="flex items-center gap-4 pr-1">
          <!-- Notification Bell -->
          <div class="relative">
            <button 
              @click="toggleNotifications"
              class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all ring-1 ring-white/5"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span v-if="notifications.length > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white font-black flex items-center justify-center rounded-full border-2 border-[#1a1a1a]">
                {{ notifications.length }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <transition name="fade-slide">
              <div v-if="showNotifications" class="absolute right-0 top-full mt-3 w-72 rounded-[24px] bg-[#1b1b1b] ring-1 ring-white/10 shadow-2xl p-4 z-50 backdrop-blur-2xl border border-white/5">
                <h4 class="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-3 px-1">Avisos e Contas</h4>
                <div v-if="notifications.length === 0" class="py-6 text-center text-xs text-neutral-500 font-medium">
                  Tudo em dia por aqui! ✨
                </div>
                <div v-else class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  <div v-for="note in notifications" :key="note.id" @click="handleNoteClick(note)" class="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
                    <p class="text-[13px] font-semibold text-white">{{ note.title }}</p>
                    <p class="text-[11px] text-neutral-500 mt-1 leading-relaxed">{{ note.message }}</p>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <button
            type="button"
            @click="logout"
            class="hidden md:block px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition shadow-lg shadow-emerald-500/10"
          >
            Sair
          </button>
          
          <!-- Mobile Menu Trigger -->
          <button @click="toggleDropdownMobile" class="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Right Section: User Profile Card -->
      <div class="hidden lg:flex items-center gap-3 rounded-[24px] bg-[#1a1a1a]/80 backdrop-blur-xl ring-1 ring-white/5 pl-2.5 pr-5 py-2 shadow-2xl shadow-black/40">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black font-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
          {{ initials }}
        </div>
        <div class="leading-tight">
          <div class="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Conta Ativa</div>
          <div class="text-[15px] font-bold text-white truncate max-w-[140px] tracking-tight">
            {{ displayName }}
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <transition name="fade-slide">
      <div v-if="dropdownOpenMobile" class="md:hidden mt-4 rounded-3xl bg-[#1b1b1b] ring-1 ring-white/10 p-4 space-y-2 shadow-2xl relative z-[70]">
        <button class="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/5 transition font-medium" @click="handleMobileNav('open-credit-cards-list')">Faturas</button>
        <button class="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/5 transition font-medium" @click="handleMobileNav('open-fixed-bills')">Recorrentes</button>
        <button class="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/5 transition font-medium" @click="handleMobileNav('open-credit-cards')">Cartões</button>
        <button class="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/5 transition font-medium" @click="handleMobileNav('open-categories')">Categorias</button>
        <button class="w-full text-left px-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 mt-4 font-bold" @click="logout">Logout</button>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/authService";
import { useMainStore } from "@/stores/store";

const router = useRouter();
const store = useMainStore();
const emit = defineEmits(["open-credit-cards", "open-categories", "open-credit-cards-list", "open-fixed-bills"]);

const dropdownOpen = ref(false);
const dropdownOpenMobile = ref(false);
const showNotifications = ref(false);
const userMeta = ref({ display_name: "", email: "" });

const displayName = computed(() => userMeta.value.display_name || (userMeta.value.email?.split("@")[0] ?? "Usuário"));
const initials = computed(() => {
  const name = displayName.value.trim();
  const parts = name.split(/\s+/);
  const first = (parts[0]?.[0] ?? "").toUpperCase();
  const last = (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
  return (first + last).slice(0, 2) || "U";
});

const fixedBills = computed(() => store.fixedBills);
const pendingBillsCount = computed(() => fixedBills.value.filter(b => b.status === 'pending').length);

const notifications = computed(() => {
  const notes = [];
  const today = new Date().getDate();
  
  fixedBills.value.forEach(bill => {
    if (bill.status === 'pending') {
      const diff = bill.dueDay - today;
      if (diff >= 0 && diff <= 3) {
        notes.push({
          id: bill.id,
          type: 'bill_due',
          title: `Vencimento Próximo: ${bill.title}`,
          message: `Vence em ${diff === 0 ? 'hoje' : diff + ' dias'}. Valor: R$ ${bill.amount.toLocaleString('pt-BR')}`,
          bill: bill
        });
      } else if (diff < 0) {
        notes.push({
          id: bill.id,
          type: 'bill_late',
          title: `Conta Atrasada: ${bill.title}`,
          message: `Venceu dia ${bill.dueDay}. Favor regularizar.`,
          bill: bill
        });
      }
    }
  });
  return notes;
});

onMounted(() => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      userMeta.value = {
        display_name: payload.displayName || "",
        email: payload.email || "",
      };
    } catch (e) {}
  }
  
  document.addEventListener("click", onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
});

const onDocumentClick = (e) => {
  // Check if click was outside the header area
  if (!e.target.closest('header')) {
    dropdownOpen.value = false;
    dropdownOpenMobile.value = false;
    showNotifications.value = false;
  }
};

const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value;
const toggleDropdownMobile = () => dropdownOpenMobile.value = !dropdownOpenMobile.value;
const toggleNotifications = () => showNotifications.value = !showNotifications.value;

const openCreditCards = () => { emit("open-credit-cards"); dropdownOpen.value = false; };
const openCategories = () => { emit("open-categories"); dropdownOpen.value = false; };

const handleNoteClick = (note) => {
  emit("open-fixed-bills");
  showNotifications.value = false;
};

const handleMobileNav = (action) => {
  if (action === 'open-credit-cards') openCreditCards();
  else if (action === 'open-categories') openCategories();
  else emit(action);
  dropdownOpenMobile.value = false;
};

const logout = async () => {
  try {
    await authService.signOut();
  } catch (e) {}
  store.reset();
  router.push({ name: "Login" });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 10px;
}
</style>
