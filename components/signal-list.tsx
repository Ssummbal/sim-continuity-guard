import type { RiskSignal } from "@/lib/types";

export function SignalList({ signals }: { signals: RiskSignal[] }) {
  if (signals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface-muted/50 px-5 py-8 text-center">
        <p className="text-sm font-semibold">No elevated-risk signals</p>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted">
          None of the configured signals were triggered for this case.
        </p>
      </div>
    );
  }

  return (
    <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      {signals.map((signal, index) => (
        <li
          key={signal.id}
          className="flex flex-col gap-3 p-5 sm:flex-row sm:gap-5"
        >
          <span
            className="font-mono text-xs font-medium leading-6 text-muted"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{signal.label}</h3>
              <span
                className="rounded-full border border-risk-medium/20 bg-risk-medium-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-risk-medium"
                aria-label={`${signal.points} risk points`}
              >
                +{signal.points}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {signal.explanation}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
