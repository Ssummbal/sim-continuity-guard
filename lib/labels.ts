import type {
  AuditDecision,
  CaseStatus,
  DecisionOutcome,
  RiskAction,
  RiskLevel,
} from "./types";

export const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high"];

export const CASE_STATUSES: CaseStatus[] = [
  "pending",
  "auto_cleared",
  "approved",
  "rejected",
  "more_info_requested",
];

export const DECISION_OUTCOMES: DecisionOutcome[] = [
  "approved",
  "rejected",
  "more_info",
];

export function isRiskLevel(value: string | undefined): value is RiskLevel {
  return value === "low" || value === "medium" || value === "high";
}

export function isCaseStatus(value: string | undefined): value is CaseStatus {
  return CASE_STATUSES.some((status) => status === value);
}

export function isDecisionOutcome(
  value: string | undefined,
): value is DecisionOutcome {
  return DECISION_OUTCOMES.some((outcome) => outcome === value);
}

export function riskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: "Low risk",
    medium: "Medium risk",
    high: "High risk",
  };
  return labels[level];
}

export function statusLabel(status: CaseStatus): string {
  const labels: Record<CaseStatus, string> = {
    pending: "Pending review",
    auto_cleared: "Auto-cleared",
    approved: "Approved",
    rejected: "Rejected",
    more_info_requested: "More info requested",
  };
  return labels[status];
}

export function decisionLabel(decision: AuditDecision): string {
  const labels: Record<AuditDecision, string> = {
    auto_cleared: "Auto-cleared",
    approved: "Approved",
    rejected: "Rejected",
    more_info_requested: "More info requested",
  };
  return labels[decision];
}

export function outcomeLabel(outcome: DecisionOutcome): string {
  const labels: Record<DecisionOutcome, string> = {
    approved: "Approved",
    rejected: "Rejected",
    more_info: "More information requested",
  };
  return labels[outcome];
}

export function actionLabel(action: RiskAction): string {
  const labels: Record<RiskAction, string> = {
    auto_clear: "Auto-clear",
    human_review: "Send to human review",
    human_review_urgent: "Send to human review — urgent",
  };
  return labels[action];
}

export function statusForOutcome(outcome: DecisionOutcome): CaseStatus {
  if (outcome === "approved") return "approved";
  if (outcome === "rejected") return "rejected";
  return "more_info_requested";
}
