import { NextRequest, NextResponse } from "next/server";
import type { AnswerRecord } from "@/app/daily/DailyClient";
import { categories } from "@/data/problems";
import {
  buildPrompt,
  SYSTEM_MESSAGE,
  validateQuestion,
} from "./daily-generate";

const LITELLM_API_URL =
  process.env.LITELLM_API_URL || "http://localhost:4000/v1";
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || "";
const LITELLM_MODEL = process.env.LITELLM_MODEL || "gpt-4o";

export async function POST(req: NextRequest) {
  try {
    if (!LITELLM_API_KEY) {
      return NextResponse.json(
        { error: "LITELLM_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const history: AnswerRecord[] = body.history ?? [];

    const prompt = buildPrompt(history);

    const response = await fetch(`${LITELLM_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LITELLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LITELLM_MODEL,
        messages: [
          { role: "system", content: SYSTEM_MESSAGE },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
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

    // Parse JSON from LLM response (strip thinking tags and markdown fences)
    const jsonStr = content
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/^```(?:json)?\s*/, "")
      .replace(/\s*```$/, "")
      .trim();
    const challengeSet = JSON.parse(jsonStr);

    if (!challengeSet.questions || !Array.isArray(challengeSet.questions)) {
      return NextResponse.json(
        { error: "Invalid response format from LLM" },
        { status: 502 }
      );
    }

    const validCategoryIds = new Set(categories.map((c) => c.id));

    // Validate each question with detailed checks
    const validQuestions: Record<string, unknown>[] = [];
    for (const q of challengeSet.questions) {
      const reason = validateQuestion(q, validCategoryIds);
      if (reason) {
        console.warn(`[daily/generate] Rejected question ${q.id}: ${reason}`);
      } else {
        // Trim whitespace from answer and distractors
        q.answer = (q.answer as string).trim();
        q.distractors = (q.distractors as string[]).map((d: string) =>
          d.trim()
        );
        validQuestions.push(q);
      }
    }

    challengeSet.questions = validQuestions;

    if (challengeSet.questions.length === 0) {
      return NextResponse.json(
        { error: "LLM generated no valid questions" },
        { status: 502 }
      );
    }

    return NextResponse.json({ challengeSet });
  } catch (err) {
    return NextResponse.json(
      {
        error: `Server error: ${err instanceof Error ? err.message : "Unknown"}`,
      },
      { status: 500 }
    );
  }
}
