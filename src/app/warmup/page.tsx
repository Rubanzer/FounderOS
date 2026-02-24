"use client";

import { useWarmupStore } from "@/stores/warmup-store";
import { CategoryPicker } from "@/components/warmup/category-picker";
import { ChallengeDisplay } from "@/components/warmup/challenge-display";
import { ResponseInput } from "@/components/warmup/response-input";
import { TimerDisplay } from "@/components/warmup/timer-display";
import { FeedbackDisplay } from "@/components/warmup/feedback-display";
import { Brain, Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import type { WarmupCategory } from "@/types/warmup";
import Link from "next/link";

export default function WarmupPage() {
  const store = useWarmupStore();

  const handleCategorySelect = async (category: WarmupCategory) => {
    store.selectCategory(category);
    store.setGenerating();

    try {
      const res = await fetch("/api/ai/warmup/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, difficulty: 1 }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      const data = await res.json();

      store.setChallengeActive({
        id: data.id,
        challengeText: data.challengeText,
        timeLimitSeconds: data.timeLimitSeconds,
        category: data.category,
        difficultyLevel: data.difficultyLevel,
      });
      store.startTimer();
    } catch (error) {
      console.error("Failed to generate challenge:", error);
      store.setError(
        error instanceof Error
          ? error.message
          : "Failed to generate challenge. Check your connection and try again."
      );
    }
  };

  const handleSubmit = async (response: string) => {
    if (!store.challenge) return;

    store.setEvaluating();

    try {
      const res = await fetch("/api/ai/warmup/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warmupId: store.challenge.id,
          userResponse: response,
          timeTakenSeconds: store.timeElapsed,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      const data = await res.json();

      store.setFeedback({
        score: data.score,
        isCorrect: data.isCorrect,
        feedback: data.feedback,
        explanation: data.explanation,
        expectedAnswer: data.expectedAnswer,
      });
    } catch (error) {
      console.error("Failed to evaluate:", error);
      // Go back to challenge_active so user can retry without losing their response
      store.backToChallengeActive();
      store.setError(
        error instanceof Error
          ? error.message
          : "Failed to evaluate your response. Try submitting again."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-600/10">
            <Brain className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Cognitive Warm-Up</h1>
            <p className="text-sm text-muted">Exercise your thinking muscles</p>
          </div>
        </div>

        {store.state !== "selecting_category" && (
          <button
            onClick={store.reset}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
        )}
      </div>

      {/* Error banner (shown alongside challenge_active for eval errors) */}
      {store.error && store.state === "challenge_active" && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Something went wrong</p>
            <p className="text-sm text-muted mt-1">{store.error}</p>
          </div>
        </div>
      )}

      {/* State machine rendering */}
      {store.state === "selecting_category" && (
        <CategoryPicker onSelect={handleCategorySelect} />
      )}

      {store.state === "generating" && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-muted text-sm">Crafting your challenge...</p>
        </div>
      )}

      {store.state === "challenge_active" && store.challenge && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <TimerDisplay
              elapsed={store.timeElapsed}
              limit={store.challenge.timeLimitSeconds}
            />
          </div>
          <ChallengeDisplay challenge={store.challenge} />
          <ResponseInput onSubmit={handleSubmit} />
        </div>
      )}

      {store.state === "evaluating" && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-muted text-sm">Evaluating your response...</p>
        </div>
      )}

      {store.state === "showing_feedback" && store.feedback && (
        <FeedbackDisplay
          feedback={store.feedback}
          timeTaken={store.timeElapsed}
          onDone={() => store.reset()}
        />
      )}

      {store.state === "error" && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="p-3 rounded-full bg-danger/10">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Something went wrong</p>
            <p className="text-sm text-muted max-w-md">{store.error}</p>
          </div>
          <button
            onClick={store.reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {store.state === "complete" && (
        <div className="text-center py-16 space-y-4">
          <p className="text-lg font-medium">Warm-up complete!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
          >
            Back to Today
          </Link>
        </div>
      )}
    </div>
  );
}
