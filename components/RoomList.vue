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
        <TransitionGroup
          name="list"
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <RoomCard
            v-for="room in rooms"
            :key="room.id"
            :room="room"
            @editRoom="handleEditRoom"
            @editCustomer="handleEditCustomer"
            @paymentRoom="handlePaymentRoom"
            @statusChange="handleStatusChange"
          />
        </TransitionGroup>
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

    <PaymentRoomModal
      :payment_visible="visiblePayment"
      @update:payment_visible="visiblePayment = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import RoomConfigModal from "~/components/modals/RoomConfig.vue";
import CustomerInfoModal from "~/components/modals/CustomerInfo.vue";
import PaymentRoomModal from "~/components/modals/PaymentRoom.vue";
import FilterBox from "./FilterBox.vue";
import RoomCard from "./RoomCard.vue";
import { useRoomStore, type Room } from "~/stores/rooms";
import { useToast } from "primevue/usetoast";

const roomStore = useRoomStore();
const rooms = computed(() => roomStore.rooms);

// toast
const toast = useToast();

// Reactive state
const isPanelOpen = ref(false);
const visibleConfig = ref(false);
const visibleCustomer = ref(false);
const visiblePayment = ref(false);

// Computed statistics
const stats = computed(() => ({
  available: rooms.value.filter((r) => r.status === "available").length,
  used: rooms.value.filter((r) => r.status === "being_used").length,
  upcoming: 2,
}));

// Methods
const handleEditRoom = (room: Room) => {
  visibleConfig.value = true;
  roomStore.currentRoom = room;
};

const handleEditCustomer = (room: Room) => {
  visibleCustomer.value = true;
  roomStore.currentRoom = room;
};

const handlePaymentRoom = (room: Room) => {
  roomStore.currentRoom = room;
  visiblePayment.value = true;
};

const handleSaveRoom = (editedRoom: any) => {
  const newRooms = rooms.value.map((r) =>
    r.id === editedRoom.id ? editedRoom : r
  );
  roomStore.currentRoom = undefined;
};

const handleStatusChange = async (
  roomId: string,
  newStatus: Room["status"]
) => {
  const error = await roomStore.changeRoomStatus(roomId, newStatus);
  if (error) {
    toast.add({
      severity: "error",
      summary: error,
      life: 5000,
    });
  }
  roomStore.fetchRoom();
};

watch(visibleConfig, () => {
  if (visibleConfig.value === false) {
    roomStore.currentRoom = undefined;
  }
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.6s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
