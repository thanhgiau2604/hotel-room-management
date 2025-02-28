<template>
  <div class="transition-all duration-300 ease-in-out w-full relative">
    <div className="p-8">
      <RoomList />
      <Transition
        :duration="1000"
        name="fade"
        mode="out-in"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <ProgressSpinner
          v-if="loading.includes('fetchRooms') && !rooms.length"
          style="width: 50px; height: 50px"
          strokeWidth="4"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoomList from "./RoomList.vue";
const roomStore = useRoomStore();
const { loading, rooms } = storeToRefs(roomStore);
</script>
