import { TIER_LABELS, SKILL_AREA_LABELS, type SkillArea } from "@/types/learning";

interface ProgressOverviewProps {
  tierProgress: Record<number, { total: number; completed: number }>;
  skillProgress: Record<string, { total: number; completed: number; inProgress: number }>;
}

export function ProgressOverview({ tierProgress, skillProgress }: ProgressOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Tier progress */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Tier Progress</h3>
        {[1, 2, 3].map((tier) => {
          const progress = tierProgress[tier];
          if (!progress) return null;
          const pct = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

          return (
            <div key={tier} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted">Tier {tier}</span>
                <span className="text-muted">{Math.round(pct)}%</span>
              </div>
              <div className="h-2 bg-border rounded-full">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill area progress */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">By Skill Area</h3>
        {Object.entries(skillProgress)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([skill, progress]) => {
            const pct = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
            return (
              <div key={skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted truncate">
                    {SKILL_AREA_LABELS[skill as SkillArea] || skill}
                  </span>
                  <span className="text-muted shrink-0">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <div className="h-1.5 bg-border rounded-full">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
