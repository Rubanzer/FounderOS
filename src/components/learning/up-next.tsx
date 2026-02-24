import { ArrowRight, BookOpen } from "lucide-react";
import { SKILL_AREA_LABELS, type SkillArea } from "@/types/learning";

interface UpNextProps {
  item: {
    id: number;
    title: string;
    type: string;
    tier: number;
    skillArea: string;
    estimatedMinutes: number | null;
  } | null;
  onStart: (itemId: number) => void;
}

export function UpNext({ item, onStart }: UpNextProps) {
  if (!item) {
    return (
      <div className="p-5 rounded-xl border border-border bg-surface text-center">
        <p className="text-sm text-muted">All caught up! No items to suggest.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-brand-500/20 bg-brand-500/5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-brand-600/10">
          <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted mb-1">Up Next</p>
          <p className="text-sm font-medium">{item.title}</p>
          <p className="text-xs text-muted mt-1">
            {SKILL_AREA_LABELS[item.skillArea as SkillArea] || item.skillArea}
            {item.estimatedMinutes && ` · ~${item.estimatedMinutes}m`}
          </p>
        </div>
      </div>
      <button
        onClick={() => onStart(item.id)}
        className="flex items-center gap-1.5 mt-3 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
      >
        Start Learning
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
