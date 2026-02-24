import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/ai/client";
import { buildReflectionPrompt } from "@/lib/ai/prompts/reflection";
import { getTodayWarmup } from "@/db/queries/warmups";
import { getStreakStats } from "@/db/queries/streaks";

export async function POST(req: NextRequest) {
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

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

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
    return NextResponse.json(
      { error: "Failed to generate reflection prompt" },
      { status: 500 }
    );
  }
}
