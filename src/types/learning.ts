export type LearningType = "video" | "book_chapter" | "podcast" | "article" | "course" | "exercise";
export type Tier = 1 | 2 | 3;
export type LearningStatus = "not_started" | "in_progress" | "completed";

export type SkillArea =
  | "clear_thinking"
  | "data_architecture"
  | "spec_writing"
  | "product_thinking"
  | "system_design"
  | "metrics"
  | "security"
  | "cloud_cost"
  | "testing"
  | "performance"
  | "fundraising"
  | "hiring"
  | "devops"
  | "tech_radar"
  | "communication";

export const SKILL_AREA_LABELS: Record<SkillArea, string> = {
  clear_thinking: "Clear Thinking",
  data_architecture: "Data Architecture",
  spec_writing: "Spec Writing",
  product_thinking: "Product Thinking",
  system_design: "System Design",
  metrics: "Metrics & Analytics",
  security: "Security",
  cloud_cost: "Cloud Cost",
  testing: "Testing",
  performance: "Performance",
  fundraising: "Fundraising",
  hiring: "Hiring",
  devops: "DevOps",
  tech_radar: "Tech Radar",
  communication: "Communication",
};

export const TIER_LABELS: Record<number, string> = {
  1: "Tier 1 — The 20% That Gets You 80%",
  2: "Tier 2 — The Next 15%",
  3: "Tier 3 — The Final 5%",
};

export const TYPE_ICONS: Record<LearningType, string> = {
  video: "play-circle",
  book_chapter: "book-open",
  podcast: "headphones",
  article: "file-text",
  course: "graduation-cap",
  exercise: "dumbbell",
};
