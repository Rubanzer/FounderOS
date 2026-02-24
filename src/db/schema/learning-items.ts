import { pgTable, text, integer, timestamp, serial, jsonb } from "drizzle-orm/pg-core";

export const learningItems = pgTable("learning_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", {
    enum: ["video", "book_chapter", "podcast", "article", "course", "exercise"],
  }).notNull(),
  tier: integer("tier").notNull().default(1),
  skillArea: text("skill_area").notNull(),
  sourceUrl: text("source_url"),
  estimatedMinutes: integer("estimated_minutes"),
  status: text("status", {
    enum: ["not_started", "in_progress", "completed"],
  }).notNull().default("not_started"),
  notes: text("notes"),
  keyConcepts: jsonb("key_concepts").$type<string[]>().default([]),
  rating: integer("rating"),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
