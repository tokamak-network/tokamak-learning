"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ResultPanel, type LogEntry } from "@/components/vulnerabilities/ResultPanel";
import SolidityHighlight from "@/components/SolidityHighlight";

// This contract MUST be compiled with solc 0.8.33 + via-IR to trigger the vulnerability
const TARGET_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;  // MUST use 0.8.33 or earlier!

contract UpgradeableVault {
    // ======== persistent storage ========
    address internal _owner;                       // slot 0
    mapping(uint256 => address) _nftApprovals;     // slot 1 base

    // ======== transient storage ========
    address internal transient _txSender;          // tslot 0

    constructor() {
        _owner = msg.sender;  // Initialize owner
    }

    function owner() external view returns (address) {
        return _owner;
    }

    // Step 1: This caches storage_set_to_zero_t_address with SSTORE
    // The compiler generates a helper function for deleting address in mapping
    function makeCollision(uint256 id) public {
        delete _nftApprovals[id];  // CACHES SSTORE helper
    }

    // Step 2: TRIGGERS THE VULNERABILITY
    // The compiler REUSES the cached SSTORE helper
    // Instead of tstore(tslot-0, 0), it executes sstore(0, 0)
    // Result: _owner (slot 0) gets cleared to 0x0!
    function cleanTransient() external {
        _txSender = msg.sender;
        delete _txSender;  // BUG: uses SSTORE instead of TSTORE
    }
}`;

interface StorageSlot {
  name: string;
  slot: string;
  persistent: boolean;
}

const STORAGE_SLOTS: StorageSlot[] = [
  { name: "_owner", slot: "0x0000000000000000000000000000000000000000000000000000000000000000", persistent: true },
  { name: "_txSender (transient)", slot: "0x0000000000000000000000000000000000000000000000000000000000000000", persistent: false },
];

export default function BlogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [storageStates, setStorageStates] = useState<{
    initial: Record<string, string>;
    afterMakeCollision: Record<string, string>;
    afterCleanTransient: Record<string, string>;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const initializedRef = useRef(false);

  const storageAt = useCallback(async (
    client: unknown,
    address: string,
    slot: string
  ): Promise<string> => {
    const result = await (client as { getStorageAt: (args: { address: `0x${string}`; slot: `0x${string}` }) => Promise<string> }).getStorageAt({
      address: address as `0x${string}`,
      slot: slot as `0x${string}`,
    });
    return result || "0x" + "0".repeat(64);
  }, []);

  const getAddressFromSlot = (slotValue: string): string => {
    const cleanValue = slotValue.startsWith("0x") ? slotValue : "0x" + slotValue;
    return "0x" + cleanValue.slice(-40);
  };

  const initializeEnvironment = useCallback(async () => {
    setLogs([{ type: "info", message: "Initializing TEVM with solc 0.8.33 + via-IR..." }]);
    setIsRunning(true);
    setStorageStates(null);
    setCurrentStep(0);

    try {
      const response = await fetch("/api/blog/tstore/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCode: TARGET_CONTRACT }),
      });

      const result = await response.json();

      if (result.success) {
        setSessionId(result.sessionId);
        setContractAddress(result.deployedContracts.VulnerableVault);

        // Get initial owner from the response
        const initialOwner = result.owner || "0x" + "0".repeat(40);

        setStorageStates({
          initial: { owner: initialOwner },
          afterMakeCollision: {},
          afterCleanTransient: {},
        });

        const ownerAddress = getAddressFromSlot(initialOwner);
        const isOwnerSet = ownerAddress !== "0x0000000000000000000000000000000000000000";

        setLogs([
          { type: "success", message: "✅ TEVM environment initialized!" },
          { type: "info", message: `🔧 Compiler: ${result.compilerVersion || "solc 0.8.33 + via-IR"}` },
          { type: "info", message: `📍 Contract: ${result.deployedContracts.VulnerableVault}` },
          { type: "info", message: "" },
          { type: "info", message: "📊 Initial Storage State:" },
          isOwnerSet 
            ? { type: "success", message: `   _owner (slot 0): ${ownerAddress} ✓` }
            : { type: "error", message: `   _owner (slot 0): ${ownerAddress} ✗ (not initialized!)` },
          { type: "info", message: "" },
          { type: "info", message: "💡 Click each step button to observe storage changes." },
          { type: "info", message: "" },
          { type: "info", message: "⚠️ Note: This uses solc 0.8.33 with via-IR to trigger the vulnerability." },
        ]);
      } else {
        setLogs([{ type: "error", message: `❌ Initialization failed: ${result.error}` }]);
      }
    } catch (error) {
      setLogs([{ type: "error", message: `❌ Error: ${error instanceof Error ? error.message : String(error)}` }]);
    } finally {
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeEnvironment();
    }
  }, [initializeEnvironment]);

  const executeStep = useCallback(async (step: "makeCollision" | "cleanTransient") => {
    if (!sessionId || !contractAddress) {
      setLogs([{ type: "error", message: "Session not initialized. Please refresh the page." }]);
      return;
    }

    setIsRunning(true);
    setLogs(prev => [...prev, { type: "info", message: "" }]);

    try {
      const response = await fetch("/api/blog/tstore/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          contractAddress,
          step,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (step === "makeCollision") {
          setCurrentStep(1);
          setStorageStates(prev => prev ? {
            ...prev,
            afterMakeCollision: { owner: result.ownerAfter },
          } : null);

          setLogs(prev => [
            ...prev,
            { type: "success", message: "✅ Step 1: makeCollision(0) executed" },
            { type: "info", message: "" },
            { type: "info", message: "📝 What happened:" },
            { type: "info", message: "   • delete _nftApprovals[0] was called" },
            { type: "info", message: "   • Compiler generated storage_set_to_zero_t_address helper" },
            { type: "info", message: "   • This helper uses SSTORE (persistent storage)" },
            { type: "info", message: "   • Helper function is now CACHED for reuse" },
            { type: "info", message: "" },
            { type: "info", message: `📊 Storage after Step 1:` },
            { type: "info", message: `   _owner: ${getAddressFromSlot(result.ownerAfter)}` },
          ]);
        } else {
          setCurrentStep(2);
          setStorageStates(prev => prev ? {
            ...prev,
            afterCleanTransient: { owner: result.ownerAfter },
          } : null);

          const ownerBefore = storageStates?.afterMakeCollision?.owner || storageStates?.initial?.owner || "";
          const ownerWasCleared = getAddressFromSlot(result.ownerAfter) === "0x0000000000000000000000000000000000000000";

          setLogs(prev => [
            ...prev,
            { type: "success", message: "✅ Step 2: cleanTransient() executed" },
            { type: "info", message: "" },
            { type: "info", message: "📝 What happened:" },
            { type: "info", message: "   • _txSender = msg.sender (sets transient slot 0)" },
            { type: "info", message: "   • delete _txSender was called" },
            { type: "info", message: "   • ⚠️ BUG: Compiler reused the cached SSTORE helper!" },
            { type: "info", message: "   • Instead of tstore(0, 0), it executed sstore(0, 0)" },
            { type: "info", message: "" },
            { type: "info", message: `📊 Storage after Step 2:` },
            { type: "info", message: `   _owner (slot 0): ${getAddressFromSlot(result.ownerAfter)}` },
            { type: "info", message: "" },
            ...(ownerWasCleared ? [
              { type: "success", message: "═══════════════════════════════════════" } as LogEntry,
              { type: "success", message: "🎯 VULNERABILITY TRIGGERED!" } as LogEntry,
              { type: "success", message: "═══════════════════════════════════════" } as LogEntry,
              { type: "info", message: "" } as LogEntry,
              { type: "info", message: "Owner (persistent slot 0) was cleared to 0x0!" } as LogEntry,
              { type: "info", message: "This happened because the compiler reused the" } as LogEntry,
              { type: "info", message: "SSTORE-based helper for transient storage delete." } as LogEntry,
              { type: "info", message: "" } as LogEntry,
              { type: "info", message: "In a real contract, anyone could now claim ownership!" } as LogEntry,
            ] : [
              { type: "info", message: "Note: Owner unchanged (vulnerability patched in 0.8.34)" } as LogEntry,
            ]),
          ]);
        }
      } else {
        setLogs(prev => [...prev, { type: "error", message: `❌ Error: ${result.error}` }]);
      }
    } catch (error) {
      setLogs(prev => [...prev, { type: "error", message: `❌ Error: ${error instanceof Error ? error.message : String(error)}` }]);
    } finally {
      setIsRunning(false);
    }
  }, [sessionId, contractAddress, storageStates]);

  const resetEnvironment = useCallback(() => {
    initializedRef.current = false;
    setSessionId(undefined);
    setContractAddress("");
    setStorageStates(null);
    setCurrentStep(0);
    setLogs([]);
    initializeEnvironment();
  }, [initializeEnvironment]);

  const renderStorageValue = (value: string | undefined, slot: StorageSlot) => {
    if (!value) return <span className="text-zinc-500">—</span>;
    const address = getAddressFromSlot(value);
    if (slot.persistent) {
      return (
        <div className="space-y-1">
          <div className="font-mono text-xs break-all">{address}</div>
          {address === "0x0000000000000000000000000000000000000000" && (
            <span className="text-red-400 text-xs font-semibold">⚠️ CLEARED!</span>
          )}
        </div>
      );
    }
    return <span className="text-zinc-500 text-xs">(transient)</span>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <header className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <span className="text-zinc-700">/</span>
            <Link href="/blog" className="hover:text-zinc-300 transition-colors">
              Blog
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Security Research</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Solidity 0.8.33 Transient Storage Vulnerability
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8 font-light">
            TSTORE Poisoning: Helper Collision Bug
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm font-medium border border-red-500/20">
              Critical Severity
            </span>
            <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium border border-amber-500/20">
              Solidity 0.8.28 - 0.8.33
            </span>
            <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20">
              via-IR Pipeline
            </span>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Fixed in Solidity 0.8.34</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-zinc-300 leading-relaxed mb-4">
            With the introduction of <strong className="text-white">EIP-1153 (Transient Storage)</strong> on Ethereum mainnet, 
            developers gained a powerful tool for reducing gas costs. However, new technologies often bring unexpected pitfalls.
          </p>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Today, we&apos;ll examine a critical vulnerability that existed from <strong className="text-white">Solidity 0.8.28 through 0.8.33</strong>: 
            the <strong className="text-cyan-400">Transient Storage Clearing Helper Collision</strong> bug.
          </p>
        </section>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">1</span>
            The Vulnerability: &quot;A Tragedy of Same Names&quot;
          </h2>
          
          <p className="text-base text-zinc-300 leading-relaxed mb-4">
            At its core, this vulnerability stems from a tiny &quot;naming mistake&quot; made by the Solidity compiler 
            <strong className="text-white"> (via-IR mode)</strong> during code generation.
          </p>
          
          <p className="text-base text-zinc-300 leading-relaxed mb-4">
            When compiling complex types (Mapping, Struct, etc.), the compiler creates internal 
            <strong className="text-white"> Yul helper functions</strong> for efficiency. The problem in versions 0.8.33 and below 
            was that <strong className="text-cyan-400">storage deletion functions</strong> and 
            <strong className="text-cyan-400"> transient storage deletion functions</strong> were given identical names.
          </p>

          {/* Callout Box */}
          <div className="my-8 p-6 bg-zinc-900/50 border-l-4 border-cyan-500 rounded-r-lg">
            <p className="text-base text-white font-semibold mb-3">Compiler&apos;s Thought Process:</p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-300">
              <li className="text-base">
                &quot;I need a function to clear an <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm">address</code> type? 
                Let me name it <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm">storage_set_to_zero_t_address</code>.&quot;
              </li>
              <li className="text-base">
                &quot;I also need to clear an <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm">address</code> in transient storage? 
                Wait, <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm">storage_set_to_zero_t_address</code> already exists! 
                <strong className="text-white"> It&apos;s the same thing, let me reuse it!</strong>&quot;
              </li>
            </ol>
          </div>

          <p className="text-base text-zinc-300 leading-relaxed">
            And thus begins the tragedy. Regular storage requires <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm">sstore</code>, 
            while transient storage requires <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm">tstore</code>. 
            But due to having the same name, <strong className="text-white">the logic for clearing regular storage 
            ended up where transient storage should have been cleared</strong>.
          </p>
        </section>

        <hr className="border-zinc-800 my-12" />

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">2</span>
            Why Only with Mappings?
          </h2>
          
          <p className="text-base text-zinc-300 leading-relaxed mb-4">
            This vulnerability has an interesting characteristic: it doesn&apos;t occur with simple 
            <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm mx-1">address</code> 
            variables, only when <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-400 text-sm mx-1">mapping</code> is used. 
            The answer lies in the compiler&apos;s <strong className="text-white">optimization strategy</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="p-5 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-green-400">✓</span> Simple Variables (Inlining)
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Code like <code className="px-1 py-0.5 bg-zinc-800 rounded text-cyan-400 text-xs">address a; delete a;</code> is too short 
                to create a separate function. The compiler directly inserts 
                <code className="px-1 py-0.5 bg-zinc-800 rounded text-cyan-400 text-xs mx-1">sstore(slot, 0)</code> at that location. 
                No function name is generated, so no collision occurs.
              </p>
            </div>
            <div className="p-5 bg-zinc-900/50 rounded-xl border border-red-500/30">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-red-400">✗</span> Complex Types (Helper Function)
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Clearing elements in <code className="px-1 py-0.5 bg-zinc-800 rounded text-cyan-400 text-xs mx-1">mapping</code> involves 
                complex slot calculations. The compiler creates a &quot;common function&quot; to clear addresses, 
                and this is where the <strong className="text-red-400">name collision</strong> occurs.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-zinc-800 my-12" />

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">3</span>
            Impact and Severity
          </h2>
          
          <p className="text-base text-zinc-300 leading-relaxed mb-4">
            This vulnerability is <strong className="text-red-400">critical</strong> in the following scenarios:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3 text-base text-zinc-300">
              <span className="text-red-400 mt-1">●</span>
              <span><strong className="text-white">Upgradeable proxy patterns</strong> with initialization logic</span>
            </li>
            <li className="flex items-start gap-3 text-base text-zinc-300">
              <span className="text-red-400 mt-1">●</span>
              <span><strong className="text-white">Temporary approvals</strong> implemented using transient storage</span>
            </li>
            <li className="flex items-start gap-3 text-base text-zinc-300">
              <span className="text-red-400 mt-1">●</span>
              <span><strong className="text-white">Reentrancy guards</strong> implemented using transient storage</span>
            </li>
          </ul>

          <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
            <p className="text-base text-white font-semibold mb-2">Attackers exploiting this vulnerability can:</p>
            <ul className="space-y-1 text-zinc-300">
              <li className="flex items-center gap-2">
                <span className="text-red-400">→</span>
                Seize contract ownership
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">→</span>
                Bypass permission checks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">→</span>
                Drain funds
              </li>
            </ul>
          </div>
        </section>

        <hr className="border-zinc-800 my-12" />

        {/* Section 4 - Mitigation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">4</span>
            Mitigation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <h3 className="font-semibold text-emerald-400 mb-3 text-lg">Immediate Action</h3>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Upgrade to <strong className="text-white">Solidity 0.8.34</strong> or higher</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Be cautious with <strong className="text-white">via-IR pipeline</strong></span>
                </li>
              </ul>
            </div>
            <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <h3 className="font-semibold text-amber-400 mb-3 text-lg">Code-Level Mitigation</h3>
              <p className="text-sm text-zinc-400 mb-2">If upgrading is not immediately possible:</p>
              <p className="text-zinc-300 text-sm">
                Use direct assignment instead of <code className="px-1 py-0.5 bg-zinc-800 rounded text-cyan-400 text-xs">delete</code>
              </p>
            </div>
          </div>

          {/* Code Block */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Solidity</span>
            </div>
            <div className="bg-[#0d0d0d]">
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                <SolidityHighlight 
                  code={`// ❌ Dangerous code (0.8.33 and below)
delete _txSender;  // Bug may occur

// ✅ Safe alternative
_txSender = address(0);  // Use direct assignment`}
                />
              </pre>
            </div>
          </div>
        </section>

        <hr className="border-zinc-800 my-12" />

        {/* Section 5 - Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">5</span>
            Official Reference
          </h2>
          
          <a 
            href="https://www.soliditylang.org/blog/2026/02/18/transient-storage-clearing-helper-collision-bug/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-cyan-500/50 hover:bg-zinc-900 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                Solidity Blog: Transient Storage Clearing Helper Collision Bug
              </p>
              <p className="text-sm text-zinc-500">soliditylang.org</p>
            </div>
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 transition-colors ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </section>

        <hr className="border-zinc-800 my-12" />

        {/* Section 6 - Interactive Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">6</span>
            Interactive Demo
          </h2>
          
          <p className="text-base text-zinc-300 leading-relaxed mb-6">
            Use the environment below to observe how the storage state changes at each step. 
            This demonstrates the vulnerability mechanism in real-time.
          </p>

          {/* TEVM Interactive Section */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Vulnerability Reproduction
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Observe storage state changes at each step
              </p>
            </div>

            {/* Step Buttons */}
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => executeStep("makeCollision")}
                  disabled={isRunning || !sessionId || currentStep >= 1}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    currentStep >= 1
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {currentStep >= 1 ? "✓ Step 1: makeCollision(0)" : "Step 1: makeCollision(0)"}
                </button>
                <button
                  onClick={() => executeStep("cleanTransient")}
                  disabled={isRunning || !sessionId || currentStep < 1 || currentStep >= 2}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    currentStep >= 2
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : currentStep < 1
                      ? "bg-zinc-800 text-zinc-500 border border-zinc-700"
                      : "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {currentStep >= 2 ? "✓ Step 2: cleanTransient()" : "Step 2: cleanTransient()"}
                </button>
                <button
                  onClick={resetEnvironment}
                  disabled={isRunning}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
              <div className="text-sm text-zinc-500">
                <p><strong className="text-zinc-400">Step 1:</strong> Caches the SSTORE helper function by deleting a mapping element</p>
                <p><strong className="text-zinc-400">Step 2:</strong> Triggers the bug — transient delete reuses SSTORE instead of TSTORE</p>
              </div>
            </div>

            {/* Storage State Table */}
            {storageStates && (
              <div className="p-5 border-b border-zinc-800 bg-zinc-900/30">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📊</span> Storage State Comparison
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left py-3 px-4 text-zinc-400 font-medium">Slot</th>
                        <th className="text-left py-3 px-4 text-zinc-400 font-medium">Variable</th>
                        <th className="text-left py-3 px-4 text-zinc-400 font-medium">Initial</th>
                        <th className="text-left py-3 px-4 text-zinc-400 font-medium">After Step 1</th>
                        <th className="text-left py-3 px-4 text-zinc-400 font-medium">After Step 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STORAGE_SLOTS.filter(s => s.persistent).map((slot) => (
                        <tr key={slot.slot} className="border-b border-zinc-800">
                          <td className="py-3 px-4 font-mono text-zinc-500 text-xs">slot 0</td>
                          <td className="py-3 px-4 text-cyan-400 font-medium">{slot.name}</td>
                          <td className="py-3 px-4">
                            {renderStorageValue(storageStates.initial?.owner, slot)}
                          </td>
                          <td className="py-3 px-4">
                            {renderStorageValue(storageStates.afterMakeCollision?.owner, slot)}
                          </td>
                          <td className="py-3 px-4 bg-red-500/5">
                            {renderStorageValue(storageStates.afterCleanTransient?.owner, slot)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {storageStates.afterCleanTransient?.owner && 
                  getAddressFromSlot(storageStates.afterCleanTransient.owner) === "0x0000000000000000000000000000000000000000" && (
                  <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-red-400 font-semibold flex items-center gap-2">
                      <span>⚠️</span> VULNERABILITY DETECTED
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">
                      Owner storage slot was cleared to 0x0. The transient storage delete operation 
                      incorrectly affected persistent storage slot 0.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contract Info */}
            {contractAddress && (
              <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/30 text-xs">
                <span className="text-zinc-500">Contract: </span>
                <span className="font-mono text-zinc-400">{contractAddress}</span>
              </div>
            )}

            {/* Log Panel */}
            <div className="h-[280px] overflow-hidden">
              <ResultPanel logs={logs} isRunning={isRunning} />
            </div>
          </div>
        </section>

        {/* Contract Code Reference */}
        <section className="mb-12">
          <details className="group border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
            <summary className="px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-zinc-900/80 transition-colors">
              <span className="text-base font-semibold text-white flex items-center gap-2">
                <span>📝</span> Contract Code
              </span>
              <svg
                className="w-5 h-5 text-zinc-500 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-zinc-800 bg-[#0d0d0d]">
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                <SolidityHighlight code={TARGET_CONTRACT} />
              </pre>
            </div>
          </details>
        </section>

        {/* Go To Learn Button */}
        <section className="mb-12">
          <div className="text-center py-8 px-6 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-2">
              Want to learn more vulnerabilities?
            </h3>
            <p className="text-zinc-400 mb-6">
              Master smart contract security through real-world attack cases
            </p>
            <Link
              href="/vulnerabilities"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Go To Learn</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}