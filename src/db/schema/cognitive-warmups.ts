import { pgTable, text, integer, timestamp, real, serial, date } from "drizzle-orm/pg-core";

export const cognitiveWarmups = pgTable("cognitive_warmups", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  category: text("category", {
    enum: ["logical_reasoning", "mental_math", "estimation_fermi"],
  }).notNull(),
  difficultyLevel: integer("difficulty_level").notNull().default(1),
  score: real("score"),
  timeTakenSeconds: integer("time_taken_seconds"),
  timeLimitSeconds: integer("time_limit_seconds").default(180),
  challengeContent: text("challenge_content").notNull(),
  expectedAnswer: text("expected_answer"),
  explanation: text("explanation"),
  userResponse: text("user_response"),
  aiFeedback: text("ai_feedback"),
  isCorrect: integer("is_correct"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
