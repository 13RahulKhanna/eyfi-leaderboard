const DAY = 14;
const TOTAL_DAYS = 30;

export function ChallengeProgress() {
  const pct = DAY / TOTAL_DAYS;
  const r = 38;
  const c = 2 * Math.PI * r;

  return (
    <div className="glass flex items-center gap-4 rounded-2xl p-4">
      <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0 -rotate-90">
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8ff9c" />
            <stop offset="55%" stopColor="var(--lime)" />
            <stop offset="100%" stopColor="var(--lime-dim)" />
          </linearGradient>
        </defs>
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--surface-border)" strokeWidth="7" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ filter: "drop-shadow(0 0 6px rgba(196, 246, 46, 0.45))" }}
        />
      </svg>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted">Wave 01 progress</p>
        <p className="mt-1 font-display text-xl font-semibold">
          Day {DAY}
          <span className="text-muted"> / {TOTAL_DAYS}</span>
        </p>
        <p className="mt-0.5 text-[12px] text-muted">{TOTAL_DAYS - DAY} days left to climb</p>
      </div>
    </div>
  );
}
