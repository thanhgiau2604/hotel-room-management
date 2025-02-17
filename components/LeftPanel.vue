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
          <div class="text-green-100 flex mb-2">
            <div class="w-[90px] font-bold">Available ac:</div>
            <div class="bg-green-100 px-1 rounded text-black w-6 text-center">
              {{ Number(stats.ac) < 10 ? `0${stats.ac}` : stats.ac }}
            </div>
          </div>
          <div class="text-blue-100 flex mb-2">
            <div class="w-[90px] font-bold">Available fan:</div>
            <div class="bg-blue-100 px-1 rounded text-black w-6 text-center">
              {{ Number(stats.fan) < 10 ? `0${stats.fan}` : stats.fan }}
            </div>
          </div>
          <div class="text-orange-100 flex mb-5">
            <div class="w-[90px] font-bold">Being used:</div>
            <div class="bg-orange-100 px-1 rounded text-black w-6 text-center">
              {{ Number(stats.using) < 10 ? `0${stats.using}` : stats.using }}
            </div>
          </div>

          <NuxtLink to="/">
            <Button
              icon="pi pi-home"
              aria-label="home"
              label="Home"
              severity="secondary"
              class="px-2 py-1 mb-1 w-full"
              raised
            />
          </NuxtLink>

          <NuxtLink to="/history">
            <Button
              icon="pi pi-history"
              aria-label="history"
              label="View History"
              severity="secondary"
              class="px-2 py-1 w-full"
              raised
            />
          </NuxtLink>
        </div>
      </Transition>

      <Transition name="fade-delay">
        <div v-if="!settings.openPanel">
          <img :src="HotelIcon" width="auto" class="mb-4" />
          <div class="text-green-100 flex mb-4 gap-1 -ml-2">
            <img :src="ACIcon" width="15" class="brightness-[100]" />
            <div class="bg-green-100 px-1 rounded text-black w-6 text-center">
              {{ Number(stats.ac) < 10 ? `0${stats.ac}` : stats.ac }}
            </div>
          </div>
          <div class="text-blue-100 flex mb-4 gap-1 -ml-2">
            <img :src="FanIcon" width="15" class="brightness-[100]" />
            <div class="bg-blue-100 px-1 rounded text-black w-6 text-center">
              {{ Number(stats.fan) < 10 ? `0${stats.fan}` : stats.fan }}
            </div>
          </div>

          <div class="text-orange-100 flex mb-5 gap-1 -ml-2">
            <i class="pi pi-users" style="font-size: 15px; color: white" />
            <div class="bg-orange-100 px-1 rounded text-black w-6 text-center">
              {{ Number(stats.using) < 10 ? `0${stats.using}` : stats.using }}
            </div>
          </div>

          <NuxtLink to="/">
            <Button
              icon="pi pi-home"
              aria-label="home"
              label=""
              severity="secondary"
              class="px-2 py-1 mb-1 w-full"
              raised
            />
          </NuxtLink>

          <NuxtLink to="/history">
            <Button
              icon="pi pi-history"
              aria-label="history"
              label=""
              severity="secondary"
              class="px-2 py-1 w-full"
              raised
            />
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "primevue";
import HotelIcon from "~/assets/icons/hotel.png";
import FanIcon from "~/assets/icons/fan.svg";
import ACIcon from "~/assets/icons/air-conditioner.svg";
const settingStore = useSettingStore();
const roomStore = useRoomStore();

const { settings } = storeToRefs(settingStore);
const { stats } = storeToRefs(roomStore);

const togglePanel = () => {
  settingStore.togglePanel();
};
</script>

<style>
.fade-delay-enter-active {
  transition: opacity 0.3s ease 0.5s; /* Add a delay to both enter and leave */
}

.fade-delay-leave-active {
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
