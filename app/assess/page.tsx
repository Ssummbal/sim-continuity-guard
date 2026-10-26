import type { Metadata } from "next";
import Link from "next/link";
import { AssessForm } from "@/components/assess-form";
import { RiskBadge } from "@/components/badges";
import { RISK_THRESHOLDS, RISK_WEIGHTS } from "@/lib/risk";

export const metadata: Metadata = {
  title: "New assessment",
};

const scoreSignals = [
  { label: "Recycled number", points: `+${RISK_WEIGHTS.recycled}` },
  { label: "SIM swap in last 30 days", points: `+${RISK_WEIGHTS.simSwap}` },
  { label: "Device changed", points: `+${RISK_WEIGHTS.deviceChanged}` },
  { label: "Dormancy before reassignment", points: `up to +${RISK_WEIGHTS.inactivityMax}` },
  { label: "Linked accounts", points: `up to +${RISK_WEIGHTS.linkedAccountsMax}` },
];

export default function AssessPage() {
  return (
    <main id="content" className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span>
        Overview
      </Link>

      <div className="mt-6 max-w-3xl">
        <p className="eyebrow">New assessment</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Run a continuity assessment
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Describe the reassignment scenario. The model returns a transparent
          score, the signals that produced it, and a routing outcome. Saudi
          mobile numbers are assessed against stc-style continuity signals.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_356px]">
        <AssessForm />

        <aside className="space-y-6 lg:sticky lg:top-6">
          <section className="card p-6" aria-labelledby="scoring-heading">
            <h2
              id="scoring-heading"
              className="font-serif text-xl font-semibold tracking-tight"
            >
              How the score is built
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Weighted, deterministic, and capped at 100.
            </p>
            <ul className="mt-5 space-y-3">
              {scoreSignals.map((signal) => (
                <li
                  key={signal.label}
                  className="flex items-baseline justify-between gap-3 border-b border-line pb-3 text-sm last:border-0 last:pb-0"
                >
                  <span>{signal.label}</span>
                  <span className="whitespace-nowrap font-mono text-xs font-medium text-muted">
                    {signal.points}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6" aria-labelledby="routing-heading">
            <h2
              id="routing-heading"
              className="font-serif text-xl font-semibold tracking-tight"
            >
              Routing thresholds
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-risk-low/20 bg-risk-low-soft/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <RiskBadge level="low" />
                  <span className="font-mono text-xs text-muted">0–29</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Auto-cleared by policy and written to the audit log.
                </p>
              </div>
              <div className="rounded-lg border border-risk-medium/20 bg-risk-medium-soft/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <RiskBadge level="medium" />
                  <span className="font-mono text-xs text-muted">
                    {RISK_THRESHOLDS.medium}–{RISK_THRESHOLDS.high - 1}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Sent to a human reviewer.
                </p>
              </div>
              <div className="rounded-lg border border-risk-high/20 bg-risk-high-soft/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <RiskBadge level="high" />
                  <span className="font-mono text-xs text-muted">
                    {RISK_THRESHOLDS.high}–100
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Human review, marked urgent.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-accent/20 bg-accent-soft p-6">
            <p className="eyebrow">Human in the loop</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              The assessment is advisory. A named reviewer makes every
              consequential decision and records a written reason.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Prototype data is held in memory and resets when the server
              restarts.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
