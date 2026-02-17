import { NextRequest, NextResponse } from "next/server";
import type { AnswerRecord } from "@/app/daily/DailyClient";
import { categories } from "@/data/problems";
import {
  buildCodeQuestionPrompt,
  buildConceptQuestionsPrompt,
  prepareCodeQuestionData,
  getPastConcepts,
  divideCurriculumIntoSections,
  shuffleArray,
  SYSTEM_MESSAGE,
  validateQuestion,
} from "./daily-generate";

const LITELLM_API_URL =
  process.env.LITELLM_API_URL || "http://localhost:4000/v1";
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || "";
const LITELLM_MODEL = process.env.LITELLM_MODEL || "gpt-4o";

const MAX_RETRIES = 2;

async function callLLM(prompt: string): Promise<Record<string, unknown>[]> {
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
    throw new Error(`LLM API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  const jsonStr = content
    .replace(/<think[\s\S]*?<\/think>/g, "")
    .replace(/^```(?:json)?\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
  const parsed = JSON.parse(jsonStr);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Invalid response format from LLM");
  }

  return parsed.questions;
}

async function generateWithRetry(
  prompt: string,
  questionId: string,
  validCategoryIds: Set<string>,
  retries: number = MAX_RETRIES
): Promise<Record<string, unknown> | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const questions = await callLLM(prompt);
      const q = questions[0];
      
      if (!q) {
        console.warn(`[daily/generate] No question returned for ${questionId} (attempt ${attempt + 1})`);
        continue;
      }

      const reason = validateQuestion(q, validCategoryIds);
      if (reason) {
        console.warn(`[daily/generate] Rejected ${questionId} (attempt ${attempt + 1}): ${reason}`);
        continue;
      }

      q.answer = (q.answer as string).trim();
      q.distractors = (q.distractors as string[]).map((d: string) => d.trim());
      return q;
    } catch (err) {
      console.warn(`[daily/generate] Error for ${questionId} (attempt ${attempt + 1}): ${err}`);
    }
  }
  return null;
}

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

    const { wrongAnswers, mastered } = prepareCodeQuestionData(history);
    const pastConcepts = getPastConcepts(history);
    const validCategoryIds = new Set(categories.map((c) => c.id));

    const curriculumSections = divideCurriculumIntoSections(mastered, 5);

    const codeQuestionIds = ["gen-c1", "gen-c2", "gen-c3", "gen-c4", "gen-c5"];
    const codePrompts = codeQuestionIds.map((id, index) => {
      const section = curriculumSections[index];
      const wrongAnswer = wrongAnswers[index];
      return buildCodeQuestionPrompt(id, section, wrongAnswer);
    });

    const conceptPrompt = buildConceptQuestionsPrompt(pastConcepts);

    const codeResults = await Promise.all(
      codePrompts.map((prompt, index) =>
        generateWithRetry(prompt, codeQuestionIds[index], validCategoryIds)
      )
    );

    const conceptQuestions = await callLLM(conceptPrompt);

    const allQuestions: Record<string, unknown>[] = [];

    for (const q of codeResults) {
      if (q) {
        allQuestions.push(q);
      }
    }

    for (const q of conceptQuestions) {
      const reason = validateQuestion(q, validCategoryIds);
      if (reason) {
        console.warn(`[daily/generate] Rejected concept question ${q.id}: ${reason}`);
      } else {
        q.answer = (q.answer as string).trim();
        q.distractors = (q.distractors as string[]).map((d: string) => d.trim());
        allQuestions.push(q);
      }
    }

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: "LLM generated no valid questions" },
        { status: 502 }
      );
    }

    const shuffledQuestions = shuffleArray(allQuestions);

    const challengeSet = {
      id: "generated",
      questions: shuffledQuestions,
    };

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
