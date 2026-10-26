import { statusForOutcome } from "./labels";
import { createSeedAuditEntries, createSeedCases } from "./mock-data";
import { assessRisk } from "./risk";
import type {
  AuditDecision,
  AuditEntry,
  Case,
  CaseQuery,
  DecisionOutcome,
  RiskInput,
} from "./types";

interface Store {
  initialized: boolean;
  cases: Case[];
  audit: AuditEntry[];
  nextCaseNumber: number;
}

export interface DecisionInput {
  outcome: DecisionOutcome;
  reviewer: string;
  reason: string;
}

const globalStore = globalThis as typeof globalThis & {
  __simContinuityGuardStore?: Store;
};

function seedStore(): Store {
  const now = new Date();
  const cases = createSeedCases(now);
  const highestId = cases.reduce((highest, item) => {
    const numericId = Number(item.id.replace("SCG-", ""));
    return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
  }, 1000);

  return {
    initialized: true,
    cases,
    audit: createSeedAuditEntries(cases),
    nextCaseNumber: highestId + 1,
  };
}

function getStore(): Store {
  if (!globalStore.__simContinuityGuardStore) {
    globalStore.__simContinuityGuardStore = seedStore();
  }

  return globalStore.__simContinuityGuardStore;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

export async function getCases(query: CaseQuery = {}): Promise<Case[]> {
  const { level = "all", status = "all" } = query;
  const cases = getStore().cases;

  return cases
    .filter((item) => level === "all" || item.level === level)
    .filter((item) => status === "all" || item.status === status)
    .map((item) => clone(item));
}

export async function getCaseById(id: string): Promise<Case | null> {
  const normalizedId = id.trim().toUpperCase();
  const item = getStore().cases.find((entry) => entry.id === normalizedId);
  return item ? clone(item) : null;
}

export async function createCase(input: RiskInput): Promise<Case> {
  const store = getStore();
  const assessment = assessRisk(input);
  const timestamp = new Date().toISOString();
  const id = `SCG-${String(store.nextCaseNumber).padStart(4, "0")}`;
  store.nextCaseNumber += 1;

  const newCase: Case = {
    ...input,
    id,
    carrier: "stc",
    score: assessment.score,
    level: assessment.level,
    signals: assessment.signals,
    recommendedAction: assessment.recommendedAction,
    status: assessment.level === "low" ? "auto_cleared" : "pending",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.cases.push(newCase);

  if (newCase.status === "auto_cleared") {
    store.audit.push({
      id: `AUD-${id.slice(4)}`,
      caseId: id,
      phoneNumber: newCase.phoneNumber,
      decision: "auto_cleared",
      reviewer: "System policy",
      reason: `Low risk score (${newCase.score}/100) is below the human-review threshold. Auto-cleared by policy.`,
      timestamp,
    });
  }

  return clone(newCase);
}

export async function updateCaseDecision(
  caseId: string,
  decision: DecisionInput,
): Promise<Case> {
  const store = getStore();
  const normalizedId = caseId.trim().toUpperCase();
  const item = store.cases.find((entry) => entry.id === normalizedId);

  if (!item) {
    throw new Error("Case not found.");
  }

  if (item.status !== "pending") {
    throw new Error("This case has already been decided.");
  }

  const timestamp = new Date().toISOString();
  const status = statusForOutcome(decision.outcome);

  item.status = status;
  item.updatedAt = timestamp;
  item.decision = {
    outcome: decision.outcome,
    reviewer: decision.reviewer.trim(),
    reason: decision.reason.trim(),
    decidedAt: timestamp,
  };

  store.audit.push({
    id: `AUD-${item.id.slice(4)}-${Date.now().toString(36).toUpperCase()}`,
    caseId: item.id,
    phoneNumber: item.phoneNumber,
    decision: status as AuditDecision,
    reviewer: item.decision.reviewer,
    reason: item.decision.reason,
    timestamp,
  });

  return clone(item);
}

export async function getAuditLog(): Promise<AuditEntry[]> {
  return getStore()
    .audit.slice()
    .sort(
      (left, right) =>
        new Date(right.timestamp).getTime() -
        new Date(left.timestamp).getTime(),
    )
    .map((entry) => clone(entry));
}
