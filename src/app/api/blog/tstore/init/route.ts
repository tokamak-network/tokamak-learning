import { NextRequest, NextResponse } from "next/server";
import { createMemoryClient } from "tevm";
import { mainnet } from "tevm/common";
import { parseEther } from "viem";
import solc033 from "solc-0.8.33";

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

// Vulnerable contract that demonstrates TSTORE poisoning
// MUST use solc 0.8.33 or earlier with via-IR to trigger the bug
const VULNERABLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

contract UpgradeableVault {
    // ======== persistent storage ========
    address internal _owner;                       // slot 0
    mapping(uint256 => address) _nftApprovals;     // slot 1 base

    // ======== transient storage ========
    address internal transient _txSender;          // tslot 0

    constructor() {
        _owner = msg.sender;
    }

    function owner() external view returns (address) {
        return _owner;
    }

    // This caches storage_set_to_zero_t_address with SSTORE
    function makeCollision(uint256 id) public {
        delete _nftApprovals[id];
    }

    function cleanTransient() external {
        _txSender = msg.sender;
        delete _txSender; // BUG: should use tstore, but reused sstore helper
    }
}`;

// Compile with via-IR using solc 0.8.33 to trigger the vulnerability
function compileWithViaIR(sourceCode: string) {
  const input = {
    language: "Solidity" as const,
    sources: {
      "contract.sol": { content: sourceCode },
    },
    settings: {
      viaIR: true, // REQUIRED for the vulnerability!
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };

  const output = JSON.parse(solc033.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter((e: { severity: string }) => e.severity === "error");
    if (errors.length > 0) {
      return { success: false, errors: errors.map((e: { message: string }) => e.message) };
    }
  }

  const contract = output.contracts?.["contract.sol"]?.["UpgradeableVault"];
  if (!contract) {
    return { success: false, errors: ["Contract not found"] };
  }

  return {
    success: true,
    bytecode: contract.evm?.bytecode?.object,
    abi: contract.abi,
  };
}

export async function POST(req: NextRequest) {
  try {
    // Create TEVM client
    const client = createMemoryClient({
      common: mainnet,
      miningConfig: { type: "auto" },
    });

    await client.tevmReady();

    // Fund deployer
    await client.tevmSetAccount({
      address: ATTACKER_ADDRESS,
      balance: parseEther("100"),
      nonce: BigInt(0),
    });

    // Compile with solc 0.8.33 + via-IR (vulnerability trigger)
    const compiled = compileWithViaIR(VULNERABLE_CONTRACT);
    if (!compiled.success || !compiled.bytecode) {
      return NextResponse.json({
        success: false,
        error: `Compilation failed: ${compiled.errors?.join(", ")}`,
      }, { status: 400 });
    }

    // Deploy contract
    const deployData = `0x${compiled.bytecode}` as `0x${string}`;
    const deployResult = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      data: deployData,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });

    if (deployResult.errors || !deployResult.createdAddress) {
      return NextResponse.json({
        success: false,
        error: `Deployment failed: ${deployResult.errors?.[0]?.message}`,
      }, { status: 500 });
    }

    const targetAddress = deployResult.createdAddress;

    // Get initial owner
    const ownerSlot = await client.getStorageAt({
      address: targetAddress,
      slot: "0x0000000000000000000000000000000000000000000000000000000000000000",
    });
    
    // Properly extract address from storage slot
    const rawValue = ownerSlot || "0x0000000000000000000000000000000000000000000000000000000000000000";
    const owner = rawValue.length >= 42 
      ? "0x" + rawValue.slice(-40)
      : "0x" + "0".repeat(40);

    // Create session
    const sessionId = Math.random().toString(36).substring(2, 15);
    const sessions = getSessionsMap();
    sessions.set(sessionId, {
      client,
      deployedContracts: {
        UpgradeableVault: targetAddress,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId,
      owner,
      compilerVersion: "solc 0.8.33 + via-IR",
      deployedContracts: {
        VulnerableVault: targetAddress,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}