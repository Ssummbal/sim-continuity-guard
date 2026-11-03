import { cx } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { actionLabel, outcomeLabel } from "@/lib/labels";
import type { Case } from "@/lib/types";
import { StatusBadge, UrgentBadge } from "./badges";

export function OutcomePanel({ item }: { item: Case }) {
  if (item.status === "auto_cleared") {
    return (
      <section
        className="rounded-2xl border border-risk-low/25 bg-risk-low-soft/60 p-6 shadow-[var(--shadow-sm)]"
        aria-labelledby="outcome-heading"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-risk-low">
          Outcome
        </p>
        <h2
          id="outcome-heading"
          className="mt-2 font-serif text-2xl font-semibold tracking-tight"
        >
          Auto-cleared
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The score fell below the human-review threshold. The case was closed
          automatically and recorded in the audit log.
        </p>
        <div className="mt-4">
          <StatusBadge status={item.status} />
        </div>
      </section>
    );
  }

  if (item.status === "pending") {
    const high = item.level === "high";
    return (
      <section
        className={cx(
          "rounded-2xl border p-6 shadow-[var(--shadow-sm)]",
          high
            ? "border-risk-high/25 bg-risk-high-soft/50"
            : "border-risk-medium/25 bg-risk-medium-soft/50",
        )}
        aria-labelledby="outcome-heading"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Outcome
        </p>
        <h2
          id="outcome-heading"
          className="mt-2 font-serif text-2xl font-semibold tracking-tight"
        >
          Sent to human review
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {high
            ? "This case is marked urgent. A named reviewer must examine the signals before access is restored."
            : "This case is waiting in the review queue. The score is advisory; a named reviewer makes the final call."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status={item.status} />
          {high ? <UrgentBadge /> : null}
        </div>
      </section>
    );
  }

  return (
    <section
      className="card p-6"
      aria-labelledby="outcome-heading"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        Human decision
      </p>
      <h2
        id="outcome-heading"
        className="mt-2 font-serif text-2xl font-semibold tracking-tight"
      >
        {item.decision ? outcomeLabel(item.decision.outcome) : "Decided"}
      </h2>
      <div className="mt-3">
        <StatusBadge status={item.status} />
      </div>
      {item.decision ? (
        <>
          <p className="mt-4 rounded-lg border border-line bg-surface-muted/60 px-4 py-3 text-sm leading-relaxed text-foreground">
            {item.decision.reason}
          </p>
          <dl className="mt-4 space-y-2 text-xs text-muted">
            <div className="flex justify-between gap-4">
              <dt>Reviewer</dt>
              <dd className="text-right font-medium text-foreground">
                {item.decision.reviewer}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Decided</dt>
              <dd className="text-right font-medium text-foreground">
                {formatDateTime(item.decision.decidedAt)}
              </dd>
            </div>
          </dl>
        </>
      ) : null}
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Recommendation at assessment: {actionLabel(item.recommendedAction)}.
      </p>
    </section>
  );
}
