import type { ToastServiceMethods } from "primevue";

export const msgSuccess = (
  toast: ToastServiceMethods,
  text: string,
  lifeTime?: number
) => {
  toast.add({
    severity: "success",
    summary: text,
    life: lifeTime || 3000,
  });
};

export const msgError = (
  toast: ToastServiceMethods,
  text: string,
  lifeTime?: number
) => {
  toast.add({
    severity: "error",
    summary: text,
    life: lifeTime || 5000,
  });
};
