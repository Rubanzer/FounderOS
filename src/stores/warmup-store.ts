"use client";

import { create } from "zustand";
import type { WarmupCategory, WarmupState, WarmupChallenge, WarmupFeedback } from "@/types/warmup";
import { ALL_CATEGORIES } from "@/types/warmup";

const MAX_PREFETCH_PER_CATEGORY = 5;

function emptyPrefetchMap<T>(val: T): Record<WarmupCategory, T> {
  return Object.fromEntries(ALL_CATEGORIES.map((c) => [c, val])) as Record<WarmupCategory, T>;
}

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

  // Prefetch state
  prefetchedChallenges: Record<WarmupCategory, WarmupChallenge[]>;
  prefetchLoading: Record<WarmupCategory, boolean>;

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

  // Prefetch actions
  addPrefetchedChallenge: (category: WarmupCategory, challenge: WarmupChallenge) => void;
  consumePrefetched: (category: WarmupCategory) => WarmupChallenge | null;
  setPrefetchLoading: (category: WarmupCategory, loading: boolean) => void;
  getPrefetchCount: (category: WarmupCategory) => number;

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

  // Prefetch state
  prefetchedChallenges: emptyPrefetchMap<WarmupChallenge[]>([]),
  prefetchLoading: emptyPrefetchMap(false),

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

  // Prefetch actions
  addPrefetchedChallenge: (category, challenge) => {
    set((state) => {
      const current = state.prefetchedChallenges[category];
      if (current.length >= MAX_PREFETCH_PER_CATEGORY) return state;
      return {
        prefetchedChallenges: {
          ...state.prefetchedChallenges,
          [category]: [...current, challenge],
        },
      };
    });
  },

  consumePrefetched: (category) => {
    const current = get().prefetchedChallenges[category];
    if (current.length === 0) return null;
    const [first, ...rest] = current;
    set((state) => ({
      prefetchedChallenges: {
        ...state.prefetchedChallenges,
        [category]: rest,
      },
    }));
    return first;
  },

  setPrefetchLoading: (category, loading) => {
    set((state) => ({
      prefetchLoading: {
        ...state.prefetchLoading,
        [category]: loading,
      },
    }));
  },

  getPrefetchCount: (category) => {
    return get().prefetchedChallenges[category].length;
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
