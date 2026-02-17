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

const validCategories = categories.map((c) => c.id).join(", ");

const CATEGORY_GROUPS: string[][] = [
  ["basics"],
  ["control-flow"],
  ["data-structures"],
  ["advanced"],
  ["patterns"],
];

export function divideCurriculumIntoSections(
  mastered: Set<string>,
  sectionCount: number = 5
): Problem[][] {
  const sections: Problem[][] = [];

  for (let i = 0; i < sectionCount; i++) {
    const groupCategories = CATEGORY_GROUPS[i] || [];
    const availableCategories = groupCategories.filter((c) => !mastered.has(c));
    
    const targetCategories = availableCategories.length > 0 
      ? availableCategories 
      : groupCategories;
    
    const groupProblems = problems
      .filter((p) => targetCategories.includes(p.category))
      .sort((a, b) => a.order - b.order);
    
    const shuffled = shuffleArray(groupProblems);
    sections.push(shuffled);
  }

  return sections;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CODE_QUESTION_RULES = `## CRITICAL CORRECTNESS RULES:

### MANDATORY:
- Every code question MUST contain exactly one \`___BLANK___\` marker in the code.
- Without this marker, the question is invalid and will be rejected.

### For this code question:
1. The \`answer\` field MUST be the EXACT string that, when placed at the ___BLANK___ position, makes the code syntactically valid and semantically correct Solidity (^0.8.0).
2. NONE of the 3 distractors should produce valid, correct code when placed at the blank. Each distractor must cause a compilation error, runtime error, or semantic incorrectness.
3. The answer must be a single token or short expression (e.g., "mapping", "emit", "=", "msg.sender"). Do NOT use long multi-word answers.

### ABSOLUTELY BANNED ANSWERS — NEVER USE THESE (instant rejection):
1. **Visibility modifiers**: public, external, internal, private
2. **State mutability**: view, pure, payable
3. **Data locations**: memory, calldata, storage
4. **Integer types**: int, uint, int8, uint8, int256, uint256, and ALL other integer sizes
5. **Comparison operators**: >=, >, <=, <
6. **Function names or variable names** at blank position
7. **Equivalent mechanisms**: super vs ParentName, receive vs fallback, require vs revert

### BANNED BLANK POSITIONS — DO NOT PLACE BLANK AT:
1. Function or variable names — any identifier works.
2. Visibility modifiers — multiple options compile.
3. Data locations — memory/calldata often interchangeable.
4. State mutability — view/pure/payable often interchangeable.
5. Integer types — larger types always hold smaller values.
6. \`if\` vs \`else if\` when branches end with return/revert — identical behavior.
7. Comparison operators — >= vs > both compile with different logic.

### SAFE BLANK POSITIONS — USE ONLY THESE:
- **Solidity keywords with no equivalent**: \`mapping\`, \`event\`, \`emit\`, \`modifier\`, \`require\`, \`override\`, \`constructor\`
- **Operators with verifiable output**: \`*\` (multiply), \`/\` (divide), \`%\` (modulo) — when function name indicates the operation
- **Assignment operator**: \`=\` — when clearly assigning a value
- **Built-in globals**: \`msg.sender\`, \`msg.value\`, \`block.timestamp\` — when context forces exactly one
- **Control flow**: \`break\` vs \`continue\` — different loop behavior
- **Array methods**: \`push\` — only way to append to dynamic array

### SELF-VERIFICATION (mandatory):
Before finalizing, perform this check:
1. Replace ___BLANK___ with the answer → Does it compile AND behave correctly? → MUST be YES
2. Replace ___BLANK___ with each distractor → Does it compile AND behave correctly? → MUST be NO
If ANY distractor also works, you MUST rewrite the question.

### Required fields:
- type: "code"
- id: the provided question ID
- category: one of the valid categories
- code: Solidity code with exactly one \`___BLANK___\` marker
- answer: the correct answer (must NOT appear in distractors)
- distractors: array of exactly 3 strings (all different, non-empty)
- explanation: 1-2 sentences explaining WHY the answer is correct`;

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

/** Build prompt for a single code question from curriculum section */
export function buildCodeQuestionPrompt(
  questionId: string,
  curriculumSection: Problem[],
  wrongAnswer?: AnswerRecord
): string {
  const inspirationSection = `\n## CURRICULUM REFERENCE (generate a question inspired by these problems):
${curriculumSection.slice(0, 5).map((p, i) => `
### Problem ${i + 1}: ${p.title} [${p.category}]
${extractLearningSummary(p.description)}
Hints: ${p.hints.join(" | ")}
Solution:
\`\`\`solidity
${p.solution.slice(0, 400)}
\`\`\`
`).join("\n")}

IMPORTANT: Generate a question based on the curriculum above. Do NOT copy the example format. Create a unique question that tests the concept shown in the curriculum.
`;

  const weakAreaSection = wrongAnswer
    ? `\n## User's weak area (prioritize if relevant):
The user got a question wrong in category "${wrongAnswer.category}".
- Correct answer was: "${wrongAnswer.correctAnswer}"
- User answered: "${wrongAnswer.userAnswer}"
Consider creating a question that reinforces this concept.
`
    : "";

  return `Generate exactly 1 Solidity code question (fill-in-the-blank).

Question ID: ${questionId}
Valid categories: ${validCategories}

${CODE_QUESTION_RULES}
${inspirationSection}
${weakAreaSection}

Respond with ONLY valid JSON (no markdown fences, no extra text). The response must contain exactly one question in the "questions" array.`;
}

/** Build prompt for 5 concept questions */
export function buildConceptQuestionsPrompt(
  pastConcepts: string[]
): string {
  let dedupSection = "";
  if (pastConcepts.length > 0) {
    dedupSection = `\n## Previously asked concept questions (DO NOT repeat these):
${pastConcepts.slice(-20).map((q) => `- "${q}"`).join("\n")}
`;
  }

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

/** Prepare data for generating code questions */
export function prepareCodeQuestionData(history: AnswerRecord[]): {
  wrongAnswers: AnswerRecord[];
  mastered: Set<string>;
  curriculumProblems: Problem[];
} {
  const trimmed = trimHistory(history, 14);
  const wrongAnswers = deduplicateWrongAnswers(
    trimmed.filter((a) => !a.correct)
  );
  const mastered = getMasteredCategories(trimmed);
  const curriculumProblems = pickCurriculumProblems(mastered, 5);

  return { wrongAnswers, mastered, curriculumProblems };
}

/** Get past concept questions for deduplication */
export function getPastConcepts(history: AnswerRecord[]): string[] {
  const trimmed = trimHistory(history, 14);
  return trimmed
    .filter((a) => a.type === "concept")
    .map((a) => a.question);
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
