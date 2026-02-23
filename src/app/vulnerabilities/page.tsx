// src/app/vulnerabilities/page.tsx

import Link from "next/link";
import {
  vulnerabilityCategories,
  getVulnerabilitiesByCategory,
} from "@/data/vulnerabilities";
import Header from "@/components/Header";

export default function VulnerabilitiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-background)] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
            Vulnerability Reproduction
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            실제 해킹 사례를 포크된 체인에서 재현하며 보안 취약점을 학습합니다.
          </p>

          {vulnerabilityCategories.map((category) => {
            const problems = getVulnerabilitiesByCategory(category.id);

            return (
              <section key={category.id} className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                  {category.title}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {category.description}
                </p>

                <div className="grid gap-3">
                  {problems.map((problem) => (
                    <Link
                      key={problem.id}
                      href={`/vulnerabilities/${problem.id}`}
                      className="block p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-[var(--color-text)]">
                            {problem.title}
                          </h3>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                            Block: {problem.fork.blockNumber.toString()} |
                            Chain: {problem.fork.chainId}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            problem.difficulty === "beginner"
                              ? "bg-green-900/30 text-green-400"
                              : problem.difficulty === "intermediate"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
