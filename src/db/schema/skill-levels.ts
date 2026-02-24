import { pgTable, text, integer, real, serial, jsonb, timestamp } from "drizzle-orm/pg-core";

export type WarmupDifficulty = {
  logical_reasoning: number;
  mental_math: number;
  estimation_fermi: number;
  systems_design: number;
  strategic_thinking: number;
  product_sense: number;
};

export const skillLevels = pgTable("skill_levels", {
  id: serial("id").primaryKey(),
  skillArea: text("skill_area").notNull().unique(),
  currentLevel: integer("current_level").notNull().default(0),
  warmupDifficulty: jsonb("warmup_difficulty").$type<WarmupDifficulty>().default({
    logical_reasoning: 1,
    mental_math: 1,
    estimation_fermi: 1,
    systems_design: 1,
    strategic_thinking: 1,
    product_sense: 1,
  }),
  rollingAccuracy: real("rolling_accuracy").default(0),
  totalSessions: integer("total_sessions").default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
