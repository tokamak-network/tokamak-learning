"use client";

import Link from "next/link";
import Image from "next/image";
import { categories, problems } from "@/data/problems";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// -- CountUp component: animates a number from 0 to target when in viewport --

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

// -- Rotating words for hero --

const rotatingWords = ["Coding", "Solidity", "Rust", "DeFi", "Web3"];

// -- Animation variants --

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// -- Categories section (needs its own component for useInView hook) --

function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold mb-2">Curriculum</h2>
      <p className="text-[var(--color-muted)] mb-8">
        A structured learning path from basics to real-world practice
      </p>
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
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                href="/language/solidity"
                className="group flex flex-col h-full border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-accent)] transition-all bg-[var(--color-surface)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--color-accent)] bg-blue-500/10 px-2 py-1 rounded">
                    Step {cat.order}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {catProblems.length} problems
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] flex-1">
                  {cat.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// -- Main page component --

export default function Home() {
  const totalProblems = problems.length;
  const totalCategories = categories.length;
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 py-24 relative flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="max-w-3xl flex-1"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-400">
                Powered by Tokamak Network
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl font-bold mb-6 leading-tight tracking-tight"
            >
              Master{" "}
              <span className="relative inline-flex overflow-hidden align-bottom h-[1.2em] min-w-[280px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              with Plasma Energy.
              <br />
              <span className="text-[var(--color-muted)] text-4xl font-semibold">
                Learn. Code. Evolve.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-[var(--color-muted)] mb-8 leading-relaxed"
            >
              A hands-on learning platform by Tokamak Network.
              Write and compile code directly in your browser.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4">
              <Link
                href="/language/solidity"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                Start Learning
              </Link>
              <Link
                href="/problems/hello-solidity"
                className="border border-[var(--color-border)] hover:border-[var(--color-muted)] text-[var(--color-foreground)] px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                Try First Problem
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex-shrink-0 hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Image
              src="/main.png"
              alt="TokamakLearn[:run]"
              width={420}
              height={280}
              priority
              className="rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-[var(--color-foreground)] tabular-nums">
              <CountUp target={totalProblems} />
            </div>
            <div className="text-sm text-[var(--color-muted)] mt-1">
              Practice Problems
            </div>
          </div>
          <div className="border-x border-[var(--color-border)]">
            <div className="text-3xl font-bold text-[var(--color-foreground)] tabular-nums">
              <CountUp target={totalCategories} />
            </div>
            <div className="text-sm text-[var(--color-muted)] mt-1">
              Categories
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--color-foreground)] tabular-nums">
              <CountUp target={100} suffix="%" />
            </div>
            <div className="text-sm text-[var(--color-muted)] mt-1">
              In-Browser
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <CategoriesSection />

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="text-sm text-[var(--color-muted)]">
            &copy; 2025 TokamakLearn[:run]. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a
              href="https://tokamak.network"
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[var(--color-foreground)] after:transition-all hover:after:w-full"
            >
              Tokamak Network
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
