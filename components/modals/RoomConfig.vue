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
      <SelectButton
        v-model="roomTypeValue"
        :options="options"
        optionLabel="name"
        size="small"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        @click="closeModal"
        class="cancel-btn"
      ></Button>
      <Button
        type="button"
        label="Save"
        @click="submitModal"
        class="main-btn"
        :loading="loading"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import { useRoomStore, type Room } from "~/stores/rooms";
import { useToast } from "primevue/usetoast";
import { ERRORS, ROOM_TYPE } from "~/constant";

const roomStore = useRoomStore();
const toast = useToast();
const loading = ref(false);

const props = defineProps({
  config_visible: {
    type: Boolean,
    required: true,
  },
});

const options = ref(ROOM_TYPE);
const roomTypeValue = ref();

const emit = defineEmits(["update:config_visible"]);

const closeModal = () => {
  emit("update:config_visible", false);
};

const submitModal = async () => {
  const { currentRoom } = roomStore;
  if (!currentRoom) {
    msgError(toast, ERRORS.unknown);
    emit("update:config_visible", false);
    return;
  }

  loading.value = true;
  const error = await roomStore.changeRoomType(
    currentRoom.id,
    roomTypeValue.value.value as "fan" | "ac"
  );
  emit("update:config_visible", false);
  loading.value = false;

  if (error) {
    msgError(toast, ERRORS.failed);
  }
};

watch(
  () => roomStore.currentRoom,
  (newRoom) => {
    roomTypeValue.value =
      newRoom?.room_type === "ac" ? ROOM_TYPE[1] : ROOM_TYPE[0];
  },
  { deep: true, immediate: true }
);
</script>
