export type Category = 'Freelance' | 'Sell' | 'Build' | 'Teach' | 'Perform' | 'Content';

export type Range = 'week' | 'month' | 'all';

export interface Participant {
  id: string;
  name: string;
  college: string;
  city: string;
  category: Category;
  /** Earnings in INR before the tracked 30-day window (adds depth to the "all time" range). */
  priorEarnings: number;
  /** Last 30 days of daily earnings in INR, index 29 is "today". */
  dailyEarnings: number[];
  streakDays: number;
  badges: string[];
}

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
