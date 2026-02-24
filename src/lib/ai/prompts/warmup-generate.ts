import type { WarmupCategory, DifficultyLevel } from "@/types/warmup";

const CATEGORY_CONTEXT: Record<WarmupCategory, string> = {
  logical_reasoning: `Generate a logical reasoning challenge grounded in real engineering or business scenarios.
Good challenge domains: distributed systems constraint satisfaction (CAP theorem trade-offs, consistency models), resource allocation under competing constraints (team scheduling with skill dependencies), database schema design trade-offs, API versioning compatibility puzzles, dependency resolution conflicts, feature flag rollout logic with segment overlap, multi-variable hiring/org design puzzles, or microservice communication ordering problems.
The problem must require at minimum 2-3 deductive steps. Do NOT generate simple syllogisms, basic if-then chains, or anything a CS undergraduate could solve in under 60 seconds.
Frame in realistic founder/engineering scenarios: designing systems, making architecture decisions, managing trade-offs.`,

  mental_math: `Generate a quantitative reasoning challenge using real SaaS/startup metrics at scale.
Use realistic numbers: MRR in the $50K-$5M range, churn rates 2-8%, CAC $200-$2000, LTV in the thousands, conversion funnels with 4+ stages, cohort analysis with retention curves, blended unit economics across multiple pricing tiers, revenue recognition across annual/monthly mix, expansion revenue vs. contraction.
The calculation should involve 3+ chained operations. Include percentage-of-percentage calculations, weighted averages, compound effects (monthly churn compounding), payback period with multiple variables, or unit economics across segments.
Design so it is solvable without a calculator but requires genuine concentration and structured approach.`,

  estimation_fermi: `Generate a Fermi estimation question that requires structured decomposition into 4+ sub-estimates.
Good domains: sizing a specific B2B SaaS market segment, estimating infrastructure costs for a system at specific scale (e.g., "real-time analytics pipeline processing 10M events/day on AWS"), estimating engineering effort for a complex feature (months, headcount, dependencies), sizing a data warehouse for a company with specific characteristics, estimating cloud compute costs for ML training runs.
The answer should span at least 2 orders of magnitude of plausible range, and the user must build from first principles — break down into population × penetration × usage × price or similar decomposition chains. Avoid questions answerable from common knowledge or a single Google search.`,

  systems_design: `Generate a systems design reasoning challenge that tests architectural thinking.
Good challenge domains: designing the data flow for a specific feature (e.g., real-time collaborative editing, event sourcing for audit logs), choosing between architectural patterns with specific constraints (monolith vs microservices given team size, latency requirements, and consistency needs), capacity planning for a described workload, designing a caching strategy with specific invalidation requirements, schema design trade-offs for a multi-tenant SaaS with specific access patterns.
The challenge should present a concrete scenario with constraints and ask the user to reason about trade-offs, identify the best approach, and justify their decision. There should be a defensible "best" answer given the constraints, not just an open-ended discussion.`,

  strategic_thinking: `Generate a strategic reasoning challenge for a technical founder.
Good challenge domains: competitive response scenarios (a competitor launches feature X, you have Y resources — what do you do and why?), market entry decisions (given these market signals, which segment do you target first?), build vs buy vs partner decisions with specific cost/time/quality trade-offs, pricing strategy puzzles (how to price a product given specific customer segments, willingness to pay, and competitive landscape), resource allocation under uncertainty (limited runway, multiple bets — how do you allocate?).
The challenge should present a realistic business scenario with quantitative and qualitative factors. The user must synthesize multiple dimensions (market, technical, financial, timing) to arrive at a defensible recommendation.`,

  product_sense: `Generate a product reasoning challenge that tests product intuition and analytical thinking.
Good challenge domains: feature prioritization with specific user data (given these usage metrics, engagement funnel, and retention curves — which feature should you build next?), root cause analysis of product metrics (conversion dropped 15% last week — here's the data, diagnose the cause), A/B test analysis (given these results, what do you conclude and what do you do next?), user segmentation puzzles (given these behavioral patterns, define the segments and their needs), trade-off decisions between user experience and technical constraints.
The challenge should provide specific data or scenarios and require structured analysis. Avoid vague "what would you build?" questions — be concrete with numbers and constraints.`,
};

const DIFFICULTY_CONTEXT: Record<DifficultyLevel, string> = {
  1: `Moderate: Multi-step reasoning required. 2-3 interacting constraints that require careful analysis. Comparable to a solid technical interview question at a strong company. Should take an experienced engineer 2-3 minutes of focused thought. Do NOT generate anything solvable in one mental step — every problem must require writing things down or tracking multiple variables.`,

  2: `Hard: Staff/senior-engineer level. Complex systems thinking with multiple interacting variables, trade-off analysis, or multi-variable optimization. Requires creative insight or non-obvious decomposition. Comparable to a systems design interview question at a FAANG company. 3-5 minutes to solve. May involve reasoning about second-order effects or counterintuitive results.`,

  3: `Expert: Principal/staff+ engineer level. Requires novel reasoning under real-world ambiguity, creative problem-solving, or synthesizing across multiple domains (e.g., technical + business + organizational). May involve incomplete information requiring justified assumptions, or problems where the "obvious" approach fails. The kind of problem that separates senior from staff engineers. 5-8 minutes to solve.`,
};

export function buildWarmupGeneratePrompt(category: WarmupCategory, difficulty: DifficultyLevel) {
  const systemPrompt = `You are a cognitive fitness coach for experienced technical founders and engineers. You generate challenges that exercise deep reasoning ability — NOT trivia, NOT textbook exercises, NOT introductory-level problems.

CRITICAL CALIBRATION: The user is an experienced software engineer who builds production systems and thinks about architecture, scale, and trade-offs daily. Your "easiest" difficulty should be harder than most technical interview questions. If a computer science undergraduate could solve it in under 60 seconds, it is TOO EASY. Every challenge must require genuine thought, structured analysis, and careful reasoning.

Rules:
- Challenge must be solvable with reasoning alone (no external knowledge required beyond engineering fundamentals and basic business/SaaS concepts)
- Include enough context in the challenge text — the user has no other reference
- The challenge must have a definitive answer or a clear evaluation rubric
- Make it engaging and grounded in real scenarios, not dry or academic
- Be precise in your wording — ambiguity is a bug, not a feature
- Use realistic numbers, realistic constraints, and realistic trade-offs — not toy examples
- Multi-step problems are the minimum — single-step problems are unacceptable

${CATEGORY_CONTEXT[category]}
${DIFFICULTY_CONTEXT[difficulty]}

Respond with ONLY a JSON object in this exact format:
{
  "challenge_text": "The full challenge text the user will see",
  "time_limit_seconds": <number between 120 and 480>,
  "expected_answer": "The correct answer or a thorough model answer",
  "explanation": "Step-by-step explanation of how to arrive at the answer, showing all reasoning and intermediate steps",
  "hints": ["hint 1 if stuck", "hint 2 for further help"]
}`;

  const userPrompt = `Generate a ${category.replace(/_/g, " ")} challenge at difficulty level ${difficulty}/3.`;

  return { systemPrompt, userPrompt };
}
