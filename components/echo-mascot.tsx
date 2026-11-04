export type EchoMood = "idle" | "thinking" | "happy";

export function EchoMascot({
  mood = "idle",
  className = "",
  idPrefix = "echo",
}: {
  mood?: EchoMood;
  className?: string;
  idPrefix?: string;
}) {
  const bodyGradientId = `${idPrefix}-body-gradient`;
  const glowGradientId = `${idPrefix}-glow-gradient`;

  return (
    <div
      className={`echo-mascot ${className}`}
      data-mood={mood}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 180 200"
        className="echo-mascot-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={bodyGradientId} x1="90" y1="24" x2="90" y2="168">
            <stop offset="0%" stopColor="var(--ghost-highlight)" />
            <stop offset="100%" stopColor="var(--ghost)" />
          </linearGradient>
          <linearGradient id={glowGradientId} x1="90" y1="20" x2="90" y2="170">
            <stop offset="0%" stopColor="var(--ghost-glow)" stopOpacity="0.42" />
            <stop offset="100%" stopColor="var(--ghost-glow)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <ellipse
          className="echo-shadow"
          cx="90"
          cy="183"
          rx="48"
          ry="8"
          fill="var(--ghost-shadow)"
        />
        <ellipse
          cx="90"
          cy="96"
          rx="72"
          ry="76"
          fill={`url(#${glowGradientId})`}
        />

        <g className="echo-body">
          <path
            d="M34 98c0-37 25-68 56-68s56 31 56 68v51c0 13-15 20-24 11l-10-9c-6-5-15-5-21 1l-8 8c-7 7-18 7-25 0l-8-8c-6-6-15-6-21-1l-10 9c-9 9-24 2-24-11V98Z"
            fill={`url(#${bodyGradientId})`}
            stroke="var(--ghost-outline)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <g className="echo-eyes" fill="var(--ghost-eye)">
            {mood === "happy" ? (
              <>
                <path
                  d="M58 96c4-6 12-6 16 0"
                  stroke="var(--ghost-eye)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M106 96c4-6 12-6 16 0"
                  stroke="var(--ghost-eye)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <g className="echo-eye-open">
                  <ellipse cx="66" cy="96" rx="6.5" ry="8.5" />
                  <circle cx="68" cy="94" r="2.2" fill="var(--ghost-highlight)" />
                </g>
                <g className="echo-eye-open">
                  <ellipse cx="114" cy="96" rx="6.5" ry="8.5" />
                  <circle cx="116" cy="94" r="2.2" fill="var(--ghost-highlight)" />
                </g>
              </>
            )}
          </g>

          {mood === "thinking" ? (
            <ellipse
              cx="90"
              cy="123"
              rx="5"
              ry="6"
              fill="var(--ghost-eye)"
            />
          ) : mood === "happy" ? (
            <path
              d="M76 119c4 9 24 9 28 0"
              stroke="var(--ghost-eye)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M82 121c3 4 13 4 16 0"
              stroke="var(--ghost-eye)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          <ellipse
            cx="49"
            cy="116"
            rx="8"
            ry="4.5"
            fill="var(--ghost-blush)"
            opacity="0.7"
          />
          <ellipse
            cx="131"
            cy="116"
            rx="8"
            ry="4.5"
            fill="var(--ghost-blush)"
            opacity="0.7"
          />
        </g>

        {mood === "thinking" ? (
          <g className="echo-thoughts" fill="var(--ghost-highlight)" stroke="var(--ghost-outline)" strokeWidth="2">
            <circle cx="148" cy="61" r="4" />
            <circle cx="155" cy="48" r="6" />
            <circle cx="165" cy="31" r="8" />
          </g>
        ) : null}

        {mood === "happy" ? (
          <g className="echo-sparkles" fill="var(--ghost-spark)">
            <path d="M28 44l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" />
            <path d="M148 34l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5 2.5-6.5Z" />
            <path d="M154 132l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
