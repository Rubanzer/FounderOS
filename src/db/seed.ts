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
    description: "Core mental models for better decisions. Covers first principles, second-order thinking, inversion, and map vs. territory — the foundation of strategic reasoning.",
    sourceUrl: "https://fs.blog/tgmm/",
  },
  {
    title: "Thinking, Fast and Slow — Daniel Kahneman",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 480,
    description: "The definitive guide to cognitive biases and dual-process thinking. Understand System 1 vs System 2 to catch your own blind spots as a founder.",
    sourceUrl: "https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555",
  },
  {
    title: "Good Strategy Bad Strategy — Richard Rumelt",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 360,
    description: "Learn to distinguish real strategy from fluff. Rumelt's kernel of strategy (diagnosis, guiding policy, coherent action) applies directly to startup positioning.",
    sourceUrl: "https://www.amazon.com/Good-Strategy-Bad-Difference-Matters/dp/0307886239",
  },
  {
    title: "Practice: Decision Journal — daily 15 min",
    type: "exercise" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 30,
    description: "Start a daily decision journal. Record one key decision, your reasoning, expected outcome, and confidence level. Review monthly to calibrate your judgement.",
  },
  {
    title: "Practice: Pre-mortem Habit",
    type: "exercise" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 15,
    description: "Before any major decision, imagine it's 6 months later and it failed. Write down the most likely reasons. This surfaces risks your optimism hides.",
  },
  {
    title: "Practice: Inversion Thinking",
    type: "exercise" as const,
    tier: 1,
    skillArea: "clear_thinking",
    estimatedMinutes: 15,
    description: "Instead of asking 'how do I succeed?', ask 'what would guarantee failure?' then avoid those things. Apply to your current biggest challenge.",
  },

  // 1.2 — Data Architecture for BI
  {
    title: "DDIA Chapters 1-3 — Data Models, Storage, Encoding (Kleppmann)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 360,
    description: "The bible of data systems design. Chapters 1-3 cover data models (relational vs document vs graph), storage engines (LSM vs B-tree), and encoding formats.",
    sourceUrl: "https://dataintensive.net/",
  },
  {
    title: "DDIA Chapters 10-12 — Batch, Stream, Future (Kleppmann)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 300,
    description: "How batch processing (MapReduce, Spark) and stream processing (Kafka, Flink) work under the hood. Essential for building real-time analytics pipelines.",
    sourceUrl: "https://dataintensive.net/",
  },
  {
    title: "The Data Warehouse Toolkit — Kimball (Ch 1-4)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 240,
    description: "Dimensional modeling fundamentals — star schemas, fact tables, dimension tables. The standard approach for analytical data warehouses that powers most BI tools.",
    sourceUrl: "https://www.amazon.com/Data-Warehouse-Toolkit-Definitive-Dimensional/dp/1118530802",
  },
  {
    title: "Fundamentals of Data Engineering — Reis & Housley (Storage & Serving chapters)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 300,
    description: "Modern data engineering patterns. Covers the full lifecycle from ingestion to serving, with focus on storage formats and serving layer architecture.",
    sourceUrl: "https://www.amazon.com/Fundamentals-Data-Engineering-Robust-Systems/dp/1098108302",
  },
  {
    title: "Study: OLTP vs OLAP, columnar storage, Parquet/Arrow/DuckDB",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 120,
    description: "Understand the fundamental split between transactional and analytical databases. Learn why columnar formats (Parquet, Arrow) are 10-100x faster for analytics queries.",
    sourceUrl: "https://motherduck.com/blog/duckdb-tutorial-for-beginners/",
  },
  {
    title: "Study: Modern Data Stack — Sources → Warehouse → Transform → BI",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 90,
    description: "Map the modern data stack: EL tools (Fivetran, Airbyte), warehouses (Snowflake, BigQuery), transform (dbt), and BI (Metabase, Looker). Know where your product fits.",
    sourceUrl: "https://www.getdbt.com/blog/future-of-the-modern-data-stack",
  },
  {
    title: "Study: Query engines — vectorized execution, predicate pushdown, materialized views",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 90,
    description: "How query engines make analytics fast. Vectorized execution processes data in batches, predicate pushdown reduces data scanned, materialized views pre-compute results.",
  },
  {
    title: "Study: Semantic layers — Cube, dbt Semantic Layer, LookML",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 60,
    description: "The semantic layer defines business metrics once and makes them consistent across tools. Compare Cube.dev, dbt metrics, and Looker's LookML approach.",
    sourceUrl: "https://cube.dev/blog/semantic-layer-the-missing-piece-of-the-modern-data-stack",
  },
  {
    title: "Study: Embeddings, vector search, text-to-SQL for BI",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 60,
    description: "The AI-native analytics frontier. Understand how embeddings enable semantic search over data, and how text-to-SQL systems translate natural language to queries.",
  },
  {
    title: "Practice: Draw Business Brain's complete data flow diagram",
    type: "exercise" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 60,
    description: "Whiteboard your product's entire data flow: from data sources through ingestion, storage, transformation, to the user-facing dashboard. Identify bottlenecks.",
  },
  {
    title: "Study: How Metabase, Looker, Tableau, Lightdash are architectured",
    type: "article" as const,
    tier: 1,
    skillArea: "data_architecture",
    estimatedMinutes: 120,
    description: "Reverse-engineer how major BI tools work. Compare their query generation, caching strategies, permission models, and embedding approaches. Know your competitive landscape.",
  },

  // 1.3 — Problem Articulation & Spec Writing
  {
    title: "Writing That Works — Roman & Raphaelson",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 180,
    description: "Concise business writing principles. As a solo founder, every spec, email, and doc you write needs to be crystal clear. This book teaches economy of words.",
    sourceUrl: "https://www.amazon.com/Writing-That-Works-Communicate-Effectively/dp/0060956437",
  },
  {
    title: "Study: Amazon 6-pager format and PRFAQ",
    type: "article" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 60,
    description: "Amazon's 6-pager forces deep thinking over bullet points. The PRFAQ (press release + FAQ) format works backwards from the customer. Both are powerful spec templates.",
    sourceUrl: "https://www.productplan.com/glossary/amazon-prfaq/",
  },
  {
    title: "Study: 10 good RFCs — Stripe API docs, Oxide RFDs, Figma eng blog",
    type: "article" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 120,
    description: "Read world-class technical specs. Stripe's API design docs, Oxide's RFDs, and Figma's engineering blog show how top teams articulate complex technical decisions.",
    sourceUrl: "https://oxide.computer/blog/rfd-1-requests-for-discussion",
  },
  {
    title: "Build your personal spec template",
    type: "exercise" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 45,
    description: "Create your go-to spec template. Include: problem statement, proposed solution, alternatives considered, open questions, success metrics. Use it for every feature.",
  },
  {
    title: "Practice: Write 30 specs in 30 days (20 min each)",
    type: "exercise" as const,
    tier: 1,
    skillArea: "spec_writing",
    estimatedMinutes: 600,
    description: "Build the spec-writing muscle through daily practice. One feature spec per day, 20 minutes max. Volume builds fluency — don't aim for perfection, aim for clarity.",
  },

  // 1.4 — Product Thinking for BI
  {
    title: "Inspired — Marty Cagan",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 360,
    description: "The product management bible. Covers discovery, delivery, and how the best product teams work. Especially relevant: continuous discovery and outcome-driven development.",
    sourceUrl: "https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507",
  },
  {
    title: "Obviously Awesome — April Dunford",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 180,
    description: "A step-by-step framework for product positioning. Helps you nail who your product is for, what makes it different, and how to communicate that — critical for a BI startup.",
    sourceUrl: "https://www.amazon.com/Obviously-Awesome-Product-Positioning-Customers/dp/1999023005",
  },
  {
    title: "The Mom Test — Rob Fitzpatrick",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 120,
    description: "How to talk to customers without leading them. Learn to ask questions that even your mom can't lie about. Essential before building any feature.",
    sourceUrl: "https://www.amazon.com/Mom-Test-customers-business-everyone/dp/1492180742",
  },
  {
    title: "Study: BI buyer personas (analyst, business user, executive, data engineer)",
    type: "article" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 60,
    description: "Map the four key BI personas: their goals, pain points, technical skill, and buying power. Your product must serve at least two well to gain traction.",
  },
  {
    title: "Study: Embedded analytics trend",
    type: "article" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 45,
    description: "Embedded analytics (analytics inside other apps) is the fastest-growing BI segment. Understand iframe vs SDK vs API approaches and the business model implications.",
  },
  {
    title: "Study: AI-native BI — text-to-SQL, anomaly detection, conversational analytics",
    type: "article" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 60,
    description: "The next wave of BI is AI-native. Study text-to-SQL accuracy, automated anomaly detection, and conversational interfaces. This is where your product differentiates.",
  },
  {
    title: "Practice: Write Business Brain positioning statement (Dunford framework)",
    type: "exercise" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 30,
    description: "Using Dunford's positioning canvas, define: competitive alternatives, unique attributes, value, target customer, and market category for Business Brain.",
  },
  {
    title: "Practice: Talk to 5 customers using Mom Test principles",
    type: "exercise" as const,
    tier: 1,
    skillArea: "product_thinking",
    estimatedMinutes: 300,
    description: "Conduct 5 customer interviews using Mom Test principles. Ask about their current workflow, biggest pains, and past attempts to solve them. Don't pitch — listen.",
  },

  // 1.5 — System Design (Applied to BI)
  {
    title: "Fundamentals of Software Architecture — Richards & Ford (Ch 1-8)",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 360,
    description: "Architecture styles (layered, microservices, event-driven) and trade-off analysis. Chapters 1-8 give you the vocabulary to reason about system design decisions.",
    sourceUrl: "https://www.amazon.com/Fundamentals-Software-Architecture-Comprehensive-Characteristics/dp/1492043451",
  },
  {
    title: "A Philosophy of Software Design — Ousterhout",
    type: "book_chapter" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 180,
    description: "Deep modules, information hiding, and complexity management. The best short book on software design — directly applicable to keeping your codebase maintainable as a solo founder.",
    sourceUrl: "https://www.amazon.com/Philosophy-Software-Design-2nd/dp/173210221X",
  },
  {
    title: "Study: Multi-tenancy patterns (shared DB/schema, separate DB, cost vs isolation)",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 90,
    description: "The core architectural decision for any SaaS. Compare shared-everything, schema-per-tenant, and DB-per-tenant. Understand the cost, complexity, and security trade-offs.",
  },
  {
    title: "Study: Query caching and materialization strategies",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 60,
    description: "How to make dashboards load fast. Compare query result caching, materialized views, pre-aggregation (Cube), and client-side caching strategies.",
  },
  {
    title: "Study: Permission models — row-level, column-level, object-level security",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 60,
    description: "BI tools must enforce data access controls. Understand RLS (row-level security), column masking, and object-level permissions — and how they compose in multi-tenant systems.",
  },
  {
    title: "Study: Embed architecture — iframes, SDKs, APIs, auth handoff (JWT, OAuth)",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 60,
    description: "How to embed analytics in customer apps. Compare iframe embedding (simple but limited), SDK embedding (flexible), and API-only (most control). Auth handoff is the tricky part.",
  },
  {
    title: "Study: Event-driven patterns for real-time dashboard updates",
    type: "article" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 45,
    description: "Real-time dashboards need event-driven architecture. Study WebSockets, Server-Sent Events, and polling trade-offs. Understand when real-time is worth the complexity.",
  },
  {
    title: "Practice: Design Business Brain's architecture from scratch",
    type: "exercise" as const,
    tier: 1,
    skillArea: "system_design",
    estimatedMinutes: 90,
    description: "Starting from zero, design the full system architecture for Business Brain. Include data ingestion, storage, query engine, API layer, auth, embedding, and deployment.",
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
    description: "Metrics-driven startup management. Covers the One Metric That Matters (OMTM), lean startup stages, and which metrics to focus on at each stage.",
    sourceUrl: "https://www.amazon.com/Lean-Analytics-Better-Startup-Faster/dp/1449335675",
  },
  {
    title: "Measure What Matters — John Doerr",
    type: "book_chapter" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 240,
    description: "OKR framework from the investor who brought it to Google. Learn to set objectives and key results that actually drive outcomes, not just activity.",
    sourceUrl: "https://www.amazon.com/Measure-What-Matters-Google-Foundation/dp/0525536221",
  },
  {
    title: "Study: SaaS metrics — MRR, ARR, churn, LTV, CAC, NRR, payback period",
    type: "article" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 90,
    description: "Master the core SaaS metrics. Understand how MRR, ARR, churn rate, LTV, CAC, and net revenue retention relate to each other and what 'good' looks like at each stage.",
    sourceUrl: "https://www.saastr.com/saastr-guide-to-saas-metrics/",
  },
  {
    title: "Practice: Build Business Brain's own metrics dashboard (dogfood)",
    type: "exercise" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 120,
    description: "Eat your own cooking. Build a dashboard tracking Business Brain's key metrics: users, activation, engagement, and if applicable, revenue. Use your own product.",
  },
  {
    title: "Practice: Weekly metrics review habit — 30 min every Monday",
    type: "exercise" as const,
    tier: 2,
    skillArea: "metrics",
    estimatedMinutes: 30,
    description: "Establish a weekly ritual: every Monday, spend 30 minutes reviewing your key metrics, noting trends, and deciding what to focus on this week based on data.",
  },

  // 2.2 — Security & Compliance
  {
    title: "Study: OWASP Top 10 — memorize and apply as mental checklist",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 90,
    description: "The ten most critical web application security risks. Memorize them as a mental checklist for every feature you build: injection, broken auth, XSS, CSRF, and more.",
    sourceUrl: "https://owasp.org/www-project-top-ten/",
  },
  {
    title: "Study: SOC2 Type II — requirements, cost, when to start",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 60,
    description: "SOC2 is the enterprise sales gatekeeper. Understand the five trust principles, what Type I vs Type II means, typical cost ($20-50k), and when it becomes a must-have.",
    sourceUrl: "https://www.vanta.com/collection/soc-2/what-is-soc-2",
  },
  {
    title: "Study: Data encryption (at rest/in transit), key management, audit logging, RBAC",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 90,
    description: "Core security building blocks for SaaS. Encryption at rest (AES-256) and in transit (TLS), key management (KMS), audit logging for compliance, and role-based access control.",
  },
  {
    title: "Study: Multi-tenant data isolation — guaranteeing Tenant A never sees Tenant B",
    type: "article" as const,
    tier: 2,
    skillArea: "security",
    estimatedMinutes: 60,
    description: "The #1 security requirement for multi-tenant SaaS. Study row-level security, connection-level isolation, and testing strategies to guarantee data separation.",
  },

  // 2.3 — Cloud Cost Engineering
  {
    title: "Study: Understand your cloud bill line by line",
    type: "article" as const,
    tier: 2,
    skillArea: "cloud_cost",
    estimatedMinutes: 60,
    description: "Stop guessing what you're paying for. Go through your AWS/GCP/Azure bill line by line. Identify the top 5 cost drivers and understand the pricing model for each.",
  },
  {
    title: "Study: Reserved instances, spot, autoscaling, right-sizing, storage tiering",
    type: "article" as const,
    tier: 2,
    skillArea: "cloud_cost",
    estimatedMinutes: 90,
    description: "The five levers for reducing cloud costs. Reserved instances save 30-60%, spot saves 70-90% for interruptible work, autoscaling matches capacity to demand.",
    sourceUrl: "https://aws.amazon.com/aws-cost-management/",
  },
  {
    title: "Study: Query cost models (BigQuery pay-per-scan, etc.)",
    type: "article" as const,
    tier: 2,
    skillArea: "cloud_cost",
    estimatedMinutes: 45,
    description: "Different data warehouses charge differently. BigQuery charges per TB scanned, Snowflake per compute-second, Redshift per node-hour. Know how your users' queries affect your costs.",
  },

  // 2.4 — Testing & Quality Strategy
  {
    title: "Study: Testing pyramid — unit, integration, E2E",
    type: "article" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 45,
    description: "The testing pyramid: many fast unit tests, fewer integration tests, few slow E2E tests. As a solo founder, know where to invest your limited testing time for maximum confidence.",
    sourceUrl: "https://martinfowler.com/articles/practical-test-pyramid.html",
  },
  {
    title: "Study: BI-specific testing — data accuracy, performance regression, permission tests",
    type: "article" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 60,
    description: "BI has unique testing needs. Data accuracy tests verify calculations match expected results. Performance regression catches slow queries. Permission tests verify data isolation.",
  },
  {
    title: "Study: Data quality frameworks — Great Expectations, dbt tests, Soda",
    type: "article" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 60,
    description: "Automated data quality checks catch bad data before it reaches users. Compare Great Expectations (Python), dbt tests (SQL), and Soda (YAML) for data validation pipelines.",
    sourceUrl: "https://docs.getdbt.com/docs/build/data-tests",
  },
  {
    title: "Practice: Define Business Brain's correctness contract",
    type: "exercise" as const,
    tier: 2,
    skillArea: "testing",
    estimatedMinutes: 60,
    description: "Write down what 'correct' means for your product. For each chart type and metric, define the expected behavior, edge cases, and how to test it automatically.",
  },

  // 2.5 — Performance & Observability
  {
    title: "Study: P50/P95/P99 latency — why P99 matters most",
    type: "article" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 30,
    description: "Average latency lies. P50 is the median, P95 affects 1 in 20 users, P99 affects your most engaged users. Dashboard load times must be fast at P95+ to feel snappy.",
  },
  {
    title: "Study: Observability stack — Prometheus, Datadog, structured logging, OpenTelemetry",
    type: "article" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 90,
    description: "You can't improve what you can't see. Set up metrics (Prometheus/Datadog), structured logging (JSON logs), and distributed tracing (OpenTelemetry) from day one.",
    sourceUrl: "https://opentelemetry.io/docs/",
  },
  {
    title: "Study: Performance budgets for dashboards",
    type: "article" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 30,
    description: "Set concrete performance targets: dashboard initial load under 2s, chart render under 500ms, data refresh under 5s. Measure continuously and alert on regressions.",
  },
  {
    title: "Practice: Define SLOs for Business Brain (query latency, render time, data freshness)",
    type: "exercise" as const,
    tier: 2,
    skillArea: "performance",
    estimatedMinutes: 45,
    description: "Write Service Level Objectives for your product. Define acceptable latency, uptime, and data freshness targets. These become the contract with your future customers.",
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
    description: "The definitive guide to venture capital mechanics. Covers term sheets, board seats, liquidation preferences, and how VCs actually think. Read before any fundraise.",
    sourceUrl: "https://www.amazon.com/Venture-Deals-Smarter-Lawyer-Capitalist/dp/1119594820",
  },
  {
    title: "Study: Cap tables, dilution, term sheets",
    type: "article" as const,
    tier: 3,
    skillArea: "fundraising",
    estimatedMinutes: 60,
    description: "Understand how ownership works. Learn cap table math, how dilution compounds across rounds, and what each term sheet clause means for your control and economics.",
    sourceUrl: "https://www.ycombinator.com/library/Mx-a-guide-to-seed-fundraising",
  },
  {
    title: "Practice: Build basic financial model (revenue forecast, burn rate, runway)",
    type: "exercise" as const,
    tier: 3,
    skillArea: "fundraising",
    estimatedMinutes: 120,
    description: "Build a spreadsheet model: monthly revenue forecast, expense breakdown, burn rate, and runway calculation. Every founder should know their numbers cold.",
  },

  // 3.2 — Hiring & Team Topology
  {
    title: "Team Topologies — Skelton & Pais",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "hiring",
    estimatedMinutes: 240,
    description: "How to design team structures that optimize for fast flow of change. Four fundamental team types (stream-aligned, platform, enabling, complicated-subsystem) and when to use each.",
    sourceUrl: "https://www.amazon.com/Team-Topologies-Organizing-Business-Technology/dp/1942788819",
  },
  {
    title: "Study: When to hire first engineer vs keep orchestrating with AI",
    type: "article" as const,
    tier: 3,
    skillArea: "hiring",
    estimatedMinutes: 30,
    description: "The solo AI-native founder's dilemma. Evaluate when the bottleneck is truly headcount vs. when better AI tooling or architecture changes can extend your solo runway.",
  },
  {
    title: "Practice: Write a great job description + structured interview plan",
    type: "exercise" as const,
    tier: 3,
    skillArea: "hiring",
    estimatedMinutes: 60,
    description: "Write a compelling job description for your first engineering hire. Design a structured interview: define the scorecard, create work-sample exercises, and evaluation rubric.",
  },

  // 3.3 — DevOps & CI/CD
  {
    title: "Accelerate — Forsgren, Humble, Kim",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "devops",
    estimatedMinutes: 240,
    description: "Research-backed guide to high-performing engineering organizations. The four key metrics (lead time, deploy frequency, MTTR, change failure rate) you should track from day one.",
    sourceUrl: "https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339",
  },
  {
    title: "Study: CI/CD pipeline — build, test, scan, deploy, smoke test, monitor",
    type: "article" as const,
    tier: 3,
    skillArea: "devops",
    estimatedMinutes: 60,
    description: "Design a complete CI/CD pipeline: build → lint → unit test → integration test → security scan → deploy to staging → smoke test → deploy to production → monitor.",
  },
  {
    title: "Study: Blue/green and canary deployments for zero-downtime",
    type: "article" as const,
    tier: 3,
    skillArea: "devops",
    estimatedMinutes: 30,
    description: "Zero-downtime deployment strategies. Blue/green swaps between two identical environments. Canary gradually shifts traffic. Both prevent 'big bang' deployment failures.",
  },

  // 3.4 — Emerging Tech Radar
  {
    title: "Build personal tech radar (Adopt / Trial / Assess / Hold)",
    type: "exercise" as const,
    tier: 3,
    skillArea: "tech_radar",
    estimatedMinutes: 60,
    description: "Create a ThoughtWorks-style tech radar for your domain. Categorize technologies into Adopt (use now), Trial (experiment), Assess (research), and Hold (avoid). Review quarterly.",
    sourceUrl: "https://www.thoughtworks.com/radar",
  },
  {
    title: "Study: AI agents, text-to-SQL advances, semantic layer evolution",
    type: "article" as const,
    tier: 3,
    skillArea: "tech_radar",
    estimatedMinutes: 60,
    description: "Track the frontier: AI agents that can run analyses autonomously, text-to-SQL accuracy improvements (currently ~85%), and how semantic layers are evolving to support AI.",
  },
  {
    title: "Study: Real-time OLAP engines — ClickHouse, Apache Doris, StarRocks",
    type: "article" as const,
    tier: 3,
    skillArea: "tech_radar",
    estimatedMinutes: 60,
    description: "The new wave of real-time analytical databases. Compare ClickHouse (column-oriented, fast aggregations), Apache Doris (MPP, MySQL-compatible), and StarRocks (vectorized engine).",
    sourceUrl: "https://clickhouse.com/docs",
  },

  // 3.5 — Communication & Storytelling
  {
    title: "Made to Stick — Chip & Dan Heath",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "communication",
    estimatedMinutes: 240,
    description: "Why some ideas stick and others don't. The SUCCESs framework (Simple, Unexpected, Concrete, Credible, Emotional, Stories) applies to pitches, marketing, and team communication.",
    sourceUrl: "https://www.amazon.com/Made-Stick-Ideas-Survive-Others/dp/1400064287",
  },
  {
    title: "The Pyramid Principle — Barbara Minto",
    type: "book_chapter" as const,
    tier: 3,
    skillArea: "communication",
    estimatedMinutes: 180,
    description: "Structure any communication top-down: lead with the answer, then support with grouped arguments. The McKinsey standard for clear business writing and presentations.",
    sourceUrl: "https://www.amazon.com/Pyramid-Principle-Logic-Writing-Thinking/dp/0273710516",
  },
  {
    title: "Practice: Record yourself in meetings, listen back, iterate",
    type: "exercise" as const,
    tier: 3,
    skillArea: "communication",
    estimatedMinutes: 30,
    description: "Record yourself during calls or practice pitches. Listen back for filler words, unclear explanations, and missed points. This is the fastest way to improve verbal communication.",
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
      description: item.description,
      type: item.type,
      tier: item.tier,
      skillArea: item.skillArea,
      estimatedMinutes: item.estimatedMinutes,
      sourceUrl: item.sourceUrl || null,
    });
  }

  console.log(`Done! Seeded ${CURRICULUM.length} learning items across ${skills.length} skill areas.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
