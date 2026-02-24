export function buildReflectionPrompt(todaySummary: {
  warmupDone: boolean;
  warmupCategory?: string;
  warmupScore?: number;
  learningDone: boolean;
  learningTopics?: string[];
  currentStreak: number;
  timeSpentMinutes?: number;
}) {
  const systemPrompt = `You are a reflective coach for a technical founder building a BI platform (Business Brain). Generate ONE thought-provoking reflection question based on their day.

Rules:
- Be specific to their activity, not generic
- Push self-awareness and deeper thinking
- Keep it concise — one clear question
- Vary between: learning connections, cognitive performance, strategic thinking, personal growth
- Don't be sycophantic or overly encouraging

Respond with ONLY a JSON object:
{
  "prompt": "The reflection question",
  "context": "Brief note on why this question is relevant today"
}`;

  const parts: string[] = [];

  if (todaySummary.warmupDone) {
    parts.push(
      `Completed a ${todaySummary.warmupCategory?.replace(/_/g, " ")} warm-up (score: ${todaySummary.warmupScore !== undefined ? `${Math.round(todaySummary.warmupScore * 100)}%` : "N/A"})`
    );
  }

  if (todaySummary.learningDone && todaySummary.learningTopics?.length) {
    parts.push(`Studied: ${todaySummary.learningTopics.join(", ")}`);
  }

  parts.push(`Current streak: ${todaySummary.currentStreak} days`);

  if (todaySummary.timeSpentMinutes) {
    parts.push(`Time invested today: ${todaySummary.timeSpentMinutes} minutes`);
  }

  const userPrompt = `Today's activity:\n${parts.map((p) => `- ${p}`).join("\n")}\n\nGenerate a reflection question.`;

  return { systemPrompt, userPrompt };
}
