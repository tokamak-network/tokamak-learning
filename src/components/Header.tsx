"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

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

export default function Header() {
  const pathname = usePathname();
  const isFullWidthPage = pathname.startsWith("/problems/") || pathname.startsWith("/vulnerabilities/");
  const { theme, toggleTheme } = useTheme();
  const [dailyDone, setDailyDone] = useState(false);

  useEffect(() => {
    setDailyDone(isDailyCompleted()); // eslint-disable-line react-hooks/set-state-in-effect
    const handler = () => setDailyDone(isDailyCompleted());
    window.addEventListener("dailyChallengeUpdate", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("dailyChallengeUpdate", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const dailyActive = pathname === "/daily";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-xl">
      <div
        className={`flex items-center justify-between h-14 px-3 md:px-6 ${isFullWidthPage ? "" : "max-w-6xl mx-auto"}`}
      >
        <Link href="/" className="relative flex items-center group shrink-0">
          <Image src="/logo.png" alt="TokamakLearn logo" width={290} height={160} priority className={`absolute -left-2 h-[36px] w-auto transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] ${theme === "light" ? "brightness-200 contrast-125 saturate-150" : ""}`} />
          <span className="pl-[40px] font-semibold text-[var(--color-foreground)] text-lg tracking-tight">
            Tokamak<span className="text-[var(--color-accent)]">Learn</span>
            <span className="text-[var(--color-muted)] font-mono text-sm ml-0.5">[:run]</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-0.5 md:gap-1">
          <Link
            href="/daily"
            aria-current={dailyActive ? "page" : undefined}
            className={`text-sm px-2 md:px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              dailyDone
                ? dailyActive
                  ? "text-[var(--color-success)] bg-[var(--color-success)]/10 font-medium"
                  : "text-[var(--color-success)] hover:bg-[var(--color-success)]/5"
                : dailyActive
                  ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 font-medium"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
            }`}
          >
            {dailyDone && (
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            Daily{dailyDone && <span className="sr-only"> (completed)</span>}
          </Link>
          <Link
            href="/blog"
            aria-current={pathname === "/blog" ? "page" : undefined}
            className={`hidden md:inline-block text-sm px-3 py-1.5 rounded-md transition-all ${
              pathname === "/blog"
                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
            }`}
          >
            Blog
          </Link>
          <Link
            href="/language/solidity"
            aria-current={pathname.startsWith("/language") ? "page" : undefined}
            className={`hidden md:inline-block text-sm px-3 py-1.5 rounded-md transition-all ${
              pathname.startsWith("/language")
                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
            }`}
          >
            Curriculum
          </Link>
          <Link
            href="/vulnerabilities"
            aria-current={pathname.startsWith("/vulnerabilities") ? "page" : undefined}
            className={`hidden md:inline-block text-sm px-3 py-1.5 rounded-md transition-all ${
              pathname.startsWith("/vulnerabilities")
                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
            }`}
          >
            Vulnerabilities
          </Link>
          <a
            href="https://tokamak.network"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tokamak Network (opens in new tab)"
            className="hidden md:inline-block text-sm px-3 py-1.5 rounded-md text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-all"
          >
            Tokamak Network
          </a>
          <div className="hidden md:block w-px h-4 bg-[var(--color-border)] mx-1" />
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-all"
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
