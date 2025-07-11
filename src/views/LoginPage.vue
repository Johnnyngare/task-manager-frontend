<!-- src/views/LoginPage.vue -->
<template>
  <div class="flex items-center justify-center h-full">
    <div
      class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl"
    >
      <h2
        class="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8"
      >
        Login
      </h2>

      <!-- Display API error message here -->
      <div
        v-if="authStore.error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
        role="alert"
      >
        <span class="block sm:inline">{{ authStore.error }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? "Logging in..." : "Login" }}
        </button>
      </form>
      <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
        <router-link
          to="/forgot-password"
          class="font-medium text-blue-600 hover:underline"
          >Forgot Password?</router-link
        >
      </p>
      <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Don't have an account?
        <router-link
          to="/register"
          class="font-medium text-green-600 hover:underline"
          >Register here</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  const success = await authStore.login(
    { email: email.value, password: password.value },
    router
  );
  if (success) {
    toast.success("Login successful! Welcome back.");
  }
  
};
</script>
