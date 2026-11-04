export type ToastTone = "success" | "error" | "info";

export interface ToastDetail {
  message: string;
  tone: ToastTone;
}

export const TOAST_EVENT = "scg:toast";

export function showToast(message: string, tone: ToastTone = "info") {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<ToastDetail>(TOAST_EVENT, {
      detail: { message, tone },
    }),
  );
}
