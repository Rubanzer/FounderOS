import { Flame, Trophy } from "lucide-react";
import type { StreakStats } from "@/types/streak";

interface StreakCounterProps {
  stats: StreakStats;
}

export function StreakCounter({ stats }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-6">
      {/* Current streak */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-orange-500/10">
          <Flame className="w-7 h-7 text-orange-500" />
        </div>
        <div>
          <p className="text-3xl font-bold">{stats.currentStreak}</p>
          <p className="text-xs text-muted">day streak</p>
        </div>
      </div>

      {/* Longest streak */}
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-muted" />
        <div>
          <p className="text-sm font-medium">{stats.longestStreak}</p>
          <p className="text-xs text-muted">longest</p>
        </div>
      </div>

      {/* Next milestone */}
      {stats.nextMilestone && (
        <div className="text-xs text-muted">
          <p>
            {stats.nextMilestone.days - stats.currentStreak} days to{" "}
            <span className="font-medium text-foreground">
              {stats.nextMilestone.label}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
