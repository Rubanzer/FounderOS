import { getStreakStats, getStreakHeatmapData } from "@/db/queries/streaks";
import { getWarmupTrend, getCategoryStats } from "@/db/queries/warmups";
import { getProgressByTier, getProgressBySkillArea, getLearningVelocity } from "@/db/queries/learning";
import { DashboardClient } from "./client";
import { MILESTONES } from "@/types/streak";

export default async function DashboardPage() {
  let stats = {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysCompleted: 0,
    nextMilestone: MILESTONES[0] as typeof MILESTONES[0] | null,
  };
  let heatmapData: Awaited<ReturnType<typeof getStreakHeatmapData>> = [];
  let warmupTrend: Awaited<ReturnType<typeof getWarmupTrend>> = [];
  let categoryStats: Awaited<ReturnType<typeof getCategoryStats>> = [];
  let tierProgress: Awaited<ReturnType<typeof getProgressByTier>> = {};
  let skillProgress: Awaited<ReturnType<typeof getProgressBySkillArea>> = {};
  let velocity: Awaited<ReturnType<typeof getLearningVelocity>> = {
    weekItems: 0,
    monthItems: 0,
    weekMinutes: 0,
    monthMinutes: 0,
    totalItems: 0,
    completedItems: 0,
  };

  try {
    [stats, heatmapData, warmupTrend, categoryStats, tierProgress, skillProgress, velocity] =
      await Promise.all([
        getStreakStats(),
        getStreakHeatmapData(365),
        getWarmupTrend(30),
        getCategoryStats(),
        getProgressByTier(),
        getProgressBySkillArea(),
        getLearningVelocity(),
      ]);
  } catch {
    // DB not connected yet
  }

  return (
    <DashboardClient
      stats={stats}
      heatmapData={heatmapData}
      warmupTrend={warmupTrend}
      categoryStats={categoryStats}
      tierProgress={tierProgress}
      skillProgress={skillProgress}
      velocity={velocity}
    />
  );
}
