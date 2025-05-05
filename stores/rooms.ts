import {
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
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
  customer_info?: CustomerInfo | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type FilterRoomType = "all" | "ac" | "fan";

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
    filter: {
      type: undefined as FilterRoomType | undefined,
    },
  }),
  actions: {
    async updateFilterType(type: FilterRoomType) {
      this.fetchRoom(type);
      this.filter.type = type;
    },
    async getStats() {
      const { $roomsRef } = useNuxtApp();
      let roomsQuery = query($roomsRef, orderBy("created_at", "asc"));
      const querySnapshot = await getDocs(roomsQuery);
      const rooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

      this.stats = {
        fan: rooms.filter(
          (r) => r.room_type === "fan" && r.status === "available"
        ).length,
        ac: rooms.filter(
          (r) => r.room_type === "ac" && r.status === "available"
        ).length,
        using: rooms.filter((r) => r.status === "being_used").length,
      };
    },
    async updateOneRoom(roomData: Partial<Room>, roomId: string) {
      const { $roomsRef } = useNuxtApp();
      const documentRef = doc($roomsRef, roomId);

      const { error } = await setDocument<Room>(documentRef, roomData);

      if (!error) {
        this.fetchRoom();
      }
      return error;
    },
    async fetchRoom(filterType?: "all" | "ac" | "fan") {
      this.loading.push("fetchRooms");
      const { $roomsRef } = useNuxtApp();
      const roomType = filterType || this.filter.type || "all";

      let roomsQuery = query($roomsRef, orderBy("created_at", "asc"));

      if (roomType === "ac" || roomType === "fan") {
        roomsQuery = query(
          $roomsRef,
          where("room_type", "==", roomType),
          orderBy("created_at", "asc")
        );
      }

      const querySnapshot = await getDocs(roomsQuery);
      this.rooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

      this.loading.splice(this.loading.indexOf("fetchRooms"));
    },
    async changeRoomStatus(roomId: string, status: RoomStatus) {
      // add loading
      this.loading.push("changeRoomStatus");

      // update document firestore
      const { $roomsRef } = useNuxtApp();
      const documentRef = doc($roomsRef, roomId);
      const { error } = await setDocument<Room>(documentRef, {
        status,
      });

      // refresh data after the update
      this.fetchRoom();
      this.getStats();

      // remove loading
      this.loading.splice(this.loading.indexOf("changeRoomStatus"));

      return error;
    },
    async changeRoomType(roomId: string, type: Room["room_type"]) {
      // add loading
      this.loading.push("changeRoomType");

      // update document firestore
      const { $roomsRef } = useNuxtApp();
      const documentRef = doc($roomsRef, roomId);
      const { error } = await setDocument<Room>(documentRef, {
        room_type: type,
      });

      // refresh data after the update
      this.fetchRoom();
      this.getStats();

      // remove loading
      this.loading.splice(this.loading.indexOf("changeRoomType"));

      return error;
    },
    async updateCustomerInfo(
      roomId: string,
      info: CustomerInfo
    ): Promise<string | null> {
      const { $roomsRef } = useNuxtApp();

      // add loading
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

        // refresh data after the update
        this.fetchRoom();
        this.getStats();

        return null;
      } catch (error) {
        return (error as Error).message;
      } finally {
        // remove loading
        this.loading.splice(this.loading.indexOf("updateCustomerInfo"));
      }
    },
  },
});
