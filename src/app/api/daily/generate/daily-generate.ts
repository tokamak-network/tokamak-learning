import type { AnswerRecord } from "@/app/daily/DailyClient";
import { categories, problems, type Problem } from "@/data/problems";

/** Fisher-Yates shuffle, optionally limiting to `count` items */
export function shuffleArray<T>(arr: T[], count?: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return count !== undefined ? a.slice(0, count) : a;
}

/** Extract the educational summary from a problem description */
export function extractLearningSummary(description: string): string {
  const match = description.match(/## What you'll learn\n([\s\S]*?)(?=\n## |\n$)/);
  return match ? match[1].trim().slice(0, 300) : "";
}

/** Determine mastered categories: 70%+ accuracy AND at least 3 answers */
export function getMasteredCategories(history: AnswerRecord[]): Set<string> {
  const stats = new Map<string, { correct: number; total: number }>();
  for (const a of history) {
    if (!a.category) continue;
    const s = stats.get(a.category) ?? { correct: 0, total: 0 };
    s.total++;
    if (a.correct) s.correct++;
    stats.set(a.category, s);
  }
  const mastered = new Set<string>();
  for (const [cat, s] of stats) {
    if (s.total >= 3 && s.correct / s.total >= 0.7) {
      mastered.add(cat);
    }
  }
  return mastered;
}

/** Pick curriculum problems from categories the user hasn't mastered yet */
export function pickCurriculumProblems(mastered: Set<string>, count: number): Problem[] {
  const allCategoryIds = categories.map((c) => c.id);
  const target = allCategoryIds.filter((id) => !mastered.has(id)).length > 0
    ? allCategoryIds.filter((id) => !mastered.has(id))
    : allCategoryIds;
  return shuffleArray(problems.filter((p) => target.includes(p.category)), count);
}

export function trimHistory(history: AnswerRecord[], days: number): AnswerRecord[] {
  const maxAnswers = days * 10;
  return history.length <= maxAnswers ? history : history.slice(-maxAnswers);
}

export function deduplicateWrongAnswers(wrong: AnswerRecord[]): AnswerRecord[] {
  const seen = new Set<string>();
  return wrong.filter((a) => {
    const key = `${a.category}::${a.correctAnswer}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const SYSTEM_MESSAGE = `You are a precise Solidity & Ethereum quiz generator.
Your #1 priority is CORRECTNESS — every question must have exactly one unambiguously correct answer.
EVERY distractor MUST be clearly wrong — if a distractor also produces valid, correct code or is also factually true, the question is DEFECTIVE.
Quality and accuracy are more important than creativity.
You must respond with ONLY valid JSON — no markdown fences, no extra text, no explanation outside the JSON.`;

const validCategories = categories.map((c) => c.id).join(", ");

const CATEGORY_GROUPS: string[][] = [
  ["basics"],
  ["control-flow"],
  ["data-structures"],
  ["advanced"],
  ["patterns"],
];

export function divideCurriculumIntoSections(mastered: Set<string>, sectionCount = 5): Problem[][] {
  return CATEGORY_GROUPS.slice(0, sectionCount).map((groupCategories) => {
    const target = groupCategories.filter((c) => !mastered.has(c)).length > 0
      ? groupCategories.filter((c) => !mastered.has(c))
      : groupCategories;
    return shuffleArray(
      problems.filter((p) => target.includes(p.category)).sort((a, b) => a.order - b.order)
    );
  });
}

const CODE_QUESTION_RULES = `## Role: Senior Solidity Security Auditor & Instructor

## Task:
Generate a fill-in-the-blank quiz question from the provided Solidity code. Select ONE semantically important keyword (not a simple variable name) to replace with \`___BLANK___\`.

## Selection Logic:
The blank MUST be at a position that tests understanding of:
- Solidity keywords with no equivalent: \`mapping\`, \`event\`, \`emit\`, \`modifier\`, \`require\`, \`override\`, \`constructor\`
- Operators with verifiable output: \`*\`, \`/\`, \`%\` (when function name indicates the operation)
- Built-in globals: \`msg.sender\`, \`msg.value\`, \`block.timestamp\` (when context forces exactly one)
- Control flow: \`break\` vs \`continue\` (different loop behavior)
- Array methods: \`push\` (only way to append to dynamic array)

## Distractor Quality:
Distractors must be plausible but WRONG. Good distractors include:
- Similar keywords that don't work in this context
- Old Solidity syntax (pre-0.8.0)
- Common beginner misconceptions
Each distractor MUST cause compilation error, runtime error, or semantic incorrectness.

## ABSOLUTELY BANNED ANSWERS (will be rejected):
1. Visibility modifiers: public, external, internal, private
2. State mutability: view, pure, payable
3. Data locations: memory, calldata, storage
4. Integer types: int, uint, int8, uint8, int256, uint256
5. Comparison operators: >=, >, <=, <
6. Function names or variable names
7. Equivalent mechanisms: super vs ParentName, receive vs fallback, require vs revert

## Self-Verification (MANDATORY):
Before finalizing, verify:
1. Replace ___BLANK___ with answer → MUST compile and behave correctly
2. Replace ___BLANK___ with each distractor → MUST NOT compile or behave incorrectly
If any distractor works, rewrite the question.

## Required Output Format:
- type: "code"
- id: the provided question ID
- category: one of the valid categories
- code: Solidity code with exactly one \`___BLANK___\` marker
- answer: the correct answer (single token or short expression)
- distractors: array of exactly 3 different strings
- explanation: why the answer is correct and why distractors are wrong`;

const CONCEPT_QUESTIONS_RULES = `## CRITICAL CORRECTNESS RULES:

### For concept questions:
1. The \`answer\` must be factually correct and unambiguous.
2. Each distractor must be a FALSE statement. A distractor that is also true, partially true, or a subset/superset of the answer is DEFECTIVE.
3. Do NOT use a more-specific or less-specific version of the answer as a distractor (e.g., if the answer is "Validators", do NOT use "The block proposer" as a distractor since block proposers ARE validators).
4. Concept questions must NOT include a \`code\` field — only \`question\`, \`answer\`, \`distractors\`, and \`explanation\`.

### Required fields for each question:
- type: "concept"
- id: "gen-q1" through "gen-q5"
- category: one of the valid categories (use "basics" for general concepts, "patterns" for DeFi, "advanced" for EVM internals)
- question: the question text
- answer: the correct answer (must NOT appear in distractors)
- distractors: array of exactly 3 strings (all different, non-empty)
- explanation: 1-2 sentences explaining WHY the answer is correct`;

export function buildCodeQuestionPrompt(
  questionId: string,
  curriculumSection: Problem[],
  wrongAnswer?: AnswerRecord
): string {
  const randomProblem = curriculumSection[Math.floor(Math.random() * curriculumSection.length)];
  const inputCodeSection = randomProblem
    ? `\n## Input Code (generate a quiz question from this code):\n\`\`\`solidity\n${randomProblem.solution}\n\`\`\`\n\nCategory: ${randomProblem.category}\nConcept being taught: ${extractLearningSummary(randomProblem.description) || randomProblem.title}\n`
    : "";

  const additionalProblems = curriculumSection
    .filter((p) => p.id !== randomProblem?.id)
    .slice(0, 3)
    .map((p, i) => `### Reference ${i + 1}: ${p.title}\n\`\`\`solidity\n${p.solution.slice(0, 300)}\n\`\`\``)
    .join("\n");

  const weakAreaSection = wrongAnswer
    ? `\n## User's Weak Area (prioritize if similar concept exists):\nThe user got a question wrong recently:\n- Category: ${wrongAnswer.category}\n- Correct answer: "${wrongAnswer.correctAnswer}"\nConsider creating a similar question to reinforce learning.\n`
    : "";

  return `Generate exactly 1 Solidity code question (fill-in-the-blank).

Question ID: ${questionId}
Valid categories: ${validCategories}

${CODE_QUESTION_RULES}

${inputCodeSection}

## Additional Reference Code:
${additionalProblems}
${weakAreaSection}

Respond with ONLY valid JSON (no markdown fences, no extra text):
{
  "id": "${questionId}",
  "questions": [{ ... one question object ... }]
}`;
}

export function buildConceptQuestionsPrompt(pastConcepts: string[]): string {
  const dedupSection = pastConcepts.length > 0
    ? `\n## Previously asked concept questions (DO NOT repeat these):\n${pastConcepts.slice(-20).map((q) => `- "${q}"`).join("\n")}\n`
    : "";

  return `Generate exactly 5 Ethereum Fundamentals concept questions (multiple-choice).

Question IDs: "gen-q1" through "gen-q5"
Valid categories: ${validCategories}

## Topics to cover (choose diverse topics):
- Gas & fees (EIP-1559, gas optimization)
- EVM architecture (opcodes, storage, memory)
- Transaction lifecycle (mempool, inclusion, execution)
- Consensus mechanisms (PoS, validators, finality)
- Account types (EOA vs contract accounts)
- Block structure (gas limit, base fee, transactions)
- Ethereum upgrades (The Merge, EIP-1559, future upgrades)
- L2 scaling (rollups, bridges, state channels)
- DeFi concepts (AMM, flash loans, oracles, liquidity pools)
- Security patterns (reentrancy, access control, upgrades)

${CONCEPT_QUESTIONS_RULES}
${dedupSection}

Respond with ONLY valid JSON (no markdown fences, no extra text):
{
  "id": "generated",
  "questions": [
    {
      "type": "concept",
      "id": "gen-q1",
      "category": "basics",
      "question": "What happens to unused gas after a transaction executes?",
      "answer": "It is refunded to the sender",
      "distractors": ["It is burned permanently", "It goes to the next block's miner", "It is added to the contract balance"],
      "explanation": "Unused gas is refunded to the transaction sender. Only the gas actually consumed is paid to validators."
    }
  ]
}`;
}

export function prepareCodeQuestionData(history: AnswerRecord[]): {
  wrongAnswers: AnswerRecord[];
  mastered: Set<string>;
  curriculumProblems: Problem[];
} {
  const trimmed = trimHistory(history, 14);
  return {
    wrongAnswers: deduplicateWrongAnswers(trimmed.filter((a) => !a.correct)),
    mastered: getMasteredCategories(trimmed),
    curriculumProblems: pickCurriculumProblems(getMasteredCategories(trimmed), 5),
  };
}

export function getPastConcepts(history: AnswerRecord[]): string[] {
  return trimHistory(history, 14)
    .filter((a) => a.type === "concept")
    .map((a) => a.question);
}

const BANNED_PATTERNS = [
  { test: (a: string) => /^u?int\d*$/i.test(a), msg: (a: string) => `banned answer pattern: integer type "${a}" — multiple sizes are usually valid` },
  { test: (a: string) => ["public", "external", "internal", "private"].includes(a.toLowerCase()), msg: (a: string) => `banned answer pattern: visibility "${a}" — multiple modifiers often valid` },
  { test: (a: string) => ["pure", "view", "payable"].includes(a.toLowerCase()), msg: (a: string) => `banned answer pattern: mutability "${a}" — multiple options often compile` },
  { test: (a: string) => ["memory", "calldata", "storage"].includes(a.toLowerCase()), msg: (a: string) => `banned answer pattern: data location "${a}" — memory/calldata often interchangeable` },
  { test: (a: string) => [">=", ">", "<=", "<"].includes(a), msg: (a: string) => `banned answer pattern: comparison "${a}" — >= vs > often both valid depending on interpretation` },
];

export function validateQuestion(q: Record<string, unknown>, validCategoryIds: Set<string>): string | null {
  if (!q.type || !q.id) return "missing type or id";
  if (typeof q.answer !== "string" || !q.answer.trim()) return "missing or empty answer";
  if (typeof q.explanation !== "string" || !q.explanation.trim()) return "missing or empty explanation";

  if (!Array.isArray(q.distractors) || q.distractors.length !== 3) return "distractors not array of 3";
  const distractors = q.distractors as string[];
  for (let i = 0; i < distractors.length; i++) {
    if (typeof distractors[i] !== "string" || !distractors[i].trim()) return `distractor[${i}] is empty or not a string`;
  }

  const answer = (q.answer as string).trim();
  const trimmedDistractors = distractors.map((d) => d.trim());
  if (trimmedDistractors.includes(answer)) return "answer found in distractors";
  if (new Set(trimmedDistractors).size !== 3) return "duplicate distractors";

  if (q.type === "code") {
    if (typeof q.code !== "string") return "code is not a string";
    const code = q.code as string;
    if ((code.match(/___BLANK___/g) || []).length !== 1) return `code has wrong number of blanks (expected 1)`;
    if (answer.length > 80) return `answer too long (${answer.length} chars)`;
    if (answer.includes("\n")) return "answer contains newlines";
    if (/function\s+___BLANK___/.test(code)) return "banned blank position: function name — any identifier works";

    const lower = answer.toLowerCase();
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(answer)) return pattern.msg(answer);
    }

    const words = lower.split(/\s+/);
    const visibilityOrMutability = new Set(["public", "external", "internal", "private", "pure", "view", "payable"]);
    if (words.some((w) => visibilityOrMutability.has(w))) {
      return `banned answer pattern: visibility/mutability "${answer}" — multiple combinations often valid`;
    }
  }

  if (q.type === "concept" && (typeof q.question !== "string" || !q.question.trim())) {
    return "concept question text is empty";
  }

  if (!q.category || !validCategoryIds.has(q.category as string)) {
    q.category = "basics";
  }

  return null;
}
