import { describe, it, expect } from "vitest";
import type { AnswerRecord } from "@/app/daily/DailyClient";
import {
  shuffleArray,
  extractLearningSummary,
  getMasteredCategories,
  pickCurriculumProblems,
  trimHistory,
  deduplicateWrongAnswers,
  validateQuestion,
} from "./daily-generate";

// ---------------------------------------------------------------------------
// Helper: create an AnswerRecord for testing
// ---------------------------------------------------------------------------
function makeAnswer(
  overrides: Partial<AnswerRecord> = {}
): AnswerRecord {
  return {
    questionId: "q1",
    type: "concept",
    category: "basics",
    question: "What is Solidity?",
    correctAnswer: "A smart-contract language",
    userAnswer: "A smart-contract language",
    correct: true,
    explanation: "Solidity is used for Ethereum smart contracts.",
    ...overrides,
  };
}

// ===========================================================================
// shuffleArray
// ===========================================================================
describe("shuffleArray", () => {
  it("returns the requested number of items when count is provided", () => {
    const result = shuffleArray([1, 2, 3, 4, 5], 3);
    expect(result).toHaveLength(3);
  });

  it("returns all items when count >= array length", () => {
    const result = shuffleArray([1, 2, 3], 5);
    expect(result).toHaveLength(3);
  });

  it("returns empty array for empty input", () => {
    expect(shuffleArray([], 3)).toEqual([]);
  });

  it("returns 0 items when count is 0", () => {
    expect(shuffleArray([1, 2, 3], 0)).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleArray(original, 3);
    expect(original).toEqual(copy);
  });

  it("returns items that are all from the original array", () => {
    const source = ["a", "b", "c", "d"];
    const result = shuffleArray(source, 2);
    for (const item of result) {
      expect(source).toContain(item);
    }
  });

  it("shuffles the entire array when count is not provided", () => {
    const source = [1, 2, 3, 4, 5];
    const result = shuffleArray(source);
    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual(source.sort());
  });
});

// ===========================================================================
// extractLearningSummary
// ===========================================================================
describe("extractLearningSummary", () => {
  it("extracts content after '## What you'll learn'", () => {
    const desc = `# Title\n## What you'll learn\nSolidity basics and syntax.\n## Next section`;
    expect(extractLearningSummary(desc)).toBe("Solidity basics and syntax.");
  });

  it("returns empty string when heading is absent", () => {
    expect(extractLearningSummary("No heading here")).toBe("");
  });

  it("truncates to 300 characters", () => {
    const long = "A".repeat(500);
    const desc = `## What you'll learn\n${long}\n## End`;
    expect(extractLearningSummary(desc).length).toBeLessThanOrEqual(300);
  });
});

// ===========================================================================
// getMasteredCategories
// ===========================================================================
describe("getMasteredCategories", () => {
  it("returns empty set for empty history", () => {
    expect(getMasteredCategories([])).toEqual(new Set());
  });

  it("marks category as mastered with 3+ correct answers at 70%+", () => {
    const history: AnswerRecord[] = [
      makeAnswer({ category: "basics", correct: true }),
      makeAnswer({ category: "basics", correct: true }),
      makeAnswer({ category: "basics", correct: true }),
    ];
    const mastered = getMasteredCategories(history);
    expect(mastered.has("basics")).toBe(true);
  });

  it("does not master category with < 3 answers even if 100% correct", () => {
    const history: AnswerRecord[] = [
      makeAnswer({ category: "basics", correct: true }),
      makeAnswer({ category: "basics", correct: true }),
    ];
    const mastered = getMasteredCategories(history);
    expect(mastered.has("basics")).toBe(false);
  });

  it("does not master category with < 70% accuracy", () => {
    // 2 correct out of 4 = 50%
    const history: AnswerRecord[] = [
      makeAnswer({ category: "basics", correct: true }),
      makeAnswer({ category: "basics", correct: true }),
      makeAnswer({ category: "basics", correct: false }),
      makeAnswer({ category: "basics", correct: false }),
    ];
    const mastered = getMasteredCategories(history);
    expect(mastered.has("basics")).toBe(false);
  });

  it("masters category at exactly 70% with 10 answers", () => {
    const history: AnswerRecord[] = [];
    for (let i = 0; i < 7; i++)
      history.push(makeAnswer({ category: "integers", correct: true }));
    for (let i = 0; i < 3; i++)
      history.push(makeAnswer({ category: "integers", correct: false }));
    const mastered = getMasteredCategories(history);
    expect(mastered.has("integers")).toBe(true);
  });

  it("tracks multiple categories independently", () => {
    const history: AnswerRecord[] = [
      // basics: 3/3 = 100% -> mastered
      makeAnswer({ category: "basics", correct: true }),
      makeAnswer({ category: "basics", correct: true }),
      makeAnswer({ category: "basics", correct: true }),
      // integers: 1/3 = 33% -> not mastered
      makeAnswer({ category: "integers", correct: true }),
      makeAnswer({ category: "integers", correct: false }),
      makeAnswer({ category: "integers", correct: false }),
    ];
    const mastered = getMasteredCategories(history);
    expect(mastered.has("basics")).toBe(true);
    expect(mastered.has("integers")).toBe(false);
  });

  it("skips records with empty category", () => {
    const history: AnswerRecord[] = [
      makeAnswer({ category: "", correct: true }),
      makeAnswer({ category: "", correct: true }),
      makeAnswer({ category: "", correct: true }),
    ];
    const mastered = getMasteredCategories(history);
    expect(mastered.size).toBe(0);
  });
});

// ===========================================================================
// pickCurriculumProblems
// ===========================================================================
describe("pickCurriculumProblems", () => {
  it("returns problems from non-mastered categories", () => {
    const mastered = new Set(["basics"]);
    const result = pickCurriculumProblems(mastered, 5);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(5);
    for (const p of result) {
      expect(p.category).not.toBe("basics");
    }
  });

  it("falls back to all categories when all are mastered", () => {
    const allCategories = new Set([
      "basics",
      "integers",
      "basic-types",
      "arithmetic",
      "comparison",
      "variables",
      "gotchas",
      "control-flow",
      "data-structures",
      "advanced",
      "patterns",
    ]);
    const result = pickCurriculumProblems(allCategories, 3);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("returns problems from all categories when none mastered", () => {
    const result = pickCurriculumProblems(new Set(), 5);
    expect(result).toHaveLength(5);
  });
});

// ===========================================================================
// trimHistory
// ===========================================================================
describe("trimHistory", () => {
  it("returns full history when within limit", () => {
    const history = Array.from({ length: 10 }, () => makeAnswer());
    expect(trimHistory(history, 14)).toHaveLength(10);
  });

  it("trims to last N*10 entries", () => {
    const history = Array.from({ length: 200 }, (_, i) =>
      makeAnswer({ questionId: `q${i}` })
    );
    const result = trimHistory(history, 14); // 14 * 10 = 140
    expect(result).toHaveLength(140);
    // Should keep the most recent entries
    expect(result[0].questionId).toBe("q60");
    expect(result[139].questionId).toBe("q199");
  });

  it("returns exact array reference when not trimming", () => {
    const history = [makeAnswer()];
    expect(trimHistory(history, 14)).toBe(history);
  });
});

// ===========================================================================
// deduplicateWrongAnswers
// ===========================================================================
describe("deduplicateWrongAnswers", () => {
  it("removes duplicates by category+correctAnswer", () => {
    const wrong: AnswerRecord[] = [
      makeAnswer({ category: "basics", correctAnswer: "public" }),
      makeAnswer({ category: "basics", correctAnswer: "public" }),
      makeAnswer({ category: "basics", correctAnswer: "private" }),
    ];
    const result = deduplicateWrongAnswers(wrong);
    expect(result).toHaveLength(2);
  });

  it("keeps entries with same correctAnswer but different category", () => {
    const wrong: AnswerRecord[] = [
      makeAnswer({ category: "basics", correctAnswer: "public" }),
      makeAnswer({ category: "variables", correctAnswer: "public" }),
    ];
    const result = deduplicateWrongAnswers(wrong);
    expect(result).toHaveLength(2);
  });

  it("returns empty array for empty input", () => {
    expect(deduplicateWrongAnswers([])).toEqual([]);
  });

  it("preserves first occurrence order", () => {
    const wrong: AnswerRecord[] = [
      makeAnswer({ category: "a", correctAnswer: "x", questionId: "first" }),
      makeAnswer({ category: "a", correctAnswer: "x", questionId: "second" }),
    ];
    const result = deduplicateWrongAnswers(wrong);
    expect(result[0].questionId).toBe("first");
  });
});

// ===========================================================================
// validateQuestion
// ===========================================================================
describe("validateQuestion", () => {
  const validCategories = new Set([
    "basics",
    "integers",
    "basic-types",
    "arithmetic",
    "comparison",
    "variables",
    "gotchas",
    "control-flow",
    "data-structures",
    "advanced",
    "patterns",
  ]);

  // -- Valid code question --
  const validCodeQuestion = () => ({
    type: "code",
    id: "gen-c1",
    category: "basics",
    code: 'contract A { ___BLANK___ Transfer(address from, address to); }',
    answer: "event",
    distractors: ["function", "modifier", "error"],
    explanation: "The event keyword declares an event that can be emitted.",
  });

  // -- Valid concept question --
  const validConceptQuestion = () => ({
    type: "concept",
    id: "gen-q1",
    category: "basics",
    question: "What is gas in Ethereum?",
    answer: "Execution cost unit",
    distractors: ["A token", "A consensus algo", "A block type"],
    explanation: "Gas measures computational work.",
  });

  it("accepts a valid code question", () => {
    expect(validateQuestion(validCodeQuestion(), validCategories)).toBeNull();
  });

  it("accepts a valid concept question", () => {
    expect(validateQuestion(validConceptQuestion(), validCategories)).toBeNull();
  });

  // --- Missing fields ---
  it("rejects question without type", () => {
    const q = validCodeQuestion();
    delete (q as Record<string, unknown>).type;
    expect(validateQuestion(q, validCategories)).toBe("missing type or id");
  });

  it("rejects question without id", () => {
    const q = validCodeQuestion();
    delete (q as Record<string, unknown>).id;
    expect(validateQuestion(q, validCategories)).toBe("missing type or id");
  });

  it("rejects question with empty answer", () => {
    const q = validCodeQuestion();
    q.answer = "   ";
    expect(validateQuestion(q, validCategories)).toBe(
      "missing or empty answer"
    );
  });

  it("rejects question with empty explanation", () => {
    const q = validCodeQuestion();
    q.explanation = "";
    expect(validateQuestion(q, validCategories)).toBe(
      "missing or empty explanation"
    );
  });

  // --- Distractors ---
  it("rejects when distractors is not an array", () => {
    const q = validCodeQuestion();
    (q as Record<string, unknown>).distractors = "not array";
    expect(validateQuestion(q, validCategories)).toBe(
      "distractors not array of 3"
    );
  });

  it("rejects when distractors has wrong count", () => {
    const q = validCodeQuestion();
    (q as Record<string, unknown>).distractors = ["a", "b"];
    expect(validateQuestion(q, validCategories)).toBe(
      "distractors not array of 3"
    );
  });

  it("rejects empty distractor", () => {
    const q = validCodeQuestion();
    q.distractors = ["a", "", "c"];
    expect(validateQuestion(q, validCategories)).toBe(
      "distractor[1] is empty or not a string"
    );
  });

  it("rejects when answer appears in distractors", () => {
    const q = validCodeQuestion();
    q.distractors = ["event", "modifier", "error"];
    expect(validateQuestion(q, validCategories)).toBe(
      "answer found in distractors"
    );
  });

  it("rejects duplicate distractors", () => {
    const q = validCodeQuestion();
    q.distractors = ["private", "private", "pure"];
    expect(validateQuestion(q, validCategories)).toBe("duplicate distractors");
  });

  // --- Code-specific ---
  it("rejects code question with no ___BLANK___", () => {
    const q = validCodeQuestion();
    q.code = "contract A { function f() public {} }";
    expect(validateQuestion(q, validCategories)).toBe(
      "code has wrong number of blanks (expected 1)"
    );
  });

  it("rejects code question with multiple ___BLANK___", () => {
    const q = validCodeQuestion();
    q.code = "contract A { ___BLANK___ f() ___BLANK___ {} }";
    expect(validateQuestion(q, validCategories)).toBe(
      "code has wrong number of blanks (expected 1)"
    );
  });

  it("rejects code question with answer > 80 chars", () => {
    const q = validCodeQuestion();
    q.answer = "a".repeat(81);
    expect(validateQuestion(q, validCategories)).toContain("answer too long");
  });

  it("rejects code question with newline in answer", () => {
    const q = validCodeQuestion();
    q.answer = "public\nview";
    expect(validateQuestion(q, validCategories)).toBe(
      "answer contains newlines"
    );
  });

  // --- Concept-specific ---
  it("rejects concept question with empty question text", () => {
    const q = validConceptQuestion();
    q.question = "  ";
    expect(validateQuestion(q, validCategories)).toBe(
      "concept question text is empty"
    );
  });

  // --- Banned answer patterns (code questions) ---
  it("rejects integer type answers (uint8, uint16, etc.)", () => {
    for (const t of ["uint8", "uint16", "uint256", "int32", "Int128"]) {
      const q = validCodeQuestion();
      q.code = "contract A { ___BLANK___ public x = 18; }";
      q.answer = t;
      q.distractors = ["bool", "string", "address"];
      expect(validateQuestion(q, validCategories)).toContain("banned answer pattern: integer type");
    }
  });

  it("rejects visibility modifier answers", () => {
    for (const v of ["public", "external", "internal", "private"]) {
      const q = validCodeQuestion();
      q.answer = v;
      q.distractors = ["abstract", "virtual", "override"];
      expect(validateQuestion(q, validCategories)).toContain("banned answer pattern: visibility");
    }
  });

  it("rejects state mutability answers", () => {
    for (const m of ["pure", "view", "payable"]) {
      const q = validCodeQuestion();
      q.answer = m;
      q.distractors = ["abstract", "virtual", "override"];
      expect(validateQuestion(q, validCategories)).toContain("banned answer pattern: mutability");
    }
  });

  it("rejects data location answers", () => {
    for (const d of ["memory", "calldata", "storage"]) {
      const q = validCodeQuestion();
      q.answer = d;
      q.distractors = ["stack", "heap", "register"];
      expect(validateQuestion(q, validCategories)).toContain("banned answer pattern: data location");
    }
  });

  it("rejects comparison operator answers", () => {
    for (const op of [">=", ">", "<=", "<"]) {
      const q = validCodeQuestion();
      q.code = "contract A { function f(uint a) public pure returns (bool) { return a ___BLANK___ 18; } }";
      q.answer = op;
      q.distractors = ["==", "!=", "**"];
      expect(validateQuestion(q, validCategories)).toContain("banned answer pattern: comparison");
    }
  });

  it("rejects compound visibility/mutability answers", () => {
    const q = validCodeQuestion();
    q.answer = "external payable";
    q.distractors = ["abstract", "virtual", "override"];
    expect(validateQuestion(q, validCategories)).toContain("banned answer pattern: visibility/mutability");
  });

  it("rejects blank at function name position", () => {
    const q = validCodeQuestion();
    q.code = "contract A { function ___BLANK___() public {} }";
    q.answer = "getBalance";
    q.distractors = ["fetch", "retrieve", "obtain"];
    expect(validateQuestion(q, validCategories)).toContain("banned blank position: function name");
  });

  it("allows safe answers like keywords (event, mapping, require, etc.)", () => {
    const q = validCodeQuestion();
    q.answer = "event";
    expect(validateQuestion(q, validCategories)).toBeNull();

    const q2 = validCodeQuestion();
    q2.code = "contract A { ___BLANK___(x > 0, 'err'); }";
    q2.answer = "require";
    q2.distractors = ["assert", "revert", "throw"];
    expect(validateQuestion(q2, validCategories)).toBeNull();
  });

  // --- Category fallback ---
  it("sets invalid category to 'basics' and passes validation", () => {
    const q = validCodeQuestion();
    q.category = "nonexistent";
    expect(validateQuestion(q, validCategories)).toBeNull();
    expect(q.category).toBe("basics");
  });

  it("preserves valid category", () => {
    const q = validCodeQuestion();
    q.category = "advanced";
    validateQuestion(q, validCategories);
    expect(q.category).toBe("advanced");
  });
});
