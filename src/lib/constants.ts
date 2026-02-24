export const APP_NAME = "FounderOS";

export const DAILY_BLOCKS = [
  {
    id: "warmup",
    title: "Cognitive Warm-Up",
    description: "Sharpen your thinking with a business-relevant challenge",
    estimatedMinutes: 5,
    icon: "brain",
    href: "/warmup",
    mandatory: true,
  },
  {
    id: "learning",
    title: "Learning Session",
    description: "Progress through the Founder Playbook",
    estimatedMinutes: 25,
    icon: "book-open",
    href: "/learning",
    mandatory: false,
  },
  {
    id: "reflection",
    title: "Daily Reflection",
    description: "Journal your thoughts and decisions",
    estimatedMinutes: 5,
    icon: "pen-line",
    href: "/reflection",
    mandatory: false,
  },
] as const;

export const NAV_ITEMS = [
  { label: "Today", href: "/", icon: "home" },
  { label: "Warm-Up", href: "/warmup", icon: "brain" },
  { label: "Learning", href: "/learning", icon: "book-open" },
  { label: "Reflection", href: "/reflection", icon: "pen-line" },
  { label: "Dashboard", href: "/dashboard", icon: "bar-chart-3" },
] as const;

export const MAX_REST_DAYS_PER_WEEK = 1;
export const MIN_BLOCKS_FOR_COMPLETE_DAY = 2; // warmup + 1 other
export const WARMUP_MAX_DIFFICULTY = 3;
export const WARMUP_MIN_DIFFICULTY = 1;
export const DIFFICULTY_UP_THRESHOLD = 0.8;
export const DIFFICULTY_DOWN_THRESHOLD = 0.4;
export const ROLLING_WINDOW_DAYS = 7;
export const MIN_SESSIONS_FOR_ADJUSTMENT = 5;
