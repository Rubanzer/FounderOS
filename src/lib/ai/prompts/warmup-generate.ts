import type { WarmupCategory, DifficultyLevel } from "@/types/warmup";

const CATEGORY_CONTEXT: Record<WarmupCategory, string> = {
  logical_reasoning: `Generate a logical reasoning challenge relevant to a BI startup founder.
This should test deductive reasoning, constraint satisfaction, or logical analysis.
Frame it in a business context (founder meetings, hiring puzzles, product logic, resource allocation).
Do NOT make it a simple math problem — it should require careful logical thinking.`,

  mental_math: `Generate a mental math challenge using SaaS and business metrics.
Use realistic numbers for: MRR, ARR, churn rate, LTV, CAC, payback period, conversion rates, revenue growth.
The user should be able to solve this WITHOUT a calculator — design for mental computation.
Frame it as a real scenario a BI founder would encounter.`,

  estimation_fermi: `Generate a Fermi estimation question relevant to the BI/analytics/SaaS industry.
This should require structured guessing and order-of-magnitude thinking.
Examples: market sizing, TAM estimates, infrastructure costs, user behavior estimation.
The answer should be estimatable through logical decomposition, not known from memory.`,
};

const DIFFICULTY_CONTEXT: Record<DifficultyLevel, string> = {
  1: "Easy: Single-step reasoning. Clear constraints. One correct approach. Suitable for warm-up.",
  2: "Medium: Multi-step reasoning. Some ambiguity. Requires careful thought. 2-3 minutes to solve.",
  3: "Hard: Complex constraints. Multiple interacting variables. May have non-obvious insights. 3-5 minutes to solve.",
};

export function buildWarmupGeneratePrompt(category: WarmupCategory, difficulty: DifficultyLevel) {
  const systemPrompt = `You are a cognitive fitness coach for technical founders. You generate challenges that exercise raw thinking ability — NOT trivia, NOT knowledge tests. The goal is to make the founder THINK.

Rules:
- Challenge must be solvable with reasoning alone (no external knowledge required beyond basic business concepts)
- Include enough context in the challenge text — the user has no other reference
- The challenge must have a definitive answer or a clear evaluation rubric
- Make it engaging and business-relevant, not dry or academic
- Be precise in your wording — ambiguity is a bug, not a feature

${CATEGORY_CONTEXT[category]}
${DIFFICULTY_CONTEXT[difficulty]}

Respond with ONLY a JSON object in this exact format:
{
  "challenge_text": "The full challenge text the user will see",
  "time_limit_seconds": <number between 60 and 300>,
  "expected_answer": "The correct answer or a thorough model answer",
  "explanation": "Step-by-step explanation of how to arrive at the answer, showing all reasoning and intermediate steps",
  "hints": ["hint 1 if stuck", "hint 2 for further help"]
}`;

  const userPrompt = `Generate a ${category.replace(/_/g, " ")} challenge at difficulty level ${difficulty}/3.`;

  return { systemPrompt, userPrompt };
}
