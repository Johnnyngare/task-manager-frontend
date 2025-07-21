// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./assets/main.css";
import axios from "axios";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// --- AXIOS GLOBAL CONFIGURATION ---
axios.defaults.baseURL =
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000/api";
axios.defaults.withCredentials = true; // Crucial: Tells Axios to send cookies

// --- AXIOS REQUEST INTERCEPTOR ---
axios.interceptors.request.use(
  (config) => {
    // With httpOnly cookies, we no longer need to manually set the Authorization header.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- AXIOS RESPONSE INTERCEPTOR ---
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const authStore = useAuthStore(pinia);

    if (error.response && error.response.status === 401) {
      // Only trigger logout if the user was previously considered authenticated.
      // This prevents logout loops on public pages.
      if (authStore.isUserAuthenticated) {
        console.log(
          "Interceptor caught 401. User was authenticated, now logging out..."
        );

        const toast = app.config.globalProperties.$toast;
        if (toast) {
          toast.error("Session expired. Please log in again.");
        }

        authStore.logout();
      }
    }
    return Promise.reject(error);
  }
);

app.use(router);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true,
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
});

app.mount("#app");
