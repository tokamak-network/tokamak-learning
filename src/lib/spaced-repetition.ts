import type { AnswerRecord } from "@/app/daily/DailyClient";

export interface QuestionState {
  questionId: string;
  type: "code" | "concept";
  category: string;
  correctAnswer: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
  lastAnsweredAt: number;
}

export const STORAGE_KEY = "spacedRepetitionState";

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export function loadQuestionStates(): Map<string, QuestionState> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const data = JSON.parse(raw) as QuestionState[];
    return new Map(data.map((s) => [s.questionId, s]));
  } catch {
    return new Map();
  }
}

export function saveQuestionStates(states: Map<string, QuestionState>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...states.values()]));
  } catch {
    // ignore
  }
}

export function createQuestionState(
  record: AnswerRecord,
  correct: boolean
): QuestionState {
  const now = Date.now();
  return {
    questionId: record.questionId,
    type: record.type,
    category: record.category,
    correctAnswer: record.correctAnswer,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: correct ? 1 : 0,
    repetitions: correct ? 1 : 0,
    nextReviewDate: correct ? now + DAY_MS : now,
    lastAnsweredAt: now,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function updateQuestionState(
  state: QuestionState,
  correct: boolean
): QuestionState {
  const now = Date.now();

  if (!correct) {
    return {
      ...state,
      easeFactor: Math.max(MIN_EASE_FACTOR, state.easeFactor - 0.2),
      interval: 0,
      repetitions: 0,
      nextReviewDate: now,
      lastAnsweredAt: now,
    };
  }

  const newRepetitions = state.repetitions + 1;
  let newInterval: number;
  let newEaseFactor = state.easeFactor + 0.1;

  if (newRepetitions === 1) {
    newInterval = 1;
  } else if (newRepetitions === 2) {
    newInterval = 3;
  } else {
    newInterval = Math.round(state.interval * newEaseFactor);
  }

  return {
    ...state,
    easeFactor: Math.max(MIN_EASE_FACTOR, newEaseFactor),
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate: now + newInterval * DAY_MS,
    lastAnsweredAt: now,
  };
}

export function getDueQuestions(states: Map<string, QuestionState>): QuestionState[] {
  const now = Date.now();
  return [...states.values()]
    .filter((s) => s.nextReviewDate <= now)
    .sort((a, b) => {
      const priorityDiff = getPriorityScore(b) - getPriorityScore(a);
      if (priorityDiff !== 0) return priorityDiff;
      return a.nextReviewDate - b.nextReviewDate;
    });
}

export function getPriorityScore(state: QuestionState): number {
  const now = Date.now();
  const daysOverdue = (now - state.nextReviewDate) / DAY_MS;
  const easePenalty = (DEFAULT_EASE_FACTOR - state.easeFactor) * 10;
  return daysOverdue + easePenalty + state.repetitions * 0.5;
}

export function processAnswerRecords(
  records: AnswerRecord[],
  existingStates: Map<string, QuestionState>
): Map<string, QuestionState> {
  const states = new Map(existingStates);

  for (const record of records) {
    const existing = states.get(record.questionId);

    if (existing) {
      if (record.timestamp && record.timestamp > existing.lastAnsweredAt) {
        states.set(
          record.questionId,
          updateQuestionState(existing, record.correct)
        );
      }
    } else {
      states.set(record.questionId, createQuestionState(record, record.correct));
    }
  }

  return states;
}

export interface PrioritizedQuestion {
  questionId: string;
  type: "code" | "concept";
  category: string;
  priority: number;
  reason: "due-review" | "recently-wrong" | "curriculum";
}

export function prioritizeQuestionsForDaily(
  history: AnswerRecord[],
  states: Map<string, QuestionState>,
  maxQuestions: number = 10
): PrioritizedQuestion[] {
  const now = Date.now();
  const result: PrioritizedQuestion[] = [];
  const seen = new Set<string>();

  const dueQuestions = getDueQuestions(states);
  for (const q of dueQuestions) {
    if (seen.has(q.questionId)) continue;
    seen.add(q.questionId);
    result.push({
      questionId: q.questionId,
      type: q.type,
      category: q.category,
      priority: 100 + getPriorityScore(q),
      reason: "due-review",
    });
  }

  const recentWrong = history
    .filter((r) => !r.correct)
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
    .slice(0, 10);

  for (const r of recentWrong) {
    if (seen.has(r.questionId)) continue;
    seen.add(r.questionId);
    const daysSinceWrong = (now - (r.timestamp ?? now)) / DAY_MS;
    result.push({
      questionId: r.questionId,
      type: r.type,
      category: r.category,
      priority: 50 - daysSinceWrong,
      reason: "recently-wrong",
    });
  }

  return result.slice(0, maxQuestions);
}