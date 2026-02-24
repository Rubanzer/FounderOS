import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/ai/client";
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

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

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
  } catch (error: unknown) {
    console.error("Warmup evaluation error:", error);
    const message = error instanceof Error ? error.message : "Failed to evaluate response. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
