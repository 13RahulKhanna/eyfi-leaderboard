"use client";

import { Avatar } from "./Avatar";
import { formatCompactInr } from "@/lib/format";
import { CATEGORIES, type LeaderboardEntry } from "@/lib/types";

export function CategoryLeaders({ entries }: { entries: LeaderboardEntry[] }) {
  const leaders = CATEGORIES.map((category) => ({
    category,
    leader: entries.find((e) => e.category === category) ?? null,
  })).filter((c) => c.leader);

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[13px] font-semibold text-foreground">Category leaders</p>
      <p className="mt-0.5 text-[11px] text-muted">Top all-time earner in every hustle</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {leaders.map(({ category, leader }) => (
          <div
            key={category}
            className="flex flex-col gap-2 rounded-xl border border-surface-border bg-surface p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
                {category}
              </span>
              <div className="relative">
                <Avatar name={leader!.name} size={22} />
                <span className="medal-gold shine-sweep absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full text-[7px]">
                  1
                </span>
              </div>
            </div>
            <div>
              <p className="truncate text-[12.5px] font-medium">{leader!.name.split(" ")[0]}</p>
              <p className="font-mono text-[13px] font-semibold text-lime">
                {formatCompactInr(leader!.earnings)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
