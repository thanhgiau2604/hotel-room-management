<template>
  <div
    class="bg-white p-4 rounded-lg shadow-md mb-8 w-full mx-auto max-w-[500px] flex justify-center gap-3"
  >
    <input type="date" v-model="filterDate" class="p-2 border rounded-md" />
    <div class="wrapper-radio flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-2">
        <RadioButton
          v-model="filterType"
          inputId="typeAll"
          name="typeAll"
          value="all"
        />
        <label for="typeAll">All</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton
          v-model="filterType"
          inputId="typeAc"
          name="typeAc"
          value="ac"
        />
        <label for="typeAc">AC</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton
          v-model="filterType"
          inputId="typeFan"
          name="typeFan"
          value="fan"
        />
        <label for="typeFan">Fan</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const filterDate = ref(new Date().toISOString().split("T")[0]);
const filterType = ref("all" as FilterRoomType);
const roomStore = useRoomStore();

watch(filterType, () => {
  roomStore.updateFilterType(filterType.value);
});
</script>

<style scoped>
.wrapper-radio {
  box-shadow: 0px 2px 3px -1px rgba(0, 0, 0, var(--p-form-field-b-weight)),
    0px 1px 0px 0px rgba(25, 28, 33, 0.02),
    0px 0px 0px 1px rgba(25, 28, 33, 0.08);
  @apply rounded-md px-2 border border-[#e5e7eb] border-solid;
}
</style>
