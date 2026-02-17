/**
 * CLI script to generate 10 daily challenge questions.
 *
 * Usage:
 *   npx tsx scripts/generate-daily.ts
 *   npm run generate-daily
 *
 * Environment variables (reads from .env):
 *   LITELLM_API_URL  - LLM API endpoint (default: http://localhost:4000/v1)
 *   LITELLM_API_KEY  - API key (required)
 *   LITELLM_MODEL    - Model name (default: minimax-m2.5)
 */

import "dotenv/config";
import { categories } from "../src/data/problems";
import {
  buildCodeQuestionPrompt,
  buildConceptQuestionsPrompt,
  prepareCodeQuestionData,
  getPastConcepts,
  divideCurriculumIntoSections,
  shuffleArray,
  SYSTEM_MESSAGE,
  validateQuestion,
} from "../src/app/api/daily/generate/daily-generate";

const LITELLM_API_URL =
  process.env.LITELLM_API_URL || "http://localhost:4000/v1";
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || "";
const LITELLM_MODEL = process.env.LITELLM_MODEL || "minimax-m2.5";

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

async function main() {
  if (!LITELLM_API_KEY) {
    console.error("Error: LITELLM_API_KEY is not set.");
    process.exit(1);
  }

  console.log(`Model: ${LITELLM_MODEL}`);
  console.log(`API: ${LITELLM_API_URL}`);
  console.log("Generating questions with 6 parallel LLM calls...\n");

  const { wrongAnswers, mastered } = prepareCodeQuestionData([]);
  const pastConcepts = getPastConcepts([]);
  const validCategoryIds = new Set(categories.map((c) => c.id));

  const curriculumSections = divideCurriculumIntoSections(mastered, 5);
  console.log("Curriculum sections:");
  curriculumSections.forEach((section, i) => {
    const categories = [...new Set(section.map((p) => p.category))];
    console.log(`  Section ${i + 1}: ${section.length} problems from [${categories.join(", ")}]`);
  });
  console.log();

  const codeQuestionIds = ["gen-c1", "gen-c2", "gen-c3", "gen-c4", "gen-c5"];
  const codePrompts = codeQuestionIds.map((id, index) => {
    const section = curriculumSections[index];
    const wrongAnswer = wrongAnswers[index];
    return buildCodeQuestionPrompt(id, section, wrongAnswer);
  });

  const conceptPrompt = buildConceptQuestionsPrompt(pastConcepts);

  const allPrompts = [...codePrompts, conceptPrompt];
  const results = await Promise.all(allPrompts.map(callLLM));

  const allQuestions: Record<string, unknown>[] = [];
  const rejected: { id: string; reason: string }[] = [];
  const codeQuestions = results.slice(0, 5).flat();
  const conceptQuestions = results[5] || [];

  for (const q of codeQuestions) {
    const reason = validateQuestion(q, validCategoryIds);
    if (reason) {
      rejected.push({ id: String(q.id), reason });
    } else {
      q.answer = (q.answer as string).trim();
      q.distractors = (q.distractors as string[]).map((d: string) => d.trim());
      allQuestions.push(q);
    }
  }

  for (const q of conceptQuestions) {
    const reason = validateQuestion(q, validCategoryIds);
    if (reason) {
      rejected.push({ id: String(q.id), reason });
    } else {
      q.answer = (q.answer as string).trim();
      q.distractors = (q.distractors as string[]).map((d: string) => d.trim());
      allQuestions.push(q);
    }
  }

  const shuffledQuestions = shuffleArray(allQuestions);

  console.log(`=== Generated ${shuffledQuestions.length} valid questions ===\n`);

  for (const q of shuffledQuestions) {
    const record = q as Record<string, string | string[]>;
    if (record.type === "code") {
      console.log(`[${record.id}] CODE (${record.category})`);
      console.log(`  Code: ${(record.code as string).replace(/\n/g, "\\n").slice(0, 100)}...`);
      console.log(`  Answer: ${record.answer}`);
      console.log(`  Distractors: ${(record.distractors as string[]).join(", ")}`);
    } else {
      console.log(`[${record.id}] CONCEPT (${record.category})`);
      console.log(`  Q: ${record.question}`);
      console.log(`  Answer: ${record.answer}`);
      console.log(`  Distractors: ${(record.distractors as string[]).join(", ")}`);
    }
    console.log(`  Explanation: ${record.explanation}`);
    console.log();
  }

  if (rejected.length > 0) {
    console.log(`=== ${rejected.length} rejected questions ===`);
    for (const r of rejected) {
      console.log(`  ${r.id}: ${r.reason}`);
    }
    console.log();
  }

  console.log("=== Full JSON ===");
  const challengeSet = {
    id: "generated",
    questions: shuffledQuestions,
  };
  console.log(JSON.stringify(challengeSet, null, 2));
}

main();
