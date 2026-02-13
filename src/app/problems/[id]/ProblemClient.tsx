"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "@/components/Markdown";
import {
  type Problem,
  getNextProblem,
  getPrevProblem,
} from "@/data/problems";

const SolidityEditor = dynamic(() => import("@/components/SolidityEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
      에디터 로딩중...
    </div>
  ),
});

interface TestResult {
  passed: boolean;
  message: string;
}

const resultsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function ProblemClient({ problem }: { problem: Problem }) {
  const [code, setCode] = useState(problem.starterCode);
  const [isCompiling, setIsCompiling] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "results">(
    "description"
  );

  const nextProblem = getNextProblem(problem.id);
  const prevProblem = getPrevProblem(problem.id);

  const allPassed = results?.every((r) => r.passed) ?? false;

  const handleCompile = useCallback(async () => {
    setIsCompiling(true);
    setResults(null);
    setActiveTab("results");

    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: code,
          expectedFunctions: problem.expectedFunctions,
          expectedEvents: problem.expectedEvents,
          testCases: problem.testCases,
          constructorArgs: problem.constructorArgs,
        }),
      });
      const data = await res.json();
      setResults(data.results);
    } catch {
      setResults([{ passed: false, message: "서버 오류가 발생했습니다" }]);
    } finally {
      setIsCompiling(false);
    }
  }, [code, problem]);

  const handleReset = useCallback(() => {
    setCode(problem.starterCode);
    setResults(null);
  }, [problem.starterCode]);

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* Left Panel - Description */}
      <div className="w-[480px] min-w-[380px] border-r border-[var(--color-border)] flex flex-col bg-[var(--color-surface)]">
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab("description")}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "description"
                ? "text-white"
                : "text-[var(--color-muted)] hover:text-white"
            }`}
          >
            설명
            {activeTab === "description" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "results"
                ? "text-white"
                : "text-[var(--color-muted)] hover:text-white"
            }`}
          >
            결과
            {results && (
              <span
                className={`w-2 h-2 rounded-full ${allPassed ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`}
              />
            )}
            {activeTab === "results" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                {/* Navigation */}
                <div className="flex items-center gap-2 mb-4 text-xs text-[var(--color-muted)]">
                  <Link
                    href="/language/solidity"
                    className="hover:text-white transition-colors"
                  >
                    Solidity
                  </Link>
                  <span>/</span>
                  <span className="text-white">{problem.title}</span>
                </div>

                <Markdown content={problem.description} />

                {/* Hints */}
                {problem.hints.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                    >
                      {showHints ? "힌트 숨기기" : "힌트 보기"}
                    </button>
                    <AnimatePresence>
                      {showHints && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-2">
                            {problem.hints.map((hint, i) => (
                              <div
                                key={i}
                                className="text-sm text-[var(--color-muted)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-3"
                              >
                                {hint}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Solution toggle */}
                <div className="mt-4">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-sm text-[var(--color-warning)] hover:text-yellow-300 transition-colors"
                  >
                    {showSolution ? "정답 숨기기" : "정답 보기"}
                  </button>
                  <AnimatePresence>
                    {showSolution && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2">
                          <pre className="text-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-4 overflow-x-auto">
                            <code className="text-[var(--color-foreground)]">
                              {problem.solution}
                            </code>
                          </pre>
                          <button
                            onClick={() => {
                              setCode(problem.solution);
                              setShowSolution(false);
                            }}
                            className="mt-2 text-xs text-[var(--color-muted)] hover:text-white transition-colors"
                          >
                            정답 코드 적용하기
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                {!results && !isCompiling && (
                  <div className="text-[var(--color-muted)] text-sm">
                    코드를 작성하고 &quot;테스트 실행&quot; 버튼을 클릭하세요.
                  </div>
                )}
                {isCompiling && (
                  <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                    <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                    컴파일 중
                    <span className="inline-flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-[var(--color-muted)] animate-[dotPulse_1.4s_infinite_0s]" />
                      <span className="w-1 h-1 rounded-full bg-[var(--color-muted)] animate-[dotPulse_1.4s_infinite_0.2s]" />
                      <span className="w-1 h-1 rounded-full bg-[var(--color-muted)] animate-[dotPulse_1.4s_infinite_0.4s]" />
                    </span>
                  </div>
                )}
                {results && (
                  <motion.div
                    className="space-y-3"
                    variants={resultsContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Summary */}
                    <motion.div
                      variants={fadeInUpVariant}
                      className={`p-4 rounded-lg border ${
                        allPassed
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-lg ${allPassed ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}
                        >
                          {allPassed ? "Pass" : "Fail"}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)]">
                        {results.filter((r) => r.passed).length} /{" "}
                        {results.length} 테스트 통과
                      </p>
                    </motion.div>

                    {/* Individual results */}
                    {results.map((r, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUpVariant}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          r.passed
                            ? "border-green-500/20 bg-green-500/5"
                            : "border-red-500/20 bg-red-500/5"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            r.passed
                              ? "bg-[var(--color-success)] text-white"
                              : "bg-[var(--color-danger)] text-white"
                          }`}
                        >
                          {r.passed ? "V" : "X"}
                        </span>
                        <span className="text-sm text-[var(--color-foreground)]">
                          {r.message}
                        </span>
                      </motion.div>
                    ))}

                    {/* Next problem button */}
                    {allPassed && nextProblem && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          delay: 0.3,
                          stiffness: 300,
                        }}
                      >
                        <Link
                          href={`/problems/${nextProblem.id}`}
                          className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-success)] hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                          다음 문제: {nextProblem.title}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="border-t border-[var(--color-border)] p-3 flex justify-between">
          {prevProblem ? (
            <Link
              href={`/problems/${prevProblem.id}`}
              className="text-sm text-[var(--color-muted)] hover:text-white transition-colors flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              이전
            </Link>
          ) : (
            <div />
          )}
          {nextProblem ? (
            <Link
              href={`/problems/${nextProblem.id}`}
              className="text-sm text-[var(--color-muted)] hover:text-white transition-colors flex items-center gap-1"
            >
              다음
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="text-sm text-[var(--color-muted)]">
            contract.sol
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 text-[var(--color-muted)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-muted)] rounded-md hover:scale-[1.02] transition-all duration-200"
            >
              초기화
            </button>
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="text-xs px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isCompiling ? (
                <span className="inline-flex items-center gap-1">
                  컴파일 중
                  <span className="inline-flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-white animate-[dotPulse_1.4s_infinite_0s]" />
                    <span className="w-1 h-1 rounded-full bg-white animate-[dotPulse_1.4s_infinite_0.2s]" />
                    <span className="w-1 h-1 rounded-full bg-white animate-[dotPulse_1.4s_infinite_0.4s]" />
                  </span>
                </span>
              ) : (
                "테스트 실행"
              )}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <SolidityEditor value={code} onChange={setCode} />
        </div>
      </div>
    </div>
  );
}
