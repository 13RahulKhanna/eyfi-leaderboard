"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatInr } from "@/lib/format";
import type { EarningEvent } from "@/lib/types";

export function LiveTicker({
  event,
  tick,
  connected,
  compact = false,
}: {
  event: EarningEvent | null;
  tick: number;
  connected: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 overflow-hidden rounded-full border border-surface-border bg-surface ${
        compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs sm:text-sm"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            connected ? "animate-ping bg-lime opacity-75" : "bg-muted"
          }`}
        />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${connected ? "bg-lime" : "bg-muted"}`} />
      </span>

      <div className={`relative flex-1 overflow-hidden ${compact ? "h-4" : "h-5"}`}>
        <AnimatePresence mode="popLayout">
          {event ? (
            <motion.p
              key={tick}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 truncate text-muted"
            >
              <span className="font-medium text-foreground">{event.name.split(" ")[0]}</span> earned{" "}
              <span className="font-mono font-semibold text-lime">{formatInr(event.amount)}</span>
              {!compact && <> from {event.category.toLowerCase()} · {event.college}</>}
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 truncate text-muted"
            >
              {connected ? "Live · watching…" : "Connecting…"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
