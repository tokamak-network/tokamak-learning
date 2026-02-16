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
 *   LITELLM_MODEL    - Model name (default: gpt-4o)
 */

import "dotenv/config";
import { categories } from "../src/data/problems";
import {
  buildPrompt,
  SYSTEM_MESSAGE,
  validateQuestion,
} from "../src/app/api/daily/generate/daily-generate";

const LITELLM_API_URL =
  process.env.LITELLM_API_URL || "http://localhost:4000/v1";
const LITELLM_API_KEY = process.env.LITELLM_API_KEY || "";
const LITELLM_MODEL = process.env.LITELLM_MODEL || "gpt-4o";

async function main() {
  if (!LITELLM_API_KEY) {
    console.error("Error: LITELLM_API_KEY is not set.");
    process.exit(1);
  }

  console.log(`Model: ${LITELLM_MODEL}`);
  console.log(`API: ${LITELLM_API_URL}`);
  console.log("Generating 10 questions...\n");

  const prompt = buildPrompt([]);

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
    console.error(`LLM API error: ${response.status} ${errorText}`);
    process.exit(1);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  // Parse JSON (strip thinking tags and markdown fences)
  const jsonStr = content
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/^```(?:json)?\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  let challengeSet;
  try {
    challengeSet = JSON.parse(jsonStr);
  } catch {
    console.error("Failed to parse LLM response as JSON:");
    console.error(jsonStr.slice(0, 500));
    process.exit(1);
  }

  if (!Array.isArray(challengeSet.questions)) {
    console.error("Invalid response: missing questions array");
    process.exit(1);
  }

  // Validate each question
  const validCategoryIds = new Set(categories.map((c) => c.id));
  const valid: Record<string, unknown>[] = [];
  const rejected: { id: string; reason: string }[] = [];

  for (const q of challengeSet.questions) {
    const reason = validateQuestion(q, validCategoryIds);
    if (reason) {
      rejected.push({ id: q.id, reason });
    } else {
      q.answer = (q.answer as string).trim();
      q.distractors = (q.distractors as string[]).map((d: string) => d.trim());
      valid.push(q);
    }
  }

  // Print results
  console.log(`=== Generated ${valid.length} valid questions ===\n`);

  for (const q of valid) {
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

  // Also output full JSON for piping
  console.log("=== Full JSON ===");
  challengeSet.questions = valid;
  console.log(JSON.stringify(challengeSet, null, 2));
}

main();
