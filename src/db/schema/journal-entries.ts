import { pgTable, text, timestamp, serial, date } from "drizzle-orm/pg-core";

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  type: text("type", {
    enum: ["daily_reflection", "decision_log", "weekly_reflection"],
  }).notNull().default("daily_reflection"),
  prompt: text("prompt"),
  response: text("response").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
