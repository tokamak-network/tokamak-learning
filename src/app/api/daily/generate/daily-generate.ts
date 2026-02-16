import type { AnswerRecord } from "@/app/daily/DailyClient";
import { categories, problems, type Problem } from "@/data/problems";

/** Fisher-Yates shuffle — pick `count` random items from an array */
export function pickRandom<T>(arr: T[], count: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

/** Extract the educational summary from a problem description */
export function extractLearningSummary(description: string): string {
  const match = description.match(
    /## What you'll learn\n([\s\S]*?)(?=\n## |\n$)/
  );
  if (!match) return "";
  return match[1].trim().slice(0, 300);
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
export function pickCurriculumProblems(
  mastered: Set<string>,
  count: number
): Problem[] {
  const allCategoryIds = categories.map((c) => c.id);
  const remaining = allCategoryIds.filter((id) => !mastered.has(id));
  const target = remaining.length > 0 ? remaining : allCategoryIds;
  const candidates = problems.filter((p) => target.includes(p.category));
  return pickRandom(candidates, count);
}

/** Keep only the most recent 14 days of history */
export function trimHistory(
  history: AnswerRecord[],
  days: number
): AnswerRecord[] {
  const maxAnswers = days * 10;
  if (history.length <= maxAnswers) return history;
  return history.slice(-maxAnswers);
}

/** Deduplicate wrong answers by category+question to avoid repetitive prompt content */
export function deduplicateWrongAnswers(
  wrong: AnswerRecord[]
): AnswerRecord[] {
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

export function buildPrompt(history: AnswerRecord[]) {
  const trimmed = trimHistory(history, 14);
  const wrongAnswers = deduplicateWrongAnswers(
    trimmed.filter((a) => !a.correct)
  );
  const mastered = getMasteredCategories(trimmed);
  const curriculumProblems = pickCurriculumProblems(mastered, 5);

  // --- Section 1: Wrong answers for spaced repetition ---
  let wrongSection = "";
  if (wrongAnswers.length > 0) {
    wrongSection += `\n## Questions the user got WRONG (use these to inspire code questions 1-5):\n`;
    for (const a of wrongAnswers.slice(0, 15)) {
      if (a.type === "code") {
        wrongSection += `- [${a.category}] Code: \`${a.question.replace(/\n/g, " ").slice(0, 120)}...\`\n  Correct: "${a.correctAnswer}", User answered: "${a.userAnswer}"\n`;
      } else {
        wrongSection += `- [${a.category}] Concept: "${a.question}"\n  Correct: "${a.correctAnswer}", User answered: "${a.userAnswer}"\n`;
      }
    }
  }

  // --- Section 2: Curriculum problems ---
  let curriculumSection = "";
  if (curriculumProblems.length > 0) {
    curriculumSection += `\n## Curriculum problems (use these as inspiration for code questions 1-5):\n`;
    if (mastered.size > 0) {
      curriculumSection += `The user has mastered: ${[...mastered].join(", ")}.\n`;
    }
    curriculumSection += `Focus on categories the user hasn't mastered yet.\n\n`;
    for (const p of curriculumProblems) {
      const summary = extractLearningSummary(p.description);
      curriculumSection += `### ${p.title} [category: ${p.category}]\n`;
      if (summary) curriculumSection += `Concept: ${summary}\n`;
      curriculumSection += `Hints: ${p.hints.join(" | ")}\n`;
      curriculumSection += `Solution code:\n\`\`\`solidity\n${p.solution.slice(0, 500)}\n\`\`\`\n\n`;
    }
  }

  // --- Section 3: Previously asked concept questions (for dedup) ---
  const pastConcepts = trimmed
    .filter((a) => a.type === "concept")
    .map((a) => a.question);
  let conceptDedup = "";
  if (pastConcepts.length > 0) {
    conceptDedup += `\n## Previously asked concept questions (DO NOT repeat these):\n`;
    for (const q of pastConcepts.slice(-20)) {
      conceptDedup += `- "${q}"\n`;
    }
  }

  const validCategories = categories.map((c) => c.id).join(", ");

  return `Generate exactly 10 quiz questions split into two sections:

## Section A: Questions 1-5 — Solidity Code (fill-in-the-blank)
Based on the curriculum problems and the user's wrong answers below.
- Each question is a Solidity code snippet with exactly one \`___BLANK___\` marker.
- The blank MUST be at an educationally important position: a keyword, operator, type, function name, or modifier — NOT at arbitrary variable names or string literals.
- IDs: "gen-c1" through "gen-c5".
- If the user got questions wrong, create similar questions on the same topics to reinforce learning.

## Section B: Questions 6-10 — Ethereum Fundamentals (concept multiple-choice)
General Ethereum and blockchain knowledge questions — NOT tied to the Solidity curriculum.
- Topics: gas & fees, EVM architecture, transaction lifecycle, consensus mechanisms, account types, block structure, Ethereum upgrades (PoS, EIP-1559, etc.), L2 scaling, DeFi concepts (AMM, flash loans, oracles), security patterns.
- IDs: "gen-q1" through "gen-q5".
- These must be NEW and different from previously asked questions listed below.

## CRITICAL CORRECTNESS RULES:

### For code questions:
1. The \`answer\` field MUST be the EXACT string that, when placed at the ___BLANK___ position, makes the code syntactically valid and semantically correct Solidity (^0.8.0).
2. NONE of the 3 distractors should produce valid, correct code when placed at the blank. Each distractor must cause a compilation error, runtime error, or semantic incorrectness.
3. The answer must be a single token or short expression (e.g., "public", "uint256", "=", "memory", "msg.sender"). Do NOT use long multi-word answers.
4. Before writing each code question, mentally substitute the answer into the blank and verify the code compiles. Then substitute each distractor and verify it does NOT compile or is semantically wrong.

### BANNED QUESTION TYPES — DO NOT GENERATE THESE (instant P0):
1. Blank at a function name or variable name — any identifier works.
2. Blank at visibility modifier (public/external/internal/private) — unless an internal call or interface override forces exactly one.
3. Blank at data location (memory/calldata/storage) — unless the function modifies the parameter (forcing memory).
4. Blank at state mutability (view/pure/payable) — unless the function body unambiguously forces one (reads state = view, modifies state = no view/pure).
5. Blank at integer type when the value fits in all candidate types (e.g., value 18 fits uint8, uint16, uint256).
6. Blank at \`if\` vs \`else if\` when every branch ends with return/revert — both behave identically.
7. Blank at comparison operators (>=, >, <=, <) when the threshold meaning depends on real-world knowledge, not code logic.
8. Questions about Hardhat \`console.log\` vs \`console.logX\` — console.log is overloaded for most types.
9. Using equivalent Solidity mechanisms as answer vs distractor: super/ParentName, receive/fallback, require/revert.

### WHAT TO USE INSTEAD — SAFE BLANK POSITIONS:
- Solidity keywords with no equivalent: \`mapping\`, \`event\`, \`emit\`, \`modifier\`, \`require\`, \`override\`
- Operators where the code has a verifiable expected output (e.g., a function named \`multiply\` must use \`*\`, not \`+\`)
- Built-in globals where context forces exactly one: \`msg.sender\`, \`msg.value\`, \`block.timestamp\`
- Control flow keywords where code structure forces one answer: \`while\` (needs loop body), \`break\` vs \`continue\` (different loop behavior)

### SELF-VERIFICATION (mandatory for every code question):
Before finalizing each code question, perform this check:
1. Replace ___BLANK___ with the answer → Does it compile AND behave correctly? → MUST be YES
2. Replace ___BLANK___ with distractor 1 → Does it compile AND behave correctly? → MUST be NO
3. Replace ___BLANK___ with distractor 2 → Does it compile AND behave correctly? → MUST be NO
4. Replace ___BLANK___ with distractor 3 → Does it compile AND behave correctly? → MUST be NO
If ANY distractor also works, you MUST rewrite the question or replace that distractor with something that clearly fails.

### For concept questions:
1. The \`answer\` must be factually correct and unambiguous.
2. Each distractor must be a FALSE statement. A distractor that is also true, partially true, or a subset/superset of the answer is DEFECTIVE.
3. Do NOT use a more-specific or less-specific version of the answer as a distractor (e.g., if the answer is "Validators", do NOT use "The block proposer" as a distractor since block proposers ARE validators).
4. Concept questions must NOT include a \`code\` field — only \`question\`, \`answer\`, \`distractors\`, and \`explanation\`.

### For ALL questions:
- Each question: exactly 1 correct answer + exactly 3 distractors.
- The answer must NOT appear in the distractors array.
- All 3 distractors must be different from each other.
- All 4 options (answer + 3 distractors) must be non-empty strings.
- Explanations: educational, concise (1-2 sentences), explain WHY the answer is correct.
- Each question MUST include a "category" field from: ${validCategories}.
- For concept questions, use the category that best matches (e.g., "basics" for general concepts, "patterns" for DeFi, "advanced" for EVM internals).

${wrongSection}
${curriculumSection}
${conceptDedup}

Respond with ONLY valid JSON (no markdown fences, no extra text):
{
  "id": "generated",
  "questions": [
    {
      "type": "code",
      "id": "gen-c1",
      "category": "basics",
      "code": "pragma solidity ^0.8.0;\\n\\ncontract Example {\\n    uint256 public value;\\n\\n    function set(uint256 _v) ___BLANK___ {\\n        value = _v;\\n    }\\n}",
      "answer": "public",
      "distractors": ["private", "internal", "pure"],
      "explanation": "A setter function that modifies state must be public (or external) to be called from outside, and cannot be pure or view."
    },
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

/** Validate a single question, return null if valid or a reason string if invalid */
export function validateQuestion(
  q: Record<string, unknown>,
  validCategoryIds: Set<string>
): string | null {
  // Required fields
  if (!q.type || !q.id) return "missing type or id";
  if (typeof q.answer !== "string" || q.answer.trim() === "")
    return "missing or empty answer";
  if (typeof q.explanation !== "string" || q.explanation.trim() === "")
    return "missing or empty explanation";

  // Distractors: must be array of exactly 3 non-empty strings
  if (!Array.isArray(q.distractors) || q.distractors.length !== 3)
    return "distractors not array of 3";
  const distractors = q.distractors as string[];
  for (let i = 0; i < distractors.length; i++) {
    if (typeof distractors[i] !== "string" || distractors[i].trim() === "")
      return `distractor[${i}] is empty or not a string`;
  }

  // Answer must not be in distractors
  const answer = (q.answer as string).trim();
  if (distractors.map((d) => d.trim()).includes(answer))
    return "answer found in distractors";

  // Distractors must be unique
  const uniqueDistractors = new Set(distractors.map((d) => d.trim()));
  if (uniqueDistractors.size !== 3) return "duplicate distractors";

  // Code-specific checks
  if (q.type === "code") {
    if (typeof q.code !== "string") return "code is not a string";
    const code = q.code as string;
    const blankCount = (code.match(/___BLANK___/g) || []).length;
    if (blankCount !== 1)
      return `code has ${blankCount} blanks (expected 1)`;
    // Answer should be reasonably short (a single token/expression)
    if (answer.length > 80)
      return `answer too long (${answer.length} chars)`;
    // Answer should not contain newlines
    if (answer.includes("\n")) return "answer contains newlines";

    // --- Pattern-based rejection: answers that almost always have valid alternatives ---
    const lower = answer.toLowerCase();

    // Integer types: larger types always hold smaller values
    if (/^u?int\d*$/.test(lower))
      return `banned answer pattern: integer type "${answer}" — multiple sizes are usually valid`;

    // Visibility modifiers: often 2+ compile
    if (["public", "external", "internal", "private"].includes(lower))
      return `banned answer pattern: visibility "${answer}" — multiple modifiers often valid`;

    // State mutability: view is superset of pure, payable always compiles
    if (["pure", "view", "payable"].includes(lower))
      return `banned answer pattern: mutability "${answer}" — multiple options often compile`;

    // Data location: memory and calldata often interchangeable
    if (["memory", "calldata", "storage"].includes(lower))
      return `banned answer pattern: data location "${answer}" — memory/calldata often interchangeable`;

    // Comparison operators: >= vs > and <= vs < are often both valid
    if ([">=", ">", "<=", "<"].includes(answer))
      return `banned answer pattern: comparison "${answer}" — >= vs > often both valid depending on interpretation`;

    // Compound visibility+mutability (e.g. "external payable", "public view")
    const words = lower.split(/\s+/);
    const visibilitySet = new Set(["public", "external", "internal", "private"]);
    const mutabilitySet = new Set(["pure", "view", "payable"]);
    if (words.some((w) => visibilitySet.has(w)) || words.some((w) => mutabilitySet.has(w)))
      return `banned answer pattern: visibility/mutability "${answer}" — multiple combinations often valid`;

    // Blank at function/variable name position
    if (/function\s+___BLANK___/.test(code))
      return "banned blank position: function name — any identifier works";
  }

  // Concept-specific checks
  if (q.type === "concept") {
    if (typeof q.question !== "string" || (q.question as string).trim() === "")
      return "concept question text is empty";
  }

  // Fix invalid category
  if (!q.category || !validCategoryIds.has(q.category as string)) {
    q.category = "basics";
  }

  return null; // valid
}
