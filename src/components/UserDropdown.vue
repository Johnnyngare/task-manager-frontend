<!-- src/components/UserDropdown.vue -->
<template>
  <div class="relative">
    <!-- Dropdown Toggle Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 focus:outline-none hover:text-green-300 transition-colors"
    >
      <!-- Display authenticated user's username or a generic "Profile" -->
      <span
        class="font-medium"
        :class="{ 'text-slate-200': !isMobile, 'text-green-400': isMobile }"
        >{{ authStore.user?.username || "Profile" }}</span
      >
      <svg
        class="w-4 h-4 text-slate-300"
        :class="{ 'transform rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown-fade">
      <!-- FIX: Adjust position for mobile (if not fixed) -->
      <div
        v-if="isOpen"
        @click.away="closeDropdown"
        :class="{
          'absolute right-0 mt-2': !isMobile,
          'relative mt-2 w-full': isMobile,
        }"
        class="bg-white dark:bg-slate-700 rounded-md shadow-xl py-1 z-20"
      >
        <router-link
          @click="handleLinkClick"
          to="/tasks"
          class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
          >My Tasks</router-link
        >
        <router-link
          @click="handleLinkClick"
          to="/profile"
          class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
          >Profile</router-link
        >

        <div class="border-t border-slate-200 dark:border-slate-600 my-1"></div>

        <button
          @click="handleLogout"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600"
        >
          Logout
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false, // New prop to indicate if it's rendered in mobile nav
  },
  // New emit to allow parent to close mobile nav
  // when an item in the dropdown is clicked
  closeNav: {
    type: Function,
    default: () => {},
  },
});

const authStore = useAuthStore();
const router = useRouter();
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

// FIX: Handle clicks on router-links to close dropdown and potentially mobile nav
const handleLinkClick = () => {
  closeDropdown();
  if (props.isMobile && props.closeNav) {
    props.closeNav(); // Call the prop function to close the mobile nav
  }
};

const handleLogout = () => {
  authStore.logout();
  closeDropdown(); // Close dropdown on logout
  if (props.isMobile && props.closeNav) {
    props.closeNav(); // Call the prop function to close the mobile nav
  }
};
</script>

<style scoped>
/* Scoped styles for the dropdown transition */
/* These styles should work for both desktop (absolute) and mobile (relative) positioning */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
