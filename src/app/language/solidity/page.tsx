import Link from "next/link";
import { categories, getProblemsByCategory } from "@/data/problems";

const difficultyColors = {
  beginner: "text-green-400 bg-green-400/10",
  intermediate: "text-yellow-400 bg-yellow-400/10",
  advanced: "text-red-400 bg-red-400/10",
};

const difficultyLabels = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

export default function SolidityCoursePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#363636] to-[#5c5c5c] rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Solidity</h1>
            <p className="text-sm text-[var(--color-muted)]">
              스마트 컨트랙트 프로그래밍 언어
            </p>
          </div>
        </div>
        <p className="text-[var(--color-muted)]">
          Solidity의 기초부터 ERC-20 토큰까지, 단계별로 실습하며 스마트 컨트랙트
          개발을 마스터하세요. 각 문제는 작은 개념 하나에 집중하여 따라하기만 해도
          자연스럽게 전체를 이해할 수 있습니다.
        </p>
      </div>

      {/* Categories & Problems */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catProblems = getProblemsByCategory(cat.id);
          if (catProblems.length === 0) return null;

          return (
            <section key={cat.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium text-[var(--color-accent)] bg-blue-500/10 px-2.5 py-1 rounded-full">
                  {cat.order}단계
                </span>
                <h2 className="text-lg font-semibold">{cat.title}</h2>
                <span className="text-xs text-[var(--color-muted)]">
                  {catProblems.length}문제
                </span>
              </div>
              <p className="text-sm text-[var(--color-muted)] mb-3">
                {cat.description}
              </p>

              <div className="space-y-2">
                {catProblems.map((problem, idx) => (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="group flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-surface)] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-[var(--color-border)] flex items-center justify-center text-sm font-medium text-[var(--color-muted)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-medium text-white group-hover:text-[var(--color-accent)] transition-colors">
                          {problem.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${difficultyColors[problem.difficulty]}`}
                      >
                        {difficultyLabels[problem.difficulty]}
                      </span>
                      <svg
                        className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors"
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
