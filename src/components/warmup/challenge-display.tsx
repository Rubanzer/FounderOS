"use client";

import { CATEGORY_LABELS } from "@/types/warmup";
import type { WarmupChallenge } from "@/types/warmup";

interface ChallengeDisplayProps {
  challenge: WarmupChallenge;
}

export function ChallengeDisplay({ challenge }: ChallengeDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        <span>{CATEGORY_LABELS[challenge.category]}</span>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-1.5 h-1.5 rounded-full ${
                level <= challenge.difficultyLevel ? "bg-brand-500" : "bg-border"
              }`}
            />
          ))}
          <span className="ml-1">Level {challenge.difficultyLevel}</span>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border bg-surface">
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {challenge.challengeText}
        </p>
      </div>
    </div>
  );
}
