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
    tasksStore.fetchTasks();
  }
});

const calendarEvents = computed(() => {
  return (tasksStore.tasks || [])
    .filter((task) => task && task.dueDate)
    .map((task) => ({
      id: task._id,
      title: task.title,
      start: task.dueDate,
      allDay: true,
      classNames:
        task.status === "completed"
          ? ["fc-event-completed"]
          : ["fc-event-pending"],
      color: task.status === "completed" ? "#10B981" : "#F59E0B",
      extendedProps: {
        description: task.description,
        status: task.status,
      },
    }));
});

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  events: calendarEvents,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  editable: true,
  selectable: true,

  eventClick: function (info) {
    alert(
      "Task: " +
        info.event.title +
        "\nStatus: " +
        info.event.extendedProps.status
    );
  },
  dateClick: function (info) {
    alert("Clicked on date: " + info.dateStr);
  },
  eventDrop: async function (info) {
    const updatedDueDate = info.event.startStr;
    const taskId = info.event.id;

    if (
      !confirm(
        `Are you sure you want to reschedule "${info.event.title}" to ${updatedDueDate}?`
      )
    ) {
      info.revert();
      return;
    }

    try {
      await tasksStore.updateTask(taskId, { dueDate: updatedDueDate });
      toast.success(
        `Task "${info.event.title}" rescheduled to ${updatedDueDate}`
      );
    } catch (error) {
      toast.error("Failed to reschedule task.");
      info.revert();
    }
  },
  eventColor: "#378006",
  eventTextColor: "#ffffff",
});
</script>

<style>
.fc-button-primary {
  @apply bg-blue-600 text-white font-bold rounded-lg shadow-md transition-colors;
}

.fc-button-primary:hover {
  @apply bg-blue-700;
}

.fc-event-completed {
  @apply bg-green-500 !important;
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
