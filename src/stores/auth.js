// src/stores/auth.js
import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null, // This is the state that was "leaking"
  }),

  getters: {
    isUserAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  },

  actions: {
    // --- NEW ACTION to clear error state ---
    clearError() {
      this.error = null;
    },

    async login(credentials) {
      // --- FIX: Clear previous errors on a new login attempt ---
      this.clearError();
      this.loading = true;
      const toast = useToast();

      try {
        const response = await axios.post(`/auth/login`, credentials);
        this.user = response.data;
        this.isAuthenticated = true;
        toast.success(response.data.message || "Logged in successfully!");
        router.push("/tasks");
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Invalid credentials.";
        toast.error(this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const toast = useToast();
      if (!this.isAuthenticated) {
        if (router.currentRoute.value.name !== "Login") router.push("/login");
        return;
      }
      this.user = null;
      this.isAuthenticated = false;
      this.clearError(); // Also clear errors on logout
      router.push("/login");
      try {
        await axios.get(`/auth/logout`);
        toast.info("You have been logged out.");
      } catch (err) {
        console.error(
          "Logout API call failed:",
          err.response?.data?.message || err.message
        );
      }
    },

    // Other actions like register, fetchUserState remain the same...
    async register(userData) {
      this.clearError();
      this.loading = true;
      const toast = useToast();
      try {
        const response = await axios.post(`/auth/register`, userData);
        this.user = response.data;
        this.isAuthenticated = true;
        toast.success(response.data.message || "Registration successful!");
        router.push("/tasks");
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Registration failed.";
        toast.error(this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserState() {
      if (this.isAuthenticated) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/auth/me`);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (err) {
        this.user = null;
        this.isAuthenticated = false;
        this.error = err.response?.data?.message || "Session invalid.";
        console.error("Failed to fetch user state:", this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});
