"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  getTodaysChallengeSet,
  type ChallengeQuestion,
  type ChallengeSet,
} from "@/data/daily-challenges";

type Phase = "start" | "playing" | "finished";

type SavedProgress = {
  date: string;
  completed: boolean;
  score: number;
  challengeSetId: string;
  currentIndex: number;
  answers: string[];
};

const STORAGE_KEY = "dailyChallenge";

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function loadProgress(): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date !== getTodayString()) return null;
    return data;
  } catch {
    return null;
  }
}

function shuffleWithSeed(items: string[], seed: string): string[] {
  const arr = [...items];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) | 0;
    const j = ((hash >>> 0) % (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleOptions(question: ChallengeQuestion): string[] {
  return shuffleWithSeed(
    [question.answer, ...question.distractors],
    question.id
  );
}

export default function DailyClient() {
  const [phase, setPhase] = useState<Phase>("start");
  const [challengeSet, setChallengeSet] = useState<ChallengeSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  const shuffledOptions = useMemo(() => {
    if (!challengeSet) return [];
    return challengeSet.questions.map((q) => shuffleOptions(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeSet?.id]);

  const total = challengeSet?.questions.length ?? 10;

  const persist = useCallback(
    (overrides: Partial<SavedProgress>) => {
      if (!challengeSet) return;
      const current = loadProgress();
      const data: SavedProgress = {
        date: getTodayString(),
        completed: current?.completed ?? false,
        score: current?.score ?? score,
        challengeSetId: challengeSet.id,
        currentIndex: current?.currentIndex ?? currentIndex,
        answers: current?.answers ?? answers,
        ...overrides,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    [challengeSet, score, currentIndex, answers]
  );

  // Load on mount — restore in-progress or completed state
  useEffect(() => {
    const set = getTodaysChallengeSet();
    setChallengeSet(set);
    const progress = loadProgress();
    if (progress && progress.challengeSetId === set.id) {
      if (progress.completed) {
        setAnswers(progress.answers);
        setScore(progress.score);
        setPhase("finished");
      } else if (progress.answers.length > 0) {
        // Resume in-progress
        setAnswers(progress.answers);
        setScore(
          progress.answers.filter(
            (a, i) => a === set.questions[i]?.answer
          ).length
        );
        setCurrentIndex(progress.currentIndex);
        setPhase("playing");
      }
    }
    setLoaded(true);
  }, []);

  const question = challengeSet?.questions[currentIndex];
  const isCorrect = selected === question?.answer;

  function handleStart() {
    setPhase("playing");
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setAnswers([]);
    persist({ completed: false, score: 0, currentIndex: 0, answers: [] });
  }

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    const newScore = option === question?.answer ? score + 1 : score;
    const newAnswers = [...answers, option];
    setScore(newScore);
    setAnswers(newAnswers);
    // Save immediately after answering
    persist({
      score: newScore,
      currentIndex,
      answers: newAnswers,
    });
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      setPhase("finished");
      persist({ completed: true, score, currentIndex, answers });
      // Dispatch event so Header can update
      window.dispatchEvent(new Event("dailyChallengeUpdate"));
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelected(null);
      persist({ currentIndex: nextIndex, answers });
    }
  }

  function getScoreMessage(s: number, t: number) {
    const pct = s / t;
    if (pct === 1) return "Perfect! 🎯";
    if (pct >= 0.8) return "Great job! 🔥";
    if (pct >= 0.5) return "Keep practicing! 💪";
    return "Don't give up! 📚";
  }

  function renderCodeWithBlank(code: string) {
    const lines = code.split("\n");
    const blankLineIdx = lines.findIndex((l) => l.includes("___BLANK___"));

    return (
      <div className="space-y-0.5 font-mono text-[11px] leading-5">
        {lines.map((line, i) => {
          const isBlankLine = i === blankLineIdx;

          if (isBlankLine) {
            const parts = line.split("___BLANK___");
            return (
              <div
                key={i}
                className="relative -mx-1 px-1 py-1 rounded-lg bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/20 overflow-x-auto whitespace-pre scrollbar-none"
              >
                <code className="text-[var(--color-foreground)]">
                  {parts[0]}
                  <span className="inline-block px-2 py-0.5 mx-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30 font-bold min-w-[40px] text-center text-xs">
                    {selected ?? "?"}
                  </span>
                  {parts[1]}
                </code>
              </div>
            );
          }

          // Context lines — show trimmed, muted
          if (line.trim() === "") {
            return <div key={i} className="h-2" />;
          }

          return (
            <div
              key={i}
              className="overflow-hidden whitespace-pre text-[var(--color-muted)]/60 truncate"
            >
              <code>{line}</code>
            </div>
          );
        })}
      </div>
    );
  }

  if (!challengeSet || !loaded) return null;

  // ─── Start Screen ───
  if (phase === "start") {
    return (
      <div className="min-h-[calc(100dvh-56px)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm w-full"
        >
          <p className="text-[var(--color-muted)] text-sm mb-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-1">
            Daily Challenge
          </h1>
          <p className="text-[var(--color-muted)] mb-8">
            10 Questions · Solidity & Ethereum
          </p>

          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-accent)] to-[#8b5cf6] hover:opacity-90 transition-opacity text-lg"
          >
            Start
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Playing Screen ───
  if (phase === "playing" && question) {
    const options = shuffledOptions[currentIndex] ?? [];

    return (
      <div className="min-h-[calc(100dvh-56px)] flex flex-col px-4 py-4 max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-[var(--color-muted)] font-mono shrink-0">
            {currentIndex + 1}/{total}
          </span>
          <div className="flex-1 h-2 rounded-full bg-[var(--color-surface)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#8b5cf6]"
              initial={false}
              animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {question.type === "code" ? (
              <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
                {renderCodeWithBlank(question.code)}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
                <p className="text-[var(--color-foreground)] text-lg font-medium">
                  {question.question}
                </p>
              </div>
            )}

            {/* Options 2x2 grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {options.map((option) => {
                let style = "";
                if (selected) {
                  if (option === question.answer) {
                    style =
                      "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]";
                  } else if (option === selected) {
                    style =
                      "border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)]";
                  } else {
                    style =
                      "border-[var(--color-border)] text-[var(--color-muted)] opacity-50";
                  }
                } else {
                  style =
                    "border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 active:scale-95";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    disabled={!!selected}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${style}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-auto"
              >
                <div
                  className={`p-4 rounded-xl mb-4 ${
                    isCorrect
                      ? "bg-[var(--color-success)]/10 border border-[var(--color-success)]/30"
                      : "bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30"
                  }`}
                >
                  <p
                    className={`font-semibold mb-1 ${
                      isCorrect
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-danger)]"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {question.explanation}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-accent)] to-[#8b5cf6] hover:opacity-90 transition-opacity"
                >
                  {currentIndex + 1 >= total ? "See Results" : "Next"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ─── Finished Screen ───
  if (phase === "finished") {
    return (
      <div className="min-h-[calc(100dvh-56px)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full"
        >
          <div className="text-center mb-8">
            <p className="text-6xl font-bold text-[var(--color-accent)] mb-2">
              {score}
              <span className="text-2xl text-[var(--color-muted)]">
                {" "}
                / {total}
              </span>
            </p>
            <p className="text-lg text-[var(--color-foreground)]">
              {getScoreMessage(score, total)}
            </p>
          </div>

          {/* Answer review list */}
          <div className="space-y-2 mb-8">
            {challengeSet.questions.map((q, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === q.answer;
              return (
                <div
                  key={q.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    correct
                      ? "border-[var(--color-success)]/30 bg-[var(--color-success)]/5"
                      : "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5"
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      correct
                        ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                        : "bg-[var(--color-danger)]/20 text-[var(--color-danger)]"
                    }`}
                  >
                    {correct ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--color-foreground)] truncate">
                      {q.type === "concept"
                        ? q.question
                        : `Code: ${q.answer}`}
                    </p>
                    {!correct && (
                      <p className="text-xs text-[var(--color-muted)]">
                        Your answer: {userAnswer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-semibold text-center text-[var(--color-muted)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return null;
}
