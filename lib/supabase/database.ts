import type {
  AuditDecision,
  CaseStatus,
  Decision,
  RiskAction,
  RiskLevel,
  RiskSignal,
} from "../types";

export type CaseRow = {
  id: string;
  phone_number: string;
  carrier: string;
  days_inactive: number;
  was_recycled: boolean;
  linked_accounts: number;
  recent_sim_swap: boolean;
  device_changed: boolean;
  score: number;
  level: RiskLevel;
  signals: RiskSignal[];
  recommended_action: RiskAction;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
  decision: Decision | null;
};

export type AuditRow = {
  id: string;
  case_id: string;
  phone_number: string;
  decision: AuditDecision;
  reviewer: string;
  reason: string;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  status: "pending" | "approved" | "rejected";
  role: string;
  created_at: string;
};

type CaseInsert = {
  id?: string;
  phone_number: string;
  carrier?: string;
  days_inactive: number;
  was_recycled: boolean;
  linked_accounts: number;
  recent_sim_swap: boolean;
  device_changed: boolean;
  score: number;
  level: RiskLevel;
  signals: RiskSignal[];
  recommended_action: RiskAction;
  status: CaseStatus;
  created_at?: string;
  updated_at?: string;
  decision?: Decision | null;
};

type AuditInsert = {
  id?: string;
  case_id: string;
  phone_number: string;
  decision: AuditDecision;
  reviewer: string;
  reason: string;
  created_at?: string;
};

type ProfileInsert = {
  id: string;
  email?: string | null;
  status?: "pending" | "approved" | "rejected";
  role?: string;
  created_at?: string;
};

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: CaseRow;
        Insert: CaseInsert;
        Update: Partial<CaseInsert>;
        Relationships: [];
      };
      audit_entries: {
        Row: AuditRow;
        Insert: AuditInsert;
        Update: Partial<AuditInsert>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_case: {
        Args: Record<string, unknown>;
        Returns: CaseRow;
      };
      decide_case: {
        Args: Record<string, unknown>;
        Returns: CaseRow;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
