"use client";

import { motion } from "framer-motion";
import { CATEGORIES, RANGES, type Category, type Range } from "@/lib/types";

export function FilterBar({
  range,
  onRangeChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: {
  range: Range;
  onRangeChange: (r: Range) => void;
  category: Category | null;
  onCategoryChange: (c: Category | null) => void;
  search: string;
  onSearchChange: (s: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-surface-border bg-background/80 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex rounded-full border border-surface-border bg-surface p-1">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => onRangeChange(r.value)}
            className="relative z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm"
          >
            {range === r.value && (
              <motion.span
                layoutId="range-pill"
                className="glossy absolute inset-0 -z-10 rounded-full bg-lime shadow-[0_2px_12px_-2px_rgba(196,246,46,0.5)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span className={range === r.value ? "text-black" : "text-muted"}>{r.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onCategoryChange(null)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              category === null
                ? "glossy border-orange bg-orange/15 text-orange shadow-[0_2px_10px_-4px_rgba(255,90,31,0.5)]"
                : "border-surface-border text-muted hover:border-surface-border/80"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(category === c ? null : c)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === c
                  ? "glossy border-orange bg-orange/15 text-orange shadow-[0_2px_10px_-4px_rgba(255,90,31,0.5)]"
                  : "border-surface-border text-muted hover:border-surface-border/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name or college"
          className="w-full min-w-0 shrink rounded-full border border-surface-border bg-surface px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-lime/50 focus:outline-none sm:w-56 sm:text-sm"
        />
      </div>
    </div>
  );
}
