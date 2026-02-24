import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/ai/client";
import { buildWarmupEvaluatePrompt } from "@/lib/ai/prompts/warmup-evaluate";
import { db } from "@/db";
import { cognitiveWarmups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveWarmupResult } from "@/db/queries/warmups";
import { upsertStreakDay } from "@/db/queries/streaks";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { warmupId, userResponse, timeTakenSeconds } = body;

    // Get the challenge from DB
    const rows = await db
      .select()
      .from(cognitiveWarmups)
      .where(eq(cognitiveWarmups.id, warmupId))
      .limit(1);

    const warmup = rows[0];
    if (!warmup) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const { systemPrompt, userPrompt } = buildWarmupEvaluatePrompt(
      warmup.challengeContent,
      warmup.expectedAnswer || "",
      warmup.explanation || "",
      userResponse
    );

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI evaluation" },
        { status: 500 }
      );
    }

    // Save result to DB
    await saveWarmupResult(warmupId, {
      userResponse,
      score: parsed.score,
      isCorrect: parsed.is_correct,
      aiFeedback: parsed.feedback,
      timeTakenSeconds,
    });

    // Mark warmup block complete for today
    const today = new Date().toISOString().split("T")[0];
    await upsertStreakDay(today, ["warmup"]);

    return NextResponse.json({
      score: parsed.score,
      isCorrect: parsed.is_correct,
      feedback: parsed.feedback,
      explanation: parsed.explanation,
      expectedAnswer: warmup.expectedAnswer,
    });
  } catch (error) {
    console.error("Warmup evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate response" },
      { status: 500 }
    );
  }
}
