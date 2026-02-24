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

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export function TodaysFocus({ item, onStart, onSkip }: TodaysFocusProps) {
  const TypeIcon = TYPE_ICONS[item.type] || FileText;
  const isVideo = item.type === "video";
  const youtubeId = item.sourceUrl ? getYouTubeId(item.sourceUrl) : null;

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

      {/* YouTube thumbnail for video items */}
      {isVideo && youtubeId && (
        <a
          href={item.sourceUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative mb-4 rounded-lg overflow-hidden group"
        >
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
            alt={item.title}
            className="w-full h-auto rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="bg-red-600 rounded-full p-3">
              <PlayCircle className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </a>
      )}

      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg shrink-0 ${isVideo ? "bg-red-600/10" : "bg-brand-600/10"}`}>
          <TypeIcon className={`w-6 h-6 ${isVideo ? "text-red-600 dark:text-red-400" : "text-brand-600 dark:text-brand-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold leading-snug">{item.title}</h2>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted">
              {SKILL_AREA_LABELS[item.skillArea as SkillArea] || item.skillArea}
            </span>
            {isVideo ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 font-medium">
                VIDEO
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted">
                {TYPE_LABELS[item.type] || item.type}
              </span>
            )}
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
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isVideo
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-border hover:bg-surface-hover"
                }`}
              >
                {isVideo ? (
                  <>
                    <PlayCircle className="w-3.5 h-3.5" />
                    Watch Video
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Resource
                  </>
                )}
              </a>
            )}
            <button
              onClick={() => onStart(item.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isVideo
                  ? "border border-border hover:bg-surface-hover"
                  : "bg-brand-600 text-white hover:bg-brand-700"
              }`}
            >
              {isVideo ? "Log as Watched" : "Start Session"}
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
