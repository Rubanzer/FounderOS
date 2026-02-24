"use server";

import { saveJournalEntry as saveEntry } from "@/db/queries/journal";
import { upsertStreakDay } from "@/db/queries/streaks";
import { revalidatePath } from "next/cache";

export async function saveJournalEntry(data: {
  prompt: string | null;
  response: string;
  type?: "daily_reflection" | "decision_log" | "weekly_reflection";
}) {
  const today = new Date().toISOString().split("T")[0];

  const entry = await saveEntry({
    date: today,
    type: data.type || "daily_reflection",
    prompt: data.prompt,
    response: data.response,
  });

  // Mark reflection block complete
  await upsertStreakDay(today, ["reflection"]);

  revalidatePath("/");
  revalidatePath("/reflection");
  revalidatePath("/dashboard");

  return entry;
}
