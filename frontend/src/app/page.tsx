"use client";

import { useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { Podium } from "@/components/Podium";
import { LeaderboardRow } from "@/components/LeaderboardRow";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { Category, Range } from "@/lib/types";

export default function Page() {
  const { ranges, lastEvent, tick, connected, loading } = useLeaderboard();
  const [range, setRange] = useState<Range>("week");
  const [category, setCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = ranges?.[range] ?? [];
    if (category) list = list.filter((e) => e.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) => e.name.toLowerCase().includes(q) || e.college.toLowerCase().includes(q),
      );
    }
    return list;
  }, [ranges, range, category, search]);

  const showPodium = !category && !search.trim() && filtered.length >= 3;
  const listEntries = showPodium ? filtered.slice(3) : filtered;

  const totalEarned = useMemo(
    () => (ranges?.all ?? []).reduce((sum, e) => sum + e.earnings, 0),
    [ranges],
  );

  return (
    <>
      <Header
        event={lastEvent}
        tick={tick}
        connected={connected}
        totalEarned={totalEarned}
        activeEarners={ranges?.all.length ?? 0}
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-16 pt-6 sm:px-6">
        {loading ? (
          <LoadingState />
        ) : (
          <>
            {showPodium && (
              <section className="pb-2">
                <Podium entries={filtered} />
              </section>
            )}

            <FilterBar
              range={range}
              onRangeChange={setRange}
              category={category}
              onCategoryChange={setCategory}
              search={search}
              onSearchChange={setSearch}
            />

            <LayoutGroup>
              <section className="flex flex-col gap-2">
                {listEntries.length === 0 ? (
                  <p className="py-12 text-center text-sm text-muted">
                    No one matches that search yet — be the first.
                  </p>
                ) : (
                  listEntries.map((entry) => <LeaderboardRow key={entry.id} entry={entry} />)
                )}
              </section>
            </LayoutGroup>
          </>
        )}
      </main>

      <footer className="border-t border-surface-border py-6 text-center text-xs text-muted">
        Built for the EYFI Challenge — rankings update live as students log new income.
      </footer>
    </>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-2 pt-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.05 }}
          className="h-16 rounded-xl border border-surface-border bg-surface"
        />
      ))}
    </div>
  );
}
