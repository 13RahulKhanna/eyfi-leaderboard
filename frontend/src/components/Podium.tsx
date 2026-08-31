"use client";

import { motion } from "framer-motion";
import { Avatar } from "./Avatar";
import { CategoryTag } from "./CategoryTag";
import { RankDelta } from "./RankDelta";
import { RankMedal } from "./RankMedal";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCompactInr } from "@/lib/format";
import type { LeaderboardEntry } from "@/lib/types";

const PODIUM_ORDER = [1, 0, 2] as const; // visual order: 2nd, 1st, 3rd

const RANK_STYLE: Record<number, { ring: string; glow: string; lift: string }> = {
  0: { ring: "ring-2 ring-[#f3d67a]/70", glow: "shadow-[0_0_40px_-14px_rgba(243,214,122,0.55)]", lift: "sm:-translate-y-3" },
  1: { ring: "ring-1 ring-white/15", glow: "", lift: "" },
  2: { ring: "ring-1 ring-[#e3a765]/30", glow: "", lift: "" },
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
      className={`glass relative flex flex-1 flex-col items-center gap-3 rounded-2xl px-4 pb-6 pt-8 ${style.ring} ${style.glow} ${style.lift} ${
        isFirst ? "sm:flex-[1.12]" : ""
      }`}
    >
      <div className="relative">
        <Avatar name={entry.name} size={isFirst ? 64 : 52} />
        <div className="absolute -bottom-1.5 -right-1.5">
          <RankMedal rank={entry.rank} size={isFirst ? 28 : 24} />
        </div>
      </div>

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
