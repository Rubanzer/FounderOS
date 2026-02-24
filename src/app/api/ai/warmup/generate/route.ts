import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/ai/client";
import { buildWarmupGeneratePrompt } from "@/lib/ai/prompts/warmup-generate";
import { saveWarmupChallenge, calculateAdaptiveDifficulty } from "@/db/queries/warmups";
import type { WarmupCategory, DifficultyLevel } from "@/types/warmup";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = body.category as WarmupCategory;
    let difficulty = (body.difficulty || 1) as DifficultyLevel;

    // Calculate adaptive difficulty
    const adaptedDifficulty = await calculateAdaptiveDifficulty(category, difficulty);
    difficulty = adaptedDifficulty;

    const { systemPrompt, userPrompt } = buildWarmupGeneratePrompt(category, difficulty);

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

    // Parse JSON from response (handle potential markdown wrapping)
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // Save to database
    const saved = await saveWarmupChallenge({
      date: today,
      category,
      difficultyLevel: difficulty,
      challengeContent: parsed.challenge_text,
      expectedAnswer: parsed.expected_answer,
      explanation: parsed.explanation,
      timeLimitSeconds: parsed.time_limit_seconds || 180,
    });

    return NextResponse.json({
      id: saved.id,
      challengeText: parsed.challenge_text,
      timeLimitSeconds: parsed.time_limit_seconds || 180,
      category,
      difficultyLevel: difficulty,
      hints: parsed.hints || [],
    });
  } catch (error: unknown) {
    console.error("Warmup generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate challenge. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
