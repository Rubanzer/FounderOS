export type JournalType = "daily_reflection" | "decision_log" | "weekly_reflection";

export interface JournalEntry {
  id: number;
  date: string;
  type: JournalType;
  prompt: string | null;
  response: string;
  createdAt: string;
}
