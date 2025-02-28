import { addDoc, type Timestamp } from "firebase/firestore";
import { defineStore } from "pinia";

export type RoomStatus = "available" | "being_used" | "unavailable";

export type CustomerHistory = CustomerInfo & {
  end_at: Date;
};

export type RoomHistoryBase = {
  room_id: string;
  customer_info?: CustomerHistory;
};

export type RoomHistoryPayload = RoomHistoryBase & {
  payment_detail: PaymentDetail;
};

export type RoomHistoryData = RoomHistoryBase & {
  id: string;
  paid_amount: number;
  started_at: Timestamp;
  ended_at: Timestamp; // === paid_at
  created_at: Timestamp;
  updated_at: Timestamp;
};

export const useRoomHistoriesStore = defineStore("room_histories", {
  state: () => ({
    histories: [] as RoomHistoryData[],
    loading: [] as ("addHistory" | "fetchHistories")[],
  }),
  actions: {
    async addHistory(payload: RoomHistoryPayload) {
      this.loading.push("addHistory");
      const { $roomHisRef } = useNuxtApp();
      const paymentStore = usePaymentStore();
      const roomStore = useRoomStore();
      const currentTime = new Date();

      try {
        const res = await addDoc($roomHisRef, {
          ...payload,
          created_at: currentTime,
          updated_at: currentTime,
        });

        const { room_id, payment_detail } = payload;

        await Promise.all([
          // add payment history
          paymentStore.addPayment({
            history_id: res.id,
            room_id,
            payment_detail,
          }),
          // reset value of customer and set room to available
          roomStore.updateOneRoom(
            {
              customer_info: null,
              status: "available",
            },
            room_id
          ),
        ]);

        return null;
      } catch (error) {
        return (error as Error).message;
      } finally {
        this.loading.splice(this.loading.indexOf("addHistory"));
      }
    },
  },
});
