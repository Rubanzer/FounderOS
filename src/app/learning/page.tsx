import { getLearningItems, getProgressByTier, getProgressBySkillArea, getUpNextItem } from "@/db/queries/learning";
import { LearningPageClient } from "./client";

export default async function LearningPage() {
  let items: Awaited<ReturnType<typeof getLearningItems>> = [];
  let tierProgress: Awaited<ReturnType<typeof getProgressByTier>> = {};
  let skillProgress: Awaited<ReturnType<typeof getProgressBySkillArea>> = {};
  let upNext: Awaited<ReturnType<typeof getUpNextItem>> | null = null;

  try {
    [items, tierProgress, skillProgress, upNext] = await Promise.all([
      getLearningItems(),
      getProgressByTier(),
      getProgressBySkillArea(),
      getUpNextItem(),
    ]);
  } catch {
    // DB not connected yet
  }

  return (
    <LearningPageClient
      items={items}
      tierProgress={tierProgress}
      skillProgress={skillProgress}
      upNext={upNext}
    />
  );
}
