import type { RiskLevel } from "@/lib/types";

const ringColors: Record<RiskLevel, string> = {
  low: "var(--risk-low)",
  medium: "var(--risk-medium)",
  high: "var(--risk-high)",
};

export function ScoreRing({
  score,
  level,
}: {
  score: number;
  level: RiskLevel;
}) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const degrees = clampedScore * 3.6;

  return (
    <div
      role="img"
      aria-label={`Risk score ${clampedScore} out of 100`}
      className="relative grid size-36 shrink-0 place-items-center rounded-full shadow-[0_18px_36px_-24px_var(--ghost-shadow)]"
      style={{
        background: `conic-gradient(${ringColors[level]} ${degrees}deg, var(--ring-track) ${degrees}deg 360deg)`,
      }}
    >
      <div className="grid size-[7.25rem] place-items-center rounded-full bg-surface text-center">
        <div>
          <span className="block font-serif text-4xl font-semibold leading-none tracking-tight">
            {clampedScore}
          </span>
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            of 100
          </span>
        </div>
      </div>
    </div>
  );
}
