<template>
  <div class="flex items-center mb-2">
    <!-- Show image if the 'image' prop is true -->
    <template v-if="image">
      <img :src="src" alt="icon" width="15" class="brightness-[100] mr-1" />
    </template>

    <!-- Otherwise, show icon if isIcon is true -->
    <template v-else-if="isIcon">
      <i :class="icon" style="font-size: 15px; color: white" class="mr-1"></i>
    </template>

    <div v-if="label" class="w-[90px] font-bold">
      {{ label }}<span v-if="label">:</span>
    </div>

    <div
      :class="props.class"
      class="px-1 rounded text-white w-6 bg-[#126358] h-5 flex justify-center items-center"
    >
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
  icon?: string;
  src?: string;
  value: string | number;
  isIcon?: boolean;
  image?: boolean;
  class?: string;
}

const props = defineProps<Props>();
</script>
