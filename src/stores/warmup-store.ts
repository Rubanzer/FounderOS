"use client";

import { create } from "zustand";
import type { WarmupCategory, DifficultyLevel, WarmupState, WarmupChallenge, WarmupFeedback } from "@/types/warmup";

interface WarmupStore {
  state: WarmupState;
  challenge: WarmupChallenge | null;
  feedback: WarmupFeedback | null;
  selectedCategory: WarmupCategory | null;
  timeElapsed: number;
  timerInterval: ReturnType<typeof setInterval> | null;

  selectCategory: (category: WarmupCategory) => void;
  setGenerating: () => void;
  setChallengeActive: (challenge: WarmupChallenge) => void;
  setEvaluating: () => void;
  setFeedback: (feedback: WarmupFeedback) => void;
  setComplete: () => void;
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

  selectCategory: (category) =>
    set({ selectedCategory: category, state: "selecting_category" }),

  setGenerating: () => set({ state: "generating" }),

  setChallengeActive: (challenge) =>
    set({ state: "challenge_active", challenge }),

  setEvaluating: () => {
    get().stopTimer();
    set({ state: "evaluating" });
  },

  setFeedback: (feedback) =>
    set({ state: "showing_feedback", feedback }),

  setComplete: () => set({ state: "complete" }),

  reset: () => {
    get().stopTimer();
    set({
      state: "selecting_category",
      challenge: null,
      feedback: null,
      selectedCategory: null,
      timeElapsed: 0,
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
