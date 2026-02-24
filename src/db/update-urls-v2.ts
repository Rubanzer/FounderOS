import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { learningItems } from "./schema/learning-items";
import { skillLevels } from "./schema/skill-levels";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// ============================================
// PART 1: Replace Amazon URLs with content URLs
// ============================================
const URL_REPLACEMENTS: Record<string, string> = {
  "Thinking, Fast and Slow — Daniel Kahneman":
    "https://www.youtube.com/watch?v=CjVQJdIrDJ0",
  "Good Strategy Bad Strategy — Richard Rumelt":
    "https://www.youtube.com/watch?v=UZrTl16hZdk",
  "The Data Warehouse Toolkit — Kimball (Ch 1-4)":
    "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/",
  "Fundamentals of Data Engineering — Reis & Housley (Storage & Serving chapters)":
    "https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/",
  "Writing That Works — Roman & Raphaelson":
    "https://paulgraham.com/writing44.html",
  "Inspired — Marty Cagan":
    "https://www.svpg.com/inspired-how-to-create-tech-products-customers-love/",
  "Obviously Awesome — April Dunford":
    "https://www.aprildunford.com/books",
  "The Mom Test — Rob Fitzpatrick":
    "https://www.momtestbook.com/",
  "Fundamentals of Software Architecture — Richards & Ford (Ch 1-8)":
    "https://www.developertoarchitect.com/lessons/",
  "A Philosophy of Software Design — Ousterhout":
    "https://www.youtube.com/watch?v=bmSAYlu0NcY",
  "Lean Analytics — Croll & Yoskovitz":
    "https://leananalyticsbook.com/",
  "Measure What Matters — John Doerr":
    "https://www.youtube.com/watch?v=L4N1q4RNi9I",
  "Venture Deals — Brad Feld":
    "https://venturedeals.techstars.com/",
  "Team Topologies — Skelton & Pais":
    "https://teamtopologies.com/",
  "Accelerate — Forsgren, Humble, Kim":
    "https://dora.dev/",
  "Made to Stick — Chip & Dan Heath":
    "https://heathbrothers.com/books/made-to-stick/",
  "The Pyramid Principle — Barbara Minto":
    "https://medium.com/lessons-from-mckinsey/the-pyramid-principle-f0885afa6d46",
};

// ============================================
// PART 2: New video learning items
// ============================================
const NEW_VIDEOS = [
  {
    title: "Daniel Kahneman — Thinking, Fast and Slow (Talks at Google)",
    type: "video" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 65,
    description: "Nobel laureate Kahneman explains System 1 vs System 2 thinking at Google. Understand the cognitive biases that silently sabotage your founder decisions every day.",
    sourceUrl: "https://www.youtube.com/watch?v=CjVQJdIrDJ0",
  },
  {
    title: "Richard Rumelt — Good Strategy Bad Strategy (LSE Talk)",
    type: "video" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 90,
    description: "Rumelt at the London School of Economics on why most strategies are bad and how to build a real one. His kernel of strategy (diagnosis → guiding policy → coherent action) is directly applicable to startup positioning.",
    sourceUrl: "https://www.youtube.com/watch?v=UZrTl16hZdk",
  },
  {
    title: "Shane Parrish — The Art of Decision Making (The Knowledge Project)",
    type: "video" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 45,
    description: "Farnam Street founder Shane Parrish on mental models, second-order thinking, and building a latticework of frameworks for better decisions under uncertainty.",
    sourceUrl: "https://fs.blog/knowledge-project-podcast/",
  },
  {
    title: "Martin Kleppmann — Turning the Database Inside Out (Strange Loop)",
    type: "video" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 45,
    description: "Kleppmann's seminal talk on rethinking databases as immutable event logs. Changed how engineers think about data pipelines, materialized views, and stream processing.",
    sourceUrl: "https://www.youtube.com/watch?v=fU9hR3kiOK0",
  },
  {
    title: "DuckDB — The Modern Analytical Database (MotherDuck)",
    type: "video" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 30,
    description: "Why DuckDB is reshaping embedded analytics. In-process OLAP, zero dependencies, Parquet-native — the ideal engine for building fast BI tools without infrastructure overhead.",
    sourceUrl: "https://motherduck.com/blog/duckdb-tutorial-for-beginners/",
  },
  {
    title: "The dbt Viewpoint — Analytics Engineering (dbt Labs)",
    type: "video" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 35,
    description: "How dbt transformed the data stack. Treat SQL as software engineering: version control, testing, documentation, and modular transforms. The 'T' in ELT done right.",
    sourceUrl: "https://www.getdbt.com/blog/future-of-the-modern-data-stack",
  },
  {
    title: "Marty Cagan — Product Is Hard (Mind the Product)",
    type: "video" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 45,
    description: "SVPG founder Cagan on why most product teams fail and what empowered teams do differently. Essential viewing on discovery, validation, and product-market fit.",
    sourceUrl: "https://www.mindtheproduct.com/product-is-hard-by-marty-cagan/",
  },
  {
    title: "April Dunford — How to Position Your Product (Positioning Workshop)",
    type: "video" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 40,
    description: "Dunford's step-by-step positioning framework: competitive alternatives → unique attributes → value → target customer → market category. Transform how customers perceive your product.",
    sourceUrl: "https://www.aprildunford.com/",
  },
  {
    title: "John Ousterhout — A Philosophy of Software Design (Talks at Google)",
    type: "video" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 65,
    description: "Stanford professor on deep vs shallow modules, information hiding, and managing complexity. The most actionable software design talk — directly applicable to keeping your codebase clean.",
    sourceUrl: "https://www.youtube.com/watch?v=bmSAYlu0NcY",
  },
  {
    title: "Bryan Cantrill — Platform as a Reflection of Values (Node Summit)",
    type: "video" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 50,
    description: "Oxide CTO on how platform design reflects organizational values. A masterclass on making deliberate engineering trade-offs and the power of transparent decision-making (RFDs).",
    sourceUrl: "https://www.youtube.com/watch?v=Xhx970_JKX4",
  },
  {
    title: "Mark Richards — Fundamentals of Software Architecture (O'Reilly)",
    type: "video" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 55,
    description: "Richards on architecture styles, trade-off analysis, and the -ilities. Learn to choose between microservices, event-driven, and modular monoliths for your specific constraints.",
    sourceUrl: "https://www.developertoarchitect.com/lessons/",
  },
  {
    title: "Colin Bryar — Working Backwards: Amazon's Innovation Process",
    type: "video" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 45,
    description: "Former Amazon VP on the Working Backwards method: start with a press release, then FAQ, then 6-pager. Forces clarity of thought before writing a single line of code.",
    sourceUrl: "https://www.productplan.com/glossary/amazon-prfaq/",
  },
  {
    title: "John Doerr — Why the Secret to Success is Setting the Right Goals (TED)",
    type: "video" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 12,
    description: "Doerr's TED talk on OKRs — the goal-setting system behind Google, Intel, and Bono. 11 minutes that will change how you set objectives and measure progress.",
    sourceUrl: "https://www.youtube.com/watch?v=L4N1q4RNi9I",
  },
  {
    title: "David Skok — SaaS Metrics 2.0 (SaaStr)",
    type: "video" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 45,
    description: "Matrix Partners' Skok on the SaaS metrics that actually matter: LTV/CAC, magic number, net revenue retention. The definitive framework for measuring SaaS business health.",
    sourceUrl: "https://www.forentrepreneurs.com/saas-metrics-2/",
  },
  {
    title: "OWASP Top 10 — Walkthrough for Developers (2021 Edition)",
    type: "video" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 40,
    description: "Walk through the ten most critical web application security risks with practical examples. Injection, broken auth, XSS, SSRF — memorize these as your mental security checklist.",
    sourceUrl: "https://owasp.org/www-project-top-ten/",
  },
  {
    title: "AWS re:Invent — Multi-Tenant Data Isolation Patterns",
    type: "video" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 50,
    description: "AWS architects on isolation strategies for multi-tenant SaaS: pool vs silo, row-level security, IAM-based isolation, and testing strategies to guarantee tenant data separation.",
    sourceUrl: "https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/re-defining-multi-tenancy.html",
  },
  {
    title: "Brendan Gregg — Linux Systems Performance (USENIX LISA 2019)",
    type: "video" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 50,
    description: "Netflix performance engineer Gregg covers observability tools, methodologies, benchmarking, profiling, and tracing. The first 10 commands for any performance investigation.",
    sourceUrl: "https://www.youtube.com/watch?v=fhBHvsi0Ql0",
  },
  {
    title: "Gil Tene — How NOT to Measure Latency (Strange Loop)",
    type: "video" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 43,
    description: "Azul CTO on why most latency measurements are wrong. The Coordinated Omission problem, why averages lie, and how to properly measure P99 — essential for building fast dashboards.",
    sourceUrl: "https://www.youtube.com/watch?v=lJ8ydIuPFeU",
  },
  {
    title: "Brad Feld & Jason Mendelson — Venture Deals (Techstars)",
    type: "video" as const,
    tier: 3,
    skillArea: "fundraising",
    estimatedMinutes: 60,
    description: "Free Techstars course on term sheets, cap tables, and VC mechanics. Understand liquidation preferences, anti-dilution, and board seats before your first fundraise.",
    sourceUrl: "https://venturedeals.techstars.com/",
  },
  {
    title: "YC — How to Raise Your First Round of Funding",
    type: "video" as const,
    tier: 3,
    skillArea: "fundraising",
    estimatedMinutes: 30,
    description: "Y Combinator's playbook for seed fundraising: when to start, how much to raise, SAFE vs priced round, and how to run an efficient process. No-nonsense startup fundraising.",
    sourceUrl: "https://www.ycombinator.com/library/Mx-a-guide-to-seed-fundraising",
  },
  {
    title: "Nancy Duarte — The Secret Structure of Great Talks (TED)",
    type: "video" as const,
    tier: 3,
    skillArea: "communication",
    estimatedMinutes: 18,
    description: "Duarte reveals the hidden structure behind the greatest communicators in history. The 'what is' vs 'what could be' pattern applies to investor pitches, team rallies, and customer demos.",
    sourceUrl: "https://www.ted.com/talks/nancy_duarte_the_secret_structure_of_great_talks",
  },
  {
    title: "Nicole Forsgren — The Key to High-Performance (DevOps Enterprise Summit)",
    type: "video" as const,
    tier: 3,
    skillArea: "devops",
    estimatedMinutes: 35,
    description: "DORA creator Forsgren on the four key metrics that predict software delivery performance: lead time, deploy frequency, MTTR, and change failure rate. Research-backed engineering excellence.",
    sourceUrl: "https://dora.dev/",
  },
  {
    title: "YC — How to Hire Your First Engineer",
    type: "video" as const,
    tier: 3,
    skillArea: "hiring",
    estimatedMinutes: 25,
    description: "Y Combinator on when to make your first hire, what to look for, how to evaluate without a formal process, and the critical difference between hiring for a startup vs big company.",
    sourceUrl: "https://www.ycombinator.com/library/8h-how-to-hire-your-first-engineer",
  },
  {
    title: "AWS — Cloud Cost Optimization Strategies",
    type: "video" as const,
    tier: 2,
    skillArea: "cloud_cost",
    estimatedMinutes: 40,
    description: "Practical strategies: reserved instances, spot instances, right-sizing, storage tiering, and autoscaling. Know the five levers for cutting your cloud bill by 40-60%.",
    sourceUrl: "https://aws.amazon.com/aws-cost-management/",
  },
];

async function update() {
  console.log("=== Phase 1: Replacing Amazon URLs with content URLs ===\n");

  let urlUpdated = 0;
  for (const [title, sourceUrl] of Object.entries(URL_REPLACEMENTS)) {
    const result = await db
      .update(learningItems)
      .set({ sourceUrl })
      .where(eq(learningItems.title, title));
    urlUpdated++;
    console.log(`  ✓ ${title}`);
  }
  console.log(`\nReplaced ${urlUpdated} Amazon URLs.\n`);

  console.log("=== Phase 2: Inserting video learning items ===\n");

  let videosInserted = 0;
  for (const video of NEW_VIDEOS) {
    await db.insert(learningItems).values({
      title: video.title,
      description: video.description,
      type: video.type,
      tier: video.tier,
      skillArea: video.skillArea,
      estimatedMinutes: video.estimatedMinutes,
      sourceUrl: video.sourceUrl,
    });
    videosInserted++;
    console.log(`  ✓ ${video.title}`);
  }
  console.log(`\nInserted ${videosInserted} video items.\n`);

  console.log("=== Phase 3: Updating warmup difficulty maps for new categories ===\n");

  // Update all skill_levels rows to include new warmup categories
  const allSkillLevels = await db.select().from(skillLevels);
  for (const sl of allSkillLevels) {
    const currentDifficulty = (sl.warmupDifficulty as Record<string, number>) || {};
    if (!currentDifficulty.systems_design || !currentDifficulty.strategic_thinking || !currentDifficulty.product_sense) {
      const updatedDifficulty = {
        logical_reasoning: currentDifficulty.logical_reasoning || 1,
        mental_math: currentDifficulty.mental_math || 1,
        estimation_fermi: currentDifficulty.estimation_fermi || 1,
        systems_design: currentDifficulty.systems_design || 1,
        strategic_thinking: currentDifficulty.strategic_thinking || 1,
        product_sense: currentDifficulty.product_sense || 1,
      };
      await db
        .update(skillLevels)
        .set({ warmupDifficulty: updatedDifficulty })
        .where(eq(skillLevels.id, sl.id));
      console.log(`  ✓ Updated warmup difficulty for skill: ${sl.skillArea}`);
    }
  }

  console.log("\n=== Done! ===");
  process.exit(0);
}

update().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
