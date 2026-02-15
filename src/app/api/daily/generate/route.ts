import { NextRequest, NextResponse } from "next/server";
import type { AnswerRecord } from "@/app/daily/DailyClient";
import { categories, problems, type Problem } from "@/data/problems";

const LITELLM_API_URL = process.env.LITELLM_API_URL || "http://localhost:4000/v1";
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || "";
const LITELLM_MODEL = process.env.LITELLM_MODEL || "gpt-4o";

/** Pick random items from an array */
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Extract the educational summary from a problem description (the part after "What you'll learn") */
function extractLearningSummary(description: string): string {
  const match = description.match(/## What you'll learn\n([\s\S]*?)(?=\n## |\n$)/);
  if (!match) return "";
  return match[1].trim().slice(0, 300);
}

/** Pick curriculum problems from categories the user hasn't mastered yet */
function pickCurriculumProblems(correctCategories: Set<string>, count: number): Problem[] {
  const allCategoryIds = categories.map((c) => c.id);
  // Exclude categories the user already got right
  const remainingCategories = allCategoryIds.filter((id) => !correctCategories.has(id));
  // If user got everything right, pick from all categories
  const targetCategories = remainingCategories.length > 0 ? remainingCategories : allCategoryIds;

  const candidateProblems = problems.filter((p) => targetCategories.includes(p.category));
  return pickRandom(candidateProblems, count);
}

function buildPrompt(history: AnswerRecord[]) {
  const wrongAnswers = history.filter((a) => !a.correct);
  const rightAnswers = history.filter((a) => a.correct);

  let historySection = "";

  // Wrong answers: generate similar questions on same topics
  if (wrongAnswers.length > 0) {
    historySection += `\n## Questions the user got WRONG (generate similar questions on these topics):\n`;
    for (const a of wrongAnswers) {
      if (a.type === "code") {
        historySection += `- [${a.category}] Code question: \`${a.question.replace(/\n/g, " ").slice(0, 120)}...\`\n  Correct answer: "${a.correctAnswer}", User answered: "${a.userAnswer}"\n`;
      } else {
        historySection += `- [${a.category}] Concept question: "${a.question}"\n  Correct answer: "${a.correctAnswer}", User answered: "${a.userAnswer}"\n`;
      }
    }
  }

  // Right answers: pick curriculum problems from OTHER categories and ask LLM to create variations
  const correctCategories = new Set(rightAnswers.map((a) => a.category).filter(Boolean));
  const curriculumProblems = pickCurriculumProblems(correctCategories, 5);

  if (curriculumProblems.length > 0) {
    historySection += `\n## Curriculum problems to use as inspiration for NEW questions:\n`;
    historySection += `The user already knows: ${[...correctCategories].join(", ")}.\n`;
    historySection += `Use the concepts and code below to create BOTH code fill-in-the-blank AND concept multiple-choice questions. Do NOT reuse questions from the history above.\n\n`;
    for (const p of curriculumProblems) {
      const summary = extractLearningSummary(p.description);
      historySection += `### ${p.title} [category: ${p.category}]\n`;
      if (summary) {
        historySection += `Concept: ${summary}\n`;
      }
      historySection += `Hints: ${p.hints.join(" | ")}\n`;
      historySection += `Solution code:\n\`\`\`solidity\n${p.solution.slice(0, 500)}\n\`\`\`\n\n`;
    }
  }

  return `You are a Solidity & Ethereum quiz generator for a learning platform.

Generate a set of 10 quiz questions (5 code fill-in-the-blank + 5 concept multiple choice) based on the user's previous performance.

Rules:
- For questions the user got WRONG, generate similar questions on the same topics to help them practice.
- For the curriculum problems provided, use them as inspiration to create BOTH code and concept questions. Use the solution code for code fill-in-the-blank questions, and use the concept descriptions/hints for concept multiple-choice questions.
- IMPORTANT: Concept questions must be NEW and different from any concept questions shown in the history. Base them on the curriculum concepts provided, not on previously asked questions.
- Each question must have exactly 1 correct answer and 3 plausible distractors.
- Code questions must contain exactly one \`___BLANK___\` marker where the answer goes.
- Code should be valid Solidity (^0.8.0).
- Explanations should be educational and concise (1-2 sentences).
- Question IDs should follow the pattern: "gen-c1" through "gen-c5" for code, "gen-q1" through "gen-q5" for concept.
- Each question MUST include a "category" field matching one of: ${categories.map((c) => c.id).join(", ")}.

${historySection}

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "id": "generated",
  "questions": [
    {
      "type": "code",
      "id": "gen-c1",
      "category": "basics",
      "code": "pragma solidity ^0.8.0;\\n\\ncontract Example {\\n    uint256 public value;\\n\\n    function set(uint256 _v) public {\\n        value ___BLANK___ _v;\\n    }\\n}",
      "answer": "=",
      "distractors": ["==", "+=", ":="],
      "explanation": "The = operator assigns the value of _v to the state variable."
    },
    {
      "type": "concept",
      "id": "gen-q1",
      "category": "variables",
      "question": "What does the 'view' modifier indicate?",
      "answer": "The function only reads state",
      "distractors": ["The function modifies state", "The function costs no gas", "The function is private"],
      "explanation": "The view modifier means the function reads but does not modify blockchain state."
    }
  ]
}`;
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_DEBUG !== "true") {
      return NextResponse.json(
        { error: "Debug mode is not enabled" },
        { status: 403 }
      );
    }

    if (!LITELLM_API_KEY) {
      return NextResponse.json(
        { error: "LITELLM_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const history: AnswerRecord[] = body.history ?? [];

    if (history.length === 0) {
      return NextResponse.json(
        { error: "No answer history provided" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(history);

    const response = await fetch(`${LITELLM_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LITELLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LITELLM_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `LLM API error: ${response.status} ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    // Parse the JSON from LLM response (strip thinking tags and markdown fences if present)
    const jsonStr = content
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/^```(?:json)?\s*/, "")
      .replace(/\s*```$/, "")
      .trim();
    const challengeSet = JSON.parse(jsonStr);

    // Basic validation
    if (!challengeSet.questions || !Array.isArray(challengeSet.questions)) {
      return NextResponse.json(
        { error: "Invalid response format from LLM" },
        { status: 502 }
      );
    }

    const validCategoryIds = new Set(categories.map((c) => c.id));

    // Filter out invalid questions instead of failing the entire request
    challengeSet.questions = challengeSet.questions.filter((q: Record<string, unknown>) => {
      if (!q.type || !q.id || !q.answer || !q.distractors || !q.explanation) return false;
      if (q.type === "code" && !(q.code as string)?.includes("___BLANK___")) return false;
      if (q.type === "concept" && !q.question) return false;
      // Validate category — default to "basics" if missing or invalid
      if (!q.category || !validCategoryIds.has(q.category as string)) {
        q.category = "basics";
      }
      return true;
    });

    if (challengeSet.questions.length === 0) {
      return NextResponse.json(
        { error: "LLM generated no valid questions" },
        { status: 502 }
      );
    }

    return NextResponse.json({ challengeSet });
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${err instanceof Error ? err.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
