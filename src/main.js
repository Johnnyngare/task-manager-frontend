// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/main.css'
import axios from 'axios'
import { useAuthStore } from './stores/auth'; 

const app = createApp(App)
const pinia = createPinia(); 
app.use(pinia); 

// This allows you to access authStore within the axios interceptor after Pinia is installed
app.config.globalProperties.$pinia = pinia;


// --- AXIOS REQUEST INTERCEPTOR ---
// This runs before every HTTP request is sent.
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore(); 
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// --- AXIOS RESPONSE INTERCEPTOR (for global error handling like 401s) ---
axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    // Check for 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      
      // Prevent infinite redirect if already on login/register page
      if (router.currentRoute.value.name !== 'Login' && router.currentRoute.value.name !== 'Register') {
        authStore.logout(router); // Log out the user
        
        const toast = app.config.globalProperties.$toast; // Access toast if set globally by its plugin
        if (toast) {
          toast.error('Session expired. Please log in again.');
        } else {
          console.error('Toast instance not available globally from interceptor.');
        }
      }
    }
    return Promise.reject(error);
  });


app.use(router) 
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
  rtl: false
})

// Optional: Make Toast instance globally accessible too if needed in interceptors or other non-Vue files
app.config.globalProperties.$toast = app.config.globalProperties.$toast || app.provide('toast', app.config.globalProperties.$toast); // This is how vue-toastification makes it available

app.mount('#app')