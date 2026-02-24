"use client";

import { Clock } from "lucide-react";
import { formatSeconds } from "@/lib/utils";

interface TimerDisplayProps {
  elapsed: number;
  limit?: number;
}

export function TimerDisplay({ elapsed, limit }: TimerDisplayProps) {
  const isOverTime = limit ? elapsed > limit : false;
  const percentage = limit ? Math.min((elapsed / limit) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <Clock className={`w-4 h-4 ${isOverTime ? "text-danger" : "text-muted"}`} />
      <span
        className={`text-sm font-mono ${
          isOverTime ? "text-danger" : "text-foreground"
        }`}
      >
        {formatSeconds(elapsed)}
      </span>
      {limit && (
        <>
          <span className="text-xs text-muted">/ {formatSeconds(limit)}</span>
          <div className="flex-1 h-1.5 bg-border rounded-full max-w-[120px]">
            <div
              className={`h-full rounded-full transition-all ${
                isOverTime ? "bg-danger" : percentage > 75 ? "bg-warning" : "bg-brand-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
