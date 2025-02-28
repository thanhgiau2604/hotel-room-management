import {
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { ROOM_STATUES } from "~/constant";

export type CustomerInfo = {
  name: string;
  image: string;
  note: string;
  start_time: Date | Timestamp;
};

export type RoomStatus = "available" | "being_used" | "unavailable";

export type Room = {
  id: string;
  name: string;
  room_type: "fan" | "ac";
  status: RoomStatus;
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
    loading: [] as (
      | "fetchRooms"
      | "changeRoomStatus"
      | "changeRoomType"
      | "updateCustomerInfo"
    )[],
  }),
  actions: {
    updateRoom(rooms: Room[]) {
      this.rooms = rooms;
    },
    async fetchRoom() {
      this.loading.push("fetchRooms");
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

      this.loading.splice(this.loading.indexOf("fetchRooms"));

      this.stats = {
        fan: fanAvailable,
        ac: acAvailable,
        using,
      };
    },
    async changeRoomStatus(roomId: string, status: Room["status"]) {
      this.loading.push("changeRoomStatus");
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

      this.loading.splice(this.loading.indexOf("changeRoomStatus"));

      return error;
    },
    async changeRoomType(roomId: string, type: Room["room_type"]) {
      this.loading.push("changeRoomType");

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

      this.loading.splice(this.loading.indexOf("changeRoomType"));

      return error;
    },
    async updateCustomerInfo(
      roomId: string,
      info: CustomerInfo
    ): Promise<string | null> {
      const { $roomsRef } = useNuxtApp();
      this.loading.push("updateCustomerInfo");

      try {
        await setDoc(
          doc($roomsRef, roomId),
          {
            customer_info: info,
            status: ROOM_STATUES[2],
          },
          { merge: true }
        );

        this.fetchRoom();
        return null;
      } catch (error) {
        return (error as Error).message;
      } finally {
        this.loading.splice(this.loading.indexOf("updateCustomerInfo"));
      }
    },
  },
});
