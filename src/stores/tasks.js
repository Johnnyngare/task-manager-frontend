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
        this.tasks = [];
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
        // --- FIX: Add robustness check for response.data.task ---
        if (
          response.data &&
          typeof response.data.task === "object" &&
          response.data.task !== null
        ) {
          this.tasks.unshift(response.data.task); // Add the new task to the start of the list
          toast.success("Task added successfully!");
          return true; // Indicate success
        } else {
          // Fallback if backend reports success but no valid task is returned
          console.warn(
            "Backend reported success but did not return a valid task object for addTask:",
            response.data
          );
          toast.success("Task added successfully (UI might need refresh)."); // Inform user but hint at potential UI desync
          // Optionally, you might force a refetch here if you suspect immediate inconsistency
          // this.fetchTasks();
          return true;
        }
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
          // --- FIX: Add robustness check for response.data.task ---
          if (
            response.data &&
            typeof response.data.task === "object" &&
            response.data.task !== null
          ) {
            this.tasks[index] = response.data.task; // Update the task in the array
            toast.success("Task updated successfully!");
            return true; // Indicate success
          } else {
            console.warn(
              "Backend reported success but did not return a valid task object for updateTask:",
              response.data
            );
            toast.success("Task updated successfully (UI might need refresh).");
            // Optionally, this.fetchTasks(); here as well
            return true;
          }
        }
        return false; // If task not found in local store, indicate failure to update local
      } catch (err) {
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
