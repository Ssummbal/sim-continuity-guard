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
  auto_cleared: "border-mint/30 bg-mint-soft text-mint-strong",
  approved: "border-mint/30 bg-mint-soft text-mint-strong",
  rejected: "border-risk-high/30 bg-risk-high-soft text-risk-high",
  more_info_requested:
    "border-warm/30 bg-warm-soft text-warm-strong",
};

type IconName =
  | "check"
  | "alert"
  | "clock"
  | "x"
  | "help"
  | "dot";

function BadgeIcon({ name }: { name: IconName }) {
  if (name === "dot") {
    return <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "check" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.4 2.4 4.6-5" />
        </>
      ) : null}
      {name === "alert" ? (
        <>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </>
      ) : null}
      {name === "clock" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ) : null}
      {name === "x" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6" />
          <path d="m15 9-6 6" />
        </>
      ) : null}
      {name === "help" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.8.6-1.7 1.1-1.7 2.2" />
          <path d="M12 17h.01" />
        </>
      ) : null}
    </svg>
  );
}

const riskIcons: Record<RiskLevel, IconName> = {
  low: "check",
  medium: "alert",
  high: "alert",
};

const statusIcons: Record<CaseStatus, IconName> = {
  pending: "clock",
  auto_cleared: "check",
  approved: "check",
  rejected: "x",
  more_info_requested: "help",
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
      <BadgeIcon name={riskIcons[level]} />
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
      <BadgeIcon name="alert" />
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
      <BadgeIcon name={statusIcons[status]} />
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
      <BadgeIcon name={statusIcons[decision]} />
      {decisionLabel(decision)}
    </span>
  );
}
