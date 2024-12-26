<template>
  <div
    class="fixed bottom-0 left-0 right-0 bg-[#16423C] text-white p-4 flex justify-around"
  >
    <Button
      class="p-2 rounded-full hover:bg-[#6A9C89] transition-colors duration-200"
      icon="pi pi-sun"
      :style="{ fontSize: '24px' }"
    />
    <Button
      class="p-2 rounded-full hover:bg-[#6A9C89] transition-colors duration-200"
      icon="pi pi-moon"
      :style="{ fontSize: '24px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from "primevue";
</script>

<style lang=""></style>
