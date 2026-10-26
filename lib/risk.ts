import type {
  RiskAction,
  RiskAssessment,
  RiskInput,
  RiskLevel,
  RiskSignal,
} from "./types";

const POINTS = {
  recycled: 30,
  simSwap: 22,
  deviceChanged: 18,
} as const;

const INACTIVITY_TIERS = [
  { minDays: 730, points: 20 },
  { minDays: 365, points: 16 },
  { minDays: 180, points: 12 },
  { minDays: 90, points: 8 },
  { minDays: 30, points: 4 },
  { minDays: 1, points: 2 },
] as const;

const LINKED_ACCOUNT_TIERS = [
  { minAccounts: 6, points: 15 },
  { minAccounts: 4, points: 11 },
  { minAccounts: 2, points: 7 },
  { minAccounts: 1, points: 3 },
] as const;

export const RISK_THRESHOLDS = {
  medium: 30,
  high: 70,
} as const;

export const RISK_WEIGHTS = {
  recycled: POINTS.recycled,
  simSwap: POINTS.simSwap,
  deviceChanged: POINTS.deviceChanged,
  inactivityMax: INACTIVITY_TIERS[0].points,
  linkedAccountsMax: LINKED_ACCOUNT_TIERS[0].points,
} as const;

function inactivityPoints(days: number): number {
  return INACTIVITY_TIERS.find((tier) => days >= tier.minDays)?.points ?? 0;
}

function linkedAccountPoints(accounts: number): number {
  return (
    LINKED_ACCOUNT_TIERS.find((tier) => accounts >= tier.minAccounts)?.points ??
    0
  );
}

function levelForScore(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.high) return "high";
  if (score >= RISK_THRESHOLDS.medium) return "medium";
  return "low";
}

function actionForLevel(level: RiskLevel): RiskAction {
  if (level === "high") return "human_review_urgent";
  if (level === "medium") return "human_review";
  return "auto_clear";
}

function inactivityExplanation(days: number): string {
  if (days >= 365) {
    return `The number was dormant for ${days} days before reassignment. A long gap gives the previous owner plenty of time to leave linked recovery paths in place.`;
  }
  if (days >= 90) {
    return `The number was inactive for ${days} days before reassignment. That is enough time for stale recovery paths to remain attached.`;
  }
  if (days >= 30) {
    return `The number was inactive for ${days} days before reassignment, creating a modest window for old links to persist.`;
  }
  return `The number was inactive for ${days} ${days === 1 ? "day" : "days"} before reassignment, so the exposure window is limited.`;
}

export function assessRisk(input: RiskInput): RiskAssessment {
  const signals: RiskSignal[] = [];

  if (input.wasRecycled) {
    signals.push({
      id: "recycled",
      label: "Recycled number",
      explanation:
        "The number previously belonged to another subscriber and has been reassigned. Accounts tied to the old identity may still resolve to this number.",
      points: POINTS.recycled,
    });
  }

  const inactivity = inactivityPoints(input.daysInactive);
  if (inactivity > 0) {
    signals.push({
      id: "inactivity",
      label: "Dormancy before reassignment",
      explanation: inactivityExplanation(input.daysInactive),
      points: inactivity,
    });
  }

  const linkedAccounts = linkedAccountPoints(input.linkedAccounts);
  if (linkedAccounts > 0) {
    const noun = input.linkedAccounts === 1 ? "account" : "accounts";
    signals.push({
      id: "linked_accounts",
      label: "Linked accounts",
      explanation: `${input.linkedAccounts} linked ${noun} across banking, wallets, or government services still resolve to this number and may rely on SMS verification.`,
      points: linkedAccounts,
    });
  }

  if (input.recentSimSwap) {
    signals.push({
      id: "sim_swap",
      label: "Recent SIM swap",
      explanation:
        "A SIM swap was recorded in the last 30 days. A swap followed by a number reassignment is a common account-takeover pattern.",
      points: POINTS.simSwap,
    });
  }

  if (input.deviceChanged) {
    signals.push({
      id: "device_change",
      label: "Device changed",
      explanation:
        "The handset associated with the number changed during the reassignment window, which is consistent with a new owner taking control.",
      points: POINTS.deviceChanged,
    });
  }

  const rawScore = signals.reduce((total, signal) => total + signal.points, 0);
  const score = Math.min(100, rawScore);
  const level = levelForScore(score);

  return {
    score,
    level,
    signals,
    recommendedAction: actionForLevel(level),
  };
}
