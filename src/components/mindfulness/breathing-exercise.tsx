"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Phase = "inhale" | "hold_in" | "exhale" | "hold_out";

const PHASES: { phase: Phase; label: string; seconds: number }[] = [
  { phase: "inhale", label: "Breathe In", seconds: 4 },
  { phase: "hold_in", label: "Hold", seconds: 4 },
  { phase: "exhale", label: "Breathe Out", seconds: 4 },
  { phase: "hold_out", label: "Hold", seconds: 4 },
];

const TOTAL_ROUNDS = 4;

interface BreathingExerciseProps {
  onComplete: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASES[0].seconds);
  const [round, setRound] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = PHASES[phaseIndex];
  const progress = 1 - timeLeft / currentPhase.seconds;

  const advancePhase = useCallback(() => {
    const nextPhaseIndex = (phaseIndex + 1) % PHASES.length;

    // Check if we completed a full cycle
    if (nextPhaseIndex === 0) {
      if (round >= TOTAL_ROUNDS) {
        // All rounds done
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete();
        return;
      }
      setRound((r) => r + 1);
    }

    setPhaseIndex(nextPhaseIndex);
    setTimeLeft(PHASES[nextPhaseIndex].seconds);
  }, [phaseIndex, round, onComplete]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          advancePhase();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, advancePhase]);

  const start = () => {
    setIsRunning(true);
    setPhaseIndex(0);
    setTimeLeft(PHASES[0].seconds);
    setRound(1);
  };

  // Circle animation scale based on phase
  const getScale = () => {
    if (!isRunning) return 1;
    if (currentPhase.phase === "inhale") return 1 + progress * 0.4;
    if (currentPhase.phase === "hold_in") return 1.4;
    if (currentPhase.phase === "exhale") return 1.4 - progress * 0.4;
    return 1; // hold_out
  };

  const getOpacity = () => {
    if (!isRunning) return 0.3;
    if (currentPhase.phase === "inhale") return 0.3 + progress * 0.4;
    if (currentPhase.phase === "hold_in") return 0.7;
    if (currentPhase.phase === "exhale") return 0.7 - progress * 0.4;
    return 0.3;
  };

  return (
    <div className="flex flex-col items-center py-8 space-y-8">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold">Box Breathing</h2>
        <p className="text-sm text-muted">
          {isRunning
            ? `Round ${round} of ${TOTAL_ROUNDS}`
            : "4 seconds in, hold, out, hold. Repeat 4 times."}
        </p>
      </div>

      {/* Breathing circle */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-emerald-500 transition-all duration-1000 ease-in-out"
          style={{
            transform: `scale(${getScale()})`,
            opacity: getOpacity(),
          }}
        />
        <div className="relative z-10 text-center">
          {isRunning ? (
            <>
              <div className="text-3xl font-bold text-white">{timeLeft}</div>
              <div className="text-sm font-medium text-white/80 mt-1">
                {currentPhase.label}
              </div>
            </>
          ) : (
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Tap to begin
            </div>
          )}
        </div>
      </div>

      {/* Start / Phase indicators */}
      {!isRunning ? (
        <button
          onClick={start}
          className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
        >
          Start Breathing
        </button>
      ) : (
        <div className="flex gap-2">
          {PHASES.map((p, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === phaseIndex
                  ? "bg-emerald-500"
                  : i < phaseIndex
                  ? "bg-emerald-500/40"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      )}

      {/* Skip button when running */}
      {isRunning && (
        <button
          onClick={onComplete}
          className="text-xs text-muted hover:text-foreground transition-colors"
        >
          Skip exercise
        </button>
      )}
    </div>
  );
}
