export function RankDelta({ rank, previousRank }: { rank: number; previousRank: number }) {
  const delta = previousRank - rank;

  if (delta === 0) {
    return <span className="text-xs font-mono text-muted tabular-nums">—</span>;
  }

  const up = delta > 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-mono tabular-nums ${
        up ? "text-lime" : "text-orange"
      }`}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      {Math.abs(delta)}
    </span>
  );
}
