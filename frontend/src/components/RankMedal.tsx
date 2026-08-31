const MEDAL_CLASS: Record<number, string> = {
  1: "medal-gold",
  2: "medal-silver",
  3: "medal-bronze",
};

export function RankMedal({ rank, size = 26 }: { rank: number; size?: number }) {
  const medalClass = MEDAL_CLASS[rank];

  if (!medalClass) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full border border-surface-border font-mono text-[11px] text-muted"
        style={{ width: size, height: size }}
      >
        {rank}
      </span>
    );
  }

  return (
    <span
      className={`shine-sweep flex shrink-0 items-center justify-center rounded-full font-mono font-bold ${medalClass}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {rank}
    </span>
  );
}
