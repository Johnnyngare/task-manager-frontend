// src/stores/tasks.js
import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth"; // To get the token
import { useToast } from "vue-toastification"; // For toasts

const API_URL = "http://localhost:5000/api/tasks";
const toast = useToast();

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Action to fetch all tasks for the authenticated user
    async fetchTasks(filters = {}) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore(); // Access the auth store for the token

      if (!authStore.token) {
        this.error = "Not authenticated. Please log in.";
        this.loading = false;
        toast.error(this.error);
        // Optionally, redirect to login here if not handled by router guard
        return false;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
          params: filters,
        });
        this.tasks = response.data; // Update state with fetched tasks
        this.loading = false;
        return true;
      } catch (err) {
        this.loading = false;
        if (err.response && err.response.status === 401) {
          this.error =
            "Your session has expired or is invalid. Please log in again.";
          // Interceptor in main.js will handle logout and toast, so no extra toast here
        } else {
          this.error = err.response?.data?.message || "Failed to fetch tasks.";
          toast.error(this.error);
        }
        return false;
      }
    },

    // Action to add a new task
    async addTask(taskData) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = "Not authenticated. Please log in.";
        this.loading = false;
        toast.error(this.error);
        return false;
      }

      try {
        const response = await axios.post(API_URL, taskData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.tasks.unshift(response.data); // Add new task to the beginning of the list
        this.loading = false;
        toast.success("Task added successfully!");
        return true;
      } catch (err) {
        this.loading = false;
        this.error = err.response?.data?.message || "Failed to add task.";
        toast.error(this.error);
        return false;
      }
    },

    // Action to update an existing task
    async updateTask(taskId, updatedData) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = "Not authenticated. Please log in.";
        this.loading = false;
        toast.error(this.error);
        return false;
      }

      try {
        const response = await axios.put(`${API_URL}/${taskId}`, updatedData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        // Find the task in the array and replace it with the updated version
        const index = this.tasks.findIndex((task) => task._id === taskId);
        if (index !== -1) {
          this.tasks[index] = response.data;
        }
        this.loading = false;
        toast.success("Task updated successfully!");
        return true;
      } catch (err) {
        this.loading = false;
        this.error = err.response?.data?.message || "Failed to update task.";
        toast.error(this.error);
        return false;
      }
    },

    // Action to delete a task
    async deleteTask(taskId) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = "Not authenticated. Please log in.";
        this.loading = false;
        toast.error(this.error);
        return false;
      }

      try {
        await axios.delete(`${API_URL}/${taskId}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        // Remove the deleted task from the array
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
        this.loading = false;
        toast.success("Task deleted successfully!");
        return true;
      } catch (err) {
        this.loading = false;
        this.error = err.response?.data?.message || "Failed to delete task.";
        toast.error(this.error);
        return false;
      }
    },
  },
});
