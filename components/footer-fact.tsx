"use client";

import { useEffect, useState } from "react";

const FACTS = [
  "Saudi mobile numbers use nine digits after +966, starting with 5.",
  "A recycled number can still receive password resets meant for its previous owner.",
  "SIM swaps are a useful continuity signal because they change who controls the number.",
  "A number that looks new to you may already have years of account history attached.",
  "The safest recovery setup uses more than one factor, not just an SMS code.",
];

export function FooterFact() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % FACTS.length);
    }, 9000);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="max-w-sm rounded-2xl border border-ghost-strong/15 bg-ghost-soft/60 px-3.5 py-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ghost-strong">
        Phone-number fact
      </p>
      <button
        type="button"
        onClick={() => setIndex((current) => (current + 1) % FACTS.length)}
        className="mt-1 block text-left leading-relaxed text-foreground transition-colors hover:text-ghost-strong"
        aria-label="Show another phone-number fact"
      >
        {FACTS[index]}
      </button>
    </div>
  );
}
