"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const pathname = usePathname();
  const isProblemPage = pathname.startsWith("/problems/");
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div
        className={`flex items-center justify-between h-14 px-6 ${isProblemPage ? "" : "max-w-6xl mx-auto"}`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-transform duration-200 hover:scale-105">
            T
          </div>
          <span className="font-semibold text-[var(--color-foreground)] text-lg">Tokamak Learning</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/language/solidity"
            className={`text-sm transition-colors relative ${
              pathname.startsWith("/language")
                ? "text-[var(--color-foreground)] after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--color-accent)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Curriculum
          </Link>
          <a
            href="https://tokamak.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Tokamak Network
          </a>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
