<!-- src/components/TaskForm.vue -->
<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
        {{ formTitle }}
      </h3>
      <div>
        <label for="title" class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
        <input 
          type="text" 
          id="title" 
          v-model="taskForm.title" 
          required 
          :disabled="tasksStore.loading"
          class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description (Optional)</label>
        <textarea 
          id="description" 
          rows="3" 
          v-model="taskForm.description"
          :disabled="tasksStore.loading"
          class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
      </div>
      <div>
        <label for="dueDate" class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Due Date (Optional)</label>
        <input 
          type="date" 
          id="dueDate" 
          v-model="taskForm.dueDate"
          :disabled="tasksStore.loading"
          class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
      </div>
      <div>
        <label for="status" class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Status</label>
        <select 
          id="status" 
          v-model="taskForm.status" 
          :disabled="tasksStore.loading"
          class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div v-if="tasksStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
        <span class="block sm:inline">Error: {{ tasksStore.error }}</span>
      </div>

      <div class="flex justify-end space-x-4">
        <button 
          type="button" 
          @click="$emit('close')" 
          :disabled="tasksStore.loading"
          class="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-100 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          :disabled="tasksStore.loading"
          class="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {{ tasksStore.loading ? 'Saving...' : 'Save Task' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useTasksStore } from '../stores/tasks'

const props = defineProps({
  taskToEdit: {
    type: Object,
    default: null, // If null, it's an add form; otherwise, it's an edit form
  },
})

const emit = defineEmits(['close', 'task-saved'])

const tasksStore = useTasksStore()

const initialFormState = {
  title: '',
  description: '',
  dueDate: '', // Initialize as empty string for date input
  status: 'pending',
}

const taskForm = ref({ ...initialFormState })

const formTitle = computed(() => (props.taskToEdit ? 'Edit Task' : 'Add New Task'))

// Watch for changes in taskToEdit prop to populate the form for editing
watch(() => props.taskToEdit, (newTask) => {
  if (newTask) {
    // Populate form with task data
    taskForm.value = { ...newTask }
    // Format dueDate for HTML input type="date"
    if (taskForm.value.dueDate) {
      taskForm.value.dueDate = new Date(taskForm.value.dueDate).toISOString().split('T')[0]
    }
  } else {
    // Reset form when no taskToEdit is provided (e.g., when opening for adding)
    Object.assign(taskForm.value, initialFormState)
  }
}, { immediate: true }) // Run immediately on component mount if taskToEdit is already present

const handleSubmit = async () => {
  // Ensure dueDate is null if empty string, as backend expects null
  const dataToSend = { ...taskForm.value };
  if (dataToSend.dueDate === '') {
    dataToSend.dueDate = null;
  }

  let success = false
  if (props.taskToEdit) {
    // Editing existing task
    success = await tasksStore.updateTask(props.taskToEdit._id, dataToSend)
  } else {
    // Adding new task
    success = await tasksStore.addTask(dataToSend)
  }

  if (success) {
    emit('task-saved') // Inform parent that task was saved
    emit('close') // Close the form
    Object.assign(taskForm.value, initialFormState) // Reset form state
  }
  // Error handling is managed by the Pinia store which shows a toast
}
</script>