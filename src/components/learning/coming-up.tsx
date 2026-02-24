"use client";

import {
  PlayCircle,
  BookOpen,
  Headphones,
  FileText,
  GraduationCap,
  Dumbbell,
  Clock,
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

interface ComingUpItem {
  id: number;
  title: string;
  type: string;
  skillArea: string;
  estimatedMinutes: number | null;
}

interface ComingUpProps {
  items: ComingUpItem[];
}

export function ComingUp({ items }: ComingUpProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted">Coming Up</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item) => {
          const TypeIcon = TYPE_ICONS[item.type] || FileText;
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <TypeIcon className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted">
                  {SKILL_AREA_LABELS[item.skillArea as SkillArea] || item.skillArea}
                </span>
              </div>
              <p className="text-sm font-medium line-clamp-2 leading-snug">
                {item.title}
              </p>
              {item.estimatedMinutes && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted">
                  <Clock className="w-3 h-3" />
                  {item.estimatedMinutes >= 60
                    ? `${Math.floor(item.estimatedMinutes / 60)}h ${item.estimatedMinutes % 60 > 0 ? `${item.estimatedMinutes % 60}m` : ""}`
                    : `${item.estimatedMinutes}m`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
