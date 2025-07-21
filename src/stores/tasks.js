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

  actions: {
    async fetchTasks(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/tasks", { params: filters });
        this.tasks = response.data.tasks || [];
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch tasks.";
        this.tasks = []; // Also reset to an empty array on error
        console.error("Error fetching tasks:", err);
      } finally {
        this.loading = false;
      }
    },

    async addTask(taskData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();
      try {
        const response = await axios.post("/tasks", taskData);
        this.tasks.unshift(response.data.task);
        toast.success("Task added successfully!");
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to add task.";
        toast.error(this.error);
        console.error("Error adding task:", err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateTask(taskId, taskData) {
      this.loading = true;
      this.error = null;
      const toast = useToast();
      try {
        const response = await axios.put(`/tasks/${taskId}`, taskData);
        const index = this.tasks.findIndex((task) => task._id === taskId);
        if (index !== -1) {
          this.tasks[index] = response.data.task;
        }
        toast.success("Task updated successfully!");
        return true;
      } catch (err) {
        // <-- The correct opening of the catch block
        this.error = err.response?.data?.message || "Failed to update task.";
        toast.error(this.error);
        console.error("Error updating task:", err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(taskId) {
      this.loading = true;
      this.error = null;
      const toast = useToast();
      try {
        await axios.delete(`/tasks/${taskId}`);
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
  },
});
