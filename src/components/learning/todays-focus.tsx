"use client";

import {
  PlayCircle,
  BookOpen,
  Headphones,
  FileText,
  GraduationCap,
  Dumbbell,
  Clock,
  ExternalLink,
  ArrowRight,
  SkipForward,
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

const TYPE_LABELS: Record<string, string> = {
  video: "Video",
  book_chapter: "Book",
  podcast: "Podcast",
  article: "Article",
  course: "Course",
  exercise: "Exercise",
};

interface TodaysFocusProps {
  item: {
    id: number;
    title: string;
    description: string | null;
    type: string;
    tier: number;
    skillArea: string;
    sourceUrl: string | null;
    estimatedMinutes: number | null;
  };
  onStart: (id: number) => void;
  onSkip: (id: number) => void;
}

export function TodaysFocus({ item, onStart, onSkip }: TodaysFocusProps) {
  const TypeIcon = TYPE_ICONS[item.type] || FileText;

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="p-6 rounded-xl border border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-transparent">
      <p className="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-4">
        Today&apos;s Focus
      </p>

      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-brand-600/10 shrink-0">
          <TypeIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold leading-snug">{item.title}</h2>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted">
              {SKILL_AREA_LABELS[item.skillArea as SkillArea] || item.skillArea}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted">
              {TYPE_LABELS[item.type] || item.type}
            </span>
            {item.estimatedMinutes && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3 h-3" />
                {formatTime(item.estimatedMinutes)}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-sm text-muted mt-3 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Resource
              </a>
            )}
            <button
              onClick={() => onStart(item.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Start Session
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSkip(item.id)}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
