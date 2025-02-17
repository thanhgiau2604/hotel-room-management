import { defineStore } from "pinia";

export const useSettingStore = defineStore("settings", {
  state: () => ({
    settings: {
      openPanel: true,
    },
    price: {
      ac: {
        hour: 30000,
        day: 200000,
      },
      fan: {
        hour: 20000,
        day: 150000,
      },
    },
  }),
  actions: {
    togglePanel() {
      this.settings.openPanel = !this.settings.openPanel;
    },
  },
  persist: true,
});
