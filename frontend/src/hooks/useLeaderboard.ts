"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/lib/config";
import type { EarningEvent, LeaderboardEntry, Range } from "@/lib/types";

interface LeaderboardState {
  ranges: Record<Range, LeaderboardEntry[]> | null;
  lastEvent: EarningEvent | null;
  eventLog: EarningEvent[];
  connected: boolean;
  loading: boolean;
  tick: number;
}

const MAX_EVENT_LOG = 12;

export function useLeaderboard() {
  const [state, setState] = useState<LeaderboardState>({
    ranges: null,
    lastEvent: null,
    eventLog: [],
    connected: false,
    loading: true,
    tick: 0,
  });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Seed with a plain REST fetch so first paint doesn't wait on the socket handshake.
    (async () => {
      try {
        const [week, month, all] = await Promise.all(
          (["week", "month", "all"] as Range[]).map((range) =>
            fetch(`${API_URL}/api/leaderboard?range=${range}`).then((r) => r.json()),
          ),
        );
        if (cancelled) return;
        setState((s) => ({
          ...s,
          ranges: { week: week.entries, month: month.entries, all: all.entries },
          loading: false,
        }));
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    })();

    const socket = io(API_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setState((s) => ({ ...s, connected: true })));
    socket.on("disconnect", () => setState((s) => ({ ...s, connected: false })));
    socket.on(
      "leaderboard:update",
      (payload: { ranges: Record<Range, LeaderboardEntry[]>; event: EarningEvent | null }) => {
        setState((s) => ({
          ...s,
          ranges: payload.ranges,
          lastEvent: payload.event,
          loading: false,
          tick: s.tick + 1,
          eventLog: payload.event
            ? [payload.event, ...s.eventLog].slice(0, MAX_EVENT_LOG)
            : s.eventLog,
        }));
      },
    );

    return () => {
      cancelled = true;
      socket.disconnect();
    };
  }, []);

  return state;
}
