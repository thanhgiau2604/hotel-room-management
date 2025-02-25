<template>
  <div
    class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative flex flex-col"
  >
    <div class="flex">
      <div class="flex-grow">
        <div class="flex justify-between items-center mb-2">
          <div class="flex">
            <h3 class="text-lg font-bold text-main-1 mr-1">{{ room.name }}</h3>
            <img
              :src="room.room_type === 'fan' ? FanIcon : AirConditioner"
              width="20"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-col justify-between ml-4 shadow-slate-300 shadow-md p-1 rounded-md gap-1"
      >
        <StatusIcon
          v-for="status in statuses"
          :key="status"
          :status="status"
          :isSelected="room.status === status"
          @click="onStatusChange(room.id, status)"
        />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="onEditCustomer(room)"
        class="flex justify-center items-center w-6 h-6 p-1 rounded-full bg-main-2 hover:bg-main-1 text-white transition-colors duration-200"
        aria-label="Edit customer info"
      >
        <i class="pi pi-id-card" size="16" />
      </button>

      <button
        @click="onPaymentRoom(room)"
        class="flex justify-center items-center w-6 h-6 p-1 rounded-full bg-main-2 hover:bg-main-1 text-white transition-colors duration-200"
        aria-label="Payment room"
      >
        <i class="pi pi-dollar" size="16" />
      </button>

      <button
        @click="onEditRoom(room)"
        class="flex justify-center items-center w-6 h-6 p-1 rounded-full bg-main-2 hover:bg-main-1 text-white transition-colors duration-200"
        aria-label="Edit room details"
      >
        <i class="pi pi-pencil text-xs" size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import StatusIcon from "./StatusIcon.vue";
import FanIcon from "~/assets/icons/fan.svg";
import AirConditioner from "~/assets/icons/air-conditioner.svg";
import type { Room } from "~/stores/rooms";

const props = defineProps({
  room: {
    type: Object as PropType<Room>,
    required: true,
  },
  onEditRoom: {
    type: Function,
    required: true,
  },
  onEditCustomer: {
    type: Function,
    required: true,
  },
  onPaymentRoom: {
    type: Function,
    required: true,
  },
  onStatusChange: {
    type: Function,
    required: true,
  },
});

const statuses = ["available", "being_used", "unavailable"];
</script>

<style scoped>
/* Add any necessary styles */
</style>
