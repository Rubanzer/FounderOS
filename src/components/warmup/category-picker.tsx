"use client";

import { Brain, Calculator, Target } from "lucide-react";
import type { WarmupCategory } from "@/types/warmup";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/types/warmup";

const CATEGORY_ICON_MAP: Record<WarmupCategory, React.ComponentType<{ className?: string }>> = {
  logical_reasoning: Brain,
  mental_math: Calculator,
  estimation_fermi: Target,
};

interface CategoryPickerProps {
  onSelect: (category: WarmupCategory) => void;
  difficulties?: Record<WarmupCategory, number>;
}

export function CategoryPicker({ onSelect, difficulties }: CategoryPickerProps) {
  const categories: WarmupCategory[] = ["logical_reasoning", "mental_math", "estimation_fermi"];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Choose Your Warm-Up</h2>
        <p className="text-muted text-sm">Pick a category to exercise your thinking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICON_MAP[cat];
          const difficulty = difficulties?.[cat] || 1;

          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="text-left p-5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-brand-500/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand-600/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600/20 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{CATEGORY_LABELS[cat]}</h3>
                  <p className="text-xs text-muted mt-1">{CATEGORY_DESCRIPTIONS[cat]}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= difficulty
                            ? "bg-brand-500"
                            : "bg-border"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted ml-1">Level {difficulty}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
