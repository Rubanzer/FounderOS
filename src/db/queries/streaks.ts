import { db } from "@/db";
import { streakData } from "@/db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { getTodayString } from "@/lib/utils";
import type { StreakStats, Milestone } from "@/types/streak";
import { MILESTONES } from "@/types/streak";

export async function getTodayStreak() {
  const today = getTodayString();
  const rows = await db
    .select()
    .from(streakData)
    .where(eq(streakData.date, today))
    .limit(1);
  return rows[0] || null;
}

export async function getStreakStats(): Promise<StreakStats> {
  const allDays = await db
    .select()
    .from(streakData)
    .orderBy(desc(streakData.date));

  if (allDays.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
      nextMilestone: MILESTONES[0],
    };
  }

  const today = getTodayString();
  const totalDaysCompleted = allDays.filter((d) => d.isComplete).length;

  // Calculate current streak
  let currentStreak = 0;
  const sortedDays = allDays.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const day of sortedDays) {
    const dayDate = new Date(day.date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - currentStreak);
    const expectedDateStr = expectedDate.toISOString().split("T")[0];

    if (day.date === expectedDateStr && day.isComplete) {
      currentStreak++;
    } else if (day.date === expectedDateStr && !day.isComplete) {
      // Today might not be complete yet — check yesterday
      if (currentStreak === 0) continue;
      break;
    } else {
      break;
    }
  }

  // If today isn't in the data yet, check if yesterday was the last complete day
  if (currentStreak === 0) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    for (const day of sortedDays) {
      const expectedDate = new Date(yesterdayStr);
      expectedDate.setDate(expectedDate.getDate() - currentStreak);
      const expectedDateStr = expectedDate.toISOString().split("T")[0];

      if (day.date === expectedDateStr && day.isComplete) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const chronological = [...allDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 0; i < chronological.length; i++) {
    if (chronological[i].isComplete) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(chronological[i - 1].date);
        const curr = new Date(chronological[i].date);
        const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays === 1 && chronological[i - 1].isComplete) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  // Find next milestone
  const milestones: Milestone[] = MILESTONES.map((m) => ({
    ...m,
    achieved: currentStreak >= m.days,
  }));
  const nextMilestone = milestones.find((m) => !m.achieved) || null;

  return {
    currentStreak,
    longestStreak,
    totalDaysCompleted,
    nextMilestone,
  };
}

export async function getStreakHeatmapData(days: number = 365) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0];

  const rows = await db
    .select()
    .from(streakData)
    .where(gte(streakData.date, startStr))
    .orderBy(streakData.date);

  return rows;
}

export async function upsertStreakDay(
  date: string,
  blocks: string[],
  isRestDay: boolean = false
) {
  const existing = await db
    .select()
    .from(streakData)
    .where(eq(streakData.date, date))
    .limit(1);

  const blocksCompleted = existing[0]
    ? [...new Set([...(existing[0].blocksCompleted || []), ...blocks])]
    : blocks;

  const hasWarmup = blocksCompleted.includes("warmup");
  const hasOther = blocksCompleted.some((b) => b !== "warmup");
  const isComplete = isRestDay || (hasWarmup && hasOther);

  if (existing[0]) {
    await db
      .update(streakData)
      .set({ blocksCompleted, isRestDay, isComplete })
      .where(eq(streakData.date, date));
  } else {
    await db.insert(streakData).values({
      date,
      blocksCompleted,
      isRestDay,
      isComplete,
    });
  }

  return { blocksCompleted, isComplete };
}

export async function scheduleRestDay(date: string) {
  const today = getTodayString();
  if (date <= today) {
    throw new Error("Rest days must be scheduled in advance");
  }

  // Check if already has a rest day this week
  const dayOfWeek = new Date(date).getDay();
  const weekStart = new Date(date);
  weekStart.setDate(weekStart.getDate() - dayOfWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekStartStr = weekStart.toISOString().split("T")[0];
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  const existingRestDays = await db
    .select()
    .from(streakData)
    .where(
      and(
        gte(streakData.date, weekStartStr),
        lte(streakData.date, weekEndStr),
        eq(streakData.isRestDay, true)
      )
    );

  if (existingRestDays.length >= 1) {
    throw new Error("Maximum 1 rest day per week");
  }

  return upsertStreakDay(date, [], true);
}
