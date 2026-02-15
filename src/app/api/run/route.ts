import { NextRequest, NextResponse } from "next/server";
import solc from "solc";
import { runCode } from "@/lib/evm-runner";
import { CONSOLE_SOL, injectConsoleImport } from "@/lib/console-sol";
import { humanizeError } from "@/lib/humanize-error";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;
const MAX_SOURCE_SIZE = 50_000;

function getClientIP(req: NextRequest): string {
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { compiled: false, error: "Too many requests. Please wait a moment.", consoleLogs: [] },
        { status: 429 }
      );
    }

    const { source } = await req.json();

    if (!source) {
      return NextResponse.json(
        { compiled: false, error: "Code is empty", consoleLogs: [] },
        { status: 400 }
      );
    }

    if (source.length > MAX_SOURCE_SIZE) {
      return NextResponse.json(
        { compiled: false, error: "Code too large", consoleLogs: [] },
        { status: 413 }
      );
    }

    const input = {
      language: "Solidity",
      sources: {
        "contract.sol": { content: injectConsoleImport(source) },
        "hardhat/console.sol": { content: CONSOLE_SOL },
      },
      settings: {
        outputSelection: {
          "*": { "*": ["abi", "evm.bytecode"] },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    const errors: string[] = [];
    if (output.errors) {
      for (const err of output.errors) {
        if (err.severity === "error") {
          errors.push(err.formattedMessage || err.message);
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        compiled: false,
        error: humanizeError(errors[0], source),
        consoleLogs: [],
      });
    }

    // Get the main contract (from contract.sol, not console.sol)
    const contractFile = output.contracts?.["contract.sol"];
    if (!contractFile) {
      return NextResponse.json({
        compiled: true,
        deployed: false,
        error: "No contract found",
        consoleLogs: [],
      });
    }

    const contractNames = Object.keys(contractFile);
    const mainName = contractNames[contractNames.length - 1];
    const mainContract = contractFile[mainName];
    const bytecode = mainContract.evm.bytecode.object;
    const abi = mainContract.abi;

    if (!bytecode) {
      return NextResponse.json({
        compiled: true,
        deployed: false,
        error: "No bytecode (interface or abstract contract)",
        consoleLogs: [],
      });
    }

    const result = await runCode(bytecode, abi);

    return NextResponse.json({
      compiled: true,
      deployed: result.success,
      error: result.error || null,
      consoleLogs: result.consoleLogs,
    });
  } catch (err) {
    return NextResponse.json(
      {
        compiled: false,
        error: `Server error: ${err instanceof Error ? err.message : "Unknown error"}`,
        consoleLogs: [],
      },
      { status: 500 }
    );
  }
}
