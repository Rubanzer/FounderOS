import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/ai/client";
import { buildReflectionPrompt } from "@/lib/ai/prompts/reflection";
import { getTodayWarmup } from "@/db/queries/warmups";
import { getStreakStats } from "@/db/queries/streaks";

export async function POST() {
  try {
    // Gather today's context
    const [todayWarmup, streakStats] = await Promise.all([
      getTodayWarmup(),
      getStreakStats(),
    ]);

    const summary = {
      warmupDone: !!todayWarmup?.score,
      warmupCategory: todayWarmup?.category,
      warmupScore: todayWarmup?.score ?? undefined,
      learningDone: false,
      learningTopics: [] as string[],
      currentStreak: streakStats.currentStreak,
    };

    const { systemPrompt, userPrompt } = buildReflectionPrompt(summary);

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      // Fallback: use the raw text as the prompt
      parsed = {
        prompt: text.trim(),
        context: "Based on your day's activities",
      };
    }

    return NextResponse.json({
      prompt: parsed.prompt,
      context: parsed.context,
    });
  } catch (error) {
    console.error("Reflection generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate reflection prompt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
