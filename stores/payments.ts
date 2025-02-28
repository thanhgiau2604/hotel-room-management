import { addDoc, type Timestamp } from "firebase/firestore";
import { defineStore } from "pinia";

export type PaymentDetail = {
  other_cost: number;
  time_used: number;
  time_unit: "day" | "hour";
  total: number;
};

export type PaymentPayload = {
  history_id: string;
  room_id: string;
  payment_detail: PaymentDetail;
};

export type PaymentItem = PaymentPayload & {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export const usePaymentStore = defineStore("payments", {
  state: () => ({
    payments: [] as PaymentItem[],
    loading: [] as "fetching"[],
  }),
  actions: {
    async addPayment(payload: PaymentPayload) {
      const { $paymentHisRef } = useNuxtApp();
      const currentTime = new Date();

      try {
        await addDoc($paymentHisRef, {
          ...payload,
          created_at: currentTime,
          updated_at: currentTime,
        });
        return null;
      } catch (error) {
        return (error as Error).message;
      }
    },
  },
});
