export type Category = "Freelance" | "Sell" | "Build" | "Teach" | "Perform" | "Content";

export type Range = "week" | "month" | "all";

export interface LeaderboardEntry {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  college: string;
  city: string;
  category: Category;
  earnings: number;
  streakDays: number;
  badges: string[];
  trend: number[];
}

export interface EarningEvent {
  id: string;
  name: string;
  college: string;
  category: Category;
  amount: number;
}

export interface LeaderboardUpdate {
  ranges: Record<Range, LeaderboardEntry[]>;
  event: EarningEvent | null;
  generatedAt: number;
}

export const CATEGORIES: Category[] = [
  "Freelance",
  "Sell",
  "Build",
  "Teach",
  "Perform",
  "Content",
];

export const RANGES: { value: Range; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
];
