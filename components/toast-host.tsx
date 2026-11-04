"use client";

import { useEffect, useRef, useState } from "react";
import {
  TOAST_EVENT,
  type ToastDetail,
  type ToastTone,
} from "@/lib/toast";

interface ToastItem extends ToastDetail {
  id: number;
}

const toneStyles: Record<ToastTone, string> = {
  success: "border-mint/30 bg-mint-soft text-mint-strong",
  error: "border-risk-high/30 bg-risk-high-soft text-risk-high",
  info: "border-ghost-strong/20 bg-ghost-soft text-ghost-strong",
};

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef(new Map<number, number>());

  useEffect(() => {
    const timers = timersRef.current;

    function dismiss(id: number) {
      setToasts((current) => current.filter((toast) => toast.id !== id));

      const timer = timers.get(id);

      if (timer !== undefined) {
        window.clearTimeout(timer);
        timers.delete(id);
      }
    }

    function handleToast(event: Event) {
      const detail = (event as CustomEvent<ToastDetail>).detail;

      if (!detail?.message) {
        return;
      }

      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-2), { ...detail, id }]);

      const timer = window.setTimeout(() => dismiss(id), 4800);
      timers.set(id, timer);
    }

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);

      for (const timer of timers.values()) {
        window.clearTimeout(timer);
      }

      timers.clear();
    };
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : "status"}
          className={`toast-enter pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-lg)] backdrop-blur ${toneStyles[toast.tone]}`}
        >
          <span className="mt-0.5 size-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
          <p className="min-w-0 flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => {
              setToasts((current) =>
                current.filter((item) => item.id !== toast.id),
              );
            }}
            className="shrink-0 rounded-full px-1.5 text-base leading-none opacity-60 transition hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
