<template>
  <Dialog
    :visible="customer_visible"
    modal
    header="Customer information"
    class="w-[30rem] px-5 py-6"
    @update:visible="closeModal"
  >
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onSubmitCustomer"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-[100px]">Start time</label>
        <DatePicker
          id="datepicker-24h"
          v-model="initialValues.start_time"
          showTime
          hourFormat="24"
          fluid
          size="small"
          name="start_time"
          class="text-xs"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-[100px]">Customer name</label>
        <InputText
          name="name"
          class="flex-auto p-2 rounded-md"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="note" class="font-semibold w-[100px]">Notes</label>
        <Textarea
          name="note"
          rows="5"
          class="grow resize-none p-2 rounded-md"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="upload_image" class="font-semibold w-[100px]"
          >Choose image</label
        >
        <FileUpload
          mode="basic"
          name="upload_image"
          accept="image/*"
          :maxFileSize="1000000"
          @select="(e) => onFileSelect(e)"
          customUpload
          auto
          chooseLabel="Browse"
          class="bg-transparent border-surface-300 text-gray-600 hover:enabled:border-inherit hover:enabled:bg-inherit hover:enabled:brightness-75"
        />
      </div>
      <InputText
        name="image"
        class="flex-auto p-2 rounded-md"
        autocomplete="off"
        hidden
      />
      <div
        v-if="!!initialValues?.image"
        class="flex items-center justify-center gap-4 mb-8"
      >
        <Image
          :src="getImageUrl(initialValues.image)"
          alt="Image"
          width="100%"
          class="max-w-[300px]"
          preview
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          @click="closeModal"
          class="cancel-btn"
          :disabled="loading.includes('updateCustomerInfo')"
        ></Button>
        <Button
          type="submit"
          label="Book"
          class="main-btn"
          :loading="loading.includes('updateCustomerInfo')"
        ></Button>
      </div>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { defineProps, defineEmits } from "vue";
import { useToast } from "primevue/usetoast";
import type { FileUploadSelectEvent } from "primevue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import type { Timestamp } from "firebase/firestore";
const toast = useToast();
const roomStore = useRoomStore();
const { loading } = storeToRefs(roomStore);

const props = defineProps({
  customer_visible: {
    type: Boolean,
    required: true,
  },
});

const initialValues = ref({
  name: "",
  note: "",
  image: "",
  start_time: new Date(),
});

const customerSchema = z.object({
  name: z.string(),
  note: z.string(),
  image: z.string(),
  start_time: z.date(),
});

const resolver = ref(zodResolver(customerSchema));

watch(
  () => roomStore.currentRoom,
  (value) => {
    initialValues.value = {
      name: value?.customer_info?.name || "",
      note: value?.customer_info?.note || "",
      image: value?.customer_info?.image || "",
      start_time: value?.customer_info?.start_time
        ? (value?.customer_info?.start_time as Timestamp).toDate()
        : new Date(),
    };
  }
);

const onSubmitCustomer = async (data: FormSubmitEvent) => {
  const payload = {
    ...data.values,
    image: initialValues.value.image,
  } as z.infer<typeof customerSchema>;

  const roomId = roomStore.currentRoom?.id;

  if (!roomId) {
    msgError(toast, "Not found document id");
    return;
  }

  console.log(payload);

  const error = await roomStore.updateCustomerInfo(roomId, payload);

  if (!error) {
    msgSuccess(toast, "Customer info has been updated!");
    closeModal();
  } else {
    msgError(toast, "An error occured when update customer info");
  }
};

const supabase = useSupabaseClient();

async function onFileSelect(event: FileUploadSelectEvent) {
  const file = event.files[0];
  const fileName = `${new Date().getTime()}`;
  const { data, error } = await supabase.storage
    .from("room-users")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    msgError(toast, "An error occured while uploading the file", error.message);
  } else {
    initialValues.value = {
      ...initialValues.value,
      image: data.fullPath,
    };

    msgSuccess(toast, "Upload file success!");
  }
}

const emit = defineEmits(["update:customer_visible"]);

// Emit an event to the parent with the new value
const closeModal = () => {
  emit("update:customer_visible", false);
};
</script>
