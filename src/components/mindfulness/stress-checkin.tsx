"use client";

import { useState } from "react";
import { Battery, Focus, MessageSquare } from "lucide-react";

interface StressCheckinProps {
  onComplete: () => void;
}

const ENERGY_LABELS = ["Drained", "Low", "Okay", "Good", "High"];
const FOCUS_LABELS = ["Scattered", "Foggy", "Moderate", "Sharp", "Locked In"];

export function StressCheckin({ onComplete }: StressCheckinProps) {
  const [energy, setEnergy] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (energy === null || focus === null) return;

    setSaving(true);
    try {
      // Save as a journal entry with type context
      const today = new Date().toISOString().split("T")[0];
      await fetch("/api/ai/reflection/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // We'll save this through the reflection API or just store locally
          type: "stress_checkin",
          date: today,
        }),
      }).catch(() => {
        // Silently fail — the check-in itself is the value
      });
    } catch {
      // Silently fail
    }

    // Save to localStorage for tracking
    const today = new Date().toISOString().split("T")[0];
    const history = JSON.parse(localStorage.getItem("mindfulness-checkins") || "[]");
    history.push({
      date: today,
      time: new Date().toISOString(),
      energy,
      focus,
      note: note.trim() || null,
    });
    // Keep last 90 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const filtered = history.filter((h: { date: string }) => new Date(h.date) >= cutoff);
    localStorage.setItem("mindfulness-checkins", JSON.stringify(filtered));

    setSaving(false);
    onComplete();
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold">Founder Check-In</h2>
        <p className="text-sm text-muted">
          How are you right now? Be honest — no one sees this but you.
        </p>
      </div>

      {/* Energy */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium">Energy Level</span>
          {energy !== null && (
            <span className="text-xs text-muted ml-auto">{ENERGY_LABELS[energy - 1]}</span>
          )}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setEnergy(level)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                energy === level
                  ? "bg-amber-500 text-white shadow-sm"
                  : energy !== null && level <= energy
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : "bg-surface border border-border hover:bg-surface-hover"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Focus */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Focus className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">Focus Level</span>
          {focus !== null && (
            <span className="text-xs text-muted ml-auto">{FOCUS_LABELS[focus - 1]}</span>
          )}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setFocus(level)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                focus === level
                  ? "bg-blue-500 text-white shadow-sm"
                  : focus !== null && level <= focus
                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  : "bg-surface border border-border hover:bg-surface-hover"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Optional note */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted" />
          <span className="text-sm font-medium">Quick Note</span>
          <span className="text-xs text-muted">(optional)</span>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind? Any blockers? Wins?"
          className="w-full p-3 rounded-lg border border-border bg-surface text-sm placeholder:text-muted/50 focus:outline-none focus:border-brand-500/50 resize-none"
          rows={3}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={energy === null || focus === null || saving}
        className="w-full py-3 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Log Check-In"}
      </button>
    </div>
  );
}
