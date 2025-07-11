<template>
  <button
    :class="[
      'py-2 px-4 rounded-lg font-bold transition duration-200',
      variantClasses,
      { 'opacity-75 cursor-not-allowed': disabled },
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary", // primary, danger, success, secondary
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case "primary":
      return "bg-blue-600 text-white hover:bg-blue-700";
    case "danger":
      return "bg-red-500 text-white hover:bg-red-600";
    case "success":
      return "bg-green-500 text-white hover:bg-green-600";
    case "secondary":
      return "bg-gray-300 text-gray-800 hover:bg-gray-400";
    default:
      return "bg-blue-600 text-white hover:bg-blue-700";
  }
});
</script>