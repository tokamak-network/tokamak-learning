// src/components/vulnerabilities/ForkConfigPanel.tsx

"use client";

import { useState } from "react";
import type { VulnerabilityProblem } from "@/types/vulnerability";

interface ForkConfigPanelProps {
  problem: VulnerabilityProblem;
  onFork: (rpcUrl: string) => Promise<void>;
  isForking: boolean;
  isForked: boolean;
}

export function ForkConfigPanel({
  problem,
  onFork,
  isForking,
  isForked,
}: ForkConfigPanelProps) {
  const [rpcUrl, setRpcUrl] = useState(problem.fork.defaultRpc);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
        Fork Configuration
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--color-text-secondary)] mb-1">
            RPC URL
          </label>
          <input
            type="text"
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
            placeholder="https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="flex gap-4 text-xs text-[var(--color-text-secondary)]">
          <div>
            <span className="font-medium">Block:</span>{" "}
            {problem.fork.blockNumber.toString()}
          </div>
          <div>
            <span className="font-medium">Chain ID:</span> {problem.fork.chainId}
          </div>
        </div>

        <div className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-medium">Target Contract:</span>{" "}
          <code className="text-[var(--color-accent)]">
            {problem.targetContract.address}
          </code>
        </div>

        <button
          onClick={() => onFork(rpcUrl)}
          disabled={isForking || !rpcUrl}
          className="w-full py-2 px-4 bg-[var(--color-accent)] text-white rounded font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isForking ? "Forking..." : isForked ? "Forked" : "Fork Chain"}
        </button>
      </div>
    </div>
  );
}
