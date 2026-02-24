import { pgTable, text, date, boolean, serial, jsonb } from "drizzle-orm/pg-core";

export const streakData = pgTable("streak_data", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  blocksCompleted: jsonb("blocks_completed").$type<string[]>().default([]),
  isRestDay: boolean("is_rest_day").notNull().default(false),
  isComplete: boolean("is_complete").notNull().default(false),
});
