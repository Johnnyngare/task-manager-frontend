// src/stores/auth.js
import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";

const API_URL = "http://localhost:5000/api/auth";
const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    error: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // Helper to set the Axios default header for all requests
    setAuthHeader(token) {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // console.log("Axios Authorization header set:", axios.defaults.headers.common['Authorization']); // DEBUG
      } else {
        delete axios.defaults.headers.common["Authorization"];
        // console.log("Axios Authorization header cleared."); // DEBUG
      }
    },

    async register(userData, router) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/register`, userData);
        this.token = response.data.token;
        this.user = response.data;
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
        this.setAuthHeader(this.token); 
        router.push("/tasks");
        return true;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          "An error occurred during registration.";
        toast.error(this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials, router) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        this.token = response.data.token;
        this.user = response.data;
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
        this.setAuthHeader(this.token); 
        router.push("/tasks");
        return true;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Invalid credentials or server error.";
        toast.error(this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout(router) {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.setAuthHeader(null); // <-- Ensure this is called
      router.push("/login");
      toast.info("You have been logged out.");
    },
  },
});

// --- CRITICAL BLOCK: Set header on store initialization/app startup ---
// This code runs *immediately* when the store is defined and imported.
// It ensures that if a user just refreshed the page and has a token in localStorage,
// Axios is configured *before* any component's onMounted tries to fetch data.
const initialToken = localStorage.getItem("token");
if (initialToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
  // console.log("Axios Authorization header set on initial store load."); // DEBUG
}
