<template>
  <div
    class="relative h-full bg-main-2 text-white transition-all duration-300 ease-in-out"
    :class="{ 'w-64': settings.openPanel, 'w-16': !settings.openPanel }"
  >
    <Button
      class="btn-toggle"
      :icon="settings.openPanel ? 'pi pi-chevron-left' : 'pi pi-chevron-right'"
      @click="togglePanel"
    />

    <div class="p-4 mt-16">
      <!-- Expanded Panel -->
      <Transition name="fade-delay">
        <div v-if="settings.openPanel" class="leading-6">
          <div class="mb-4 flex gap-1 items-center">
            <img :src="HotelIcon" alt="Hotel" width="30" />
            <h2 class="text-xl font-bold">Room Stats</h2>
          </div>
          <StatDisplay
            image
            :src="ACIcon"
            label="Available AC"
            :value="formattedStats.ac"
          />
          <StatDisplay
            image
            :src="FanIcon"
            label="Available Fan"
            :value="formattedStats.fan"
          />
          <StatDisplay
            :icon="'pi pi-users'"
            :isIcon="true"
            label="Being Used"
            :value="formattedStats.using"
          />

          <NuxtLink to="/">
            <Button
              icon="pi pi-home"
              aria-label="home"
              label="Home"
              severity="secondary"
              class="px-2 py-1 mb-1 w-full transparent-btn"
              raised
            />
          </NuxtLink>

          <NuxtLink to="/history">
            <Button
              icon="pi pi-history"
              aria-label="history"
              label="View History"
              severity="secondary"
              class="px-2 py-1 w-full transparent-btn"
              raised
            />
          </NuxtLink>
        </div>
      </Transition>

      <!-- Collapsed Panel -->
      <Transition name="fade-delay">
        <div v-if="!settings.openPanel">
          <img :src="HotelIcon" alt="Hotel" class="mb-4" width="30" />
          <div class="-ml-2">
            <StatDisplay image :src="ACIcon" :value="formattedStats.ac" />
            <StatDisplay image :src="FanIcon" :value="formattedStats.fan" />
            <StatDisplay
              :icon="'pi pi-users'"
              :isIcon="true"
              :value="formattedStats.using"
            />
          </div>

          <NuxtLink to="/">
            <Button
              icon="pi pi-home"
              aria-label="home"
              label=""
              severity="secondary"
              class="px-2 py-1 mb-1 w-full transparent-btn"
              raised
            />
          </NuxtLink>

          <NuxtLink to="/history">
            <Button
              icon="pi pi-history"
              aria-label="history"
              label=""
              severity="secondary"
              class="px-2 py-1 w-full transparent-btn"
              raised
            />
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import StatDisplay from "~/components/StatDisplay.vue";

import HotelIcon from "~/assets/icons/hotel.png";
import FanIcon from "~/assets/icons/fan.svg";
import ACIcon from "~/assets/icons/air-conditioner.svg";

const settingStore = useSettingStore();
const roomStore = useRoomStore();

const { settings } = storeToRefs(settingStore);
const { stats } = storeToRefs(roomStore);

const formattedStats = computed(() => ({
  ac: formatNumber(stats.value.ac),
  fan: formatNumber(stats.value.fan),
  using: formatNumber(stats.value.using),
}));

function formatNumber(num?: Number): string {
  if (num === undefined) return "";
  return Number(num) < 10 ? `0${num}` : `${num}`;
}

const togglePanel = () => {
  settingStore.togglePanel();
};
</script>

<style scoped>
.fade-delay-enter-active {
  transition: opacity 0.3s ease 0.5s;
}
.fade-delay-enter-from,
.fade-delay-leave-to {
  opacity: 0;
}
.fade-delay-enter-to,
.fade-delay-leave-from {
  opacity: 1;
}

.btn-toggle {
  @apply w-9 h-8 absolute top-4 right-4 p-2 rounded-full border-none bg-main-1 hover:bg-main-2 hover:text-main-1 transition-colors duration-200;
}
</style>
