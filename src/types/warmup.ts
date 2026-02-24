export type WarmupCategory = "logical_reasoning" | "mental_math" | "estimation_fermi";

export type DifficultyLevel = 1 | 2 | 3;

export type WarmupState =
  | "selecting_category"
  | "generating"
  | "challenge_active"
  | "evaluating"
  | "showing_feedback"
  | "complete"
  | "error";

export interface WarmupChallenge {
  id: number;
  challengeText: string;
  timeLimitSeconds: number;
  category: WarmupCategory;
  difficultyLevel: DifficultyLevel;
}

export interface WarmupFeedback {
  score: number;
  isCorrect: boolean;
  feedback: string;
  explanation: string;
  expectedAnswer: string;
}

export const CATEGORY_LABELS: Record<WarmupCategory, string> = {
  logical_reasoning: "Logical Reasoning",
  mental_math: "Mental Math",
  estimation_fermi: "Estimation & Fermi",
};

export const CATEGORY_DESCRIPTIONS: Record<WarmupCategory, string> = {
  logical_reasoning: "Business logic puzzles and constraint satisfaction",
  mental_math: "SaaS metric calculations — MRR, churn, ARR, LTV",
  estimation_fermi: "Market sizing, TAM estimates, cost estimation",
};

export const CATEGORY_ICONS: Record<WarmupCategory, string> = {
  logical_reasoning: "brain",
  mental_math: "calculator",
  estimation_fermi: "target",
};
