"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CurriculumList } from "@/components/learning/curriculum-list";
import { ProgressOverview } from "@/components/learning/progress-overview";
import { TodaysFocus } from "@/components/learning/todays-focus";
import { ComingUp } from "@/components/learning/coming-up";
import { SessionLogger } from "@/components/learning/session-logger";
import { logLearningSession, updateItemStatus } from "@/actions/learning-actions";
import { useRouter } from "next/navigation";

interface LearningItem {
  id: number;
  title: string;
  description: string | null;
  type: string;
  tier: number;
  skillArea: string;
  sourceUrl: string | null;
  status: string;
  timeSpentMinutes: number | null;
  estimatedMinutes: number | null;
}

interface LearningPageClientProps {
  items: LearningItem[];
  tierProgress: Record<number, { total: number; completed: number }>;
  skillProgress: Record<string, { total: number; completed: number; inProgress: number }>;
  upNext: LearningItem | null;
  comingUp: LearningItem[];
}

export function LearningPageClient({
  items,
  tierProgress,
  skillProgress,
  upNext,
  comingUp,
}: LearningPageClientProps) {
  const [loggingItemId, setLoggingItemId] = useState<number | null>(null);
  const router = useRouter();

  const loggingItem = items.find((i) => i.id === loggingItemId);

  const handleLogSave = async (data: {
    timeSpentMinutes: number;
    notes: string;
    status: string;
    rating?: number;
  }) => {
    if (!loggingItemId) return;

    await logLearningSession(loggingItemId, {
      timeSpentMinutes: data.timeSpentMinutes,
      notes: data.notes,
      status: data.status as "not_started" | "in_progress" | "completed",
      rating: data.rating,
    });

    setLoggingItemId(null);
    router.refresh();
  };

  const handleUpdateStatus = async (itemId: number, status: string) => {
    await updateItemStatus(itemId, status as "not_started" | "in_progress" | "completed");
    router.refresh();
  };

  const handleSkip = async (itemId: number) => {
    // Mark as in_progress to skip past it and get a new "up next"
    await updateItemStatus(itemId, "in_progress");
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-600/10">
          <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Learning</h1>
          <p className="text-sm text-muted">Your Founder Playbook journey</p>
        </div>
      </div>

      {/* Today's Focus — hero card */}
      {upNext && (
        <TodaysFocus
          item={upNext}
          onStart={(id) => setLoggingItemId(id)}
          onSkip={handleSkip}
        />
      )}

      {/* Coming Up */}
      <ComingUp items={comingUp} />

      {/* Progress Overview */}
      <div className="p-5 rounded-xl border border-border bg-surface">
        <ProgressOverview
          tierProgress={tierProgress}
          skillProgress={skillProgress}
        />
      </div>

      {/* Full Curriculum */}
      {items.length === 0 ? (
        <div className="p-8 text-center border border-border rounded-xl bg-surface">
          <p className="text-muted text-sm">
            No curriculum items yet. Run the seed script to load the Founder Playbook.
          </p>
          <code className="text-xs text-muted mt-2 block">npm run db:seed</code>
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Full Curriculum</h3>
          <CurriculumList
            items={items}
            onLogSession={setLoggingItemId}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}

      {/* Session Logger Modal */}
      {loggingItemId && loggingItem && (
        <SessionLogger
          itemTitle={loggingItem.title}
          onSave={handleLogSave}
          onClose={() => setLoggingItemId(null)}
        />
      )}
    </div>
  );
}
