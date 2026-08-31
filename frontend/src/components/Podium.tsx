"use client";

import { motion } from "framer-motion";
import { Avatar } from "./Avatar";
import { CategoryTag } from "./CategoryTag";
import { RankDelta } from "./RankDelta";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompactInr } from "@/lib/format";
import type { LeaderboardEntry } from "@/lib/types";

const PODIUM_ORDER = [1, 0, 2] as const; // visual order: 2nd, 1st, 3rd
const STEP_HEIGHT: Record<number, string> = { 0: "h-40 sm:h-48", 1: "h-32 sm:h-36", 2: "h-24 sm:h-28" };
const CROWN: Record<number, string> = { 0: "👑", 1: "🥈", 2: "🥉" };

function PodiumCard({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const earnings = useCountUp(entry.earnings, 1.1);
  const isFirst = index === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center gap-2 ${isFirst ? "order-2" : index === 1 ? "order-1" : "order-3"}`}
    >
      <div className="text-xl">{CROWN[index]}</div>
      <div className="relative">
        <Avatar name={entry.name} size={isFirst ? 72 : 56} ring={isFirst} />
        {isFirst && (
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-lime/25 blur-xl" />
        )}
      </div>
      <div className="text-center">
        <p className="max-w-[9rem] truncate font-display text-sm font-bold sm:text-base">{entry.name}</p>
        <p className="max-w-[9rem] truncate text-[11px] text-muted">{entry.college}</p>
      </div>
      <CategoryTag category={entry.category} />
      <p className="font-mono text-lg font-bold text-lime sm:text-xl">
        {formatCompactInr(Math.round(earnings))}
      </p>
      <RankDelta rank={entry.rank} previousRank={entry.previousRank} />
      <div
        className={`mt-1 w-20 rounded-t-xl border border-b-0 border-surface-border bg-gradient-to-b from-surface-raised to-surface sm:w-28 ${STEP_HEIGHT[index]} flex items-start justify-center pt-2`}
      >
        <span className="font-display text-2xl font-extrabold text-muted/60">{entry.rank}</span>
      </div>
    </motion.div>
  );
}

export function Podium({ entries }: { entries: LeaderboardEntry[] }) {
  const top3 = entries.slice(0, 3);
  if (top3.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6">
      {PODIUM_ORDER.map((idx) => (
        <PodiumCard key={top3[idx].id} entry={top3[idx]} index={idx} />
      ))}
    </div>
  );
}
