<template>
  <div
    class="bg-white p-4 rounded-lg shadow-md mb-8 w-full mx-auto max-w-[500px] text-center"
  >
    <input type="date" v-model="filterDate" class="p-2 border rounded-md" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const filterDate = ref(new Date().toISOString().split("T")[0]);
</script>

<style scoped>
/* Custom styles (if needed) */
</style>
