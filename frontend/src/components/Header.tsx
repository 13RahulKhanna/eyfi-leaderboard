import { LiveTicker } from "./LiveTicker";
import type { EarningEvent } from "@/lib/types";

export function Header({
  event,
  tick,
  connected,
  totalEarned,
  activeEarners,
}: {
  event: EarningEvent | null;
  tick: number;
  connected: boolean;
  totalEarned: number;
  activeEarners: number;
}) {
  return (
    <header className="relative overflow-hidden border-b border-surface-border">
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--lime), transparent)" }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-6 pt-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-extrabold tracking-tight">
              EY<span className="text-lime">FI</span>
            </span>
            <span className="hidden text-xs text-muted sm:inline">Earn Your First Income</span>
            <span className="rounded-full border border-orange/30 bg-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange">
              Wave 01 · Leaderboard
            </span>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[22rem]">
            <LiveTicker event={event} tick={tick} connected={connected} />
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
            Who&apos;s earning the most, <span className="text-lime">right now.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
            30 days. Real hustle, real income. Every rupee earned by every student, ranked live.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatChip label="Total earned" value={`₹${(totalEarned / 100000).toFixed(2)}L`} accent="lime" />
          <StatChip label="Active earners" value={String(activeEarners)} accent="orange" />
          <StatChip label="Prize pool" value="₹2,00,000+" accent="lime" />
        </div>
      </div>
    </header>
  );
}

function StatChip({ label, value, accent }: { label: string; value: string; accent: "lime" | "orange" }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface px-4 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className={`font-mono text-lg font-bold ${accent === "lime" ? "text-lime" : "text-orange"}`}>
        {value}
      </p>
    </div>
  );
}
