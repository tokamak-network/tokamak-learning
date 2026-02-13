import Link from "next/link";
import { categories, problems } from "@/data/problems";

export default function Home() {
  const totalProblems = problems.length;
  const totalCategories = categories.length;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-400">
                Powered by Tokamak Network
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Write your first
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                1,000 lines of Solidity
              </span>
            </h1>
            <p className="text-xl text-[var(--color-muted)] mb-8 leading-relaxed">
              작은 단위부터 하나씩 실습하며 Solidity 스마트 컨트랙트를
              마스터하세요. 브라우저에서 바로 코드를 작성하고 컴파일할 수
              있습니다.
            </p>
            <div className="flex gap-4">
              <Link
                href="/language/solidity"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                학습 시작하기
              </Link>
              <Link
                href="/problems/hello-solidity"
                className="border border-[var(--color-border)] hover:border-[var(--color-muted)] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                첫 번째 문제 풀기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{totalProblems}</div>
            <div className="text-sm text-[var(--color-muted)] mt-1">
              실습 문제
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {totalCategories}
            </div>
            <div className="text-sm text-[var(--color-muted)] mt-1">
              학습 카테고리
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-sm text-[var(--color-muted)] mt-1">
              브라우저 실행
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-2">커리큘럼</h2>
        <p className="text-[var(--color-muted)] mb-8">
          기초부터 실전까지 체계적으로 학습합니다
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catProblems = problems.filter(
              (p) => p.category === cat.id
            );
            return (
              <Link
                key={cat.id}
                href="/language/solidity"
                className="group border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-accent)] transition-colors bg-[var(--color-surface)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--color-accent)] bg-blue-500/10 px-2 py-1 rounded">
                    {cat.order}단계
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {catProblems.length}문제
                  </span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors mb-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)]">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="text-sm text-[var(--color-muted)]">
            &copy; 2025 Tokamak Network. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a
              href="https://tokamak.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-muted)] hover:text-white transition-colors"
            >
              Tokamak Network
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
