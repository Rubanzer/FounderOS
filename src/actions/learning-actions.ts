"use server";

import { updateLearningItem, addLearningItem as addItem } from "@/db/queries/learning";
import { upsertStreakDay } from "@/db/queries/streaks";
import { revalidatePath } from "next/cache";
import type { LearningStatus } from "@/types/learning";

export async function logLearningSession(
  itemId: number,
  data: {
    timeSpentMinutes: number;
    notes?: string;
    keyConcepts?: string[];
    status?: LearningStatus;
    rating?: number;
  }
) {
  await updateLearningItem(itemId, {
    timeSpentMinutes: data.timeSpentMinutes,
    notes: data.notes,
    keyConcepts: data.keyConcepts,
    status: data.status,
    rating: data.rating,
  });

  // Mark learning block complete for today
  const today = new Date().toISOString().split("T")[0];
  await upsertStreakDay(today, ["learning"]);

  revalidatePath("/");
  revalidatePath("/learning");
  revalidatePath("/dashboard");
}

export async function updateItemStatus(itemId: number, status: LearningStatus) {
  await updateLearningItem(itemId, { status });
  revalidatePath("/learning");
}

export async function addLearningItem(data: {
  title: string;
  type: string;
  tier: number;
  skillArea: string;
  sourceUrl?: string;
  estimatedMinutes?: number;
}) {
  const item = await addItem(data);
  revalidatePath("/learning");
  return item;
}
