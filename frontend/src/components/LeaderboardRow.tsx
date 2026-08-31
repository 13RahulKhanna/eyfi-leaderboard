"use client";

import { motion } from "framer-motion";
import { Avatar } from "./Avatar";
import { CategoryTag } from "./CategoryTag";
import { RankDelta } from "./RankDelta";
import { Sparkline } from "./Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { formatInr } from "@/lib/format";
import type { LeaderboardEntry } from "@/lib/types";

export function LeaderboardRow({ entry, highlight }: { entry: LeaderboardEntry; highlight?: boolean }) {
  const earnings = useCountUp(entry.earnings, 0.9);

  return (
    <motion.div
      layout
      layoutId={entry.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ layout: { duration: 0.5, ease: "easeInOut" }, opacity: { duration: 0.3 } }}
      className={`grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-xl border px-3 py-2.5 sm:grid-cols-[2.5rem_1fr_5rem_5rem_auto] sm:gap-4 sm:px-4 ${
        highlight
          ? "border-lime/40 bg-lime/[0.06]"
          : "border-surface-border bg-surface hover:border-surface-border/80 hover:bg-surface-raised/60"
      } transition-colors`}
    >
      <span className="text-center font-mono text-sm text-muted tabular-nums">{entry.rank}</span>

      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={entry.name} size={36} />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold sm:text-[15px]">{entry.name}</p>
          <p className="truncate text-xs text-muted">
            {entry.college}
            {entry.streakDays >= 3 && (
              <span className="ml-1.5 text-orange">🔥{entry.streakDays}</span>
            )}
          </p>
        </div>
      </div>

      <div className="hidden sm:block">
        <CategoryTag category={entry.category} />
      </div>

      <div className="hidden sm:flex sm:justify-center">
        <Sparkline data={entry.trend} />
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <span className="font-mono text-sm font-bold tabular-nums sm:text-base">
          {formatInr(Math.round(earnings))}
        </span>
        <RankDelta rank={entry.rank} previousRank={entry.previousRank} />
      </div>
    </motion.div>
  );
}
