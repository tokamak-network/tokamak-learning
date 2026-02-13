"use client";

import Link from "next/link";
import Image from "next/image";
import { categories, problems } from "@/data/problems";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PlasmaCanvas from "@/components/PlasmaCanvas";

// -- CountUp --

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// -- Rotating words --

const rotatingWords = ["Solidity", "Rust", "DeFi", "Web3", "Coding"];

// -- Animation variants --

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

// -- Categories section --

function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-accent)]/40 to-transparent" />
          <span className="text-xs font-medium text-[var(--color-accent)] tracking-widest uppercase">
            Curriculum
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[var(--color-accent)]/40 to-transparent" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
          Structured Learning Path
        </h2>
        <p className="text-[var(--color-muted)] text-center max-w-xl mx-auto">
          From basics to real-world practice, master smart contract development step by step
        </p>
      </motion.div>
      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {categories.map((cat, i) => {
          const catProblems = problems.filter((p) => p.category === cat.id);
          return (
            <motion.div
              key={cat.id}
              variants={fadeInUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/language/solidity#${cat.id}`}
                className="glow-card group flex flex-col h-full rounded-xl p-6 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/50 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2.5 py-1 rounded-md">
                    {String(cat.order).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {catProblems.length} problems
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors mb-2 tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] flex-1 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                  <span>Start learning</span>
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// -- Main --

function isDailyCompleted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("dailyChallenge");
    if (!raw) return false;
    const data = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    return data.date === today && data.completed === true;
  } catch {
    return false;
  }
}

export default function Home() {
  const totalProblems = problems.length;
  const totalCategories = categories.length;
  const [wordIndex, setWordIndex] = useState(0);
  const [dailyDone, setDailyDone] = useState(false);

  useEffect(() => {
    setDailyDone(isDailyCompleted()); // eslint-disable-line react-hooks/set-state-in-effect
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Layered plasma background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-blue-600/5 to-transparent" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-[plasma-drift_20s_ease-in-out_infinite]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] animate-[plasma-drift_15s_ease-in-out_infinite_reverse]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="max-w-2xl flex-1"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 rounded-full px-4 py-1.5 mb-8"
            >
              <div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-pulse" />
              <span className="text-sm text-[var(--color-accent)] font-medium">
                Powered by Tokamak Network
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight"
            >
              Master{" "}
              <span className="relative inline-flex overflow-hidden align-bottom h-[1.15em] min-w-[200px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              <span className="text-[var(--color-muted)]">
                with Plasma Energy.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[var(--color-muted)] mb-10 leading-relaxed max-w-lg"
            >
              A hands-on learning platform by Tokamak Network.
              Write, compile, repeat — build muscle memory for coding.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex gap-3">
              <Link
                href="/daily"
                className={`md:hidden group relative px-6 py-3 rounded-lg font-medium transition-all ${
                  dailyDone
                    ? "bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[var(--shadow-glow-strong)] hover:scale-[1.02]"
                }`}
              >
                {dailyDone ? "✓ Completed" : "Daily Challenge"}
              </Link>
              <Link
                href="/language/solidity"
                className="hidden md:inline-flex group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-[var(--shadow-glow-strong)] hover:scale-[1.02]"
              >
                Start Learning
              </Link>
              <Link
                href="/problems/hello-solidity"
                className="hidden md:inline-flex border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-[var(--color-foreground)] px-6 py-3 rounded-lg font-medium transition-all hover:bg-[var(--color-surface)] hover:scale-[1.02]"
              >
                Try First Problem
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-shrink-0 hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <PlasmaCanvas />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-3 gap-3 md:gap-8 text-center">
          <div>
            <div className="text-2xl md:text-4xl font-bold text-[var(--color-foreground)] tabular-nums tracking-tight">
              <CountUp target={totalProblems} />
            </div>
            <div className="text-xs md:text-sm text-[var(--color-muted)] mt-1.5">
              Problems
            </div>
          </div>
          <div className="border-x border-[var(--color-border)]">
            <div className="text-2xl md:text-4xl font-bold text-[var(--color-foreground)] tabular-nums tracking-tight">
              <CountUp target={totalCategories} />
            </div>
            <div className="text-xs md:text-sm text-[var(--color-muted)] mt-1.5">
              Tracks
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tabular-nums tracking-tight">
              <CountUp target={100} suffix="%" />
            </div>
            <div className="text-xs md:text-sm text-[var(--color-muted)] mt-1.5">
              In-Browser
            </div>
          </div>
        </div>
      </section>

      {/* Categories — desktop only */}
      <div className="hidden md:block">
        <CategoriesSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="text-xs md:text-sm text-[var(--color-muted)]">
            &copy; 2025 TokamakLearn[:run]
          </div>
          <a
            href="https://tokamak.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5"
          >
            <Image src="/tokamak-icon.png" alt="Tokamak Network" width={20} height={20} className="w-5 h-5" />
            <span className="hidden md:inline text-sm">Tokamak Network</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
