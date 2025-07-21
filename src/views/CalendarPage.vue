<!-- src/views/CalendarPage.vue -->
<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
      Task Calendar
    </h1>

    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <div
        v-if="tasksStore.loading"
        class="text-center text-slate-500 dark:text-slate-400 py-8"
      >
        <svg
          class="animate-spin h-8 w-8 text-green-500 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
        <p class="mt-4">Loading calendar tasks...</p>
      </div>
      <div
        v-else-if="tasksStore.error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
        role="alert"
      >
        <span class="block sm:inline"
          >Error loading tasks: {{ tasksStore.error }}</span
        >
      </div>
      <div v-else>
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
// CSS imports are no longer needed for FullCalendar v6+.
// The JavaScript plugins now handle their own styles automatically.

import { ref, onMounted, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useTasksStore } from "../stores/tasks";
import { useAuthStore } from "../stores/auth";
import { useToast } from "vue-toastification";

const tasksStore = useTasksStore();
const authStore = useAuthStore();
const toast = useToast();

onMounted(() => {
  if (authStore.isAuthenticated) {
    // Only fetch if authenticated
    tasksStore.fetchTasks(); // Fetch tasks when component mounts
  }
});

// --- FullCalendar Event Handling ---

// 1. Transform tasks from Pinia store into FullCalendar event format
const calendarEvents = computed(() => {
  return (tasksStore.tasks || [])
    .filter((task) => task.dueDate) // Only include tasks with a due date
    .map((task) => ({
      id: task._id, // Use backend task ID as event ID
      title: task.title,
      start: task.dueDate, // FullCalendar uses 'start' for event date
      allDay: true, // Assuming tasks are all-day events unless you have start/end times
      classNames:
        task.status === "completed"
          ? ["fc-event-completed"]
          : ["fc-event-pending"], // Custom classes for styling
      color: task.status === "completed" ? "#10B981" : "#F59E0B", // Tailwind green-500, yellow-500
      extendedProps: {
        // Store original task data if needed for eventClick
        description: task.description,
        status: task.status,
      },
    }));
});

// 2. Define FullCalendar Options
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth", // Default view when calendar loads
  events: calendarEvents, // This reactive computed property feeds events to the calendar

  // --- Header Toolbar ---
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay", // Views available in the header
  },

  // --- Interaction (Drag & Drop, Clicking) ---
  editable: true, // Allows drag & drop event resizing and moving
  selectable: true, // Allows users to select dates on the calendar
  // eventDurationEditable: true, // If your tasks have start/end times

  // Callbacks for interactions
  eventClick: function (info) {
    // Fired when an event (task) is clicked
    alert(
      "Task: " +
        info.event.title +
        "\nStatus: " +
        info.event.extendedProps.status
    );
    // You could open a modal here to show task details or allow editing
    // Example: openEditTaskForm(tasksStore.tasks.find(t => t._id === info.event.id));
  },
  dateClick: function (info) {
    // Fired when a date is clicked
    alert("Clicked on date: " + info.dateStr);
    // You could open a new task modal here and pre-fill the due date
    // Example: openAddTaskFormWithDate(info.dateStr);
  },
  eventDrop: async function (info) {
    // Fired when an event is dragged and dropped to a new date
    const updatedDueDate = info.event.startStr; // The new date
    const taskId = info.event.id; // The task's _id

    if (
      !confirm(
        `Are you sure you want to reschedule "${info.event.title}" to ${updatedDueDate}?`
      )
    ) {
      info.revert(); // If user cancels, revert the change
      return;
    }

    try {
      await tasksStore.updateTask(taskId, { dueDate: updatedDueDate });
      toast.success(
        `Task "${info.event.title}" rescheduled to ${updatedDueDate}`
      );
    } catch (error) {
      toast.error("Failed to reschedule task.");
      info.revert(); // Revert on API error
    }
  },
  // eventResize: function(info) { // If you had duration for tasks
  //   // Fired when an event's duration is resized
  //   alert('Event resized to ' + info.event.endStr);
  //   // You'd update tasksStore.updateTask here with new end date
  // },

  // --- Custom Styling (Tailwind-like colors) ---
  // Event styling
  eventColor: "#378006", // Default event background color (if not set per event)
  eventTextColor: "#ffffff", // Default event text color
  // You can override FullCalendar's default button/background colors with global CSS if needed.
});
</script>

<style>
/* Keep your custom styling here */
.fc-button-primary {
  @apply bg-blue-600 text-white font-bold rounded-lg shadow-md transition-colors;
}

.fc-button-primary:hover {
  @apply bg-blue-700;
}

.fc-event-completed {
  @apply bg-green-500 !important; /* Use !important to override FullCalendar's default */
  border-color: theme("colors.green.600") !important;
}

.fc-event-pending {
  @apply bg-yellow-500 !important;
  border-color: theme("colors.yellow.600") !important;
}

.fc {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}
</style>
