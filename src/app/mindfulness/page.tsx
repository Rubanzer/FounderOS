"use client";

import { useState } from "react";
import { Wind, Brain, ArrowLeft, CheckCircle2 } from "lucide-react";
import { BreathingExercise } from "@/components/mindfulness/breathing-exercise";
import { StressCheckin } from "@/components/mindfulness/stress-checkin";
import Link from "next/link";

type MindfulnessMode = "menu" | "breathing" | "checkin" | "complete";

export default function MindfulnessPage() {
  const [mode, setMode] = useState<MindfulnessMode>("menu");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-600/10">
            <Wind className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Mindfulness</h1>
            <p className="text-sm text-muted">Reset, breathe, check in with yourself</p>
          </div>
        </div>
        {mode !== "menu" && (
          <button
            onClick={() => setMode("menu")}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      {/* Menu */}
      {mode === "menu" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode("breathing")}
            className="text-left p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-emerald-500/30 transition-all group"
          >
            <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 w-fit group-hover:bg-emerald-600/20 transition-colors mb-4">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm">Breathing Exercise</h3>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Box breathing — used by Navy SEALs to regulate stress. 4 rounds, ~3 minutes.
            </p>
          </button>

          <button
            onClick={() => setMode("checkin")}
            className="text-left p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-brand-500/30 transition-all group"
          >
            <div className="p-3 rounded-lg bg-brand-600/10 text-brand-600 dark:text-brand-400 w-fit group-hover:bg-brand-600/20 transition-colors mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm">Founder Check-In</h3>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Quick energy & focus assessment. Track your cognitive state over time.
            </p>
          </button>
        </div>
      )}

      {/* Breathing */}
      {mode === "breathing" && (
        <BreathingExercise onComplete={() => setMode("complete")} />
      )}

      {/* Check-in */}
      {mode === "checkin" && (
        <StressCheckin onComplete={() => setMode("complete")} />
      )}

      {/* Complete */}
      {mode === "complete" && (
        <div className="text-center py-12 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-emerald-600/10">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold">Nice work</h2>
          <p className="text-muted text-sm">You took a moment for yourself. That compounds.</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setMode("menu")}
              className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
            >
              Do Another
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
            >
              Back to Today
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
