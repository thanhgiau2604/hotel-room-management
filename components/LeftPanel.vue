<template>
  <div
    class="relative h-full bg-main-2 text-white transition-all duration-300 ease-in-out"
    :class="{ 'w-64': settings.openPanel, 'w-16': !settings.openPanel }"
  >
    <Button
      class="w-9 h-8 absolute top-4 right-4 p-2 rounded-full bg-main-1 hover:bg-main-3 hover:text-main-1 transition-colors duration-200"
      :icon="settings.openPanel ? 'pi pi-chevron-left' : 'pi pi-chevron-right'"
      @click="togglePanel"
    >
    </Button>
    <div class="p-4 mt-16">
      <Transition name="fade-delay">
        <div v-if="settings.openPanel" class="leading-6">
          <h2 class="text-xl font-bold mb-4">Room Stats</h2>
          <p><strong>Available:</strong> {{ stats.available }}</p>
          <p><strong>Used:</strong> {{ stats.used }}</p>
          <p><strong>Upcoming:</strong> {{ stats.upcoming }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "primevue";
const settingStore = useSettingStore();

const { settings } = storeToRefs(settingStore);

const stats = {
  available: 2,
  used: 1,
  upcoming: 1,
};

const togglePanel = () => {
  settingStore.togglePanel();
};
</script>

<style>
.fade-delay-enter-active {
  transition: opacity 0.3s ease 0.3s; /* Add a delay to both enter and leave */
}

.fade-delay-leave-active {
  transition: opacity 0s ease;
}

.fade-delay-enter-from,
.fade-delay-leave-to {
  opacity: 0;
}
.fade-delay-enter-to,
.fade-delay-leave-from {
  opacity: 1;
}
</style>
