"use client";

import { useState } from "react";
import { X, Clock, StickyNote, Star } from "lucide-react";

interface SessionLoggerProps {
  itemTitle: string;
  onSave: (data: {
    timeSpentMinutes: number;
    notes: string;
    status: string;
    rating?: number;
  }) => void;
  onClose: () => void;
}

export function SessionLogger({ itemTitle, onSave, onClose }: SessionLoggerProps) {
  const [minutes, setMinutes] = useState(30);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [rating, setRating] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-medium">Log Session</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted">{itemTitle}</p>

          {/* Time spent */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="w-3.5 h-3.5" />
              Time Spent (minutes)
            </label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              min={1}
              max={480}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium">
              <StickyNote className="w-3.5 h-3.5" />
              Key Takeaways
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What did you learn? Key insights?"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm placeholder:text-muted resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <div className="flex gap-2">
              {["in_progress", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    status === s
                      ? "border-brand-500 bg-brand-600/10 text-brand-600 dark:text-brand-400"
                      : "border-border hover:bg-surface-hover"
                  }`}
                >
                  {s === "in_progress" ? "In Progress" : "Completed"}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          {status === "completed" && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium">
                <Star className="w-3.5 h-3.5" />
                How useful was this?
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`p-1 ${r <= rating ? "text-warning" : "text-border"}`}
                  >
                    <Star className="w-5 h-5" fill={r <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                timeSpentMinutes: minutes,
                notes,
                status,
                rating: rating || undefined,
              })
            }
            className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            Save Session
          </button>
        </div>
      </div>
    </div>
  );
}
