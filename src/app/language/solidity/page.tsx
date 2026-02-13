"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { categories, getProblemsByCategory } from "@/data/problems";
import type { Category } from "@/data/problems";

const difficultyColors = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  advanced: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

function CategorySection({ cat, completedProblems }: { cat: Category; completedProblems: Set<string> }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const catProblems = getProblemsByCategory(cat.id);
  const completedCount = catProblems.filter((p) => completedProblems.has(p.id)).length;

  if (catProblems.length === 0) return null;

  const progress = catProblems.length > 0 ? (completedCount / catProblems.length) * 100 : 0;

  return (
    <section ref={ref}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-mono font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2.5 py-1 rounded-md">
          {String(cat.order).padStart(2, "0")}
        </span>
        <h2 className="text-lg font-semibold tracking-tight">{cat.title}</h2>
        <span className="text-xs text-[var(--color-muted)] ml-auto">
          {completedCount}/{catProblems.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--color-border)] rounded-full mb-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${progress}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
      </div>

      <p className="text-sm text-[var(--color-muted)] mb-4">
        {cat.description}
      </p>

      <motion.div
        className="space-y-1.5"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {catProblems.map((problem, idx) => {
          const isCompleted = completedProblems.has(problem.id);
          return (
            <motion.div key={problem.id} variants={fadeInUp}>
              <Link
                href={`/problems/${problem.id}`}
                className="group flex items-center justify-between p-3.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all hover:shadow-[var(--shadow-glow)]"
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isCompleted
                      ? "bg-[var(--color-success)]/20 text-[var(--color-success)] ring-1 ring-[var(--color-success)]/30"
                      : "bg-[var(--color-border)] text-[var(--color-muted)] group-hover:bg-[var(--color-accent)]/20 group-hover:text-[var(--color-accent)] group-hover:ring-1 group-hover:ring-[var(--color-accent)]/30"
                  }`}>
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                    {problem.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md border ${difficultyColors[problem.difficulty]}`}
                  >
                    {difficultyLabels[problem.difficulty]}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export default function SolidityCoursePage() {
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("completedProblems");
      if (stored) {
        setCompletedProblems(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const totalCompleted = completedProblems.size;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Course Header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Solidity</h1>
            <p className="text-sm text-[var(--color-muted)]">
              Smart Contract Programming Language
            </p>
          </div>
          {totalCompleted > 0 && (
            <span className="ml-auto text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1.5 rounded-full">
              {totalCompleted} completed
            </span>
          )}
        </div>
        <p className="text-[var(--color-muted)] leading-relaxed">
          From Solidity basics to ERC-20 tokens, master smart contract
          development through hands-on, step-by-step exercises.
        </p>
      </motion.div>

      {/* Categories & Problems */}
      <div className="space-y-10">
        {categories.map((cat) => (
          <CategorySection key={cat.id} cat={cat} completedProblems={completedProblems} />
        ))}
      </div>
    </main>
  );
}
