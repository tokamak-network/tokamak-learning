"use client";

import { useMemo, useEffect, useRef } from "react";
import type { ConstructorParamsConfig } from "@/types/vulnerability";

interface ConstructorParamsProps {
  config: ConstructorParamsConfig;
  deployedContracts: Record<string, string>;
  values: unknown[];
  onChange: (values: unknown[]) => void;
  disabled?: boolean;
}

export function ConstructorParams({
  config,
  deployedContracts,
  values,
  onChange,
  disabled = false,
}: ConstructorParamsProps) {
  const hasInitializedRef = useRef(false);

  // Find target contract address for auto-fill
  const targetContractAddress = useMemo(() => {
    if (config.autoFillOptions?.useDeployedContract) {
      return deployedContracts[config.autoFillOptions.useDeployedContract] || null;
    }
    return null;
  }, [config.autoFillOptions, deployedContracts]);

  // Auto-fill constructor args when target contract becomes available
  useEffect(() => {
    // Only run if we have auto-fill configured and a target address is available
    if (
      config.autoFillOptions?.useDeployedContract &&
      targetContractAddress &&
      config.params.length > 0 &&
      !hasInitializedRef.current
    ) {
      // Check if we need to auto-fill:
      // 1. values is empty, OR
      // 2. values has empty strings (initial state before target was deployed)
      const needsAutoFill =
        values.length === 0 ||
        (values.length > 0 &&
         values.some((v, index) => {
           // Check if this param should be auto-filled and is currently empty
           const param = config.params[index];
           return (
             param &&
             param.type === "address" &&
             param.name === "_target" &&
             (!v || v === "")
           );
         }));

      if (needsAutoFill) {
        const newValues = config.params.map((param, index) => {
          // Auto-fill address parameters
          if (
            param.type === "address" &&
            param.name === "_target" &&
            targetContractAddress
          ) {
            return targetContractAddress;
          }
          // Keep existing value if any
          return values[index] || "";
        });

        // Only update if values actually changed
        const hasChanged = newValues.some((v, i) => v !== values[i]);
        if (hasChanged) {
          onChange(newValues);
        }
        hasInitializedRef.current = true;
      }
    }
  }, [config, targetContractAddress, values, onChange]);

  const handleValueChange = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    onChange(newValues);
    // Mark as manually changed
    hasInitializedRef.current = true;
  };

  const handleAutoFill = (index: number) => {
    if (targetContractAddress) {
      handleValueChange(index, targetContractAddress);
    }
  };

  if (config.params.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-4 h-4 text-[var(--color-accent)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm font-medium text-[var(--color-foreground)]">
          Constructor Parameters
        </span>
      </div>

      <div className="space-y-2">
        {config.params.map((param, index) => (
          <div key={param.name}>
            <label className="block text-xs text-[var(--color-muted)] mb-1">
              <span className="font-mono">{param.name}</span>
              <span className="text-[var(--color-accent)] ml-1">({param.type})</span>
              {param.description && (
                <span className="block mt-0.5 text-[var(--color-muted)]">
                  {param.description}
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={(values[index] as string) || ""}
                onChange={(e) => handleValueChange(index, e.target.value)}
                disabled={disabled}
                placeholder={
                  param.type === "address"
                    ? "0x..."
                    : param.type.startsWith("uint")
                    ? "0"
                    : ""
                }
                className="flex-1 px-3 py-1.5 text-sm font-mono bg-[var(--color-background)] border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {param.type === "address" && targetContractAddress && (
                <button
                  type="button"
                  onClick={() => handleAutoFill(index)}
                  disabled={disabled}
                  className="px-2 py-1 text-xs text-[var(--color-accent)] border border-[var(--color-accent)]/40 rounded hover:bg-[var(--color-accent)]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  title={`Use ${config.autoFillOptions?.useDeployedContract} address`}
                >
                  Use Target
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {targetContractAddress && (
        <div className="mt-2 text-xs text-[var(--color-muted)]">
          💡 Auto-filled with the deployed{" "}
          <span className="text-[var(--color-accent)]">
            {config.autoFillOptions?.useDeployedContract}
          </span>{" "}
          address. You can modify if needed.
        </div>
      )}

      {!targetContractAddress && config.autoFillOptions?.useDeployedContract && (
        <div className="mt-2 text-xs text-yellow-400">
          ⏳ Waiting for {config.autoFillOptions.useDeployedContract} contract to be deployed...
        </div>
      )}
    </div>
  );
}