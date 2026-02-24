"use client";

import { useWarmupStore } from "@/stores/warmup-store";
import { CategoryPicker } from "@/components/warmup/category-picker";
import { ChallengeDisplay } from "@/components/warmup/challenge-display";
import { ResponseInput } from "@/components/warmup/response-input";
import { TimerDisplay } from "@/components/warmup/timer-display";
import { FeedbackDisplay } from "@/components/warmup/feedback-display";
import { Brain, Loader2, RotateCcw } from "lucide-react";
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

      if (!res.ok) throw new Error("Failed to generate challenge");

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
      store.reset();
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

      if (!res.ok) throw new Error("Failed to evaluate response");

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
      store.reset();
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
