import {
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import { defineStore } from "pinia";

export type CustomerInfo = {
  name: string;
  image: string;
  note: string;
};

export type Room = {
  id: string;
  name: string;
  room_type: "fan" | "ac";
  status: "available" | "being_used" | "unavailable";
  started_at: Timestamp | null;
  customer_info?: CustomerInfo;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export const useRoomStore = defineStore("rooms", {
  state: () => ({
    rooms: [] as Room[],
    currentRoom: undefined as Room | undefined,
    stats: {
      fan: undefined as Number | undefined,
      ac: undefined as Number | undefined,
      using: undefined as Number | undefined,
    },
  }),
  actions: {
    updateRoom(rooms: Room[]) {
      this.rooms = rooms;
    },
    async fetchRoom() {
      const { $roomsRef } = useNuxtApp();
      const roomsQuery = query($roomsRef, orderBy("created_at", "asc"));
      const querySnapshot = await getDocs(roomsQuery);
      this.rooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

      // stats
      const fanAvailable = [...this.rooms].filter(
        (r) => r.room_type === "fan" && r.status === "available"
      ).length;
      const acAvailable = [...this.rooms].filter(
        (r) => r.room_type === "ac" && r.status === "available"
      ).length;
      const using = [...this.rooms].filter(
        (r) => r.status === "being_used"
      ).length;

      this.stats = {
        fan: fanAvailable,
        ac: acAvailable,
        using,
      };
    },
    async changeRoomStatus(roomId: string, status: Room["status"]) {
      const newRooms = [...this.rooms].map((r) =>
        r.id === roomId ? { ...r, status } : r
      );

      this.rooms = newRooms;

      // update document firestore
      const { $roomsRef } = useNuxtApp();
      const documentRef = doc($roomsRef, roomId);
      const { error } = await setDocument<Room>(documentRef, {
        status,
      });

      return error;
    },
    async changeRoomType(roomId: string, type: Room["room_type"]) {
      const newRooms = [...this.rooms].map((r) =>
        r.id === roomId ? { ...r, room_type: type } : r
      );
      this.rooms = newRooms;

      // update document firestore
      const { $roomsRef } = useNuxtApp();
      const documentRef = doc($roomsRef, roomId);
      const { error } = await setDocument<Room>(documentRef, {
        room_type: type,
      });

      return error;
    },
    async updateCustomerInfo(
      roomId: string,
      info: CustomerInfo
    ): Promise<string | null> {
      const { $roomsRef } = useNuxtApp();

      try {
        await setDoc(
          doc($roomsRef, roomId),
          {
            customer_info: info,
          },
          { merge: true }
        );

        this.fetchRoom();
        return null;
      } catch (error) {
        return (error as Error).message;
      }
    },
  },
});
