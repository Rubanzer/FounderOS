"use client";

import { useWarmupStore } from "@/stores/warmup-store";
import { CategoryPicker } from "@/components/warmup/category-picker";
import { ChallengeDisplay } from "@/components/warmup/challenge-display";
import { ResponseInput } from "@/components/warmup/response-input";
import { TimerDisplay } from "@/components/warmup/timer-display";
import { FeedbackDisplay } from "@/components/warmup/feedback-display";
import { Brain, Loader2, RotateCcw, AlertTriangle, Zap, CheckCircle2, Trophy } from "lucide-react";
import type { WarmupCategory } from "@/types/warmup";
import Link from "next/link";

export default function WarmupPage() {
  const store = useWarmupStore();

  const generateChallenge = async (category: WarmupCategory) => {
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

  const handleCategorySelect = async (category: WarmupCategory) => {
    store.selectCategory(category);
    store.setGenerating();
    await generateChallenge(category);
  };

  const handleNextChallenge = async () => {
    const category = store.selectedCategory;
    if (!category) return;
    store.nextChallenge();
    await generateChallenge(category);
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
      store.backToChallengeActive();
      store.setError(
        error instanceof Error
          ? error.message
          : "Failed to evaluate your response. Try submitting again."
      );
    }
  };

  const handleEndSession = () => {
    if (store.sessionCount > 0) {
      store.setComplete();
    } else {
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

        <div className="flex items-center gap-3">
          {store.sessionCount > 0 && store.state !== "complete" && store.state !== "selecting_category" && (
            <span className="text-xs font-medium text-brand-600 bg-brand-600/10 px-2.5 py-1 rounded-full">
              {store.sessionCount} done
            </span>
          )}
          {store.state !== "selecting_category" && store.state !== "complete" && (
            <button
              onClick={store.reset}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          )}
        </div>
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
          <p className="text-muted text-sm">
            {store.sessionCount > 0
              ? `Crafting challenge #${store.sessionCount + 1}...`
              : "Crafting your challenge..."}
          </p>
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
          sessionCount={store.sessionCount}
          sessionScores={store.sessionScores}
          onNextChallenge={handleNextChallenge}
          onDone={handleEndSession}
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
        <div className="space-y-6 py-8">
          {/* Session summary */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-brand-600/10">
              <Trophy className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-xl font-semibold">Session Complete!</h2>
            <p className="text-muted text-sm">
              You crushed {store.sessionCount} challenge{store.sessionCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Stats */}
          {store.sessionScores.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl border border-border bg-surface">
                <div className="text-2xl font-bold text-brand-600">
                  {store.sessionCount}
                </div>
                <div className="text-xs text-muted mt-1">Challenges</div>
              </div>
              <div className="text-center p-4 rounded-xl border border-border bg-surface">
                <div className="text-2xl font-bold text-success">
                  {store.sessionScores.filter((s) => s.isCorrect).length}
                </div>
                <div className="text-xs text-muted mt-1">Correct</div>
              </div>
              <div className="text-center p-4 rounded-xl border border-border bg-surface">
                <div className="text-2xl font-bold">
                  {Math.round(
                    (store.sessionScores.reduce((sum, s) => sum + s.score, 0) /
                      store.sessionScores.length) *
                      100
                  )}
                  %
                </div>
                <div className="text-xs text-muted mt-1">Avg Score</div>
              </div>
            </div>
          )}

          {/* Score dots */}
          {store.sessionScores.length > 0 && (
            <div className="flex justify-center gap-2">
              {store.sessionScores.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                    s.isCorrect
                      ? "bg-success/10 text-success border border-success/30"
                      : "bg-danger/10 text-danger border border-danger/30"
                  }`}
                >
                  {Math.round(s.score * 100)}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <button
              onClick={store.reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
            >
              <Zap className="w-4 h-4" />
              New Session
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
