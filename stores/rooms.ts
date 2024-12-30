import {
  doc,
  getDocs,
  orderBy,
  query,
  type Timestamp,
} from "firebase/firestore";
import { defineStore } from "pinia";

export type Room = {
  id: string;
  name: string;
  room_type: "fan" | "ac";
  status: "available" | "being_used" | "unavailable";
  started_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export const useRoomStore = defineStore("rooms", {
  state: () => ({
    rooms: [] as Room[],
    currentRoom: undefined as Room | undefined,
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
  },
});
