import { defineStore } from "pinia";

export const useSettingStore = defineStore("settings", {
  state: () => ({
    settings: {
      openPanel: true,
    },
  }),
  actions: {
    togglePanel() {
      this.settings.openPanel = !this.settings.openPanel;
    },
  },
  persist: true,
});
