import { Injectable } from '@nestjs/common';
import { generateParticipants } from './data/participants.seed.js';
import type {
  Category,
  EarningEvent,
  LeaderboardEntry,
  Participant,
  Range,
} from './types.js';

const RANGES: Range[] = ['week', 'month', 'all'];

// How many live ticks make up a simulated "day" before today's earnings roll into
// history and a fresh (empty) day opens up. Without this, a long-running server
// keeps piling every tick onto the same last array slot forever, so "today" grows
// to dwarf the other 6 days for everyone and every sparkline converges on the same
// flat-then-spike shape.
const TICKS_PER_DAY = 40;

@Injectable()
export class LeaderboardService {
  private readonly participants: Participant[] = generateParticipants();
  private previousRanks: Record<Range, Map<string, number>> = {
    week: new Map(),
    month: new Map(),
    all: new Map(),
  };
  private ticksSinceRollover = 0;

  constructor() {
    // Seed previousRanks so the very first response has sensible (flat) deltas.
    for (const range of RANGES) {
      this.rank(range).forEach((entry) => this.previousRanks[range].set(entry.id, entry.rank));
    }
  }

  private earningsFor(p: Participant, range: Range): number {
    if (range === 'week') {
      return p.dailyEarnings.slice(-7).reduce((a, b) => a + b, 0);
    }
    if (range === 'month') {
      return p.dailyEarnings.reduce((a, b) => a + b, 0);
    }
    return p.priorEarnings + p.dailyEarnings.reduce((a, b) => a + b, 0);
  }

  private rank(range: Range): LeaderboardEntry[] {
    const sorted = [...this.participants].sort(
      (a, b) => this.earningsFor(b, range) - this.earningsFor(a, range),
    );
    const prevMap = this.previousRanks[range];
    return sorted.map((p, idx) => ({
      id: p.id,
      rank: idx + 1,
      previousRank: prevMap.get(p.id) ?? idx + 1,
      name: p.name,
      college: p.college,
      city: p.city,
      category: p.category,
      earnings: this.earningsFor(p, range),
      streakDays: p.streakDays,
      badges: p.badges,
      trend: p.dailyEarnings.slice(-7),
    }));
  }

  private commitRanks(range: Range, entries: LeaderboardEntry[]) {
    const next = new Map<string, number>();
    entries.forEach((e) => next.set(e.id, e.rank));
    this.previousRanks[range] = next;
  }

  getLeaderboard(range: Range, category?: Category, search?: string): LeaderboardEntry[] {
    let entries = this.rank(range);
    if (category) {
      entries = entries.filter((e) => e.category === category);
    }
    if (search) {
      const q = search.trim().toLowerCase();
      if (q) {
        entries = entries.filter(
          (e) => e.name.toLowerCase().includes(q) || e.college.toLowerCase().includes(q),
        );
      }
    }
    return entries;
  }

  getAllRanges(): Record<Range, LeaderboardEntry[]> {
    const result = {} as Record<Range, LeaderboardEntry[]>;
    for (const range of RANGES) {
      result[range] = this.rank(range);
    }
    return result;
  }

  /** Shifts every participant's 30-day window forward by one day, opening a fresh "today". */
  private rolloverDay() {
    for (const p of this.participants) {
      p.priorEarnings += p.dailyEarnings.shift() ?? 0;
      p.dailyEarnings.push(0);

      let streak = 0;
      for (let d = p.dailyEarnings.length - 1; d >= 0; d--) {
        if (p.dailyEarnings[d] > 0) streak++;
        else break;
      }
      p.streakDays = streak;
    }
  }

  /** Advances the world by one tick: a few random participants earn a bit more, then re-rank. */
  tick(): { ranges: Record<Range, LeaderboardEntry[]>; event: EarningEvent | null } {
    this.ticksSinceRollover++;
    if (this.ticksSinceRollover >= TICKS_PER_DAY) {
      this.rolloverDay();
      this.ticksSinceRollover = 0;
    }

    const bumpCount = 1 + Math.floor(Math.random() * 3);
    let lastEvent: EarningEvent | null = null;

    for (let i = 0; i < bumpCount; i++) {
      const target = this.participants[Math.floor(Math.random() * this.participants.length)];
      const recentAvg = Math.max(1, target.dailyEarnings.slice(-7).reduce((a, b) => a + b, 0) / 7);
      const amount = Math.max(40, Math.round((Math.random() * 1.8 + 0.2) * recentAvg * 0.6));
      target.dailyEarnings[target.dailyEarnings.length - 1] += amount;
      target.streakDays = Math.max(target.streakDays, 1);
      lastEvent = {
        id: target.id,
        name: target.name,
        college: target.college,
        category: target.category,
        amount,
      };
    }

    const ranges = {} as Record<Range, LeaderboardEntry[]>;
    for (const range of RANGES) {
      const entries = this.rank(range);
      this.commitRanks(range, entries);
      ranges[range] = entries;
    }

    return { ranges, event: lastEvent };
  }
}
