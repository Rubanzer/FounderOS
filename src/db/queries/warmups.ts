import { db } from "@/db";
import { cognitiveWarmups } from "@/db/schema";
import { eq, desc, gte, and, or, isNotNull } from "drizzle-orm";
import type { WarmupCategory, DifficultyLevel } from "@/types/warmup";
import {
  ROLLING_WINDOW_DAYS,
  MIN_SESSIONS_FOR_ADJUSTMENT,
  DIFFICULTY_UP_THRESHOLD,
  DIFFICULTY_DOWN_THRESHOLD,
  WARMUP_MAX_DIFFICULTY,
  WARMUP_MIN_DIFFICULTY,
} from "@/lib/constants";

export async function getTodayWarmup() {
  const today = new Date().toISOString().split("T")[0];
  const rows = await db
    .select()
    .from(cognitiveWarmups)
    .where(eq(cognitiveWarmups.date, today))
    .orderBy(desc(cognitiveWarmups.createdAt))
    .limit(1);
  return rows[0] || null;
}

export async function saveWarmupChallenge(data: {
  date: string;
  category: WarmupCategory;
  difficultyLevel: DifficultyLevel;
  challengeContent: string;
  expectedAnswer: string;
  explanation: string;
  timeLimitSeconds: number;
}) {
  const result = await db
    .insert(cognitiveWarmups)
    .values({
      date: data.date,
      category: data.category,
      difficultyLevel: data.difficultyLevel,
      challengeContent: data.challengeContent,
      expectedAnswer: data.expectedAnswer,
      explanation: data.explanation,
      timeLimitSeconds: data.timeLimitSeconds,
    })
    .returning();
  return result[0];
}

export async function saveWarmupResult(
  id: number,
  data: {
    userResponse: string;
    score: number;
    isCorrect: boolean;
    aiFeedback: string;
    timeTakenSeconds: number;
  }
) {
  await db
    .update(cognitiveWarmups)
    .set({
      userResponse: data.userResponse,
      score: data.score,
      isCorrect: data.isCorrect ? 1 : 0,
      aiFeedback: data.aiFeedback,
      timeTakenSeconds: data.timeTakenSeconds,
    })
    .where(eq(cognitiveWarmups.id, id));
}

export async function getWarmupHistory(limit: number = 30) {
  return db
    .select()
    .from(cognitiveWarmups)
    .where(isNotNull(cognitiveWarmups.score))
    .orderBy(desc(cognitiveWarmups.createdAt))
    .limit(limit);
}

export async function getRollingAccuracy(category: WarmupCategory): Promise<{
  accuracy: number;
  sessionsCount: number;
}> {
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - ROLLING_WINDOW_DAYS);
  const windowStartStr = windowStart.toISOString().split("T")[0];

  const sessions = await db
    .select()
    .from(cognitiveWarmups)
    .where(
      and(
        eq(cognitiveWarmups.category, category),
        gte(cognitiveWarmups.date, windowStartStr)
      )
    )
    .orderBy(desc(cognitiveWarmups.createdAt));

  const scoredSessions = sessions.filter((s) => s.score !== null);
  if (scoredSessions.length === 0) return { accuracy: 0, sessionsCount: 0 };

  const avgScore =
    scoredSessions.reduce((sum, s) => sum + (s.score || 0), 0) /
    scoredSessions.length;

  return { accuracy: avgScore, sessionsCount: scoredSessions.length };
}

export async function calculateAdaptiveDifficulty(
  category: WarmupCategory,
  currentDifficulty: DifficultyLevel
): Promise<DifficultyLevel> {
  const { accuracy, sessionsCount } = await getRollingAccuracy(category);

  if (sessionsCount < MIN_SESSIONS_FOR_ADJUSTMENT) {
    return currentDifficulty;
  }

  if (accuracy > DIFFICULTY_UP_THRESHOLD && currentDifficulty < WARMUP_MAX_DIFFICULTY) {
    return (currentDifficulty + 1) as DifficultyLevel;
  }

  if (accuracy < DIFFICULTY_DOWN_THRESHOLD && currentDifficulty > WARMUP_MIN_DIFFICULTY) {
    return (currentDifficulty - 1) as DifficultyLevel;
  }

  return currentDifficulty;
}

export async function getCategoryStats() {
  const categories: WarmupCategory[] = [
    "logical_reasoning",
    "mental_math",
    "estimation_fermi",
  ];

  const stats = await Promise.all(
    categories.map(async (cat) => {
      const { accuracy, sessionsCount } = await getRollingAccuracy(cat);
      return { category: cat, accuracy, sessionsCount };
    })
  );

  return stats;
}

export async function getWarmupTrend(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0];

  return db
    .select()
    .from(cognitiveWarmups)
    .where(gte(cognitiveWarmups.date, startStr))
    .orderBy(cognitiveWarmups.date);
}
