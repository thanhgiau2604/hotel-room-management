<template>
  <div class="min-h-screen flex items-center justify-center bg-main-4">
    <Toast />
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-[440px]">
      <p class="text-3xl font-bold mb-6 text-center text-main-1">Login</p>

      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="onFormSubmit"
        class="flex flex-col gap-6 w-full"
      >
        <div class="flex flex-col gap-2 w-full">
          <InputText
            name="username"
            type="text"
            placeholder="Username"
            fluid
            class="h-10"
          />
          <Message
            v-if="$form.username?.invalid"
            severity="error"
            size="small"
            variant="simple"
            style="--p-message-text-sm-font-size: 12px"
            >{{ $form.username.error.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-2">
          <InputText
            name="password"
            type="password"
            placeholder="Password"
            fluid
            class="h-10"
          />
          <Message
            v-if="$form.password?.invalid"
            severity="error"
            size="small"
            variant="simple"
            style="--p-message-text-sm-font-size: 12px"
            >{{ $form.password.error.message }}</Message
          >
        </div>
        <Button type="submit" label="Submit" class="main-btn h-9" />
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Form } from "@primevue/forms";
import { ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const initialValues = ref({
  username: "",
  password: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      username: z.string().min(1, { message: "Username is required" }),
      password: z.string().min(1, { message: "Password is required" }),
    })
  )
);

const onFormSubmit = ({ valid }: { valid: any }) => {
  if (valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }
};

// const { $roomsRef } = useNuxtApp();

// const roomsRef = useCollection($roomsRef);
// console.log(roomsRef.value);

// const supabase = useSupabaseClient();

// const files = await supabase.storage.from("room-users").list();
</script>

<style></style>
