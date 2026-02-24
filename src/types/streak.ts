export interface StreakDay {
  date: string;
  blocksCompleted: string[];
  isRestDay: boolean;
  isComplete: boolean;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  nextMilestone: Milestone | null;
}

export interface Milestone {
  days: number;
  label: string;
  achieved: boolean;
}

export const MILESTONES: Milestone[] = [
  { days: 7, label: "Week One", achieved: false },
  { days: 30, label: "Monthly Machine", achieved: false },
  { days: 100, label: "Triple Digits", achieved: false },
  { days: 365, label: "Year of the Founder", achieved: false },
];

export type BlockType = "warmup" | "learning" | "reflection";

export const BLOCK_LABELS: Record<BlockType, string> = {
  warmup: "Cognitive Warm-Up",
  learning: "Learning Session",
  reflection: "Daily Reflection",
};
