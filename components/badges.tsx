import { cx } from "@/lib/cn";
import {
  decisionLabel,
  riskLabel,
  statusLabel,
} from "@/lib/labels";
import type { AuditDecision, CaseStatus, RiskLevel } from "@/lib/types";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide";

const riskStyles: Record<RiskLevel, string> = {
  low: "border-risk-low/30 bg-risk-low-soft text-risk-low",
  medium: "border-risk-medium/30 bg-risk-medium-soft text-risk-medium",
  high: "border-risk-high/30 bg-risk-high-soft text-risk-high",
};

const statusStyles: Record<CaseStatus, string> = {
  pending: "border-info/30 bg-info-soft text-info",
  auto_cleared: "border-accent/30 bg-accent-soft text-accent",
  approved: "border-accent/30 bg-accent-soft text-accent",
  rejected: "border-risk-high/30 bg-risk-high-soft text-risk-high",
  more_info_requested:
    "border-risk-medium/30 bg-risk-medium-soft text-risk-medium",
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span className={cx(base, riskStyles[level], className)}>
      <span
        className="size-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      {riskLabel(level)}
    </span>
  );
}

export function UrgentBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        base,
        "border-risk-high/30 bg-risk-high-soft text-risk-high",
        className,
      )}
    >
      <span aria-hidden="true">!</span>
      Urgent
    </span>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: CaseStatus;
  className?: string;
}) {
  return (
    <span className={cx(base, statusStyles[status], className)}>
      {statusLabel(status)}
    </span>
  );
}

export function DecisionBadge({
  decision,
  className,
}: {
  decision: AuditDecision;
  className?: string;
}) {
  return (
    <span className={cx(base, statusStyles[decision], className)}>
      {decisionLabel(decision)}
    </span>
  );
}
