import { NextRequest, NextResponse } from "next/server";
import solc from "solc";
import { runTests, type TestResult } from "@/lib/evm-runner";
import type { TestCase } from "@/data/problems";

// Simple in-memory rate limiter: max 10 requests per 60s per IP
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

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

interface CompileRequest {
  source: string;
  expectedFunctions?: string[];
  expectedEvents?: string[];
  testCases?: TestCase[];
  constructorArgs?: string[];
  expectedContractName?: string;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { results: [{ passed: false, message: "Too many requests. Please wait a moment." }] },
        { status: 429 }
      );
    }

    const body: CompileRequest = await req.json();
    const { source, expectedFunctions, expectedEvents, testCases, constructorArgs, expectedContractName } = body;

    if (!source) {
      return NextResponse.json(
        { results: [{ passed: false, message: "Code is empty" }] },
        { status: 400 }
      );
    }

    const input = {
      language: "Solidity",
      sources: {
        "contract.sol": { content: source },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    const errors: string[] = [];
    const warnings: string[] = [];

    if (output.errors) {
      for (const err of output.errors) {
        if (err.severity === "error") {
          errors.push(err.formattedMessage || err.message);
        } else {
          warnings.push(err.formattedMessage || err.message);
        }
      }
    }

    const results: TestResult[] = [];

    // Test 1: Compilation
    if (errors.length > 0) {
      results.push({
        passed: false,
        message: `Compilation failed:\n${errors[0]}`,
      });
      return NextResponse.json({ results });
    }

    results.push({ passed: true, message: "Compilation successful" });

    // Get contracts
    const contracts: Record<string, { abi: unknown[]; evm: { bytecode: { object: string } } }> = {};
    if (output.contracts?.["contract.sol"]) {
      for (const [name, data] of Object.entries(
        output.contracts["contract.sol"]
      )) {
        contracts[name] = data as { abi: unknown[]; evm: { bytecode: { object: string } } };
      }
    }

    const contractNames = Object.keys(contracts);
    if (contractNames.length === 0) {
      results.push({
        passed: false,
        message: "Contract not found",
      });
      return NextResponse.json({ results });
    }

    // Check expected contract name
    if (expectedContractName) {
      const found = contractNames.includes(expectedContractName);
      results.push({
        passed: found,
        message: found
          ? `Contract name '${expectedContractName}' verified`
          : `Contract name is not '${expectedContractName}'. Found: ${contractNames.join(", ")}`,
      });
      if (!found) {
        return NextResponse.json({ results });
      }
    }

    // Use the expected contract or the last one
    const mainContractName = expectedContractName && contractNames.includes(expectedContractName)
      ? expectedContractName
      : contractNames[contractNames.length - 1];
    const mainContract = contracts[mainContractName];
    const abi = mainContract.abi as Array<{
      type: string;
      name: string;
    }>;

    // EVM test execution (if testCases provided)
    if (testCases && testCases.length > 0) {
      const bytecode = mainContract.evm.bytecode.object;
      const evmResults = await runTests(bytecode, abi, testCases, constructorArgs);
      results.push(...evmResults);
    } else {
      // Fallback: ABI-only checks for problems without testCases
      if (expectedFunctions && expectedFunctions.length > 0) {
        const abiFunctionNames = abi
          .filter((item) => item.type === "function")
          .map((item) => item.name);

        for (const fn of expectedFunctions) {
          const found = abiFunctionNames.includes(fn);
          results.push({
            passed: found,
            message: found
              ? `Function '${fn}' found`
              : `Function '${fn}' not found`,
          });
        }
      }

      if (expectedEvents && expectedEvents.length > 0) {
        const abiEventNames = abi
          .filter((item) => item.type === "event")
          .map((item) => item.name);

        for (const ev of expectedEvents) {
          const found = abiEventNames.includes(ev);
          results.push({
            passed: found,
            message: found
              ? `Event '${ev}' found`
              : `Event '${ev}' not found`,
          });
        }
      }
    }

    // Warnings
    if (warnings.length > 0) {
      results.push({
        passed: true,
        message: `${warnings.length} warning(s) (compilation succeeded)`,
      });
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      {
        results: [
          {
            passed: false,
            message: `Server error: ${err instanceof Error ? err.message : "Unknown error"}`,
          },
        ],
      },
      { status: 500 }
    );
  }
}
