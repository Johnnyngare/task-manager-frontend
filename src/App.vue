<!-- src/App.vue -->
<template>
  <div class="flex flex-col min-h-screen font-sans">
    <!-- Top Header Navigation Bar -->
    <header class="bg-slate-800 text-slate-200 p-4 shadow-lg">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Logo/Brand -->
        <router-link to="/" class="text-2xl font-bold text-green-400">
          TaskForge
        </router-link>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <template v-if="authStore.isUserAuthenticated">
            <router-link
              to="/tasks"
              class="hover:text-green-300 transition-colors"
              >My Tasks</router-link
            >
            <router-link
              to="/calendar"
              class="hover:text-green-300 transition-colors"
              >Calendar</router-link
            >
            <UserDropdown />
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="hover:text-green-300 transition-colors"
              >Login</router-link
            >
            <router-link
              to="/register"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
              >Sign Up Free</router-link
            >
          </template>
        </div>

        <!-- Mobile Navigation Toggle (Hamburger Icon) -->
        <div class="md:hidden">
          <button
            @click="toggleMobileNav"
            class="text-slate-200 hover:text-green-300 focus:outline-none"
          >
            <svg
              v-if="!isMobileNavOpen"
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
            <svg
              v-else
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Menu (Hidden by Default) -->
    <Transition name="slide-fade">
      <div
        v-if="isMobileNavOpen"
        class="md:hidden bg-slate-700 text-slate-200 p-4 space-y-2 shadow-inner"
      >
        <template v-if="authStore.isUserAuthenticated">
          <router-link
            @click="closeMobileNav"
            to="/tasks"
            class="block py-2 px-3 hover:bg-slate-600 rounded"
            >My Tasks</router-link
          >
          <router-link
            @click="closeMobileNav"
            to="/calendar"
            class="block py-2 px-3 hover:bg-slate-600 rounded"
            >Calendar</router-link
          >
          <!-- FIX: Integrate UserDropdown for mobile -->
          <div class="py-2 px-3">
            <UserDropdown :is-mobile="true" @close-nav="closeMobileNav" />
          </div>
          <button
            @click="handleLogoutAndCloseNav"
            class="block py-2 px-3 w-full text-left hover:bg-slate-600 rounded"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link
            @click="closeMobileNav"
            to="/login"
            class="block py-2 px-3 hover:bg-slate-600 rounded"
            >Login</router-link
          >
          <router-link
            @click="closeMobileNav"
            to="/register"
            class="block py-2 px-3 w-full text-left hover:bg-slate-600 rounded"
            >Sign Up Free</router-link
          >
        </template>
      </div>
    </Transition>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 sm:p-6 md:p-10">
      <!-- FIX: Removed overflow-y-auto from here -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import UserDropdown from "./components/UserDropdown.vue";

const router = useRouter();
const authStore = useAuthStore();
const isMobileNavOpen = ref(false);

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
};

const handleLogoutAndCloseNav = () => {
  handleLogout();
  closeMobileNav();
};

onMounted(() => {
  authStore.fetchUserState();
});

router.afterEach(() => {
  closeMobileNav();
});
</script>

<style>
/* Transitions for mobile menu */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Base fade transition for page content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
