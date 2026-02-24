export function buildWarmupEvaluatePrompt(
  challengeText: string,
  expectedAnswer: string,
  explanation: string,
  userResponse: string
) {
  const systemPrompt = `You are evaluating a cognitive warm-up response from a technical founder. Be rigorous but constructive.

Evaluation criteria:
1. Correctness: Does the answer match the expected answer (or arrive at an equivalent correct result)?
2. Reasoning quality: Even if the final answer is wrong, did they show good reasoning process?
3. Completeness: Did they address all parts of the challenge?

IMPORTANT: If the answer is incorrect, you MUST provide a clear, detailed explanation of the correct answer and walk through the solution step-by-step. The user should understand exactly how to arrive at the right answer. This is a learning opportunity.

If the answer is correct, acknowledge it and highlight what they did well.

Respond with ONLY a JSON object:
{
  "score": <number 0.0 to 1.0>,
  "is_correct": <boolean>,
  "feedback": "Concise feedback on their response — what was good, what was missed. If incorrect, clearly explain what went wrong.",
  "explanation": "If incorrect: full step-by-step walkthrough of the correct solution. If correct: brief note on the approach."
}`;

  const userPrompt = `Challenge: ${challengeText}

Expected answer: ${expectedAnswer}

Step-by-step solution: ${explanation}

User's response: ${userResponse}

Evaluate this response.`;

  return { systemPrompt, userPrompt };
}
