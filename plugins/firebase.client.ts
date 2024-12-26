import { getFirestore, collection } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp: any) => {
  const db = getFirestore(nuxtApp.$firebaseApp);
  const roomsRef = collection(db, "rooms");
  const roomHisRef = collection(db, "roomHistories");
  const paymentHisRef = collection(db, "paymentHistories");

  return {
    provide: {
      db,
      roomsRef,
      roomHisRef,
      paymentHisRef,
    },
  };
});
