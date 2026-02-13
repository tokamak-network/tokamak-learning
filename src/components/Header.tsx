"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isProblemPage = pathname.startsWith("/problems/");

  return (
    <header className="border-b border-gray-800 bg-[#0d1117]">
      <div
        className={`flex items-center justify-between h-14 px-6 ${isProblemPage ? "" : "max-w-6xl mx-auto"}`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-transform duration-200 hover:scale-105">
            T
          </div>
          <span className="font-semibold text-white text-lg">Toka Learn</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/language/solidity"
            className={`text-sm transition-colors relative ${
              pathname.startsWith("/language")
                ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--color-accent)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Curriculum
          </Link>
          <a
            href="https://tokamak.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Tokamak Network
          </a>
        </nav>
      </div>
    </header>
  );
}
