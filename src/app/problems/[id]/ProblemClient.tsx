"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "@/components/Markdown";
import {
  type Problem,
  getNextProblem,
  getPrevProblem,
} from "@/data/problems";
import type { TestResult } from "@/lib/evm-runner";

type ClientProblem = Omit<Problem, "solution" | "hints">;

const SolidityEditor = dynamic(() => import("@/components/SolidityEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
      Loading editor...
    </div>
  ),
});

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

function highlightSolidity(code: string): string {
  const keywords = /\b(pragma|solidity|contract|interface|library|is|function|modifier|event|struct|enum|mapping|if|else|for|while|do|return|returns|require|revert|assert|emit|new|delete|constructor|fallback|receive|virtual|override|abstract|using|import|error|unchecked)\b/g;
  const types = /\b(address|bool|string|bytes\d*|byte|u?int\d*|u?fixed|public|private|internal|external|pure|view|payable|constant|immutable|memory|storage|calldata|indexed)\b/g;
  const literals = /\b(true|false|wei|gwei|ether)\b/g;
  const numbers = /\b(0x[0-9a-fA-F]+|\d+)\b/g;

  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\/\/.*$/gm, (m) => `<span style="color:var(--color-muted)">${m}</span>`)
    .replace(/\/\*[\s\S]*?\*\//g, (m) => `<span style="color:var(--color-muted)">${m}</span>`)
    .replace(/"[^"]*"/g, (m) => `<span style="color:var(--color-success)">${m}</span>`)
    .replace(/'[^']*'/g, (m) => `<span style="color:var(--color-success)">${m}</span>`)
    .replace(keywords, (m) => `<span style="color:var(--color-accent)">${m}</span>`)
    .replace(types, (m) => `<span style="color:#c084fc">${m}</span>`)
    .replace(literals, (m) => `<span style="color:var(--color-warning)">${m}</span>`)
    .replace(numbers, (m) => `<span style="color:var(--color-warning)">${m}</span>`);
}

export default function ProblemClient({ problem }: { problem: ClientProblem }) {
  const [code, setCode] = useState(problem.starterCode);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [solution, setSolution] = useState<string | null>(null);
  const [isTestResult, setIsTestResult] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"description" | "editor">("description");
  const [activeTab, setActiveTab] = useState<"description" | "results">(
    "description"
  );
  const [vimMode, setVimMode] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("vimMode") === "true";
    } catch {
      return false;
    }
  });

  const nextProblem = getNextProblem(problem.id);
  const prevProblem = getPrevProblem(problem.id);

  const allPassed = isTestResult && (results?.every((r) => r.passed) ?? false);

  // Save completed problem to localStorage
  useEffect(() => {
    if (allPassed) {
      try {
        const stored = localStorage.getItem("completedProblems");
        const completed: string[] = stored ? JSON.parse(stored) : [];
        if (!completed.includes(problem.id)) {
          completed.push(problem.id);
          localStorage.setItem("completedProblems", JSON.stringify(completed));
        }
      } catch {
        // ignore localStorage errors
      }
    }
  }, [allPassed, problem.id]);

  const fetchSolutionData = useCallback(async () => {
    if (solution !== null) return; // already fetched
    try {
      const res = await fetch(`/api/solution?id=${problem.id}`);
      const data = await res.json();
      setHints(data.hints ?? []);
      setSolution(data.solution ?? "");
    } catch {
      // ignore
    }
  }, [problem.id, solution]);

  const isLoading = isCompiling || isRunning;

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setResults(null);
    setConsoleLogs([]);
    setIsTestResult(false);
    setActiveTab("results");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: code }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setResults([{ passed: false, message: "Too many requests. Please wait a moment and try again." }]);
        return;
      }

      const data = await res.json();
      const newResults: TestResult[] = [];

      if (!data.compiled) {
        newResults.push({ passed: false, message: `Compilation failed:\n${data.error}` });
      } else {
        newResults.push({ passed: true, message: "Compilation successful" });
        if (data.deployed) {
          newResults.push({ passed: true, message: "Deployment successful" });
        } else if (data.error) {
          newResults.push({ passed: false, message: data.error });
        }
      }

      setResults(newResults);
      setConsoleLogs(data.consoleLogs || []);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setResults([{ passed: false, message: "Request timed out." }]);
      } else {
        setResults([{ passed: false, message: "Network error." }]);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsRunning(false);
    }
  }, [code]);

  const handleCompile = useCallback(async () => {
    setIsCompiling(true);
    setResults(null);
    setConsoleLogs([]);
    setIsTestResult(true);
    setActiveTab("results");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

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
          expectedContractName: problem.expectedContractName,
        }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setResults([{ passed: false, message: "Too many requests. Please wait a moment and try again." }]);
        return;
      }

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setResults([{ passed: false, message: "Request timed out. The server might be busy — please try again." }]);
      } else {
        setResults([{ passed: false, message: "Network error. Please check your connection and try again." }]);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsCompiling(false);
    }
  }, [code, problem]);

  const handleReset = useCallback(() => {
    if (code !== problem.starterCode) {
      if (!window.confirm("Reset your code? Your changes will be lost.")) return;
    }
    setCode(problem.starterCode);
    setResults(null);
  }, [code, problem.starterCode]);

  const toggleVimMode = useCallback(() => {
    setVimMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vimMode", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + Shift + Enter → Test
      if (mod && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleCompile();
        return;
      }
      // Cmd/Ctrl + Enter → Run
      if (mod && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
      // Cmd/Ctrl + Shift + H → Toggle hints
      if (mod && e.shiftKey && e.key === "H") {
        e.preventDefault();
        fetchSolutionData();
        setShowHints((prev) => !prev);
        setActiveTab("description");
      }
      // Cmd/Ctrl + Shift + S → Toggle solution
      if (mod && e.shiftKey && e.key === "S") {
        e.preventDefault();
        fetchSolutionData();
        setShowSolution((prev) => !prev);
        setActiveTab("description");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCompile, handleRun, fetchSolutionData]);

  return (
    <div className="h-[calc(100dvh-56px)] flex flex-col lg:flex-row">
      {/* Mobile panel toggle */}
      <div role="tablist" aria-label="Problem panels" className="flex lg:hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          role="tab"
          aria-selected={mobilePanel === "description"}
          onClick={() => setMobilePanel("description")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobilePanel === "description"
              ? "text-[var(--color-foreground)] border-b-2 border-[var(--color-accent)]"
              : "text-[var(--color-muted)]"
          }`}
        >
          Description
        </button>
        <button
          role="tab"
          aria-selected={mobilePanel === "editor"}
          onClick={() => setMobilePanel("editor")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobilePanel === "editor"
              ? "text-[var(--color-foreground)] border-b-2 border-[var(--color-accent)]"
              : "text-[var(--color-muted)]"
          }`}
        >
          Editor
        </button>
      </div>

      {/* Left Panel - Description */}
      <div className={`${mobilePanel === "description" ? "flex" : "hidden"} lg:flex w-full lg:w-[480px] lg:min-w-[380px] border-r border-[var(--color-border)] flex-col bg-[var(--color-surface)] min-h-0 flex-1 lg:flex-initial`}>
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab("description")}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "description"
                ? "text-[var(--color-foreground)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Description
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
                ? "text-[var(--color-foreground)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Results
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
                    className="hover:text-[var(--color-foreground)] transition-colors"
                  >
                    Solidity
                  </Link>
                  <span>/</span>
                  <span className="text-[var(--color-foreground)]">{problem.title}</span>
                </div>

                <Markdown content={problem.description} />

                {/* Hints */}
                <div className="mt-6">
                  <button
                    onClick={() => { fetchSolutionData(); setShowHints(!showHints); }}
                    className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                  >
                    {showHints ? "Hide Hints" : "Show Hints"}
                    <span className="ml-1 text-xs opacity-50">&#8984;&#8679;H</span>
                  </button>
                  <AnimatePresence>
                    {showHints && hints.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2">
                          {hints.map((hint, i) => (
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

                {/* Solution toggle */}
                <div className="mt-4">
                  <button
                    onClick={() => { fetchSolutionData(); setShowSolution(!showSolution); }}
                    className="text-sm text-[var(--color-warning)] hover:text-[var(--color-warning)] transition-colors"
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                    <span className="ml-1 text-xs opacity-50">&#8984;&#8679;S</span>
                  </button>
                  <AnimatePresence>
                    {showSolution && solution && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2">
                          <pre className="text-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-4 overflow-x-auto">
                            <code
                              className="text-[var(--color-foreground)]"
                              dangerouslySetInnerHTML={{ __html: highlightSolidity(solution) }}
                            />
                          </pre>
                          <button
                            onClick={() => {
                              setCode(solution);
                              setShowSolution(false);
                            }}
                            className="mt-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                          >
                            Apply solution code
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
                aria-live="polite"
              >
                {!results && !isCompiling && !isRunning && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg aria-hidden="true" className="w-10 h-10 text-[var(--color-muted)] opacity-40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                    </svg>
                    <p className="text-[var(--color-muted)] text-sm mb-1">Ready to run your code?</p>
                    <p className="text-xs text-[var(--color-muted)] opacity-60">
                      <kbd className="px-1.5 py-0.5 bg-[var(--color-border)] rounded text-[10px]">&#8984;Enter</kbd> Run
                      <span className="mx-2">|</span>
                      <kbd className="px-1.5 py-0.5 bg-[var(--color-border)] rounded text-[10px]">&#8984;&#8679;Enter</kbd> Test
                    </p>
                  </div>
                )}
                {(isCompiling || isRunning) && (
                  <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                    <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                    {isRunning ? "Running" : "Compiling"}
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
                    {isTestResult && (
                      <motion.div
                        variants={fadeInUpVariant}
                        className={`p-4 rounded-lg border ${
                          allPassed
                            ? "bg-[var(--color-success)]/5 border-[var(--color-success)]/20"
                            : "bg-[var(--color-danger)]/5 border-[var(--color-danger)]/20"
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
                          {results.length} tests passed
                        </p>
                      </motion.div>
                    )}

                    {/* Individual results */}
                    {results.map((r, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUpVariant}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          r.passed
                            ? "border-[var(--color-success)]/20 bg-[var(--color-success)]/5"
                            : "border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            r.passed
                              ? "bg-[var(--color-success)] text-white"
                              : "bg-[var(--color-danger)] text-white"
                          }`}
                        >
                          {r.passed ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm text-[var(--color-foreground)]">
                          {r.message}
                        </span>
                      </motion.div>
                    ))}

                    {/* Console output */}
                    {consoleLogs.length > 0 && (
                      <motion.div variants={fadeInUpVariant}>
                        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">Console Output</div>
                        <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-3 font-mono text-sm space-y-1">
                          {consoleLogs.map((log, i) => (
                            <div key={i} className="text-[var(--color-foreground)]">
                              <span className="text-[var(--color-muted)] mr-2">&gt;</span>
                              {log || <span className="text-[var(--color-muted)] italic">(empty)</span>}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

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
                          className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-success)] hover:brightness-90 text-white rounded-lg font-medium transition-all"
                        >
                          Next: {nextProblem.title}
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
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors flex items-center gap-1"
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
              Prev
            </Link>
          ) : (
            <div />
          )}
          {nextProblem ? (
            <Link
              href={`/problems/${nextProblem.id}`}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors flex items-center gap-1"
            >
              Next
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
      <div className={`${mobilePanel === "editor" ? "flex" : "hidden"} lg:flex flex-1 flex-col min-h-0`}>
        {/* Editor toolbar - file info */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-muted)]">
              contract.sol
            </span>
            <button
              onClick={toggleVimMode}
              className={`text-xs px-2 py-1 rounded-md border transition-all duration-200 ${
                vimMode
                  ? "text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                  : "text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)]"
              }`}
            >
              VIM
            </button>
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isLoading}
            aria-busy={isRunning}
            aria-label="Run code"
            className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-[var(--color-accent)]/40 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 font-medium transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {isRunning ? (
              <span className="inline-flex items-center gap-1">
                Running
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] animate-[dotPulse_1.4s_infinite_0s]" />
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] animate-[dotPulse_1.4s_infinite_0.2s]" />
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] animate-[dotPulse_1.4s_infinite_0.4s]" />
                </span>
              </span>
            ) : (
              "Run"
            )}
          </button>
          <button
            onClick={handleCompile}
            disabled={isLoading}
            aria-busy={isCompiling}
            aria-label="Run tests"
            className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-[var(--color-success)]/40 text-[var(--color-success)] hover:bg-[var(--color-success)]/10 font-medium transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {isCompiling ? (
              <span className="inline-flex items-center gap-1">
                Testing
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-success)] animate-[dotPulse_1.4s_infinite_0s]" />
                  <span className="w-1 h-1 rounded-full bg-[var(--color-success)] animate-[dotPulse_1.4s_infinite_0.2s]" />
                  <span className="w-1 h-1 rounded-full bg-[var(--color-success)] animate-[dotPulse_1.4s_infinite_0.4s]" />
                </span>
              </span>
            ) : (
              "Test"
            )}
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset code to starter"
            className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-[var(--color-danger)]/40 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 font-medium transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          </div>
          <span className="text-xs text-[var(--color-muted)] hidden sm:inline-flex items-center gap-2 opacity-60">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-border)] text-[10px]">&#8984;Enter</kbd>
              <span>Run</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-border)] text-[10px]">&#8984;&#8679;Enter</kbd>
              <span>Test</span>
            </span>
          </span>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <SolidityEditor value={code} onChange={setCode} vimMode={vimMode} />
        </div>
      </div>
    </div>
  );
}
