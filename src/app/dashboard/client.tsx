"use client";

import {
  BarChart3,
  Flame,
  Trophy,
  BookOpen,
  Brain,
  Clock,
  TrendingUp,
} from "lucide-react";
import { HeatmapCalendar } from "@/components/streak/heatmap-calendar";
import { StreakCounter } from "@/components/streak/streak-counter";
import { ProgressOverview } from "@/components/learning/progress-overview";
import { CATEGORY_LABELS } from "@/types/warmup";
import type { StreakStats } from "@/types/streak";
import type { WarmupCategory } from "@/types/warmup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatMinutes } from "@/lib/utils";

interface HeatmapDay {
  date: string;
  blocksCompleted: string[] | null;
  isRestDay: boolean;
  isComplete: boolean;
}

interface WarmupTrendItem {
  date: string;
  score: number | null;
  category: string;
}

interface CategoryStat {
  category: string;
  accuracy: number;
  sessionsCount: number;
}

interface DashboardClientProps {
  stats: StreakStats;
  heatmapData: HeatmapDay[];
  warmupTrend: WarmupTrendItem[];
  categoryStats: CategoryStat[];
  tierProgress: Record<number, { total: number; completed: number }>;
  skillProgress: Record<string, { total: number; completed: number; inProgress: number }>;
  velocity: {
    weekItems: number;
    monthItems: number;
    weekMinutes: number;
    monthMinutes: number;
    totalItems: number;
    completedItems: number;
  };
}

export function DashboardClient({
  stats,
  heatmapData,
  warmupTrend,
  categoryStats,
  tierProgress,
  skillProgress,
  velocity,
}: DashboardClientProps) {
  // Format warmup trend for chart
  const chartData = warmupTrend
    .filter((w) => w.score !== null)
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: Math.round((w.score || 0) * 100),
      category: w.category,
    }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-600/10">
          <BarChart3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-muted">Your progress at a glance</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame className="w-4 h-4 text-orange-500" />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
        />
        <StatCard
          icon={<Trophy className="w-4 h-4 text-yellow-500" />}
          label="Longest Streak"
          value={`${stats.longestStreak} days`}
        />
        <StatCard
          icon={<BookOpen className="w-4 h-4 text-brand-500" />}
          label="Items Completed"
          value={`${velocity.completedItems}/${velocity.totalItems}`}
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-brand-500" />}
          label="This Week"
          value={formatMinutes(velocity.weekMinutes)}
        />
      </div>

      {/* Streak heatmap */}
      <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Streak History</h2>
          <StreakCounter stats={stats} />
        </div>
        <HeatmapCalendar data={heatmapData} months={12} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cognitive Fitness Trend */}
        <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-medium">Cognitive Fitness</h2>
          </div>

          {/* Category stats */}
          <div className="space-y-2">
            {categoryStats.map((cs) => (
              <div key={cs.category} className="flex items-center gap-3">
                <span className="text-xs text-muted w-28 truncate">
                  {CATEGORY_LABELS[cs.category as WarmupCategory] || cs.category}
                </span>
                <div className="flex-1 h-2 bg-border rounded-full">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${Math.round(cs.accuracy * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono w-10 text-right">
                  {Math.round(cs.accuracy * 100)}%
                </span>
              </div>
            ))}
          </div>

          {/* Trend chart */}
          {chartData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "var(--muted-color)" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "var(--muted-color)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-8">
              Complete warm-ups to see your trend
            </p>
          )}
        </div>

        {/* Learning Velocity */}
        <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-medium">Learning Velocity</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-surface-hover">
              <p className="text-xs text-muted">This Week</p>
              <p className="text-lg font-semibold">{velocity.weekItems} items</p>
              <p className="text-xs text-muted">{formatMinutes(velocity.weekMinutes)}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-hover">
              <p className="text-xs text-muted">This Month</p>
              <p className="text-lg font-semibold">{velocity.monthItems} items</p>
              <p className="text-xs text-muted">{formatMinutes(velocity.monthMinutes)}</p>
            </div>
          </div>

          <ProgressOverview
            tierProgress={tierProgress}
            skillProgress={skillProgress}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted">{label}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
