import { pgTable, text, integer, jsonb, serial, timestamp } from "drizzle-orm/pg-core";

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  dailyTimeBudgetMinutes: integer("daily_time_budget_minutes").default(45),
  scheduledRestDays: jsonb("scheduled_rest_days").$type<string[]>().default([]),
  theme: text("theme", { enum: ["light", "dark", "system"] }).default("system"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
