// src/components/vulnerabilities/ResultPanel.tsx

"use client";

import { useMemo } from "react";
import type { ValidationResult } from "@/lib/exploit-validator";

export interface LogEntry {
  type: "info" | "success" | "error" | "warning";
  message: string;
}

interface ResultPanelProps {
  logs: LogEntry[];
  validationResult?: ValidationResult;
  isRunning: boolean;
}

export function ResultPanel({ logs, validationResult, isRunning }: ResultPanelProps) {
  const logColor = useMemo(() => ({
    info: "text-[var(--color-text-secondary)]",
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
  }), []);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
        Execution Results
      </h3>

      <div className="bg-[var(--color-background)] rounded p-3 min-h-[120px] max-h-[300px] overflow-y-auto font-mono text-xs">
        {logs.length === 0 && !isRunning && (
          <span className="text-[var(--color-text-secondary)]">
            Run your exploit to see results...
          </span>
        )}

        {isRunning && (
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <div className="animate-spin h-4 w-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full" />
            Executing...
          </div>
        )}

        {logs.map((log, i) => (
          <div key={i} className={`${logColor[log.type]} py-0.5`}>
            <span className="text-[var(--color-text-secondary)] mr-2">
              [{log.type.toUpperCase()}]
            </span>
            {log.message}
          </div>
        ))}
      </div>

      {validationResult && (
        <div
          className={`mt-3 p-3 rounded ${
            validationResult.passed
              ? "bg-green-900/20 border border-green-800"
              : "bg-red-900/20 border border-red-800"
          }`}
        >
          <div
            className={`font-semibold ${
              validationResult.passed ? "text-green-400" : "text-red-400"
            }`}
          >
            {validationResult.passed ? "🎉 Exploit Successful!" : "❌ Exploit Failed"}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">
            {validationResult.message}
          </div>
          {validationResult.details.map((detail, i) => (
            <div key={i} className="text-xs text-[var(--color-text-secondary)] mt-1">
              {detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
