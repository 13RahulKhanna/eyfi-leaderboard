"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "./Avatar";
import { formatInr } from "@/lib/format";
import type { EarningEvent } from "@/lib/types";

export function LiveActivityFeed({ events }: { events: EarningEvent[] }) {
  const items = events.slice(0, 6);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
        </span>
        <p className="text-[13px] font-semibold text-foreground">Live activity</p>
      </div>
      <p className="mt-0.5 text-[11px] text-muted">Fresh income, as it lands</p>

      <div className="mt-4 flex flex-col gap-2">
        {items.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-muted">Waiting for the first earn…</p>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((event, i) => (
              <motion.div
                key={`${event.id}-${i}`}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1 - i * 0.08, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 rounded-xl border border-surface-border bg-surface px-3 py-2"
              >
                <Avatar name={event.name} size={26} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{event.name}</p>
                  <p className="truncate text-[10.5px] text-muted">
                    {event.category} · {event.college}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[12.5px] font-semibold text-lime">
                  +{formatInr(event.amount)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
