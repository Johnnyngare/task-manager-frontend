// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Import page components
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import TasksPage from "../views/TasksPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import ForgotPasswordPage from "../views/ForgotPasswordPage.vue";
import ResetPasswordPage from "../views/ResetPasswordPage.vue";
import CalendarPage from "../views/CalendarPage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: TasksPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: CalendarPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordPage,
    meta: { guestOnly: true },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPasswordPage,
    meta: { guestOnly: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- NEW, SMARTER Navigation Guard ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // --- FIX: Only try to fetch user state if the route requires authentication ---
  // This prevents unnecessary API calls on public pages like Login/Register.
  if (to.meta.requiresAuth && authStore.user === null && !authStore.error) {
    // The 'await' is crucial. It pauses navigation until we know if the user is authenticated.
    await authStore.fetchUserState();
  }

  const isAuthenticated = authStore.isUserAuthenticated;

  // Rule 1: If a route requires authentication and the user is NOT logged in,
  // redirect them to the login page.
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  }
  // Rule 2: If a route is for guests only (like Login/Register) and the user IS logged in,
  // redirect them to their main dashboard.
  else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: "Tasks" });
  }
  // Rule 3: In all other cases (e.g., public pages for a guest), allow navigation.
  else {
    next();
  }
});

export default router;
