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
    <header className="border-b border-surface-border">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="font-display text-[15px] font-bold tracking-tight">
            EY<span className="text-lime">FI</span>
          </span>
          <span className="h-3.5 w-px bg-surface-border" />
          <span className="text-[13px] text-muted">Challenge Leaderboard</span>
          <span className="hidden rounded-full border border-surface-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted sm:inline">
            Wave 01
          </span>
        </div>
        <div className="w-56 sm:w-72">
          <LiveTicker event={event} tick={tick} connected={connected} compact />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pb-8 pt-10 lg:px-10 lg:pt-14">
        <p className="text-[13px] font-medium tracking-wide text-lime">Live rankings</p>
        <h1 className="mt-2 max-w-2xl font-display text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem]">
          Who&apos;s earning the most, right now.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
          30 days. Real hustle, real income. Every rupee earned by every student, ranked live.
        </p>

        <div className="glass mt-8 grid grid-cols-3 divide-x divide-surface-border rounded-2xl">
          <StatCell label="Total earned" value={`₹${(totalEarned / 100000).toFixed(2)}L`} />
          <StatCell label="Active earners" value={String(activeEarners)} />
          <StatCell label="Prize pool" value="₹2,00,000+" accent="orange" />
        </div>
      </div>
    </header>
  );
}

function StatCell({
  label,
  value,
  accent = "lime",
}: {
  label: string;
  value: string;
  accent?: "lime" | "orange";
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3.5 sm:px-6 sm:py-4">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p
        className={`font-mono text-base font-semibold tabular-nums sm:text-lg ${
          accent === "lime" ? "text-lime" : "text-orange"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
