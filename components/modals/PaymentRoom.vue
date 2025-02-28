<template>
  <Dialog
    :visible="payment_visible"
    modal
    header="Payment"
    class="w-[30rem] px-5 py-6"
    @update:visible="closeModal"
  >
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
            <div class="flex flex-col gap-2">
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
                <span>{{ formatDate(new Date()) }} </span>
              </p>
              <div class="flex gap-2">
                <InputText
                  v-model="values.timeUsed"
                  type="number"
                  id="payment-time-used"
                  class="flex-auto p-2 rounded-md w-[150px]"
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
              class="w-full resize-none p-2 rounded-md h-[60px]"
            />
          </div>

          <div class="flex items-center">
            <label class="shrink-0 w-[100px] font-bold">Summary</label>
            <div
              class="text-right grow border border-dashed border-gray-300 rounded-sm p-3"
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
                  {{
                    toCurrency(
                      +values.otherCost + +values.timeUsed * basePriceUsing
                    )
                  }}
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
      ></Button>
      <Button
        type="button"
        label="Confirm payment"
        @click="closeModal"
        class="main-btn"
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

const { price: basePrice } = useSettingStore();
const { currentRoom } = storeToRefs(roomStore);

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

const values = ref({
  selectedUnit: TIME_UNIT[0],
  timeUsed: "1",
  typeRoom: currentRoom.value?.room_type || "fan",
  notes: "",
  otherCost: "",
});

const errorOtherCost = computed(() => {
  const cost = values.value.otherCost;
  if (cost.trim() === "") return "";
  return isValidNumber(cost) ? "" : "Invalid value";
});

watch(currentRoom, () => {
  values.value.typeRoom = currentRoom.value?.room_type || "fan";

  const startTime = currentRoom.value?.customer_info?.start_time
    ? (currentRoom.value?.customer_info?.start_time as Timestamp).toDate()
    : null;

  const endTime = new Date();

  if (startTime) {
    const durationUsed = differenceBetweenDates(endTime, startTime);
    console.log(durationUsed);

    if (durationUsed.days >= 1) {
      values.value.selectedUnit = TIME_UNIT[1];
      values.value.timeUsed = durationUsed.days.toFixed(1);
    } else {
      values.value.selectedUnit = TIME_UNIT[0];
      values.value.timeUsed = durationUsed.hours.toFixed(1);
    }
  }
});

const emit = defineEmits(["update:payment_visible"]);

// Emit an event to the parent with the new value
const closeModal = () => {
  emit("update:payment_visible", false);
};
</script>
