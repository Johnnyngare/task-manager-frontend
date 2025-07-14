// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";

// Import page components
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import TasksPage from "../views/TasksPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import ForgotPasswordPage from "../views/ForgotPasswordPage.vue";
import ResetPasswordPage from "../views/ResetPasswordPage.vue";
import CalendarPage from "../views/CalendarPage.vue"; // NEW: Import CalendarPage

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
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
    // NEW: Calendar Route
    path: "/calendar",
    name: "Calendar",
    component: CalendarPage,
    meta: { requiresAuth: true }, // Protected route
  },

  // --- Password Reset Routes ---
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordPage,
    meta: { guestOnly: true }, // Should only be accessible to guests
  },
  {
    path: "/reset-password", // Link sent in email will be /reset-password?token=XYZ or /reset-password?code=XYZ
    name: "ResetPassword",
    component: ResetPasswordPage,
    meta: { guestOnly: true }, // Should only be accessible to guests
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// --- Navigation Guard ---
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: "Tasks" });
  } else {
    next();
  }
});

export default router;
