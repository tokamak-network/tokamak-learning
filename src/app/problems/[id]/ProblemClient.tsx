"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "description"
                ? "text-white border-b-2 border-[var(--color-accent)]"
                : "text-[var(--color-muted)] hover:text-white"
            }`}
          >
            설명
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "results"
                ? "text-white border-b-2 border-[var(--color-accent)]"
                : "text-[var(--color-muted)] hover:text-white"
            }`}
          >
            결과
            {results && (
              <span
                className={`w-2 h-2 rounded-full ${allPassed ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "description" && (
            <div className="p-6">
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
                  {showHints && (
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
                  )}
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
                {showSolution && (
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
                )}
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div className="p-6">
              {!results && !isCompiling && (
                <div className="text-[var(--color-muted)] text-sm">
                  코드를 작성하고 &quot;테스트 실행&quot; 버튼을 클릭하세요.
                </div>
              )}
              {isCompiling && (
                <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                  <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                  컴파일 중...
                </div>
              )}
              {results && (
                <div className="space-y-3">
                  {/* Summary */}
                  <div
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
                  </div>

                  {/* Individual results */}
                  {results.map((r, i) => (
                    <div
                      key={i}
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
                    </div>
                  ))}

                  {/* Next problem button */}
                  {allPassed && nextProblem && (
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
                  )}
                </div>
              )}
            </div>
          )}
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
              className="text-xs px-3 py-1.5 text-[var(--color-muted)] hover:text-white border border-[var(--color-border)] rounded-md transition-colors"
            >
              초기화
            </button>
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="text-xs px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isCompiling ? "컴파일 중..." : "테스트 실행"}
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
