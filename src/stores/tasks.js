// src/stores/tasks.js
import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth"; // To check authentication status
import { useToast } from "vue-toastification"; // For toasts

// BaseURL is now set in main.js, so we can use relative paths
const API_URL = "/tasks";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Action to fetch all tasks for the authenticated user
    async fetchTasks(filters = {}) {
      const authStore = useAuthStore();
      const toast = useToast();

      if (!authStore.isUserAuthenticated) {
        this.error = "Not authenticated. Please log in.";
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(API_URL, {
          params: filters,
        });
        this.tasks = response.data;
        return true;
      } catch (err) {
        // --- SIMPLIFIED CATCH BLOCK ---
        // The global interceptor handles 401s. This block now only handles other errors.
        if (err.response?.status !== 401) {
          this.error = err.response?.data?.message || "Failed to fetch tasks.";
          toast.error(this.error);
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Action to add a new task
    async addTask(taskData) {
      const authStore = useAuthStore();
      const toast = useToast();

      if (!authStore.isUserAuthenticated) {
        toast.error("Not authenticated. Please log in.");
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(API_URL, taskData);
        this.tasks.unshift(response.data);
        toast.success("Task added successfully!");
        return true;
      } catch (err) {
        if (err.response?.status !== 401) {
          this.error = err.response?.data?.message || "Failed to add task.";
          toast.error(this.error);
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Action to update an existing task
    async updateTask(taskId, updatedData) {
      const authStore = useAuthStore();
      const toast = useToast();

      if (!authStore.isUserAuthenticated) {
        toast.error("Not authenticated. Please log in.");
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.put(`${API_URL}/${taskId}`, updatedData);
        const index = this.tasks.findIndex((task) => task._id === taskId);
        if (index !== -1) {
          this.tasks[index] = response.data;
        }
        toast.success("Task updated successfully!");
        return true;
      } catch (err) {
        if (err.response?.status !== 401) {
          this.error = err.response?.data?.message || "Failed to update task.";
          toast.error(this.error);
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Action to delete a task
    async deleteTask(taskId) {
      const authStore = useAuthStore();
      const toast = useToast();

      if (!authStore.isUserAuthenticated) {
        toast.error("Not authenticated. Please log in.");
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`${API_URL}/${taskId}`);
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
        toast.success("Task deleted successfully!");
        return true;
      } catch (err) {
        if (err.response?.status !== 401) {
          this.error = err.response?.data?.message || "Failed to delete task.";
          toast.error(this.error);
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
