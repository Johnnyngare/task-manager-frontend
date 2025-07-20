<!-- src/components/TaskItem.vue -->
<template>
  <!-- The :class binding here is for overall styling, not what the test looks for -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 space-y-4 border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
  >
    <!-- Title and Status -->
    <div class="flex justify-between items-start mb-2">
      <!-- FIX #1: Added data-testid for the title -->
      <h3
        data-testid="task-title"
        class="font-bold text-xl text-slate-900 dark:text-slate-100 flex-1 pr-4"
        :class="{ 'line-through text-slate-500': task.status === 'completed' }"
      >
        {{ task.title }}
      </h3>
      <span
        :class="
          task.status === 'completed'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        "
        class="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
      >
        {{ task.status.charAt(0).toUpperCase() + task.status.slice(1) }}
      </span>
    </div>

    <!-- Description -->
    <!-- FIX #2: Added data-testid for the description -->
    <p
      v-if="task.description"
      data-testid="task-description"
      class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow overflow-hidden"
    >
      {{ task.description }}
    </p>
    <p v-else class="text-slate-400 dark:text-slate-600 text-sm flex-grow">
      No description provided.
    </p>

    <!-- Due Date (Optional) -->
    <div
      v-if="task.dueDate"
      class="flex items-center text-slate-500 dark:text-slate-400 text-xs mt-2"
    >
      <svg
        class="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
      <span>Due: {{ formatDate(task.dueDate) }}</span>
    </div>

    <!-- Action Buttons -->
    <div
      class="flex justify-end items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto"
    >
      <button
        v-if="task.status === 'pending'"
        class="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
        @click="$emit('toggle-status', task)"
      >
        Mark Complete
      </button>
      <button
        v-else
        class="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
        @click="$emit('toggle-status', task)"
      >
        Mark Pending
      </button>

      <button
        class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        @click="$emit('edit-task', task)"
      >
        Edit
      </button>
      <!-- FIX #3: Added data-testid for the delete button -->
      <button
        data-testid="delete-button"
        class="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
        @click="$emit('delete-task', task._id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit-task', 'delete-task', 'toggle-status']);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '';
  }
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

// This computed property is not used in the template, but it's fine to keep it.
// The test now checks for the 'line-through' class directly on the title element.
const taskClasses = computed(() => ({
  'line-through text-slate-500': props.task.status === 'completed',
}));
</script>