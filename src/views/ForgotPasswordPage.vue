<template>
  <div class="flex items-center justify-center h-full">
    <div
      class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl text-center"
    >
      <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-6">
        Forgot Password
      </h2>
      <p class="text-slate-600 dark:text-slate-300 mb-6">
        Enter your email or phone number to receive a password reset link or
        code.
      </p>

      <!-- Message display for success/error from API -->
      <div
        v-if="message"
        :class="
          messageType === 'success'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        "
        class="border px-4 py-3 rounded-lg relative mb-6"
        role="alert"
      >
        <span class="block sm:inline">{{ message }}</span>
      </div>

      <form @submit.prevent="handleForgotPassword" class="space-y-6">
        <!-- Reset Method dropdown (MOVED HERE) -->
        <div>
          <label
            for="method"
            class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 text-left"
            >Reset Method</label
          >
          <select
            id="method"
            v-model="method"
            required
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="email">Email</option>
            <option value="sms">SMS (Code expires in 15 mins)</option>
          </select>
        </div>

        <!-- Email or Phone Number input -->
        <div>
          <label for="contact" class="sr-only">Email or Phone Number</label>
          <input
            type="text"
            id="contact"
            v-model="contact"
            required
            :placeholder="inputPlaceholder"
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {{ loading ? "Sending..." : "Send Reset Link/Code" }}
        </button>
      </form>

      <!-- CORRECTED: Conditional Button/Link for SMS Reset -->
      <div v-if="showResetLinkButton" class="mt-6">
        <router-link
          to="/reset-password"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 inline-flex items-center justify-center space-x-2"
        >
          <span>Enter Verification Code</span>
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            ></path>
          </svg>
        </router-link>
      </div>

      <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
        <router-link
          to="/login"
          class="font-medium text-blue-600 hover:underline"
          >Back to Login</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"; // Import computed
import axios from "axios";
import { useToast } from "vue-toastification";

const contact = ref("");
const method = ref("email");
const message = ref("");
const messageType = ref("");
const loading = ref(false);
const toast = useToast();

const showResetLinkButton = ref(false);

const API_URL = "http://localhost:5000/api/auth";

// Computed property to dynamically change the placeholder
const inputPlaceholder = computed(() => {
  return method.value === "email"
    ? "Enter your email address"
    : "Enter your phone number (e.g., +254712345678)";
});

const handleForgotPassword = async () => {
  loading.value = true;
  message.value = "";
  messageType.value = "";
  showResetLinkButton.value = false;

  const payload = { method: method.value };
  if (method.value === "email") {
    payload.email = contact.value;
  } else {
    payload.phoneNumber = contact.value;
  }

  try {
    const response = await axios.post(`${API_URL}/forgot-password`, payload);

    message.value = response.data.message;
    messageType.value = "success";

    toast.success(response.data.message);

    if (method.value === "sms") {
      // Only show button if method is SMS
      showResetLinkButton.value = true;
    }
  } catch (error) {
    message.value =
      error.response?.data?.message ||
      `Failed to send reset ${
        method.value === "email" ? "link" : "code"
      }. Please try again.`;
    messageType.value = "error";

    toast.error(message.value);
    showResetLinkButton.value = false;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Any specific styling for this component */
</style>
