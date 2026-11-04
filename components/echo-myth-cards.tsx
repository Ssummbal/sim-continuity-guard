"use client";

import { useState } from "react";

const CARDS = [
  {
    statement:
      "Recycled numbers are always completely clean, so old accounts cannot follow them.",
    verdict: "Myth",
    explanation:
      "A number can be reassigned after a line is deactivated. Accounts that still treat that number as the owner's recovery route can create ghost messages or recovery risk for the new owner.",
  },
  {
    statement:
      "A verification code you did not request is harmless if you ignore it.",
    verdict: "Myth",
    explanation:
      "The code may belong to the previous owner. Do not use, share, or reply to it. Tell the sender or bank that the number has changed owners.",
  },
  {
    statement:
      "Updating your number with your bank before switching helps prevent ghost messages.",
    verdict: "Fact",
    explanation:
      "It gives the bank a chance to move alerts and recovery to the right person before the old number is reassigned.",
  },
  {
    statement: "SMS is the safest way to recover every important account.",
    verdict: "Myth",
    explanation:
      "SMS can be useful, but authenticator apps and passkeys are less dependent on a phone number and reduce recycling-related takeover risk.",
  },
] as const;

export function EchoMythCards() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  function toggleCard(index: number) {
    setFlipped((current) => ({ ...current, [index]: !current[index] }));
  }

  return (
    <section aria-labelledby="echo-myth-title">
      <div className="max-w-2xl">
        <p className="eyebrow text-ghost-strong">Spooky thinking</p>
        <h2
          id="echo-myth-title"
          className="mt-1.5 font-serif text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Myth or fact?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Flip each card to check a common belief about mobile number
          recycling.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CARDS.map((card, index) => {
          const isFlipped = flipped[index] === true;

          return (
            <button
              key={card.statement}
              type="button"
              onClick={() => toggleCard(index)}
              aria-pressed={isFlipped}
              aria-label={`${isFlipped ? "Hide" : "Reveal"} answer: ${card.statement}`}
              className="myth-card block w-full rounded-2xl text-left focus-visible:outline-offset-4"
            >
              <span className="myth-card-inner relative block min-h-[16rem]">
                <span
                  className="myth-card-face myth-card-front flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-sm)]"
                  aria-hidden={isFlipped}
                >
                  <span>
                    <span className="inline-flex rounded-full border border-ghost-strong/25 bg-ghost-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ghost-strong">
                      Myth or fact?
                    </span>
                    <span className="mt-4 block font-serif text-xl font-semibold leading-snug text-foreground">
                      {card.statement}
                    </span>
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-ghost-strong">
                    Tap to flip
                    <svg
                      viewBox="0 0 20 20"
                      className="size-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 10h12" />
                      <path d="m12 6 4 4-4 4" />
                    </svg>
                  </span>
                </span>

                <span
                  className="myth-card-face myth-card-back flex flex-col justify-between rounded-2xl border border-ghost-strong/30 bg-ghost-soft p-5 shadow-[var(--shadow-sm)]"
                  aria-hidden={!isFlipped}
                >
                  <span>
                    <span className="inline-flex rounded-full bg-ghost-strong px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-surface">
                      {card.verdict}
                    </span>
                    <span className="mt-4 block text-sm leading-relaxed text-foreground">
                      {card.explanation}
                    </span>
                  </span>
                  <span className="mt-5 text-xs font-semibold text-ghost-strong">
                    Tap to flip back
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
