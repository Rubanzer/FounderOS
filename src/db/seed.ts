import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { learningItems } from "./schema/learning-items";
import { skillLevels } from "./schema/skill-levels";
import { userSettings } from "./schema/user-settings";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const CURRICULUM = [
  // ============================================
  // TIER 1 — The 20% That Gets You 80%
  // ============================================

  // 1.1 — Clear Thinking & Decision-Making
  {
    title: "The Great Mental Models Vol. 1 — Shane Parrish",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 300,
  },
  {
    title: "Thinking, Fast and Slow — Daniel Kahneman",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 480,
  },
  {
    title: "Good Strategy Bad Strategy — Richard Rumelt",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 360,
  },
  {
    title: "Practice: Decision Journal — daily 15 min",
    type: "exercise" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 30,
  },
  {
    title: "Practice: Pre-mortem Habit",
    type: "exercise" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 15,
  },
  {
    title: "Practice: Inversion Thinking",
    type: "exercise" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 15,
  },

  // 1.2 — Data Architecture for BI
  {
    title: "DDIA Chapters 1-3 — Data Models, Storage, Encoding (Kleppmann)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 360,
  },
  {
    title: "DDIA Chapters 10-12 — Batch, Stream, Future (Kleppmann)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 300,
  },
  {
    title: "The Data Warehouse Toolkit — Kimball (Ch 1-4)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 240,
  },
  {
    title: "Fundamentals of Data Engineering — Reis & Housley (Storage & Serving chapters)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 300,
  },
  {
    title: "Study: OLTP vs OLAP, columnar storage, Parquet/Arrow/DuckDB",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 120,
  },
  {
    title: "Study: Modern Data Stack — Sources → Warehouse → Transform → BI",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 90,
  },
  {
    title: "Study: Query engines — vectorized execution, predicate pushdown, materialized views",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 90,
  },
  {
    title: "Study: Semantic layers — Cube, dbt Semantic Layer, LookML",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Embeddings, vector search, text-to-SQL for BI",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 60,
  },
  {
    title: "Practice: Draw Business Brain's complete data flow diagram",
    type: "exercise" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 60,
  },
  {
    title: "Study: How Metabase, Looker, Tableau, Lightdash are architectured",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 120,
  },

  // 1.3 — Problem Articulation & Spec Writing
  {
    title: "Writing That Works — Roman & Raphaelson",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 180,
  },
  {
    title: "Study: Amazon 6-pager format and PRFAQ",
    type: "article" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 60,
  },
  {
    title: "Study: 10 good RFCs — Stripe API docs, Oxide RFDs, Figma eng blog",
    type: "article" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 120,
  },
  {
    title: "Build your personal spec template",
    type: "exercise" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 45,
  },
  {
    title: "Practice: Write 30 specs in 30 days (20 min each)",
    type: "exercise" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 600,
  },

  // 1.4 — Product Thinking for BI
  {
    title: "Inspired — Marty Cagan",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 360,
  },
  {
    title: "Obviously Awesome — April Dunford",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 180,
  },
  {
    title: "The Mom Test — Rob Fitzpatrick",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 120,
  },
  {
    title: "Study: BI buyer personas (analyst, business user, executive, data engineer)",
    type: "article" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Embedded analytics trend",
    type: "article" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 45,
  },
  {
    title: "Study: AI-native BI — text-to-SQL, anomaly detection, conversational analytics",
    type: "article" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 60,
  },
  {
    title: "Practice: Write Business Brain positioning statement (Dunford framework)",
    type: "exercise" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 30,
  },
  {
    title: "Practice: Talk to 5 customers using Mom Test principles",
    type: "exercise" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 300,
  },

  // 1.5 — System Design (Applied to BI)
  {
    title: "Fundamentals of Software Architecture — Richards & Ford (Ch 1-8)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 360,
  },
  {
    title: "A Philosophy of Software Design — Ousterhout",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 180,
  },
  {
    title: "Study: Multi-tenancy patterns (shared DB/schema, separate DB, cost vs isolation)",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 90,
  },
  {
    title: "Study: Query caching and materialization strategies",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Permission models — row-level, column-level, object-level security",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Embed architecture — iframes, SDKs, APIs, auth handoff (JWT, OAuth)",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Event-driven patterns for real-time dashboard updates",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 45,
  },
  {
    title: "Practice: Design Business Brain's architecture from scratch",
    type: "exercise" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 90,
  },

  // ============================================
  // TIER 2 — The Next 15%
  // ============================================

  // 2.1 — Metrics & Analytics
  {
    title: "Lean Analytics — Croll & Yoskovitz",
    type: "book_chapter" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 300,
  },
  {
    title: "Measure What Matters — John Doerr",
    type: "book_chapter" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 240,
  },
  {
    title: "Study: SaaS metrics — MRR, ARR, churn, LTV, CAC, NRR, payback period",
    type: "article" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 90,
  },
  {
    title: "Practice: Build Business Brain's own metrics dashboard (dogfood)",
    type: "exercise" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 120,
  },
  {
    title: "Practice: Weekly metrics review habit — 30 min every Monday",
    type: "exercise" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 30,
  },

  // 2.2 — Security & Compliance
  {
    title: "Study: OWASP Top 10 — memorize and apply as mental checklist",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 90,
  },
  {
    title: "Study: SOC2 Type II — requirements, cost, when to start",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Data encryption (at rest/in transit), key management, audit logging, RBAC",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 90,
  },
  {
    title: "Study: Multi-tenant data isolation — guaranteeing Tenant A never sees Tenant B",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 60,
  },

  // 2.3 — Cloud Cost Engineering
  {
    title: "Study: Understand your cloud bill line by line",
    type: "article" as const,
    tier: 2,
    skillArea: "cloud_cost",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Reserved instances, spot, autoscaling, right-sizing, storage tiering",
    type: "article" as const,
    tier: 2,
    skillArea: "cloud_cost",
    estimatedMinutes: 90,
  },
  {
    title: "Study: Query cost models (BigQuery pay-per-scan, etc.)",
    type: "article" as const,
    tier: 2,
    skillArea: "cloud_cost",
    estimatedMinutes: 45,
  },

  // 2.4 — Testing & Quality Strategy
  {
    title: "Study: Testing pyramid — unit, integration, E2E",
    type: "article" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 45,
  },
  {
    title: "Study: BI-specific testing — data accuracy, performance regression, permission tests",
    type: "article" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Data quality frameworks — Great Expectations, dbt tests, Soda",
    type: "article" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 60,
  },
  {
    title: "Practice: Define Business Brain's correctness contract",
    type: "exercise" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 60,
  },

  // 2.5 — Performance & Observability
  {
    title: "Study: P50/P95/P99 latency — why P99 matters most",
    type: "article" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 30,
  },
  {
    title: "Study: Observability stack — Prometheus, Datadog, structured logging, OpenTelemetry",
    type: "article" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 90,
  },
  {
    title: "Study: Performance budgets for dashboards",
    type: "article" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 30,
  },
  {
    title: "Practice: Define SLOs for Business Brain (query latency, render time, data freshness)",
    type: "exercise" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 45,
  },

  // ============================================
  // TIER 3 — The Final 5%
  // ============================================

  // 3.1 — Fundraising & Financial Modeling
  {
    title: "Venture Deals — Brad Feld",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "fundraising",
    estimatedMinutes: 300,
  },
  {
    title: "Study: Cap tables, dilution, term sheets",
    type: "article" as const,
    tier: 3,
    skillArea: "fundraising",
    estimatedMinutes: 60,
  },
  {
    title: "Practice: Build basic financial model (revenue forecast, burn rate, runway)",
    type: "exercise" as const,
    tier: 3,
    skillArea: "fundraising",
    estimatedMinutes: 120,
  },

  // 3.2 — Hiring & Team Topology
  {
    title: "Team Topologies — Skelton & Pais",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "hiring",
    estimatedMinutes: 240,
  },
  {
    title: "Study: When to hire first engineer vs keep orchestrating with AI",
    type: "article" as const,
    tier: 3,
    skillArea: "hiring",
    estimatedMinutes: 30,
  },
  {
    title: "Practice: Write a great job description + structured interview plan",
    type: "exercise" as const,
    tier: 3,
    skillArea: "hiring",
    estimatedMinutes: 60,
  },

  // 3.3 — DevOps & CI/CD
  {
    title: "Accelerate — Forsgren, Humble, Kim",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "devops",
    estimatedMinutes: 240,
  },
  {
    title: "Study: CI/CD pipeline — build, test, scan, deploy, smoke test, monitor",
    type: "article" as const,
    tier: 3,
    skillArea: "devops",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Blue/green and canary deployments for zero-downtime",
    type: "article" as const,
    tier: 3,
    skillArea: "devops",
    estimatedMinutes: 30,
  },

  // 3.4 — Emerging Tech Radar
  {
    title: "Build personal tech radar (Adopt / Trial / Assess / Hold)",
    type: "exercise" as const,
    tier: 3,
    skillArea: "tech_radar",
    estimatedMinutes: 60,
  },
  {
    title: "Study: AI agents, text-to-SQL advances, semantic layer evolution",
    type: "article" as const,
    tier: 3,
    skillArea: "tech_radar",
    estimatedMinutes: 60,
  },
  {
    title: "Study: Real-time OLAP engines — ClickHouse, Apache Doris, StarRocks",
    type: "article" as const,
    tier: 3,
    skillArea: "tech_radar",
    estimatedMinutes: 60,
  },

  // 3.5 — Communication & Storytelling
  {
    title: "Made to Stick — Chip & Dan Heath",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "communication",
    estimatedMinutes: 240,
  },
  {
    title: "The Pyramid Principle — Barbara Minto",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "communication",
    estimatedMinutes: 180,
  },
  {
    title: "Practice: Record yourself in meetings, listen back, iterate",
    type: "exercise" as const,
    tier: 3,
    skillArea: "communication",
    estimatedMinutes: 30,
  },
];

async function seed() {
  console.log("Seeding database...");

  // Insert default user settings
  console.log("Creating default user settings...");
  await db.insert(userSettings).values({
    dailyTimeBudgetMinutes: 45,
    scheduledRestDays: [],
    theme: "system",
  });

  // Insert skill levels with default warmup difficulties
  console.log("Creating skill levels...");
  const skills = [...new Set(CURRICULUM.map((c) => c.skillArea))];
  for (const skill of skills) {
    await db.insert(skillLevels).values({
      skillArea: skill,
      currentLevel: 0,
      warmupDifficulty: {
        logical_reasoning: 1,
        mental_math: 1,
        estimation_fermi: 1,
      },
      rollingAccuracy: 0,
      totalSessions: 0,
    });
  }

  // Insert curriculum
  console.log(`Inserting ${CURRICULUM.length} learning items...`);
  for (const item of CURRICULUM) {
    await db.insert(learningItems).values({
      title: item.title,
      type: item.type,
      tier: item.tier,
      skillArea: item.skillArea,
      estimatedMinutes: item.estimatedMinutes,
    });
  }

  console.log(`Done! Seeded ${CURRICULUM.length} learning items across ${skills.length} skill areas.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
