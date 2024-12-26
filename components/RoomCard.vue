<template>
  <div
    class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative flex"
  >
    <div class="flex-grow">
      <div class="flex justify-between items-center mb-2">
        <div class="flex">
          <h3 class="text-lg font-bold">{{ room.number }}</h3>
          <img
            :src="room.type === 'fan' ? FanIcon : AirConditioner"
            width="20"
          />
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="onEditRoom(room)"
            class="flex justify-center items-center w-6 h-6 p-1 rounded-full bg-slate-400 hover:bg-slate-600 text-white transition-colors duration-200"
            aria-label="Edit room details"
          >
            <i class="pi pi-pencil" size="16" />
          </button>

          <button
            @click="onEditCustomer(room)"
            class="flex justify-center items-center w-6 h-6 p-1 rounded-full bg-slate-400 hover:bg-slate-600 text-white transition-colors duration-200"
            aria-label="Edit room details"
          >
            <i class="pi pi-id-card" size="16" />
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-600">
        {{ room.customerName || "No customer" }}
      </p>
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
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import StatusIcon from "./StatusIcon.vue";
import FanIcon from "~/assets/icons/fan.svg";
import AirConditioner from "~/assets/icons/air-conditioner.svg";

const props = defineProps({
  room: {
    type: Object,
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
  onStatusChange: {
    type: Function,
    required: true,
  },
});

const statuses = ["available", "used", "unavailable"];
</script>

<style scoped>
/* Add any necessary styles */
</style>
