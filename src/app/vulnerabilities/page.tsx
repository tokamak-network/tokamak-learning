import Link from "next/link";
import {
  vulnerabilityCategories,
  getChallengesByCategory,
} from "@/data/vulnerabilities";

export default function VulnerabilitiesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
          Vulnerability Playground
        </h1>
        <p className="text-[var(--color-muted)] mb-8">
          Reproduce real-world smart contract vulnerabilities and learn security by doing.
        </p>

        {vulnerabilityCategories.map((category) => {
          const challenges = getChallengesByCategory(category.id);

          if (challenges.length === 0) return null;

          return (
            <section key={category.id} className="mb-8">
              <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
                {category.title}
              </h2>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                {category.description}
              </p>

              <div className="grid gap-3">
                {challenges.map((challenge) => (
                  <Link
                    key={challenge.id}
                    href={`/vulnerabilities/${challenge.id}`}
                    className="block p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[var(--color-foreground)]">
                          {challenge.title}
                        </h3>
                        <p className="text-xs text-[var(--color-muted)] mt-1">
                          {challenge.incident.name} | {challenge.incident.date}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          challenge.difficulty === "beginner"
                            ? "bg-green-900/30 text-green-400"
                            : challenge.difficulty === "intermediate"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {challenge.difficulty}
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
  );
}