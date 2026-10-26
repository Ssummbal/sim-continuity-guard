export type RiskLevel = "low" | "medium" | "high";

export type RiskAction = "auto_clear" | "human_review" | "human_review_urgent";

export type SignalId =
  | "recycled"
  | "inactivity"
  | "linked_accounts"
  | "sim_swap"
  | "device_change";

export type CaseStatus =
  | "pending"
  | "auto_cleared"
  | "approved"
  | "rejected"
  | "more_info_requested";

export type DecisionOutcome = "approved" | "rejected" | "more_info";

export type AuditDecision = Exclude<CaseStatus, "pending">;

export interface RiskInput {
  phoneNumber: string;
  daysInactive: number;
  wasRecycled: boolean;
  linkedAccounts: number;
  recentSimSwap: boolean;
  deviceChanged: boolean;
}

export interface RiskSignal {
  id: SignalId;
  label: string;
  explanation: string;
  points: number;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  signals: RiskSignal[];
  recommendedAction: RiskAction;
}

export interface Decision {
  outcome: DecisionOutcome;
  reviewer: string;
  reason: string;
  decidedAt: string;
}

export interface Case extends RiskInput {
  id: string;
  carrier: string;
  score: number;
  level: RiskLevel;
  signals: RiskSignal[];
  recommendedAction: RiskAction;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  decision?: Decision;
}

export interface AuditEntry {
  id: string;
  caseId: string;
  phoneNumber: string;
  decision: AuditDecision;
  reviewer: string;
  reason: string;
  timestamp: string;
}

export interface CaseQuery {
  level?: RiskLevel | "all";
  status?: CaseStatus | "all";
}

export type AssessmentField = "phoneNumber" | "daysInactive" | "linkedAccounts";

export type AssessmentFieldErrors = Partial<Record<AssessmentField, string>>;

export interface AssessmentActionState {
  message?: string;
  errors?: AssessmentFieldErrors;
}

export type DecisionField = "reviewer" | "reason";

export type DecisionFieldErrors = Partial<Record<DecisionField, string>>;

export interface DecisionActionState {
  message?: string;
  errors?: DecisionFieldErrors;
}
