<!-- src/views/TasksPage.vue -->
<template>
  <div class="space-y-8">
    <header
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <h1 class="text-4xl font-bold text-slate-800 dark:text-slate-100">
        My Tasks
      </h1>
      <button
        @click="openAddTaskForm"
        class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Add Task</span>
      </button>
    </header>

    <!-- Search and Filter Bar -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4"
    >
      <div class="relative w-full md:flex-1">
        <input
          type="text"
          v-model="searchQuery"
          @input="debouncedFetchTasks"
          placeholder="Search tasks..."
          class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <select
        v-model="statusFilter"
        @change="fetchTasksWithFilters"
        class="w-full md:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Loading, Error, or Empty States -->
    <div
      v-if="tasksStore.loading"
      class="text-center text-slate-600 dark:text-slate-300 py-8"
    >
      <svg
        class="animate-spin h-8 w-8 text-green-500 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="mt-4">Loading tasks...</p>
    </div>
    <div
      v-else-if="tasksStore.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
      role="alert"
    >
      <span class="block sm:inline">Error: {{ tasksStore.error }}</span>
    </div>
    <div
      v-else-if="!tasksStore.tasks || tasksStore.tasks.length === 0"
      class="text-center text-slate-500 dark:text-slate-400 py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
    >
      <p class="text-lg">
        No tasks found. Click "Add Task" to create your first one!
      </p>
    </div>

    <!-- Responsive Task Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <TaskItem
        v-for="task in tasksStore.tasks || []"
        :key="task?._id"
        :task="task"
        @edit-task="openEditTaskForm"
        @delete-task="handleDeleteTask"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <!-- Task Form Modal/Component -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showTaskForm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <div class="relative w-full max-w-lg mx-auto">
            <TaskForm
              :taskToEdit="editingTask"
              @task-saved="handleTaskSaved"
              @close="closeTaskForm"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useTasksStore } from "../stores/tasks";
import { useAuthStore } from "../stores/auth";
import TaskItem from "../components/TaskItem.vue";
import TaskForm from "../components/TaskForm.vue";
import debounce from "lodash.debounce";

// 1. Initialize stores and refs first
const tasksStore = useTasksStore();
const authStore = useAuthStore();

const showTaskForm = ref(false);
const editingTask = ref(null);
const searchQuery = ref("");
const statusFilter = ref("");

// 2. DEFINE ALL YOUR FUNCTIONS NEXT
const fetchTasksWithFilters = () => {
  if (!authStore.isUserAuthenticated) return;
  const filters = {};
  if (searchQuery.value) filters.search = searchQuery.value;
  if (statusFilter.value) filters.status = statusFilter.value;
  tasksStore.fetchTasks(filters);
};

const debouncedFetchTasks = debounce(() => {
  fetchTasksWithFilters();
}, 300);

const openAddTaskForm = () => {
  editingTask.value = null;
  showTaskForm.value = true;
};

const openEditTaskForm = (task) => {
  editingTask.value = task;
  showTaskForm.value = true;
};

const handleTaskSaved = () => {
  showTaskForm.value = false;
  editingTask.value = null;
  fetchTasksWithFilters();
};

const closeTaskForm = () => {
  showTaskForm.value = false;
  editingTask.value = null;
};

const handleDeleteTask = async (taskId) => {
  if (confirm("Are you sure you want to delete this task?")) {
    await tasksStore.deleteTask(taskId);
  }
};

const handleToggleStatus = async (task) => {
  const newStatus = task.status === "pending" ? "completed" : "pending";
  await tasksStore.updateTask(task._id, { status: newStatus });
};

// 3. SET UP YOUR WATCHERS LAST
watch(
  () => authStore.isUserAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      fetchTasksWithFilters();
    } else {
      tasksStore.tasks = [];
      tasksStore.error = "Not authenticated. Please log in.";
    }
  },
  { immediate: true }
);

watch(statusFilter, () => {
  fetchTasksWithFilters();
});
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
