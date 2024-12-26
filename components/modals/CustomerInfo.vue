<template>
  <Dialog
    :visible="customer_visible"
    modal
    header="Room configuration"
    class="w-[30rem] px-5 py-6"
    @update:visible="closeModal"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="customer-name" class="font-semibold w-[100px]"
        >Customer name</label
      >
      <InputText
        id="customer-name"
        class="flex-auto p-2 rounded-md focus:shadow-slate-300 focus:shadow-md"
        autocomplete="off"
      />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="notes" class="font-semibold w-[100px]">Notes</label>
      <Textarea
        id="notes"
        rows="5"
        class="w-full resize-none p-2 rounded-md focus:shadow-slate-300 focus:shadow-md"
      />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="notes" class="font-semibold w-[100px]">Choose image</label>
      <FileUpload
        mode="basic"
        name="demo[]"
        url="/api/upload"
        accept="image/*"
        :maxFileSize="1000000"
        @upload="onUpload"
        :auto="true"
        chooseLabel="Browse"
      />
    </div>
    <div class="flex items-center justify-center gap-4 mb-8">
      <Image
        src="https://i2.wp.com/digital-photography-school.com/wp-content/uploads/2021/03/landscape-photography-tips-4.jpg?resize=1500%2C908&ssl=1"
        alt="Image"
        width="100%"
        class="max-w-[300px]"
        preview
      />
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
import { useToast } from "primevue/usetoast";
const toast = useToast();

const props = defineProps({
  customer_visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:customer_visible"]);

// Emit an event to the parent with the new value
const closeModal = () => {
  emit("update:customer_visible", false);
};

const onUpload = (event: any) => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};
</script>
