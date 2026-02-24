import { Flame, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { StreakStats } from "@/types/streak";

interface StreakBannerProps {
  stats: StreakStats;
}

const MOTIVATIONAL_MESSAGES = [
  "You're building something that lasts.",
  "Consistency compounds. Keep going.",
  "Every day you show up, you win.",
  "The best founders never stop learning.",
  "You're in the top 1% of consistency.",
  "Discipline is freedom.",
  "Small daily improvements lead to extraordinary results.",
];

export function StreakBanner({ stats }: StreakBannerProps) {
  const message = MOTIVATIONAL_MESSAGES[stats.currentStreak % MOTIVATIONAL_MESSAGES.length];

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {stats.currentStreak > 0 ? (
            <>
              <Flame className="w-6 h-6 text-orange-500" />
              Day {stats.currentStreak}
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 text-brand-500" />
              Start Your Streak
            </>
          )}
        </h1>
        <p className="text-sm text-muted mt-1">{message}</p>
      </div>
      <p className="text-sm text-muted">{formatDate(new Date())}</p>
    </div>
  );
}
