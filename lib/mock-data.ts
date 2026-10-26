import { assessRisk } from "./risk";
import type {
  AuditDecision,
  AuditEntry,
  Case,
  CaseStatus,
  DecisionOutcome,
  RiskInput,
} from "./types";

interface SeedCaseConfig {
  id: string;
  input: RiskInput;
  createdMinutesAgo: number;
  status: CaseStatus;
  decision?: {
    outcome: DecisionOutcome;
    reviewer: string;
    reason: string;
    decidedMinutesAgo: number;
  };
}

const seedCaseConfigs: SeedCaseConfig[] = [
  {
    id: "SCG-1042",
    input: {
      phoneNumber: "+966552048817",
      daysInactive: 12,
      wasRecycled: false,
      linkedAccounts: 1,
      recentSimSwap: false,
      deviceChanged: false,
    },
    createdMinutesAgo: 8_640,
    status: "auto_cleared",
  },
  {
    id: "SCG-1043",
    input: {
      phoneNumber: "+966537712409",
      daysInactive: 45,
      wasRecycled: false,
      linkedAccounts: 0,
      recentSimSwap: false,
      deviceChanged: false,
    },
    createdMinutesAgo: 2_880,
    status: "auto_cleared",
  },
  {
    id: "SCG-1044",
    input: {
      phoneNumber: "+966503386721",
      daysInactive: 120,
      wasRecycled: false,
      linkedAccounts: 1,
      recentSimSwap: false,
      deviceChanged: true,
    },
    createdMinutesAgo: 1_800,
    status: "auto_cleared",
  },
  {
    id: "SCG-1045",
    input: {
      phoneNumber: "+966569024473",
      daysInactive: 3,
      wasRecycled: false,
      linkedAccounts: 0,
      recentSimSwap: false,
      deviceChanged: false,
    },
    createdMinutesAgo: 12_960,
    status: "auto_cleared",
  },
  {
    id: "SCG-1046",
    input: {
      phoneNumber: "+966541189036",
      daysInactive: 210,
      wasRecycled: true,
      linkedAccounts: 2,
      recentSimSwap: false,
      deviceChanged: false,
    },
    createdMinutesAgo: 1_560,
    status: "pending",
  },
  {
    id: "SCG-1047",
    input: {
      phoneNumber: "+966596402285",
      daysInactive: 95,
      wasRecycled: true,
      linkedAccounts: 3,
      recentSimSwap: false,
      deviceChanged: false,
    },
    createdMinutesAgo: 4_320,
    status: "approved",
    decision: {
      outcome: "approved",
      reviewer: "Faisal Al-Qahtani",
      reason:
        "Subscriber completed identity re-verification by phone. Linked accounts were confirmed as belonging to the new holder.",
      decidedMinutesAgo: 2_880,
    },
  },
  {
    id: "SCG-1048",
    input: {
      phoneNumber: "+966558731194",
      daysInactive: 200,
      wasRecycled: true,
      linkedAccounts: 2,
      recentSimSwap: false,
      deviceChanged: true,
    },
    createdMinutesAgo: 840,
    status: "pending",
  },
  {
    id: "SCG-1049",
    input: {
      phoneNumber: "+966582156670",
      daysInactive: 60,
      wasRecycled: true,
      linkedAccounts: 4,
      recentSimSwap: false,
      deviceChanged: false,
    },
    createdMinutesAgo: 7_200,
    status: "rejected",
    decision: {
      outcome: "rejected",
      reviewer: "Layan Al-Sudairi",
      reason:
        "Subscriber could not verify ownership of two linked accounts. Escalating to branch verification before any access is restored.",
      decidedMinutesAgo: 1_800,
    },
  },
  {
    id: "SCG-1050",
    input: {
      phoneNumber: "+966507743628",
      daysInactive: 800,
      wasRecycled: true,
      linkedAccounts: 6,
      recentSimSwap: true,
      deviceChanged: true,
    },
    createdMinutesAgo: 300,
    status: "pending",
  },
  {
    id: "SCG-1051",
    input: {
      phoneNumber: "+966573098152",
      daysInactive: 500,
      wasRecycled: true,
      linkedAccounts: 5,
      recentSimSwap: true,
      deviceChanged: false,
    },
    createdMinutesAgo: 1_200,
    status: "pending",
  },
  {
    id: "SCG-1052",
    input: {
      phoneNumber: "+966534869071",
      daysInactive: 320,
      wasRecycled: true,
      linkedAccounts: 4,
      recentSimSwap: true,
      deviceChanged: true,
    },
    createdMinutesAgo: 5_760,
    status: "rejected",
    decision: {
      outcome: "rejected",
      reviewer: "Noura Al-Harbi",
      reason:
        "SIM swap and device change occurred within 48 hours of reassignment. The prior owner still has an active banking linkage.",
      decidedMinutesAgo: 4_320,
    },
  },
  {
    id: "SCG-1053",
    input: {
      phoneNumber: "+966561287743",
      daysInactive: 700,
      wasRecycled: true,
      linkedAccounts: 3,
      recentSimSwap: false,
      deviceChanged: true,
    },
    createdMinutesAgo: 2_880,
    status: "more_info_requested",
    decision: {
      outcome: "more_info",
      reviewer: "Faisal Al-Qahtani",
      reason:
        "Requested proof of address and written confirmation from the prior owner's bank before the number is released for account recovery.",
      decidedMinutesAgo: 1_200,
    },
  },
];

function minutesBefore(now: Date, minutes: number): string {
  return new Date(now.getTime() - minutes * 60_000).toISOString();
}

export function createSeedCases(now = new Date()): Case[] {
  return seedCaseConfigs.map((config) => {
    const assessment = assessRisk(config.input);
    const createdAt = minutesBefore(now, config.createdMinutesAgo);
    const status =
      assessment.level === "low" ? "auto_cleared" : config.status;
    const decidedAt = config.decision
      ? minutesBefore(now, config.decision.decidedMinutesAgo)
      : undefined;

    return {
      ...config.input,
      id: config.id,
      carrier: "stc",
      score: assessment.score,
      level: assessment.level,
      signals: assessment.signals,
      recommendedAction: assessment.recommendedAction,
      status,
      createdAt,
      updatedAt: decidedAt ?? createdAt,
      decision:
        config.decision && decidedAt
          ? {
              outcome: config.decision.outcome,
              reviewer: config.decision.reviewer,
              reason: config.decision.reason,
              decidedAt,
            }
          : undefined,
    };
  });
}

export function createSeedAuditEntries(cases: Case[]): AuditEntry[] {
  return cases.flatMap((item) => {
    if (item.status === "auto_cleared") {
      return [
        {
          id: `AUD-${item.id.slice(4)}`,
          caseId: item.id,
          phoneNumber: item.phoneNumber,
          decision: "auto_cleared" as AuditDecision,
          reviewer: "System policy",
          reason: `Low risk score (${item.score}/100) is below the human-review threshold. Auto-cleared by policy.`,
          timestamp: item.updatedAt,
        },
      ];
    }

    if (item.decision) {
      return [
        {
          id: `AUD-${item.id.slice(4)}`,
          caseId: item.id,
          phoneNumber: item.phoneNumber,
          decision: item.status as AuditDecision,
          reviewer: item.decision.reviewer,
          reason: item.decision.reason,
          timestamp: item.decision.decidedAt,
        },
      ];
    }

    return [];
  });
}
