"use client";

import { motion } from "framer-motion";
import { Avatar } from "./Avatar";
import { CategoryTag } from "./CategoryTag";
import { RankDelta } from "./RankDelta";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompactInr } from "@/lib/format";
import type { LeaderboardEntry } from "@/lib/types";

const PODIUM_ORDER = [1, 0, 2] as const; // visual order: 2nd, 1st, 3rd

const RANK_STYLE: Record<number, { ring: string; badge: string; lift: string }> = {
  0: { ring: "ring-2 ring-lime/60", badge: "border-lime/50 text-lime", lift: "sm:-translate-y-3" },
  1: { ring: "", badge: "border-surface-border text-foreground/70", lift: "" },
  2: { ring: "", badge: "border-orange/40 text-orange/90", lift: "" },
};

function PodiumCard({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const earnings = useCountUp(entry.earnings, 1.1);
  const isFirst = index === 0;
  const style = RANK_STYLE[index];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: "easeOut" }}
      className={`glass relative flex flex-1 flex-col items-center gap-3 rounded-2xl px-4 pb-6 pt-8 ${style.ring} ${style.lift} ${
        isFirst ? "sm:flex-[1.12]" : ""
      }`}
    >
      <span
        className={`absolute left-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px] font-semibold ${style.badge}`}
      >
        {entry.rank}
      </span>

      <Avatar name={entry.name} size={isFirst ? 64 : 52} ring={isFirst} />

      <div className="text-center">
        <p className="max-w-[9rem] truncate font-display text-sm font-semibold sm:text-[15px]">
          {entry.name}
        </p>
        <p className="max-w-[9rem] truncate text-[11px] text-muted">{entry.college}</p>
      </div>

      <CategoryTag category={entry.category} />

      <p className="font-mono text-lg font-semibold tabular-nums text-lime sm:text-xl">
        {formatCompactInr(Math.round(earnings))}
      </p>

      <RankDelta rank={entry.rank} previousRank={entry.previousRank} />
    </motion.div>
  );
}

export function Podium({ entries }: { entries: LeaderboardEntry[] }) {
  const top3 = entries.slice(0, 3);
  if (top3.length < 3) return null;

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
      {PODIUM_ORDER.map((idx) => (
        <PodiumCard key={top3[idx].id} entry={top3[idx]} index={idx} />
      ))}
    </div>
  );
}
