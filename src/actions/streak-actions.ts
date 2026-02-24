"use server";

import { upsertStreakDay, scheduleRestDay as scheduleRest, getStreakStats } from "@/db/queries/streaks";
import { revalidatePath } from "next/cache";

export async function markBlockComplete(block: string) {
  const today = new Date().toISOString().split("T")[0];
  const result = await upsertStreakDay(today, [block]);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}

export async function scheduleRestDay(date: string) {
  try {
    const result = await scheduleRest(date);
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function fetchStreakStats() {
  return getStreakStats();
}
