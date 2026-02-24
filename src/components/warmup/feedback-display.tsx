"use client";

import { CheckCircle2, XCircle, ArrowRight, Zap } from "lucide-react";
import type { WarmupFeedback } from "@/types/warmup";

interface FeedbackDisplayProps {
  feedback: WarmupFeedback;
  timeTaken: number;
  sessionCount: number;
  sessionScores: { score: number; isCorrect: boolean }[];
  onNextChallenge: () => void;
  onDone: () => void;
}

export function FeedbackDisplay({
  feedback,
  timeTaken,
  sessionCount,
  sessionScores,
  onNextChallenge,
  onDone,
}: FeedbackDisplayProps) {
  const scorePercent = Math.round(feedback.score * 100);
  const totalCorrect = sessionScores.filter((s) => s.isCorrect).length;
  const avgScore = sessionScores.length
    ? Math.round((sessionScores.reduce((sum, s) => sum + s.score, 0) / sessionScores.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* Session progress */}
      {sessionCount > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
          <Zap className="w-4 h-4 text-brand-500" />
          <div className="flex-1 flex items-center gap-3 text-sm">
            <span className="font-medium">Session: {sessionCount} done</span>
            <span className="text-muted">|</span>
            <span className="text-success">{totalCorrect} correct</span>
            <span className="text-muted">|</span>
            <span className="text-muted">Avg: {avgScore}%</span>
          </div>
          <div className="flex gap-1">
            {sessionScores.map((s, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${s.isCorrect ? "bg-success" : "bg-danger"}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Score header */}
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border ${
          feedback.isCorrect
            ? "border-success/30 bg-success/5"
            : "border-danger/30 bg-danger/5"
        }`}
      >
        {feedback.isCorrect ? (
          <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-danger shrink-0" />
        )}
        <div className="flex-1">
          <p
            className={`font-semibold ${
              feedback.isCorrect ? "text-success" : "text-danger"
            }`}
          >
            {feedback.isCorrect ? "Correct!" : "Not quite right"}
          </p>
          <p className="text-sm text-muted">
            Score: {scorePercent}% | Time: {Math.floor(timeTaken / 60)}m{" "}
            {timeTaken % 60}s
          </p>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Feedback</h3>
        <div className="p-4 rounded-xl border border-border bg-surface">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {feedback.feedback}
          </p>
        </div>
      </div>

      {/* Explanation — always shown, especially important for wrong answers */}
      {feedback.explanation && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">
            {feedback.isCorrect ? "Solution Approach" : "Correct Solution"}
          </h3>
          <div
            className={`p-4 rounded-xl border ${
              feedback.isCorrect
                ? "border-border bg-surface"
                : "border-brand-500/30 bg-brand-500/5"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {feedback.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Expected answer — shown when wrong */}
      {!feedback.isCorrect && feedback.expectedAnswer && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Expected Answer</h3>
          <div className="p-4 rounded-xl border border-border bg-surface">
            <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
              {feedback.expectedAnswer}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={onDone}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          End Session
        </button>
        <button
          onClick={onNextChallenge}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
        >
          Next Challenge
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
