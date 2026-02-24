"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CurriculumList } from "@/components/learning/curriculum-list";
import { ProgressOverview } from "@/components/learning/progress-overview";
import { UpNext } from "@/components/learning/up-next";
import { SessionLogger } from "@/components/learning/session-logger";
import { logLearningSession, updateItemStatus } from "@/actions/learning-actions";
import { useRouter } from "next/navigation";

interface LearningItem {
  id: number;
  title: string;
  type: string;
  tier: number;
  skillArea: string;
  status: string;
  timeSpentMinutes: number | null;
  estimatedMinutes: number | null;
}

interface LearningPageClientProps {
  items: LearningItem[];
  tierProgress: Record<number, { total: number; completed: number }>;
  skillProgress: Record<string, { total: number; completed: number; inProgress: number }>;
  upNext: LearningItem | null;
}

export function LearningPageClient({
  items,
  tierProgress,
  skillProgress,
  upNext,
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-600/10">
          <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Learning Tracker</h1>
          <p className="text-sm text-muted">Progress through the Founder Playbook</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content */}
        <div className="lg:col-span-8">
          {items.length === 0 ? (
            <div className="p-8 text-center border border-border rounded-xl bg-surface">
              <p className="text-muted text-sm">
                No curriculum items yet. Run the seed script to load the Founder Playbook.
              </p>
              <code className="text-xs text-muted mt-2 block">npm run db:seed</code>
            </div>
          ) : (
            <CurriculumList
              items={items}
              onLogSession={setLoggingItemId}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <UpNext
            item={upNext}
            onStart={(id) => setLoggingItemId(id)}
          />
          <div className="p-5 rounded-xl border border-border bg-surface">
            <ProgressOverview
              tierProgress={tierProgress}
              skillProgress={skillProgress}
            />
          </div>
        </div>
      </div>

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
