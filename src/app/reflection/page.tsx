import { getJournalEntries, getTodayReflection } from "@/db/queries/journal";
import { ReflectionPageClient } from "./client";

export default async function ReflectionPage() {
  let entries: Awaited<ReturnType<typeof getJournalEntries>> = [];
  let todayReflection: Awaited<ReturnType<typeof getTodayReflection>> | null = null;

  try {
    [entries, todayReflection] = await Promise.all([
      getJournalEntries(),
      getTodayReflection(),
    ]);
  } catch {
    // DB not connected yet
  }

  return (
    <ReflectionPageClient
      entries={entries}
      todayReflection={todayReflection}
    />
  );
}
