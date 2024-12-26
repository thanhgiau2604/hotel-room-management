<template>
  <div class="bg-[#E9EFEC] min-h-screen">
    <div
      :class="[
        'transition-all',
        'duration-300',
        'ease-in-out',
        isPanelOpen ? 'ml-64' : 'ml-16',
      ]"
    >
      <div class="p-8">
        <FilterBox />
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <RoomCard
            v-for="room in rooms"
            :key="room.id"
            :room="room"
            @editRoom="handleEditRoom"
            @editCustomer="handleEditCustomer"
            @statusChange="handleStatusChange"
          />
        </div>
      </div>
    </div>
    <RoomConfigModal
      :config_visible="visibleConfig"
      @update:config_visible="visibleConfig = $event"
    />

    <CustomerInfoModal
      :customer_visible="visibleCustomer"
      @update:customer_visible="visibleCustomer = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import RoomConfigModal from "~/components/modals/RoomConfig.vue";
import CustomerInfoModal from "~/components/modals/CustomerInfo.vue";
import FilterBox from "./FilterBox.vue";
import RoomCard from "./RoomCard.vue";

// Reactive state
const isPanelOpen = ref(false);
const rooms = ref([
  {
    id: 1,
    number: "101",
    status: "available",
    type: "fan",
    customerName: "",
    note: "",
    usedBy: "hour",
  },
  {
    id: 2,
    number: "102",
    status: "used",
    type: "air-conditioned",
    customerName: "John Doe",
    note: "VIP guest",
    usedBy: "day",
  },
  {
    id: 3,
    number: "103",
    status: "unavailable",
    type: "fan",
    customerName: "",
    note: "Under maintenance",
    usedBy: "hour",
  },
  {
    id: 4,
    number: "104",
    status: "available",
    type: "air-conditioned",
    customerName: "",
    note: "",
    usedBy: "hour",
  },
  {
    id: 5,
    number: "105",
    status: "used",
    type: "fan",
    customerName: "Jane Smith",
    note: "",
    usedBy: "hour",
  },
  {
    id: 6,
    number: "106",
    status: "available",
    type: "air-conditioned",
    customerName: "",
    note: "",
    usedBy: "day",
  },
  {
    id: 7,
    number: "107",
    status: "used",
    type: "fan",
    customerName: "Bob Johnson",
    note: "Late checkout",
    usedBy: "day",
  },
  {
    id: 8,
    number: "108",
    status: "unavailable",
    type: "air-conditioned",
    customerName: "",
    note: "Cleaning",
    usedBy: "hour",
  },
]);
const editingRoom = ref(null);
const visibleConfig = ref(false);
const visibleCustomer = ref(false);

// Computed statistics
const stats = computed(() => ({
  available: rooms.value.filter((r) => r.status === "available").length,
  used: rooms.value.filter((r) => r.status === "used").length,
  upcoming: 2,
}));

// Methods
const handleEditRoom = (room: any) => {
  editingRoom.value = room;
  visibleConfig.value = true;
};

const handleEditCustomer = (customer: any) => {
  visibleCustomer.value = true;
};

const handleSaveRoom = (editedRoom: any) => {
  rooms.value = rooms.value.map((r) =>
    r.id === editedRoom.id ? editedRoom : r
  );
  editingRoom.value = null;
};

const handleStatusChange = (roomId: any, newStatus: any) => {
  rooms.value = rooms.value.map((r) =>
    r.id === roomId ? { ...r, status: newStatus } : r
  );
};
</script>

<style scoped>
/* Add any specific styles here */
</style>
