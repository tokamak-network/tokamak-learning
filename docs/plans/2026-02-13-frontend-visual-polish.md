# Frontend Visual Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Framer Motion animations, typography improvements, and visual polish to all pages of Toka Learn while keeping the current GitHub dark theme.

**Architecture:** Install framer-motion, update global CSS tokens/typography, then enhance each page independently with stagger animations, hover effects, and micro-interactions. Pages are independent so Tasks 3-5 can run in parallel.

**Tech Stack:** Framer Motion 12, Tailwind CSS 4, Next.js 16, React 19

---

### Task 1: Install Framer Motion

**Files:**
- Modify: `package.json`

**Step 1: Install framer-motion**

Run: `npm install framer-motion`
Expected: framer-motion added to dependencies in package.json

**Step 2: Verify installation**

Run: `npm ls framer-motion`
Expected: Shows framer-motion version

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion dependency"
```

---

### Task 2: Update Global CSS (Typography + Design Tokens)

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add design tokens and typography improvements**

Add to `@theme inline` block:
```css
--color-surface-hover: #1c2129;
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.3);
```

Update `.prose-dark` styles:
```css
.prose-dark {
  line-height: 1.75;
}
.prose-dark h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-foreground);
  letter-spacing: -0.02em;
}
.prose-dark h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-foreground);
  letter-spacing: -0.02em;
}
.prose-dark h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-foreground);
  letter-spacing: -0.01em;
}
```

Add `pre` left-border accent:
```css
.prose-dark pre {
  background: #0d1117;
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}
```

Add keyframe at bottom of file:
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dotPulse {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}
```

**Step 2: Verify dev server runs**

Run: `npm run dev` (check no CSS errors)

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: improve typography and add design tokens"
```

---

### Task 3: Landing Page Animations (src/app/page.tsx)

> **Parallelizable:** Can run simultaneously with Tasks 4 and 5 after Tasks 1-2 are complete.

**Files:**
- Modify: `src/app/page.tsx`

**Context:**
- Current file: `src/app/page.tsx` (134 lines)
- It's a Server Component currently — must convert to Client Component for Framer Motion
- Uses `categories` and `problems` from `@/data/problems`
- Has 4 sections: Hero, Stats, Categories Preview, Footer

**Step 1: Convert to client component and add Framer Motion imports**

Add at top of file:
```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
```

**Step 2: Add CountUp component and stagger variants**

After imports, before the Home component:
```tsx
function CountUp({ target, suffix = "" }: { target: number | string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numTarget = typeof target === "string" ? parseInt(target) || 0 : target;

  useEffect(() => {
    if (!isInView) return;
    const duration = 1000;
    const steps = 30;
    const increment = numTarget / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numTarget) {
        setCount(numTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numTarget]);

  return <span ref={ref}>{isInView ? count : 0}{suffix}</span>;
}

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
```

**Step 3: Wrap Hero section with motion stagger**

Replace the Hero section `<div className="max-w-3xl">` content with motion wrappers:
- Wrap outer div: `<motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">`
- Wrap badge div: `<motion.div variants={fadeInUp} className="inline-flex ...">`
- Wrap h1: `<motion.h1 variants={fadeInUp} className="text-5xl font-bold mb-6 leading-tight tracking-tight">`
- Wrap p: `<motion.p variants={fadeInUp} className="text-xl ...">`
- Wrap button div: `<motion.div variants={fadeInUp} className="flex gap-4">`

Add to both Link buttons: `transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`

**Step 4: Update Stats section with CountUp and dividers**

Replace the stats grid inner content:
```tsx
<div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
  <div>
    <div className="text-3xl font-bold text-white tabular-nums">
      <CountUp target={totalProblems} />
    </div>
    <div className="text-sm text-[var(--color-muted)] mt-1">실습 문제</div>
  </div>
  <div className="border-x border-[var(--color-border)]">
    <div className="text-3xl font-bold text-white tabular-nums">
      <CountUp target={totalCategories} />
    </div>
    <div className="text-sm text-[var(--color-muted)] mt-1">학습 카테고리</div>
  </div>
  <div>
    <div className="text-3xl font-bold text-white tabular-nums">
      <CountUp target={100} suffix="%" />
    </div>
    <div className="text-sm text-[var(--color-muted)] mt-1">브라우저 실행</div>
  </div>
</div>
```

**Step 5: Add stagger to Categories Preview cards**

Wrap the grid with a motion container using `useInView`:
```tsx
// Inside the component, add ref for categories section
const categoriesRef = useRef(null);
const categoriesInView = useInView(categoriesRef, { once: true, margin: "-100px" });
```

Replace the grid:
```tsx
<motion.div
  ref={categoriesRef}
  variants={stagger}
  initial="hidden"
  animate={categoriesInView ? "visible" : "hidden"}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
>
```

Each card `<Link>` should be wrapped with `<motion.div variants={fadeInUp}>` and add hover class: `hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]`

**Step 6: Polish Footer**

Add hover underline to footer link:
```tsx
className="text-sm text-[var(--color-muted)] hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-white hover:after:w-full after:transition-all"
```

**Step 7: Verify and commit**

Run: `npm run dev` — visit `/` and verify animations work
Run: `npm run build` — verify no build errors

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page animations and visual polish"
```

---

### Task 4: Curriculum Page Animations (src/app/language/solidity/page.tsx)

> **Parallelizable:** Can run simultaneously with Tasks 3 and 5 after Tasks 1-2 are complete.

**Files:**
- Modify: `src/app/language/solidity/page.tsx`

**Context:**
- Current file: `src/app/language/solidity/page.tsx` (107 lines)
- Server Component — must convert to Client Component
- Maps over `categories` and `getProblemsByCategory` to show problem lists
- Uses `difficultyColors` and `difficultyLabels` objects

**Step 1: Convert to client component and add imports**

Add at top:
```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
```

**Step 2: Add animation variants**

After imports:
```tsx
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};
```

**Step 3: Create CategorySection wrapper component**

This is needed because each category section needs its own `useInView` ref:
```tsx
function CategorySection({ cat, catProblems }: { cat: { id: string; order: number; title: string; description: string }; catProblems: Problem[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section key={cat.id}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-[var(--color-accent)] bg-blue-500/10 px-2.5 py-1 rounded-full">
          {cat.order}단계
        </span>
        <h2 className="text-lg font-semibold tracking-tight">{cat.title}</h2>
        <span className="text-xs text-[var(--color-muted)]">{catProblems.length}문제</span>
      </div>
      <p className="text-sm text-[var(--color-muted)] mb-3">{cat.description}</p>

      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="space-y-2"
      >
        {catProblems.map((problem, idx) => (
          <motion.div key={problem.id} variants={fadeInUp}>
            <Link
              href={`/problems/${problem.id}`}
              className="group flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-200"
            >
              {/* ... keep existing inner content ... */}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

**Step 4: Update page header**

Change Solidity icon gradient from gray to purple/blue:
```tsx
<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
```

Wrap header with fade-in:
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mb-8"
>
```

Add `tracking-tight` to the h1.

**Step 5: Update spacing**

Change `<div className="space-y-8">` to `<div className="space-y-10">` for categories gap.

**Step 6: Verify and commit**

Run: `npm run dev` — visit `/language/solidity` and verify animations
Run: `npm run build`

```bash
git add src/app/language/solidity/page.tsx
git commit -m "feat: add curriculum page animations and visual polish"
```

---

### Task 5: Problem Page Animations (src/app/problems/[id]/ProblemClient.tsx)

> **Parallelizable:** Can run simultaneously with Tasks 3 and 4 after Tasks 1-2 are complete.

**Files:**
- Modify: `src/app/problems/[id]/ProblemClient.tsx`

**Context:**
- Current file: `src/app/problems/[id]/ProblemClient.tsx` (349 lines)
- Already a Client Component ("use client")
- Has tabs (description/results), left panel (description), right panel (editor)
- Test results display with pass/fail cards
- Uses dynamic import for SolidityEditor

**Step 1: Add Framer Motion imports**

Add to existing imports:
```tsx
import { motion, AnimatePresence } from "framer-motion";
```

**Step 2: Add animated tab indicator**

Replace the tab buttons area. Instead of `border-b-2` on active tab, use a layoutId-based sliding indicator:

```tsx
{/* Tabs */}
<div className="flex border-b border-[var(--color-border)] relative">
  <button
    onClick={() => setActiveTab("description")}
    className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
      activeTab === "description" ? "text-white" : "text-[var(--color-muted)] hover:text-white"
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
    className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center gap-2 ${
      activeTab === "results" ? "text-white" : "text-[var(--color-muted)] hover:text-white"
    }`}
  >
    결과
    {results && (
      <span className={`w-2 h-2 rounded-full ${allPassed ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`} />
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
```

**Step 3: Add AnimatePresence for tab content transitions**

Wrap the tab content area with AnimatePresence:
```tsx
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
        {/* ... existing description content ... */}
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
        {/* ... existing results content ... */}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

**Step 4: Animate hints/solution toggle with AnimatePresence**

Replace hints section:
```tsx
<AnimatePresence>
  {showHints && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-2 space-y-2 overflow-hidden"
    >
      {problem.hints.map((hint, i) => (
        <div key={i} className="text-sm text-[var(--color-muted)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-3">
          {hint}
        </div>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

Same pattern for solution toggle.

**Step 5: Stagger test results appearance**

Replace the results map with staggered motion:
```tsx
{results && (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    className="space-y-3"
  >
    {/* Summary card */}
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      className={`p-4 rounded-lg border ${allPassed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}
    >
      {/* ... existing summary content ... */}
    </motion.div>

    {/* Individual results */}
    {results.map((r, i) => (
      <motion.div
        key={i}
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className={`flex items-start gap-3 p-3 rounded-lg border ${
          r.passed ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
        }`}
      >
        {/* ... existing result content ... */}
      </motion.div>
    ))}

    {/* Next problem button */}
    {allPassed && nextProblem && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
      >
        <Link href={`/problems/${nextProblem.id}`} className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-success)] hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
          다음 문제: {nextProblem.title}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    )}
  </motion.div>
)}
```

**Step 6: Improve compile loading state**

Replace "컴파일 중..." text with animated dots:
```tsx
{isCompiling && (
  <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
    <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    <span>컴파일 중<span className="inline-flex w-6"><span className="animate-[dotPulse_1.4s_infinite_0s]">.</span><span className="animate-[dotPulse_1.4s_infinite_0.2s]">.</span><span className="animate-[dotPulse_1.4s_infinite_0.4s]">.</span></span></span>
  </div>
)}
```

**Step 7: Add hover effects to toolbar buttons**

Update reset button:
```tsx
className="text-xs px-3 py-1.5 text-[var(--color-muted)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-muted)] rounded-md transition-all duration-200 hover:scale-[1.02]"
```

Update test button:
```tsx
className="text-xs px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
```

**Step 8: Verify and commit**

Run: `npm run dev` — visit `/problems/hello-solidity` and test:
- Tab switching animation
- Hint/solution toggle animation
- Compile and check result stagger
- Button hover effects

Run: `npm run build`

```bash
git add src/app/problems/[id]/ProblemClient.tsx
git commit -m "feat: add problem page animations and visual polish"
```

---

### Task 6: Header Polish (src/components/Header.tsx)

> **Can run in parallel with Tasks 3-5.**

**Files:**
- Modify: `src/components/Header.tsx`

**Context:**
- Current file: `src/components/Header.tsx` (45 lines)
- Client component with logo, nav links

**Step 1: Add subtle hover effect to logo**

Replace logo div:
```tsx
<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-transform duration-200 hover:scale-105">
  T
</div>
```

**Step 2: Add active indicator style improvement**

For the Curriculum nav link, add underline on active:
```tsx
className={`text-sm transition-colors relative ${
  pathname.startsWith("/language")
    ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--color-accent)]"
    : "text-gray-400 hover:text-white"
}`}
```

**Step 3: Verify and commit**

Run: `npm run dev` — check header across all pages

```bash
git add src/components/Header.tsx
git commit -m "style: polish header interactions"
```

---

### Task 7: Final Verification

**Step 1: Full build check**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Visual verification**

Run: `npm run dev` and check all 3 pages:
- `/` — Hero stagger, stat countup, card hover
- `/language/solidity` — Category stagger, card hover
- `/problems/hello-solidity` — Tab slide, result stagger, compile animation

**Step 3: Final commit if any fixes needed**

---

## Parallel Execution Strategy

```
Task 1 (install framer-motion) ──┐
                                  ├── Task 2 (globals.css) ──┐
                                  │                           ├── Task 3 (landing page)   ─┐
                                  │                           ├── Task 4 (curriculum page) ─┤── Task 7 (verify)
                                  │                           ├── Task 5 (problem page)    ─┤
                                  │                           └── Task 6 (header)          ─┘
```

**Agent Assignment for Parallel Execution:**
- **Agent A:** Task 3 (Landing page) — uses `frontend-design` skill
- **Agent B:** Task 4 (Curriculum page) — uses `frontend-design` skill
- **Agent C:** Task 5 (Problem page) — uses `frontend-design` skill
- **Task 6** (Header) is small enough to fold into any agent or run sequentially after

Tasks 1-2 must complete first (sequential). Then Agents A/B/C run in parallel. Task 7 runs after all complete.
