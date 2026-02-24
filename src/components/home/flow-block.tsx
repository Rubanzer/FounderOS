import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Brain, BookOpen, PenLine, Wind } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  "book-open": BookOpen,
  "pen-line": PenLine,
  wind: Wind,
};

interface FlowBlockProps {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  icon: string;
  href: string;
  isComplete: boolean;
  mandatory?: boolean;
}

export function FlowBlock({
  id,
  title,
  description,
  estimatedMinutes,
  icon,
  href,
  isComplete,
  mandatory,
}: FlowBlockProps) {
  const Icon = ICON_MAP[icon] || Circle;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-5 rounded-xl border transition-all group ${
        isComplete
          ? "border-success/30 bg-success/5"
          : "border-border bg-surface hover:bg-surface-hover hover:border-brand-500/30"
      }`}
    >
      <div
        className={`p-3 rounded-xl ${
          isComplete
            ? "bg-success/10"
            : "bg-brand-600/10 group-hover:bg-brand-600/20"
        } transition-colors`}
      >
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : (
          <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium text-sm ${isComplete ? "text-muted line-through" : ""}`}>
            {title}
          </h3>
          {mandatory && !isComplete && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium">
              Required
            </span>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-muted">{estimatedMinutes}m</span>
        {!isComplete && (
          <ArrowRight className="w-4 h-4 text-muted group-hover:text-brand-500 transition-colors" />
        )}
      </div>
    </Link>
  );
}
