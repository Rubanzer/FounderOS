import { getStreakStats, getTodayStreak, getStreakHeatmapData } from "@/db/queries/streaks";
import { StreakBanner } from "@/components/home/streak-banner";
import { FlowBlock } from "@/components/home/flow-block";
import { HeatmapCalendar } from "@/components/streak/heatmap-calendar";
import { DAILY_BLOCKS } from "@/lib/constants";
import { MILESTONES } from "@/types/streak";

export default async function HomePage() {
  let stats = {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysCompleted: 0,
    nextMilestone: MILESTONES[0] as typeof MILESTONES[0] | null,
  };
  let todayBlocks: string[] = [];
  let heatmapData: Awaited<ReturnType<typeof getStreakHeatmapData>> = [];

  try {
    [stats, heatmapData] = await Promise.all([
      getStreakStats(),
      getStreakHeatmapData(180),
    ]);
    const today = await getTodayStreak();
    todayBlocks = (today?.blocksCompleted as string[]) || [];
  } catch {
    // DB not connected yet — show empty state
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <StreakBanner stats={stats} />

      {/* Today's flow */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Today&apos;s Session</h2>
        {DAILY_BLOCKS.map((block) => (
          <FlowBlock
            key={block.id}
            id={block.id}
            title={block.title}
            description={block.description}
            estimatedMinutes={block.estimatedMinutes}
            icon={block.icon}
            href={block.href}
            isComplete={todayBlocks.includes(block.id)}
            mandatory={block.mandatory}
          />
        ))}

        {/* Total time */}
        <div className="text-center text-xs text-muted pt-2">
          Total: ~{DAILY_BLOCKS.reduce((sum, b) => sum + b.estimatedMinutes, 0)} minutes
        </div>
      </div>

      {/* Streak heatmap */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Streak History</h2>
        <div className="p-5 rounded-xl border border-border bg-surface overflow-x-auto">
          <HeatmapCalendar data={heatmapData} months={6} />
        </div>
      </div>
    </div>
  );
}
