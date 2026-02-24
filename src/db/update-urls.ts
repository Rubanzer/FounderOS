import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { learningItems } from "./schema/learning-items";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Only items where sourceUrl changed or was added
const URL_UPDATES: Record<string, string> = {
  "Study: Query engines — vectorized execution, predicate pushdown, materialized views":
    "https://www.cockroachlabs.com/blog/how-we-built-a-vectorized-execution-engine/",
  "Study: Semantic layers — Cube, dbt Semantic Layer, LookML":
    "https://atlan.com/know/semantic-layer/",
  "Study: Embeddings, vector search, text-to-SQL for BI":
    "https://vanna.ai/blog/ai-sql-accuracy.html",
  "Study: How Metabase, Looker, Tableau, Lightdash are architectured":
    "https://www.holistics.io/blog/best-embedded-analytics-tools/",
  "Study: BI buyer personas (analyst, business user, executive, data engineer)":
    "https://www.gooddata.com/blog/what-embedded-analytics/",
  "Study: Embedded analytics trend":
    "https://embeddable.com/blog/what-is-embedded-analytics",
  "Study: AI-native BI — text-to-SQL, anomaly detection, conversational analytics":
    "https://www.numbersstation.ai/text-to-sql/",
  "Study: Multi-tenancy patterns (shared DB/schema, separate DB, cost vs isolation)":
    "https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns",
  "Study: Query caching and materialization strategies":
    "https://cube.dev/blog/query-caching-with-cube",
  "Study: Permission models — row-level, column-level, object-level security":
    "https://www.postgresql.org/docs/current/ddl-rowsecurity.html",
  "Study: Embed architecture — iframes, SDKs, APIs, auth handoff (JWT, OAuth)":
    "https://www.yellowfinbi.com/blog/api-sdk-iframes-practical-guide-to-embedding-business-intelligence",
  "Study: Event-driven patterns for real-time dashboard updates":
    "https://ably.com/topic/websockets-vs-sse",
  "Study: SaaS metrics — MRR, ARR, churn, LTV, CAC, NRR, payback period":
    "https://stripe.com/resources/more/essential-saas-metrics",
  "Study: Data encryption (at rest/in transit), key management, audit logging, RBAC":
    "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html",
  "Study: Multi-tenant data isolation — guaranteeing Tenant A never sees Tenant B":
    "https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/re-defining-multi-tenancy.html",
  "Study: Understand your cloud bill line by line":
    "https://aws.amazon.com/aws-cost-management/",
  "Study: Query cost models (BigQuery pay-per-scan, etc.)":
    "https://cloud.google.com/bigquery/pricing",
  "Study: BI-specific testing — data accuracy, performance regression, permission tests":
    "https://docs.getdbt.com/docs/build/data-tests",
  "Study: P50/P95/P99 latency — why P99 matters most":
    "https://aerospike.com/blog/what-is-p99-latency/",
  "Study: Performance budgets for dashboards":
    "https://web.dev/articles/performance-budgets-101",
  "Study: When to hire first engineer vs keep orchestrating with AI":
    "https://www.ycombinator.com/library/8h-how-to-hire-your-first-engineer",
  "Study: CI/CD pipeline — build, test, scan, deploy, smoke test, monitor":
    "https://docs.github.com/en/actions/about-github-actions/understanding-github-actions",
  "Study: Blue/green and canary deployments for zero-downtime":
    "https://martinfowler.com/bliki/BlueGreenDeployment.html",
  "Study: AI agents, text-to-SQL advances, semantic layer evolution":
    "https://arxiv.org/abs/2406.08426",
};

async function updateUrls() {
  console.log("Updating learning items with new/fixed source URLs...");

  let updated = 0;
  for (const [title, sourceUrl] of Object.entries(URL_UPDATES)) {
    await db
      .update(learningItems)
      .set({ sourceUrl })
      .where(eq(learningItems.title, title));
    updated++;
    console.log(`  ✓ ${title}`);
  }

  console.log(`\nUpdated ${updated} items.`);
  process.exit(0);
}

updateUrls().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
