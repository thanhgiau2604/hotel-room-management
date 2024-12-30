<template>
  <div>
    <Toast />
    <div class="bg-main-4 w-screen h-screen flex">
      <LeftPanel />
      <MainSection />
    </div>
    <BottomAction />
  </div>
</template>

<script lang="ts" setup>
import LeftPanel from "~/components/LeftPanel.vue";
import BottomAction from "~/components/BottomAction.vue";
import MainSection from "~/components/MainSection.vue";
import { useRoomStore } from "~/stores/rooms";

const roomStore = useRoomStore();

onMounted(async () => {
  await roomStore.fetchRoom();
});
</script>
