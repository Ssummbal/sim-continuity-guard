"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/lib/toast";

const COLORS = [
  "var(--ghost-strong)",
  "var(--ghost-glow)",
  "var(--mint)",
  "var(--warm)",
  "var(--ghost-blush)",
  "var(--primary)",
];

const PIECES = Array.from({ length: 28 }, (_, index) => ({
  left: (index * 37 + 9) % 100,
  delay: (index % 7) * 0.06,
  duration: 2.2 + (index % 5) * 0.18,
  width: 6 + (index % 4) * 2,
  height: 10 + (index % 3) * 4,
  color: COLORS[index % COLORS.length],
}));

export function Celebration({
  message,
  onceKey,
}: {
  message: string;
  onceKey?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (onceKey && window.sessionStorage.getItem(onceKey)) {
      return;
    }

    if (onceKey) {
      window.sessionStorage.setItem(onceKey, "1");
    }

    showToast(message, "success");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const startTimer = window.setTimeout(() => setActive(true), 20);
    const endTimer = window.setTimeout(() => setActive(false), 3200);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [message, onceKey]);

  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[65] overflow-hidden" aria-hidden="true">
      {PIECES.map((piece, index) => (
        <span
          key={index}
          className="confetti-piece rounded-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
