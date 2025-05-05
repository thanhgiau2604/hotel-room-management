<template>
  <Dialog
    :visible="payment_visible"
    modal
    header="Payment"
    :class="[
      'w-[30rem] px-5 py-6',
      { 'pointer-events-none': loading.includes('addHistory') },
    ]"
    @update:visible="closeModal"
  >
    <!-- Customer Info -->
    <div class="card mb-3">
      <Panel header="Customer info" toggleable class="text-base">
        <div class="text-sm">
          <div class="flex p-0 mb-2">
            <label class="shrink-0 w-[80px] font-bold">Name</label>
            <p>{{ currentRoom?.customer_info?.name }}</p>
          </div>

          <div class="flex p-0 mb-2 pt-2">
            <label class="shrink-0 w-[80px] font-bold">Image</label>
            <Image
              v-if="currentRoom?.customer_info?.image"
              :src="getImageUrl(currentRoom?.customer_info?.image)"
              alt="Image"
              width="100%"
              class="overflow-hidden"
              preview
            />
          </div>

          <div class="flex p-0 items-center pt-2">
            <label class="shrink-0 w-[80px] font-bold">Notes</label>
            <p class="breakline leading-6">
              {{ currentRoom?.customer_info?.note }}
            </p>
          </div>
        </div>
      </Panel>
    </div>

    <div class="card mb-3">
      <Panel header="Payment" toggleable class="text-base">
        <div class="text-sm">
          <div class="flex p-0 mb-2">
            <label class="shrink-0 w-[100px] font-bold">Type of room</label>
            <p>{{ values.typeRoom === "fan" ? "Fan" : "Air Conditioner" }}</p>
          </div>
          <div class="flex mb-3 items-center">
            <label class="shrink-0 w-[100px] font-bold">Time used</label>
            <div
              class="flex flex-col gap-2 p-3 rounded-md border border-dashed border-gray-300"
            >
              <p>
                <span class="font-medium mr-2">Start time:</span>
                <span v-if="currentRoom?.customer_info?.start_time"
                  >{{
                    formatDate(
                      (
                        currentRoom?.customer_info.start_time as Timestamp
                      ).toDate()
                    )
                  }}
                </span>
              </p>
              <p>
                <span class="font-medium mr-2">End time:</span>
                <span>{{ formatDate(paymentTime) }} </span>
              </p>
              <div class="flex gap-2">
                <InputText
                  v-model="values.timeUsed"
                  type="number"
                  id="payment-time-used"
                  class="flex-auto p-2 rounded-md w-full"
                  autocomplete="off"
                  min="1"
                />
                <SelectButton
                  v-model="values.selectedUnit"
                  :options="timeUnits"
                  optionLabel="name"
                  size="small"
                />
              </div>
            </div>
          </div>
          <div class="flex mb-3">
            <label class="shrink-0 w-[100px] font-bold">Notes</label>
            <Textarea
              v-model="values.notes"
              rows="2"
              class="w-full resize-none p-2 rounded-md h-[60px] border border-dashed border-gray-300"
            />
          </div>

          <div class="flex items-center">
            <label class="shrink-0 w-[100px] font-bold">Summary</label>
            <div
              class="text-right grow border border-dashed border-gray-300 rounded-md p-3"
            >
              <p class="font-bold text-lg text-gray-500 mb-1">
                {{ values.timeUsed }} ({{ values.selectedUnit.value }}) x
                {{ toCurrency(basePriceUsing) }}
              </p>
              <p class="font-bold text-xl">
                {{ toCurrency(+values.timeUsed * basePriceUsing) }}
              </p>
              <div class="flex items-center gap-2 mt-2 justify-end">
                <label>Other</label>
                <InputText
                  v-model="values.otherCost"
                  class="flex-auto p-2 rounded-md max-w-[150px]"
                  autocomplete="off"
                />
              </div>
              <p v-if="errorOtherCost" class="text-xs text-red-400 mt-1">
                {{ errorOtherCost }}
              </p>
            </div>
          </div>
          <div class="flex items-center mt-2">
            <label class="shrink-0 w-[100px] font-bold">Total</label>
            <div class="text-right grow">
              <p class="font-bold text-lg text-blue-400 mb-1">
                {{
                  `${toCurrency(+values.otherCost)} + ${toCurrency(
                    +values.timeUsed * basePriceUsing
                  )}`
                }}
              </p>
              <div class="font-bold text-lg text-right">
                <p
                  class="text-blue-600 mb-1 bg-blue-100 w-fit inline-block px-2 py-1 rounded-md"
                >
                  {{ toCurrency(totalPrice) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        @click="closeModal"
        class="cancel-btn"
        :disabled="loading.includes('addHistory')"
      ></Button>
      <Button
        type="button"
        label="Confirm payment"
        @click="submitPayment"
        class="main-btn"
        :loading="loading.includes('addHistory')"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import { useToast } from "primevue/usetoast";
import { TIME_UNIT } from "~/constant";
import { toCurrency } from "~/utils";
import type { Timestamp } from "firebase/firestore";

const toast = useToast();
const roomStore = useRoomStore();
const historyStore = useRoomHistoriesStore();

const { price: basePrice } = useSettingStore();
const { currentRoom } = storeToRefs(roomStore);
const { loading } = storeToRefs(historyStore);

const props = defineProps({
  payment_visible: {
    type: Boolean,
    required: true,
  },
});

const basePriceUsing = computed(
  () => basePrice[values.value.typeRoom][values.value.selectedUnit.value]
);

const timeUnits = ref(TIME_UNIT);

let paymentTime = new Date();

const values = ref({
  selectedUnit: TIME_UNIT[0],
  timeUsed: "1",
  typeRoom: currentRoom.value?.room_type || "fan",
  notes: "",
  otherCost: "",
});

const totalPrice = computed(
  () => +values.value.otherCost + +values.value.timeUsed * basePriceUsing.value
);

const errorOtherCost = computed(() =>
  isValidNumber(values.value.otherCost) ? "" : "Invalid value"
);

watch(
  () => [currentRoom, props.payment_visible],
  () => {
    values.value.typeRoom = currentRoom.value?.room_type || "fan";

    let startTime = currentRoom.value?.customer_info?.start_time;
    startTime = startTime ? (startTime as Timestamp).toDate() : undefined;

    if (startTime) {
      paymentTime = new Date();
      const { days, hours } = differenceBetweenDates(paymentTime, startTime);
      values.value.selectedUnit = days >= 1 ? TIME_UNIT[1] : TIME_UNIT[0];
      values.value.timeUsed = (days >= 1 ? days : hours).toFixed(1);
    }
  }
);

const submitPayment = async () => {
  if (!currentRoom?.value?.customer_info) {
    return;
  }

  const paymentAmount = values.value;

  const error = await historyStore.addHistory({
    room_id: currentRoom.value?.id || "",
    customer_info: {
      ...currentRoom.value.customer_info,
      end_at: paymentTime,
    },
    payment_detail: {
      other_cost: +paymentAmount.otherCost,
      time_used: +paymentAmount.timeUsed,
      time_unit: paymentAmount.selectedUnit.value,
      total: totalPrice.value,
    },
  });

  if (!error) {
    msgSuccess(toast, "The action has been processed successfully!");
    closeModal();
  } else {
    msgError(toast, "An error occured", error);
  }
};

const emit = defineEmits(["update:payment_visible"]);

// Emit an event to the parent with the new value
const closeModal = () => {
  emit("update:payment_visible", false);
};
</script>
