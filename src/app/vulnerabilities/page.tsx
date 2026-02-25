import Link from "next/link";
import { motion } from "framer-motion";
import {
  vulnerabilityCategories,
  getChallengesByCategory,
} from "@/data/vulnerabilities";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

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

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {challenges.map((challenge) => (
                  <motion.div key={challenge.id} variants={fadeInUp}>
                    <Link
                      href={`/vulnerabilities/${challenge.id}`}
                      className="glow-card group flex flex-col h-full rounded-xl p-6 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/50 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                            challenge.difficulty === "beginner"
                              ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                              : challenge.difficulty === "intermediate"
                              ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20"
                              : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20"
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors mb-2 tracking-tight">
                        {challenge.title}
                      </h3>
                      <div className="mt-auto pt-4 flex flex-col gap-1 text-xs text-[var(--color-muted)] border-t border-[var(--color-border)]/50">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{challenge.incident.date}</span>
                        </div>
                        {challenge.incident.losses && (
                          <div className="flex items-center gap-2 text-[var(--color-warning)]">
                            <span>💰</span>
                            <span>{challenge.incident.losses}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          );
        })}
      </div>
    </main>
  );
}