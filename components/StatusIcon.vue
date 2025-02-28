<template>
  <button
    :class="[
      baseClasses,
      isSelected ? selectedClasses + selectedColor : '',
      statusClass,
      hoverClass,
    ]"
    @click="handleClick"
    :disabled="isDisabled"
  >
    <i :class="iconName" style="font-size: 11px" />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, type PropType } from "vue";
import { ROOM_STATUES } from "~/constant";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  currentStatus: {
    type: String as PropType<RoomStatus>,
    required: true,
  },
  onClick: {
    type: Function,
    required: true,
  },
});

const isSelected = computed(() => props.status === props.currentStatus);

const isDisabled = computed(() => {
  const { status, currentStatus } = props;
  if (currentStatus === ROOM_STATUES[1]) {
    return status === ROOM_STATUES[2];
  } else if (currentStatus === ROOM_STATUES[2]) {
    return status === ROOM_STATUES[1] || status === ROOM_STATUES[3];
  } else {
    return status === ROOM_STATUES[2];
  }
});

const emit = defineEmits();

// Base and selected class styles
const baseClasses =
  "btnStatus flex justify-center items-center p-1 rounded-full transition-all duration-200 cursor-pointer w-4 h-4 ";
const selectedClasses = "ring-1 ring-offset-1 ";

const statusClass = computed(() => {
  switch (props.status) {
    case "available":
      return "text-main-1 hover:bg-main-4";
    case "used":
      return "text-main-1 hover:bg-main-4";
    case "unavailable":
      return "text-main-1 hover:bg-main-4";
    default:
      return "";
  }
});

const selectedColor = computed(() => {
  switch (props.status) {
    case "available":
      return "ring-green-500";
    case "being_used":
      return "ring-red-500";
    case "unavailable":
      return "ring-yellow-500";
    default:
      return "";
  }
});

const hoverClass = computed(() => {
  switch (props.status) {
    case "available":
      return "hover:bg-green-100";
    case "being_used":
      return "hover:bg-red-100";
    case "unavailable":
      return "hover:bg-yellow-100";
    default:
      return "";
  }
});

const iconName = computed(() => {
  switch (props.status) {
    case "available":
      return "pi pi-check";
    case "being_used":
      return "pi pi-users";
    case "unavailable":
      return "pi pi-wrench";
    default:
      return "";
  }
});

// Handle click event
const handleClick = () => {
  // Call the passed onClick function
  if (typeof props.onClick === "function") {
    props.onClick();
  }
};
</script>

<style lang="scss" scoped>
.btnStatus:disabled {
  @apply opacity-40 cursor-not-allowed;
  @apply hover:bg-transparent;
}
</style>
