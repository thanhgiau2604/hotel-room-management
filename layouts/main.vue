<template>
  <div>
    <Toast />
    <div class="bg-main-4 w-screen h-screen flex">
      <LeftPanel />
      <slot />
    </div>
    <BottomAction />
  </div>
</template>

<script lang="ts" setup>
import LeftPanel from "~/components/LeftPanel.vue";
import BottomAction from "~/components/BottomAction.vue";

import { useRoomStore } from "~/stores/rooms";

const roomStore = useRoomStore();

onMounted(async () => {
  await Promise.all([roomStore.fetchRoom(), roomStore.getStats()]);
});
</script>
