"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatInr } from "@/lib/format";
import type { EarningEvent } from "@/lib/types";

export function LiveTicker({
  event,
  tick,
  connected,
}: {
  event: EarningEvent | null;
  tick: number;
  connected: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 overflow-hidden rounded-full border border-surface-border bg-surface px-3 py-1.5 text-xs sm:text-sm">
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            connected ? "animate-ping bg-lime opacity-75" : "bg-muted"
          }`}
        />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${connected ? "bg-lime" : "bg-muted"}`} />
      </span>

      <div className="relative h-5 flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {event ? (
            <motion.p
              key={tick}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 truncate text-muted"
            >
              <span className="font-semibold text-foreground">{event.name}</span> just earned{" "}
              <span className="font-mono font-bold text-lime">{formatInr(event.amount)}</span> from{" "}
              {event.category.toLowerCase()} · {event.college}
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 truncate text-muted"
            >
              {connected ? "Live — watching for the next earn…" : "Connecting to live feed…"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
