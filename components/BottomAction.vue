<template>
  <div
    class="fixed bottom-0 left-0 right-0 bg-main-1 text-white p-4 flex justify-around"
  >
    <Button icon="pi pi-sun" class="action-btn" />
    <Button icon="pi pi-moon" class="action-btn" />
  </div>
</template>

<script setup lang="ts">
import { Button } from "primevue";
</script>

<style scoped>
.action-btn {
  @apply p-2 rounded-full bg-main-5 hover:bg-inherit hover:brightness-110 transition-colors duration-200 text-2xl border-none;
}
</style>
