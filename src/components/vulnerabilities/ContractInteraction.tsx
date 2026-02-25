"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { ExposedFunction } from "@/types/vulnerability";
import { parseContractAbi } from "@/lib/abi-parser";

interface ContractInteractionProps {
  sessionId: string | null;
  deployedContracts: Record<string, string>;
  contractAbis?: Record<string, string[]>;
  exposedFunctions?: ExposedFunction[];
  onSessionExpired?: () => Promise<void>;
}

interface CallResult {
  success: boolean;
  data?: unknown;
  error?: string;
  gasUsed?: string;
  reverted?: boolean;
  isView?: boolean;
}

interface InteractionLog {
  id: number;
  timestamp: string;
  action: string;
  target: string;
  result: CallResult;
}

export function ContractInteraction({
  sessionId,
  deployedContracts,
  contractAbis = {},
  exposedFunctions = [],
  onSessionExpired,
}: ContractInteractionProps) {
  const contractNames = Object.keys(deployedContracts);
  const [selectedContract, setSelectedContract] = useState<string>(contractNames[0] || "");
  const [functionName, setFunctionName] = useState("");
  const [argsInput, setArgsInput] = useState("");
  const [valueInput, setValueInput] = useState("0");
  const [abiInput, setAbiInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"call" | "inspect">("call");
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const logIdRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const reinitializingRef = useRef(false);
  const pendingCallRef = useRef<{ action: string; payload: Record<string, unknown> } | null>(null);
  const isExecutingRef = useRef(false);
  const onSessionExpiredRef = useRef(onSessionExpired);
  const lastSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    onSessionExpiredRef.current = onSessionExpired;
  }, [onSessionExpired]);

  useEffect(() => {
    if (selectedContract && contractAbis[selectedContract]) {
      setAbiInput(JSON.stringify(contractAbis[selectedContract], null, 2));
    }
  }, [selectedContract, contractAbis]);

  // Reset input fields when target contract changes
  useEffect(() => {
    setFunctionName("");
    setArgsInput("");
    setValueInput("0");
  }, [selectedContract]);

  useEffect(() => {
    if (contractNames.length > 0 && !selectedContract) {
      setSelectedContract(contractNames[0]);
    }
  }, [contractNames, selectedContract]);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Parse ABI for selected contract to generate dynamic function list
  const parsedFunctions = useMemo(() => {
    const abi = contractAbis[selectedContract] || [];
    if (abi.length > 0) {
      return parseContractAbi(abi);
    }
    return [];
  }, [selectedContract, contractAbis]);

  // Create a set of parsed function signatures for filtering
  const parsedSignatures = useMemo(() => {
    return new Set(parsedFunctions.map(fn => fn.signature));
  }, [parsedFunctions]);

  // Filter exposedFunctions to only include those that exist in the selected contract's ABI
  // This prevents showing buttons for functions that don't exist in the current contract
  const relevantExposedFunctions = useMemo(() => {
    if (parsedFunctions.length === 0) {
      // If no ABI parsed, fall back to exposedFunctions (for backward compatibility)
      return exposedFunctions;
    }
    // Only include exposedFunctions that exist in the parsed ABI
    return exposedFunctions.filter(fn => parsedSignatures.has(fn.signature));
  }, [exposedFunctions, parsedFunctions, parsedSignatures]);

  // Merge exposedFunctions prop with parsed functions (props take precedence for matching signatures)
  const availableFunctions = useMemo(() => {
    const functionMap = new Map<string, ExposedFunction>();

    // Add parsed functions first (from ABI)
    for (const fn of parsedFunctions) {
      functionMap.set(fn.signature, fn);
    }

    // Only override with relevant exposedFunctions (filtered to current contract)
    for (const fn of relevantExposedFunctions) {
      functionMap.set(fn.signature, fn);
    }

    return Array.from(functionMap.values());
  }, [parsedFunctions, relevantExposedFunctions]);

  // Quick call functions (no parameters)
  const quickCallFunctions = useMemo(() => 
    availableFunctions.filter(fn => !fn.inputs || fn.inputs.length === 0),
    [availableFunctions]
  );

  // Parameter call functions (with parameters)
  const parameterCallFunctions = useMemo(() => 
    availableFunctions.filter(fn => fn.inputs && fn.inputs.length > 0),
    [availableFunctions]
  );

  const addLog = (action: string, target: string, result: CallResult) => {
    const newLog: InteractionLog = {
      id: ++logIdRef.current,
      timestamp: new Date().toLocaleTimeString(),
      action,
      target,
      result,
    };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const executeApiCall = useCallback(async (
    currentSessionId: string,
    action: string,
    payload: Record<string, unknown>
  ) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;

    setLoading(true);

    try {
      const res = await fetch("/api/vulnerability/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSessionId, action, payload }),
      });

      const data = await res.json();

      if (res.status === 404 && data.error?.includes("Session not found")) {
        if (onSessionExpiredRef.current && !reinitializingRef.current) {
          pendingCallRef.current = { action, payload };
          reinitializingRef.current = true;
          const errorResult: CallResult = { success: false, error: "Session expired. Reinitializing..." };
          addLog(action, payload.target as string || selectedContract, errorResult);
          try {
            await onSessionExpiredRef.current();
            isExecutingRef.current = false;
          } catch {
            const failResult: CallResult = { success: false, error: "Failed to reinitialize. Please click Reset." };
            addLog(action, payload.target as string || selectedContract, failResult);
            pendingCallRef.current = null;
            reinitializingRef.current = false;
            isExecutingRef.current = false;
          }
        } else {
          isExecutingRef.current = false;
        }
        return;
      }

      addLog(action, payload.target as string || selectedContract, data);
      isExecutingRef.current = false;
    } catch (e) {
      const errorResult: CallResult = { success: false, error: e instanceof Error ? e.message : "Unknown error" };
      addLog(action, payload.target as string || selectedContract, errorResult);
      isExecutingRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [selectedContract]);

  useEffect(() => {
    const newSessionId = sessionId;
    
    if (newSessionId && 
        newSessionId !== lastSessionIdRef.current && 
        pendingCallRef.current && 
        !reinitializingRef.current &&
        !isExecutingRef.current) {
      
      lastSessionIdRef.current = newSessionId;
      reinitializingRef.current = false;
      
      const pendingCall = pendingCallRef.current;
      pendingCallRef.current = null;
      executeApiCall(newSessionId, pendingCall.action, pendingCall.payload);
    }
  }, [sessionId, executeApiCall]);

  const handleApiCall = useCallback(async (action: string, payload: Record<string, unknown>) => {
    if (!sessionId) {
      if (onSessionExpiredRef.current) {
        pendingCallRef.current = { action, payload };
        reinitializingRef.current = true;
        const errorResult: CallResult = { success: false, error: "Initializing session..." };
        addLog(action, payload.target as string || selectedContract, errorResult);
        try {
          await onSessionExpiredRef.current();
        } catch {
          const failResult: CallResult = { success: false, error: "Failed to initialize. Please reset the challenge." };
          addLog(action, payload.target as string || selectedContract, failResult);
          pendingCallRef.current = null;
          reinitializingRef.current = false;
        }
      } else {
        const errorResult: CallResult = { success: false, error: "No active session. Please reset the challenge." };
        addLog(action, payload.target as string || selectedContract, errorResult);
      }
      return;
    }

    await executeApiCall(sessionId, action, payload);
  }, [sessionId, selectedContract, executeApiCall]);

  const handleCall = async () => {
    if (!functionName) return;

    let args: unknown[] = [];
    if (argsInput.trim()) {
      try {
        args = JSON.parse(argsInput);
      } catch {
        const errorResult: CallResult = { success: false, error: "Invalid JSON for arguments" };
        addLog("call", selectedContract, errorResult);
        return;
      }
    }

    let abi: string[] = [];
    if (abiInput.trim()) {
      try {
        abi = JSON.parse(abiInput);
      } catch {
        const errorResult: CallResult = { success: false, error: "Invalid JSON for ABI" };
        addLog("call", selectedContract, errorResult);
        return;
      }
    }

    await handleApiCall("call", {
      target: selectedContract,
      functionName,
      args,
      abi,
      value: valueInput,
    });
  };

  const handleQuickFunction = async (fn: ExposedFunction) => {
    // Build complete ABI with return types for proper decoding
    let functionAbi = `function ${fn.signature}`;
    
    // Add state mutability if present
    if (fn.stateMutability) {
      functionAbi += ` ${fn.stateMutability}`;
    }
    
    // Add return types for proper decoding
    if (fn.outputs && fn.outputs.length > 0) {
      const outputs = fn.outputs.map(o => o.type).join(", ");
      functionAbi += ` returns (${outputs})`;
    }
    
    await handleApiCall("call", {
      target: selectedContract,
      functionName: fn.name,
      args: [],
      abi: [functionAbi],
      value: "0",
    });
  };

  const handleCheckBalance = async () => {
    await handleApiCall("getBalance", { target: selectedContract });
  };

  const handleCheckStorage = async () => {
    const slot = prompt("Enter storage slot (e.g., 0x0000...0000):");
    if (!slot) return;
    await handleApiCall("getStorage", { target: selectedContract, slot });
  };

  const handleCheckCode = async () => {
    await handleApiCall("getCode", { target: selectedContract });
  };

  const handleGetAccount = async () => {
    await handleApiCall("getAccount", { target: selectedContract });
  };

  const formatResult = (data: unknown): string => {
    if (typeof data === "string") return data;
    if (typeof data === "bigint") return data.toString();
    if (Array.isArray(data)) {
      return `[${data.map(formatResult).join(", ")}]`;
    }
    if (typeof data === "object" && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  const formatActionLabel = (action: string): string => {
    switch (action) {
      case "call": return "Call";
      case "getBalance": return "Balance";
      case "getStorage": return "Storage";
      case "getCode": return "Code";
      case "getAccount": return "Account";
      default: return action;
    }
  };

  const handleTabChange = (tab: "call" | "inspect") => {
    setActiveTab(tab);
    // Scroll to top of component when switching tabs to prevent layout issues
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentContractAbi = contractAbis[selectedContract] || [];
  const isReady = sessionId !== null && contractNames.length > 0 && !reinitializingRef.current && !loading;

  return (
    <div ref={containerRef} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden flex flex-col h-full">
      <div className="flex border-b border-[var(--color-border)]">
        <button
          onClick={() => handleTabChange("call")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "call"
              ? "text-[var(--color-foreground)] bg-[var(--color-background)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          }`}
        >
          Call
        </button>
        <button
          onClick={() => handleTabChange("inspect")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "inspect"
              ? "text-[var(--color-foreground)] bg-[var(--color-background)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          }`}
        >
          Inspect
        </button>
      </div>

      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="mb-3">
          <label className="text-xs text-[var(--color-muted)] block mb-1">
            Target Contract
          </label>
          <select
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)]"
          >
            {contractNames.map((name) => (
              <option key={name} value={name}>
                {name} ({deployedContracts[name].slice(0, 10)}...)
              </option>
            ))}
          </select>
          {currentContractAbi.length > 0 && (
            <p className="text-xs text-[var(--color-muted)] mt-1">
              ABI loaded: {currentContractAbi.length} function{currentContractAbi.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {activeTab === "call" && (
          <>
            {!isReady && (
              <div className="mb-3 p-2 bg-yellow-900/20 border border-yellow-700 rounded text-xs text-yellow-400">
                {reinitializingRef.current ? "Reinitializing session..." : "Waiting for session..."}
              </div>
            )}

            {quickCallFunctions.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-[var(--color-muted)] block mb-1">
                  Quick Calls
                </label>
                <div className="flex flex-wrap gap-1">
                  {quickCallFunctions.map((fn) => (
                    <button
                      key={fn.signature}
                      onClick={() => handleQuickFunction(fn)}
                      disabled={loading || !isReady}
                      className="text-xs px-2 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                    >
                      {fn.name}()
                    </button>
                  ))}
                </div>
              </div>
            )}

            {parameterCallFunctions.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-[var(--color-muted)] block mb-1">
                  Parameter Calls
                </label>
                <div className="space-y-1">
                  {parameterCallFunctions.map((fn) => (
                    <button
                      key={fn.signature}
                      onClick={() => {
                        setFunctionName(fn.name);
                        const inputTypes = fn.inputs?.map(i => i.type).join(", ") || "";
                        const inputNames = fn.inputs?.map(i => i.name).join(", ") || "";
                        const placeholder = fn.inputs?.map(i => {
                          if (i.type === "address") return '"0x..."';
                          if (i.type === "uint256" || i.type === "uint") return "0";
                          if (i.type === "bool") return "true";
                          if (i.type === "bytes") return '"0x..."';
                          return "?";
                        }).join(", ") || "";
                        setArgsInput("");
                        (document.querySelector('[data-placeholder-hint]') as HTMLElement)?.setAttribute('data-hint', placeholder);
                      }}
                      disabled={loading || !isReady}
                      className="w-full text-left text-xs px-2 py-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                    >
                      <span className="text-[var(--color-foreground)]">{fn.name}</span>
                      <span className="text-[var(--color-muted)]">({fn.inputs?.map(i => `${i.type} ${i.name}`).join(", ")})</span>
                      {fn.outputs && fn.outputs.length > 0 && (
                        <span className="text-[var(--color-muted)]"> → {fn.outputs.map(o => o.type).join(", ")}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="text-xs text-[var(--color-muted)] block mb-1">
                Function Name
              </label>
              <input
                type="text"
                placeholder="e.g., balanceOf"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-[var(--color-muted)] block mb-1">
                Arguments (JSON array)
              </label>
              <input
                type="text"
                placeholder='e.g., ["0x1234..."]'
                value={argsInput}
                onChange={(e) => setArgsInput(e.target.value)}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] font-mono text-xs focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-[var(--color-muted)] block mb-1">
                  Value (ETH)
                </label>
                <input
                  type="text"
                  placeholder="0"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCall}
                  disabled={loading || !isReady || !functionName}
                  className="w-full px-4 py-2 bg-[var(--color-accent)] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {loading ? "..." : "Execute"}
                </button>
              </div>
            </div>

            <details className="mb-0" open={currentContractAbi.length > 0}>
              <summary className="text-xs text-[var(--color-muted)] cursor-pointer hover:text-[var(--color-foreground)]">
                ABI {currentContractAbi.length > 0 && "(auto-loaded)"}
              </summary>
              <textarea
                placeholder='["function balanceOf(address) view returns (uint256)"]'
                value={abiInput}
                onChange={(e) => setAbiInput(e.target.value)}
                className="w-full mt-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-accent)] resize-none"
                rows={3}
              />
            </details>
          </>
        )}

        {activeTab === "inspect" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCheckBalance}
              disabled={loading || !isReady}
              className="px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-sm hover:border-[var(--color-accent)] transition-colors disabled:opacity-50"
            >
              Balance
            </button>
            <button
              onClick={handleCheckStorage}
              disabled={loading || !isReady}
              className="px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-sm hover:border-[var(--color-accent)] transition-colors disabled:opacity-50"
            >
              Storage
            </button>
            <button
              onClick={handleCheckCode}
              disabled={loading || !isReady}
              className="px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-sm hover:border-[var(--color-accent)] transition-colors disabled:opacity-50"
            >
              Code
            </button>
            <button
              onClick={handleGetAccount}
              disabled={loading || !isReady}
              className="px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded text-sm hover:border-[var(--color-accent)] transition-colors disabled:opacity-50"
            >
              Account Info
            </button>
          </div>
        )}
      </div>

      {/* Interaction Logs */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
          <span className="text-xs font-medium text-[var(--color-foreground)]">
            Interaction Logs
          </span>
          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-3 bg-[var(--color-background)] min-h-[100px] max-h-[200px]">
          {logs.length === 0 ? (
            <div className="text-xs text-[var(--color-muted)]">
              No interactions yet. Execute a call or inspect a contract to see results.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded text-xs font-mono ${
                    log.result.success
                      ? "bg-green-900/20 border border-green-800"
                      : "bg-red-900/20 border border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[var(--color-muted)]">{log.timestamp}</span>
                    <span className="text-[var(--color-accent)]">{formatActionLabel(log.action)}</span>
                    <span className="text-[var(--color-muted)]">→</span>
                    <span className="text-[var(--color-foreground)]">{log.target?.slice(0, 10)}...</span>
                    <span className={log.result.success ? "text-green-400" : "text-red-400"}>
                      {log.result.success ? "✓" : "✗"}
                    </span>
                  </div>
                  {log.result.error ? (
                    <pre className="text-red-400 whitespace-pre-wrap break-all">{log.result.error}</pre>
                  ) : (
                    (log.result.isView || log.result.data !== "0x") && log.result.data != null && (
                      <pre className="text-[var(--color-foreground)] whitespace-pre-wrap break-all">
                        {String(formatResult(log.result.data))}
                      </pre>
                    )
                  )}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mt-2">
              <div className="animate-spin h-3 w-3 border-2 border-[var(--color-accent)] border-t-transparent rounded-full" />
              Executing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}