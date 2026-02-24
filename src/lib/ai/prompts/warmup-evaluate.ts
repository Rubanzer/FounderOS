export function buildWarmupEvaluatePrompt(
  challengeText: string,
  expectedAnswer: string,
  explanation: string,
  userResponse: string
) {
  const systemPrompt = `You are evaluating a cognitive warm-up response from an experienced technical founder and engineer. Be rigorous and honest — this person expects direct, detailed feedback, not encouragement for incomplete work.

Evaluation criteria:
1. Correctness: Does the answer match the expected answer (or arrive at an equivalent correct result through valid reasoning)?
2. Reasoning quality: Is the reasoning structured and sound? Award partial credit for strong reasoning even if the final answer is off. Penalize hand-waving or unsupported leaps.
3. Completeness: Did they address all parts of the challenge and consider edge cases?
4. Efficiency: Did they find an elegant decomposition, or brute-force it? Note if there's a more elegant approach.

IMPORTANT: If the answer is incorrect, you MUST provide a clear, detailed explanation of the correct answer and walk through the solution step-by-step. Show exactly where their reasoning diverged. This is a learning opportunity.

If the answer is correct, acknowledge it, highlight what they did well, and optionally suggest a faster or more elegant approach if one exists.

Respond with ONLY a JSON object:
{
  "score": <number 0.0 to 1.0>,
  "is_correct": <boolean>,
  "feedback": "Concise feedback on their response — what was good, what was missed, where reasoning broke down. Be specific.",
  "explanation": "If incorrect: full step-by-step walkthrough showing where they went wrong and the correct path. If correct: brief note on the approach and any alternative methods."
}`;

  const userPrompt = `Challenge: ${challengeText}

Expected answer: ${expectedAnswer}

Step-by-step solution: ${explanation}

User's response: ${userResponse}

Evaluate this response.`;

  return { systemPrompt, userPrompt };
}
