<!-- src/views/HomePage.vue -->
<template>
  <div class="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-purple-50 via-white to-blue-100 dark:from-slate-800 dark:via-slate-900 dark:to-black p-10 rounded-lg">
    <h1 class="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-4">
      Welcome to TaskForge
    </h1>
    <p class="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-8">
      Your personal task management solution. Organize your life, one task at a time.
    </p>
    <div class="space-x-4">
      <!-- Conditionally display CTA based on auth state -->
      <router-link 
        v-if="!isAuthenticated" 
        to="/register" 
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Sign Up Free
      </router-link>
      <router-link 
        v-if="isAuthenticated" 
        to="/tasks" 
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Go to My Tasks
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// Ensure you have authStore imported if you haven't already
import { useAuthStore } from '../stores/auth';

// Use Pinia's isAuthenticated getter directly
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>