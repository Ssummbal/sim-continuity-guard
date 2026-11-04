"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    id: "bank-sms",
    question: "Do you use SMS codes to log into your bank?",
  },
  {
    id: "changed-number",
    question: "Have you changed numbers without updating your accounts?",
  },
  {
    id: "sms-recovery",
    question: "Do you rely only on SMS to recover important accounts?",
  },
  {
    id: "ghost-codes",
    question: "Have you received codes or messages meant for someone else?",
  },
  {
    id: "unknown-links",
    question: "Are you unsure which accounts still use your number?",
  },
  {
    id: "wide-sharing",
    question: "Have you shared your number widely for verification or recovery?",
  },
];

const SCORE_BANDS = [
  {
    max: 1,
    label: "Squeaky clean",
    tone: "text-risk-low",
    summary:
      "Your number looks well looked after. Keep it that way by reviewing the accounts that still depend on SMS.",
    tips: [
      "Keep an authenticator app or passkey on your most important accounts.",
      "Make a short list of accounts that still use your number for login or recovery.",
      "Before changing numbers, update your bank, email and messaging accounts first.",
    ],
  },
  {
    max: 3,
    label: "A few cobwebs",
    tone: "text-risk-medium",
    summary:
      "A few old links could become a problem if your number is ever recycled. A small cleanup now goes a long way.",
    tips: [
      "Move banking and email recovery away from SMS where you can.",
      "Review accounts that still use your phone number as a backup factor.",
      "Tell your bank and operator before you switch or give up a number.",
    ],
  },
  {
    max: 6,
    label: "Quite haunted",
    tone: "text-risk-high",
    summary:
      "Your number is carrying a lot of recovery power. Treat this as a good moment to reduce the haunting.",
    tips: [
      "Do not reply to, click, or share any code that arrives for someone else.",
      "Contact your bank and mobile operator right away if you see suspicious activity.",
      "Move critical accounts to an authenticator app or passkey, then update your number everywhere.",
    ],
  },
];

export function EchoQuiz() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const answeredCount = QUESTIONS.filter(
    (item) => typeof answers[item.id] === "boolean",
  ).length;
  const score = QUESTIONS.filter((item) => answers[item.id] === true).length;
  const complete = answeredCount === QUESTIONS.length;
  const band =
    SCORE_BANDS.find((item) => score <= item.max) ??
    SCORE_BANDS[SCORE_BANDS.length - 1];

  function setAnswer(id: string, value: boolean) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function resetQuiz() {
    setAnswers({});
  }

  return (
    <section className="card overflow-hidden" aria-labelledby="echo-quiz-title">
      <div className="border-b border-ghost-strong/15 bg-ghost-soft/60 px-5 py-6 sm:px-7">
        <p className="eyebrow text-ghost-strong">A tiny haunting check</p>
        <h2
          id="echo-quiz-title"
          className="mt-1.5 font-serif text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          How haunted is your number?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Six quick yes-or-no questions. Everything stays in this browser tab:
          no answers are sent, saved, or stored.
        </p>
      </div>

      <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-5">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold text-muted">
              <span>{answeredCount} of {QUESTIONS.length} answered</span>
              <span>{Math.round((answeredCount / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-ghost-strong transition-[width] duration-300"
                style={{
                  width: `${(answeredCount / QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {QUESTIONS.map((item, index) => (
              <fieldset
                key={item.id}
                className="rounded-xl border border-line bg-background/60 p-4"
              >
                <legend className="text-sm font-semibold text-foreground">
                  {index + 1}. {item.question}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium transition has-[:checked]:border-ghost-strong has-[:checked]:bg-ghost-soft has-[:checked]:text-ghost-strong">
                    <input
                      type="radio"
                      name={`echo-quiz-${item.id}`}
                      checked={answers[item.id] === true}
                      onChange={() => setAnswer(item.id, true)}
                      className="size-4 accent-[var(--ghost-strong)]"
                    />
                    Yes
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium transition has-[:checked]:border-ghost-strong has-[:checked]:bg-ghost-soft has-[:checked]:text-ghost-strong">
                    <input
                      type="radio"
                      name={`echo-quiz-${item.id}`}
                      checked={answers[item.id] === false}
                      onChange={() => setAnswer(item.id, false)}
                      className="size-4 accent-[var(--ghost-strong)]"
                    />
                    No
                  </label>
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="rounded-2xl border border-ghost-strong/20 bg-ghost-soft/70 p-5"
            aria-live="polite"
          >
            {complete ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Your haunting score
                </p>
                <p className={`mt-1 font-serif text-3xl font-semibold ${band.tone}`}>
                  {band.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {score} of {QUESTIONS.length} risk points
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {band.summary}
                </p>
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Three practical tips
                  </p>
                  <ol className="mt-3 space-y-2.5">
                    {band.tips.map((tip, index) => (
                      <li
                        key={tip}
                        className="flex gap-2.5 text-sm leading-relaxed text-foreground"
                      >
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ghost-strong text-[11px] font-bold text-surface">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="btn-secondary mt-5 w-full"
                >
                  Retake the quiz
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Waiting for the spirits
                </p>
                <p className="mt-2 font-serif text-2xl font-semibold">
                  Answer all six to see your haunting level.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Each &quot;yes&quot; adds one risk point. The result is a
                  general conversation starter, not a risk assessment.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {SCORE_BANDS.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-line bg-surface px-2 py-3"
                    >
                      <p className={`text-xs font-semibold ${item.tone}`}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
