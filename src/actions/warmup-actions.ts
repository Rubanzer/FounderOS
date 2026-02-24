"use server";

import { saveWarmupResult } from "@/db/queries/warmups";
import { upsertStreakDay } from "@/db/queries/streaks";
import { revalidatePath } from "next/cache";

export async function submitWarmupResponse(
  warmupId: number,
  data: {
    userResponse: string;
    score: number;
    isCorrect: boolean;
    aiFeedback: string;
    timeTakenSeconds: number;
  }
) {
  await saveWarmupResult(warmupId, data);

  // Mark warmup block complete for today
  const today = new Date().toISOString().split("T")[0];
  await upsertStreakDay(today, ["warmup"]);

  revalidatePath("/");
  revalidatePath("/warmup");
  revalidatePath("/dashboard");
}
