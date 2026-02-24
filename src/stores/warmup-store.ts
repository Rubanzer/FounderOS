"use client";

import { create } from "zustand";
import type { WarmupCategory, WarmupState, WarmupChallenge, WarmupFeedback } from "@/types/warmup";

interface WarmupStore {
  state: WarmupState;
  challenge: WarmupChallenge | null;
  feedback: WarmupFeedback | null;
  selectedCategory: WarmupCategory | null;
  timeElapsed: number;
  timerInterval: ReturnType<typeof setInterval> | null;
  error: string | null;
  sessionCount: number;
  sessionScores: { score: number; isCorrect: boolean }[];

  selectCategory: (category: WarmupCategory) => void;
  setGenerating: () => void;
  setChallengeActive: (challenge: WarmupChallenge) => void;
  setEvaluating: () => void;
  setFeedback: (feedback: WarmupFeedback) => void;
  setComplete: () => void;
  setError: (message: string) => void;
  backToChallengeActive: () => void;
  nextChallenge: () => void;
  reset: () => void;

  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useWarmupStore = create<WarmupStore>((set, get) => ({
  state: "selecting_category",
  challenge: null,
  feedback: null,
  selectedCategory: null,
  timeElapsed: 0,
  timerInterval: null,
  error: null,
  sessionCount: 0,
  sessionScores: [],

  selectCategory: (category) =>
    set({ selectedCategory: category, state: "selecting_category" }),

  setGenerating: () => set({ state: "generating", error: null }),

  setChallengeActive: (challenge) =>
    set({ state: "challenge_active", challenge, error: null }),

  setEvaluating: () => {
    get().stopTimer();
    set({ state: "evaluating", error: null });
  },

  setFeedback: (feedback) =>
    set((state) => ({
      state: "showing_feedback",
      feedback,
      sessionCount: state.sessionCount + 1,
      sessionScores: [...state.sessionScores, { score: feedback.score, isCorrect: feedback.isCorrect }],
    })),

  setComplete: () => set({ state: "complete" }),

  setError: (message) => {
    get().stopTimer();
    set({ state: "error", error: message });
  },

  backToChallengeActive: () => {
    set({ state: "challenge_active", error: null });
    get().startTimer();
  },

  nextChallenge: () => {
    get().stopTimer();
    set({
      state: "generating",
      challenge: null,
      feedback: null,
      timeElapsed: 0,
      error: null,
    });
  },

  reset: () => {
    get().stopTimer();
    set({
      state: "selecting_category",
      challenge: null,
      feedback: null,
      selectedCategory: null,
      timeElapsed: 0,
      error: null,
      sessionCount: 0,
      sessionScores: [],
    });
  },

  startTimer: () => {
    const existing = get().timerInterval;
    if (existing) clearInterval(existing);

    const interval = setInterval(() => {
      set((state) => ({ timeElapsed: state.timeElapsed + 1 }));
    }, 1000);
    set({ timerInterval: interval, timeElapsed: 0 });
  },

  stopTimer: () => {
    const interval = get().timerInterval;
    if (interval) clearInterval(interval);
    set({ timerInterval: null });
  },

  resetTimer: () => {
    get().stopTimer();
    set({ timeElapsed: 0 });
  },
}));
