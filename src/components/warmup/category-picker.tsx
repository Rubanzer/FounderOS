"use client";

import { Brain, Calculator, Target, Server, Crown, Lightbulb, Loader2, Check } from "lucide-react";
import type { WarmupCategory } from "@/types/warmup";
import { ALL_CATEGORIES, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/types/warmup";

const CATEGORY_ICON_MAP: Record<WarmupCategory, React.ComponentType<{ className?: string }>> = {
  logical_reasoning: Brain,
  mental_math: Calculator,
  estimation_fermi: Target,
  systems_design: Server,
  strategic_thinking: Crown,
  product_sense: Lightbulb,
};

interface CategoryPickerProps {
  onSelect: (category: WarmupCategory) => void;
  difficulties?: Record<WarmupCategory, number>;
  readyCounts?: Record<WarmupCategory, number>;
  prefetchLoading?: Record<WarmupCategory, boolean>;
}

export function CategoryPicker({ onSelect, difficulties, readyCounts, prefetchLoading }: CategoryPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Choose Your Warm-Up</h2>
        <p className="text-muted text-sm">Pick a category to exercise your thinking.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICON_MAP[cat];
          const difficulty = difficulties?.[cat] || 1;
          const readyCount = readyCounts?.[cat] || 0;
          const isLoading = prefetchLoading?.[cat] || false;

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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-sm">{CATEGORY_LABELS[cat]}</h3>
                    {readyCount > 0 ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded-full shrink-0">
                        <Check className="w-3 h-3" />
                        {readyCount} ready
                      </span>
                    ) : isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 text-muted animate-spin shrink-0" />
                    ) : null}
                  </div>
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
