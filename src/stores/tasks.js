// src/stores/tasks.js
import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  getters: {
    // You can add getters here if needed, e.g., filteredTasks
  },

  actions: {
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/tasks"); // Use relative path
        this.tasks = response.data.tasks;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch tasks.";
        console.error("Error fetching tasks:", err);
      } finally {
        this.loading = false;
      }
    },

    // --- ADDED: Action to add a new task ---
    async addTask(taskData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();
      try {
        const response = await axios.post("/tasks", taskData); // Use relative path
        this.tasks.unshift(response.data.task); // Add the new task to the start of the list
        toast.success("Task added successfully!");
        return true; // Indicate success
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to add task.";
        toast.error(this.error);
        console.error("Error adding task:", err);
        return false; // Indicate failure
      } finally {
        this.loading = false;
      }
    },

    async updateTask(taskId, taskData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();
      try {
        const response = await axios.put(`/tasks/${taskId}`, taskData); // Use relative path
        const index = this.tasks.findIndex((task) => task._id === taskId);
        if (index !== -1) {
          this.tasks[index] = response.data.task; // Update the task in the array
        }
        toast.success("Task updated successfully!");
        return true; // Indicate success
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to update task.";
        toast.error(this.error);
        console.error("Error updating task:", err);
        return false; // Indicate failure
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(taskId) {
      this.loading = true;
      this.error = null;
      const toast = useToast();
      try {
        await axios.delete(`/tasks/${taskId}`); // Use relative path
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
        toast.success("Task deleted successfully!");
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to delete task.";
        toast.error(this.error);
        console.error("Error deleting task:", err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // You can add other task-related actions here
  },
});
