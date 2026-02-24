export type WarmupCategory =
  | "logical_reasoning"
  | "mental_math"
  | "estimation_fermi"
  | "systems_design"
  | "strategic_thinking"
  | "product_sense";

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
  systems_design: "Systems Design",
  strategic_thinking: "Strategic Thinking",
  product_sense: "Product Sense",
};

export const CATEGORY_DESCRIPTIONS: Record<WarmupCategory, string> = {
  logical_reasoning: "Constraint satisfaction, deduction, dependency analysis",
  mental_math: "SaaS metrics at scale — MRR, churn, unit economics",
  estimation_fermi: "Market sizing, infra costs, engineering effort",
  systems_design: "Architecture trade-offs, scaling, distributed systems",
  strategic_thinking: "Competitive moves, market positioning, resource allocation",
  product_sense: "Feature prioritization, user psychology, roadmap trade-offs",
};

export const CATEGORY_ICONS: Record<WarmupCategory, string> = {
  logical_reasoning: "brain",
  mental_math: "calculator",
  estimation_fermi: "target",
  systems_design: "server",
  strategic_thinking: "chess" ,
  product_sense: "lightbulb",
};

export const ALL_CATEGORIES: WarmupCategory[] = [
  "logical_reasoning",
  "mental_math",
  "estimation_fermi",
  "systems_design",
  "strategic_thinking",
  "product_sense",
];
