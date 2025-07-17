<!-- src/views/LoginPage.vue -->
<template>
  <div class="flex items-center justify-center h-full">
    <div
      class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl"
    >
      <h2
        class="text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center"
      >
        Login
      </h2>
      <!-- Display error message from the auth store -->
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
            class="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="mt-1 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="mt-1 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div class="text-right">
          <router-link
            to="/forgot-password"
            class="text-sm text-blue-600 hover:underline"
            >Forgot Password?</router-link
          >
        </div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <!-- OR Separator -->
      <div class="my-6 flex items-center">
        <div
          class="flex-grow border-t border-slate-300 dark:border-slate-600"
        ></div>
        <span class="mx-4 text-slate-500 dark:text-slate-400">OR</span>
        <div
          class="flex-grow border-t border-slate-300 dark:border-slate-600"
        ></div>
      </div>

      <!-- Google Login Button (NEW) -->
      <a
        :href="googleAuthUrl"
        class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-lg shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center justify-center gap-3"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
        <span>Sign in with Google</span>
      </a>

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
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

// --- Fix: Clear any previous auth errors when the component is mounted ---
onMounted(() => {
  authStore.clearError();
});

const handleLogin = () => {
  authStore.login({ email: email.value, password: password.value });
};

// --- NEW: Google OAuth URL ---
const googleAuthUrl = "http://localhost:5000/api/auth/google"; // Adjust this to your backend's Google auth initiation route
</script>
