"use client";

import {
  PlayCircle,
  BookOpen,
  Headphones,
  FileText,
  GraduationCap,
  Dumbbell,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { SKILL_AREA_LABELS, type SkillArea } from "@/types/learning";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  video: PlayCircle,
  book_chapter: BookOpen,
  podcast: Headphones,
  article: FileText,
  course: GraduationCap,
  exercise: Dumbbell,
};

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  not_started: { icon: Circle, color: "text-muted", label: "Not Started" },
  in_progress: { icon: Loader2, color: "text-brand-500", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-success", label: "Completed" },
};

interface LearningItemCardProps {
  item: {
    id: number;
    title: string;
    description: string | null;
    type: string;
    skillArea: string;
    sourceUrl: string | null;
    status: string;
    timeSpentMinutes: number | null;
    estimatedMinutes: number | null;
  };
  onLogSession: () => void;
  onUpdateStatus: (status: string) => void;
}

export function LearningItemCard({ item, onLogSession, onUpdateStatus }: LearningItemCardProps) {
  const TypeIcon = TYPE_ICONS[item.type] || FileText;
  const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.not_started;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="px-5 py-3 hover:bg-surface-hover/50 transition-colors">
      <div className="flex items-start gap-4">
        <TypeIcon className="w-4 h-4 text-muted shrink-0 mt-1" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted mt-0.5">
                {SKILL_AREA_LABELS[item.skillArea as SkillArea] || item.skillArea}
                {item.estimatedMinutes && ` · ${item.estimatedMinutes}m`}
                {item.timeSpentMinutes ? ` · ${item.timeSpentMinutes}m logged` : ""}
              </p>
              {item.description && (
                <p className="text-xs text-muted mt-1 line-clamp-1">{item.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                  title="Open resource"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {item.status !== "completed" && (
                <button
                  onClick={onLogSession}
                  className="text-xs px-3 py-1 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                >
                  Log
                </button>
              )}

              <button
                onClick={() => {
                  const next = item.status === "not_started"
                    ? "in_progress"
                    : item.status === "in_progress"
                    ? "completed"
                    : "not_started";
                  onUpdateStatus(next);
                }}
                className={`flex items-center gap-1 text-xs ${statusConfig.color}`}
                title={statusConfig.label}
              >
                <StatusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
