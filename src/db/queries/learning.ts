import { db } from "@/db";
import { learningItems } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { SkillArea, Tier, LearningStatus } from "@/types/learning";

export async function getLearningItems(tier?: number) {
  if (tier) {
    return db
      .select()
      .from(learningItems)
      .where(eq(learningItems.tier, tier))
      .orderBy(learningItems.skillArea, learningItems.id);
  }
  return db
    .select()
    .from(learningItems)
    .orderBy(learningItems.tier, learningItems.skillArea, learningItems.id);
}

export async function getLearningItem(id: number) {
  const rows = await db
    .select()
    .from(learningItems)
    .where(eq(learningItems.id, id))
    .limit(1);
  return rows[0] || null;
}

export async function updateLearningItem(
  id: number,
  data: {
    status?: LearningStatus;
    notes?: string;
    keyConcepts?: string[];
    rating?: number;
    timeSpentMinutes?: number;
  }
) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (data.status !== undefined) updates.status = data.status;
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.keyConcepts !== undefined) updates.keyConcepts = data.keyConcepts;
  if (data.rating !== undefined) updates.rating = data.rating;
  if (data.timeSpentMinutes !== undefined) {
    // Accumulate time
    const existing = await getLearningItem(id);
    updates.timeSpentMinutes = (existing?.timeSpentMinutes || 0) + data.timeSpentMinutes;
  }
  if (data.status === "completed") {
    updates.completedAt = new Date();
  }

  await db
    .update(learningItems)
    .set(updates)
    .where(eq(learningItems.id, id));
}

export async function getProgressByTier() {
  const items = await db.select().from(learningItems);

  const tierProgress: Record<number, { total: number; completed: number }> = {};

  for (const item of items) {
    if (!tierProgress[item.tier]) {
      tierProgress[item.tier] = { total: 0, completed: 0 };
    }
    tierProgress[item.tier].total++;
    if (item.status === "completed") {
      tierProgress[item.tier].completed++;
    }
  }

  return tierProgress;
}

export async function getProgressBySkillArea() {
  const items = await db.select().from(learningItems);

  const skillProgress: Record<string, { total: number; completed: number; inProgress: number }> = {};

  for (const item of items) {
    if (!skillProgress[item.skillArea]) {
      skillProgress[item.skillArea] = { total: 0, completed: 0, inProgress: 0 };
    }
    skillProgress[item.skillArea].total++;
    if (item.status === "completed") {
      skillProgress[item.skillArea].completed++;
    } else if (item.status === "in_progress") {
      skillProgress[item.skillArea].inProgress++;
    }
  }

  return skillProgress;
}

export async function getUpNextItem() {
  // Find least-progressed skill area in lowest incomplete tier
  const tierProgress = await getProgressByTier();
  let targetTier = 1;
  for (const tier of [1, 2, 3]) {
    const progress = tierProgress[tier];
    if (progress && progress.completed < progress.total) {
      targetTier = tier;
      break;
    }
  }

  // Find skill area with least progress in target tier
  const items = await db
    .select()
    .from(learningItems)
    .where(
      and(
        eq(learningItems.tier, targetTier),
        eq(learningItems.status, "not_started")
      )
    )
    .orderBy(learningItems.skillArea, learningItems.id)
    .limit(1);

  return items[0] || null;
}

export async function getComingUpItems(limit: number = 3) {
  // Get the next N not_started items after the up-next item
  const tierProgress = await getProgressByTier();
  let targetTier = 1;
  for (const tier of [1, 2, 3]) {
    const progress = tierProgress[tier];
    if (progress && progress.completed < progress.total) {
      targetTier = tier;
      break;
    }
  }

  const items = await db
    .select()
    .from(learningItems)
    .where(
      and(
        eq(learningItems.tier, targetTier),
        eq(learningItems.status, "not_started")
      )
    )
    .orderBy(learningItems.skillArea, learningItems.id)
    .limit(limit + 1); // +1 because the first one is the "up next" item

  // Skip the first (that's the up-next), return the rest
  return items.slice(1, limit + 1);
}

export async function getLearningVelocity() {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const allItems = await db.select().from(learningItems);
  const completed = allItems.filter((i) => i.status === "completed");

  const weekItems = completed.filter(
    (i) => i.completedAt && new Date(i.completedAt) >= weekAgo
  );
  const monthItems = completed.filter(
    (i) => i.completedAt && new Date(i.completedAt) >= monthAgo
  );

  const weekMinutes = weekItems.reduce((sum, i) => sum + (i.timeSpentMinutes || 0), 0);
  const monthMinutes = monthItems.reduce((sum, i) => sum + (i.timeSpentMinutes || 0), 0);

  return {
    weekItems: weekItems.length,
    monthItems: monthItems.length,
    weekMinutes,
    monthMinutes,
    totalItems: allItems.length,
    completedItems: completed.length,
  };
}

export async function addLearningItem(data: {
  title: string;
  type: string;
  tier: number;
  skillArea: string;
  sourceUrl?: string;
  estimatedMinutes?: number;
}) {
  const result = await db
    .insert(learningItems)
    .values({
      title: data.title,
      type: data.type as "video" | "book_chapter" | "podcast" | "article" | "course" | "exercise",
      tier: data.tier,
      skillArea: data.skillArea,
      sourceUrl: data.sourceUrl,
      estimatedMinutes: data.estimatedMinutes,
    })
    .returning();
  return result[0];
}
