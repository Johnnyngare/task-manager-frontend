<!-- src/views/ResetPasswordPage.vue -->
<template>
  <div class="flex items-center justify-center h-full">
    <div
      class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl text-center"
    >
      <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-6">
        Reset Password
      </h2>

      <!-- Message display for success/error from API or initial prompt -->
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

      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <!-- Input field for SMS Code (conditional, only if no token in URL) -->
        <div v-if="!tokenFromUrl">
          <label for="resetCodeInput" class="sr-only">Verification Code</label>
          <input
            type="text"
            id="resetCodeInput"
            v-model="manualResetCode"
            required
            placeholder="Enter verification code (e.g., from SMS)"
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label for="newPassword" class="sr-only">New Password</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            required
            placeholder="New Password"
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label for="confirmNewPassword" class="sr-only"
            >Confirm New Password</label
          >
          <input
            type="password"
            id="confirmNewPassword"
            v-model="confirmNewPassword"
            required
            placeholder="Confirm New Password"
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>
      </form>
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";

const route = useRoute(); // Access current route information (e.g., query params)
const router = useRouter(); // Access router for navigation

const newPassword = ref("");
const confirmNewPassword = ref("");
const message = ref("");
const messageType = ref("");
const loading = ref(false);
const toast = useToast();

const tokenFromUrl = ref(null); // Stores the token if present in URL (for email link)
const manualResetCode = ref(""); // Stores the code if user types it manually (for SMS)

const API_URL = "http://localhost:5000/api/auth"; // Your backend API base URL

onMounted(() => {
  // Check if a 'token' (for email) or 'code' (for SMS) query parameter exists in the URL
  tokenFromUrl.value = route.query.token || route.query.code;

  if (!tokenFromUrl.value) {
    // If no token/code in URL, assume user will manually enter SMS code
    message.value = "Please enter the verification code received via SMS.";
    messageType.value = "info"; // Use 'info' for a neutral prompt message type
  } else {
    // If a token is found in the URL, provide a prompt for email link users
    message.value = "Please set your new password.";
    messageType.value = "info";
  }
});

const handleResetPassword = async () => {
  // Determine which token/code to use: from URL or manual input
  const actualToken = tokenFromUrl.value || manualResetCode.value;

  // Basic client-side validations
  if (!actualToken) {
    message.value = "Reset token/code is missing.";
    messageType.value = "error";
    toast.error(message.value);
    return;
  }
  if (newPassword.value !== confirmNewPassword.value) {
    message.value = "New passwords do not match.";
    messageType.value = "error";
    toast.error(message.value);
    return;
  }
  if (newPassword.value.length < 6) {
    message.value = "Password must be at least 6 characters.";
    messageType.value = "error";
    toast.error(message.value);
    return;
  }

  loading.value = true; // Set loading state
  message.value = ""; // Clear previous message
  messageType.value = ""; // Clear previous message type

  try {
    // Send POST request to backend with the actual token/code and new password
    await axios.post(`${API_URL}/reset-password`, {
      token: actualToken,
      newPassword: newPassword.value,
    });

    // On success: display success message, show toast, and redirect
    message.value =
      "Password has been reset successfully! You can now log in with your new password.";
    messageType.value = "success";
    toast.success("Password reset successful!");

    // Redirect to login page after a short delay for user to read success message
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    // On error: display error message and show toast
    message.value =
      error.response?.data?.message ||
      "Failed to reset password. Token/code might be invalid or expired.";
    messageType.value = "error";
    toast.error(message.value);
  } finally {
    loading.value = false; // Always reset loading state
  }
};
</script>
