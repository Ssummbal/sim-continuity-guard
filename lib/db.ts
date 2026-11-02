import "server-only";

import { assessRisk } from "./risk";
import { getSupabaseAdmin } from "./supabase/admin";
import type { AuditRow, CaseRow } from "./supabase/database";
import type {
  AuditEntry,
  Case,
  CaseQuery,
  CaseStatus,
  DecisionOutcome,
  RiskInput,
} from "./types";

export interface DecisionInput {
  outcome: DecisionOutcome;
  reviewer: string;
  reason: string;
}

function toCase(row: CaseRow): Case {
  return {
    id: row.id,
    phoneNumber: row.phone_number,
    carrier: row.carrier,
    daysInactive: row.days_inactive,
    wasRecycled: row.was_recycled,
    linkedAccounts: row.linked_accounts,
    recentSimSwap: row.recent_sim_swap,
    deviceChanged: row.device_changed,
    score: row.score,
    level: row.level,
    signals: row.signals,
    recommendedAction: row.recommended_action,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.decision ? { decision: row.decision } : {}),
  };
}

function toAuditEntry(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    caseId: row.case_id,
    phoneNumber: row.phone_number,
    decision: row.decision,
    reviewer: row.reviewer,
    reason: row.reason,
    timestamp: row.created_at,
  };
}

export async function getCases(query: CaseQuery = {}): Promise<Case[]> {
  const { level = "all", status = "all" } = query;
  let request = getSupabaseAdmin().from("cases").select("*");

  if (level !== "all") {
    request = request.eq("level", level);
  }

  if (status !== "all") {
    request = request.eq("status", status);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  return data.map(toCase);
}

export async function getCaseById(id: string): Promise<Case | null> {
  const normalizedId = id.trim().toUpperCase();
  const { data, error } = await getSupabaseAdmin()
    .from("cases")
    .select("*")
    .eq("id", normalizedId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? toCase(data) : null;
}

export async function createCase(input: RiskInput): Promise<Case> {
  const assessment = assessRisk(input);
  const status: CaseStatus =
    assessment.level === "low" ? "auto_cleared" : "pending";
  const autoClearReason = `Low risk score (${assessment.score}/100) is below the human-review threshold. Auto-cleared by policy.`;

  const { data, error } = await getSupabaseAdmin().rpc("create_case", {
    p_phone_number: input.phoneNumber,
    p_days_inactive: input.daysInactive,
    p_was_recycled: input.wasRecycled,
    p_linked_accounts: input.linkedAccounts,
    p_recent_sim_swap: input.recentSimSwap,
    p_device_changed: input.deviceChanged,
    p_score: assessment.score,
    p_level: assessment.level,
    p_signals: assessment.signals,
    p_recommended_action: assessment.recommendedAction,
    p_status: status,
    p_audit_reviewer: status === "auto_cleared" ? "System policy" : null,
    p_audit_reason: status === "auto_cleared" ? autoClearReason : null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return toCase(data);
}

export async function updateCaseDecision(
  caseId: string,
  decision: DecisionInput,
): Promise<Case> {
  const normalizedId = caseId.trim().toUpperCase();
  const { data, error } = await getSupabaseAdmin().rpc("decide_case", {
    p_case_id: normalizedId,
    p_outcome: decision.outcome,
    p_reviewer: decision.reviewer.trim(),
    p_reason: decision.reason.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return toCase(data);
}

export async function getAuditLog(): Promise<AuditEntry[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("audit_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(toAuditEntry);
}
