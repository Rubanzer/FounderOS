import { db } from "@/db";
import { journalEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getTodayString } from "@/lib/utils";

export async function getTodayReflection() {
  const today = getTodayString();
  const rows = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.date, today))
    .orderBy(desc(journalEntries.createdAt))
    .limit(1);
  return rows[0] || null;
}

export async function getJournalEntries(limit: number = 30) {
  return db
    .select()
    .from(journalEntries)
    .orderBy(desc(journalEntries.date), desc(journalEntries.createdAt))
    .limit(limit);
}

export async function getJournalEntry(id: number) {
  const rows = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.id, id))
    .limit(1);
  return rows[0] || null;
}

export async function saveJournalEntry(data: {
  date: string;
  type: "daily_reflection" | "decision_log" | "weekly_reflection";
  prompt: string | null;
  response: string;
}) {
  const result = await db
    .insert(journalEntries)
    .values({
      date: data.date,
      type: data.type,
      prompt: data.prompt,
      response: data.response,
    })
    .returning();
  return result[0];
}
