<template>
  <Dialog
    :visible="config_visible"
    modal
    header="Room configuration"
    class="w-[25rem] p-3"
    @update:visible="closeModal"
  >
    <div class="flex items-center gap-4 mb-8">
      <label for="notes" class="font-semibold w-24">Room type</label>
      <SelectButton v-model="value" :options="options" size="small" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" @click="closeModal"></Button>
      <Button
        type="button"
        label="Save"
        @click="closeModal"
        class="main-btn"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  config_visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:config_visible"]);

// Emit an event to the parent with the new value
const closeModal = () => {
  emit("update:config_visible", false);
};

const value = ref("Fan");
const options = ref(["Fan", "Air-Conditioner"]);
</script>
