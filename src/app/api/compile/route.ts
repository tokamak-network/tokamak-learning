import { NextRequest, NextResponse } from "next/server";
import solc from "solc";
import { runTests } from "@/lib/evm-runner";
import type { TestCase } from "@/data/problems";

interface CompileRequest {
  source: string;
  expectedFunctions?: string[];
  expectedEvents?: string[];
  testCases?: TestCase[];
  constructorArgs?: string[];
  expectedContractName?: string;
}

interface TestResult {
  passed: boolean;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CompileRequest = await req.json();
    const { source, expectedFunctions, expectedEvents, testCases, constructorArgs, expectedContractName } = body;

    if (!source) {
      return NextResponse.json(
        { results: [{ passed: false, message: "코드가 비어있습니다" }] },
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
        message: `컴파일 실패:\n${errors[0]}`,
      });
      return NextResponse.json({ results });
    }

    results.push({ passed: true, message: "컴파일 성공" });

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
        message: "컨트랙트를 찾을 수 없습니다",
      });
      return NextResponse.json({ results });
    }

    // Check expected contract name
    if (expectedContractName) {
      const found = contractNames.includes(expectedContractName);
      results.push({
        passed: found,
        message: found
          ? `컨트랙트 '${expectedContractName}' 이름 확인`
          : `컨트랙트 이름이 '${expectedContractName}'이(가) 아닙니다. 현재: ${contractNames.join(", ")}`,
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
              ? `함수 '${fn}' 존재 확인`
              : `함수 '${fn}'을(를) 찾을 수 없습니다`,
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
              ? `이벤트 '${ev}' 존재 확인`
              : `이벤트 '${ev}'을(를) 찾을 수 없습니다`,
          });
        }
      }
    }

    // Warnings
    if (warnings.length > 0) {
      results.push({
        passed: true,
        message: `경고 ${warnings.length}개 (컴파일은 성공)`,
      });
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      {
        results: [
          {
            passed: false,
            message: `서버 오류: ${err instanceof Error ? err.message : "Unknown error"}`,
          },
        ],
      },
      { status: 500 }
    );
  }
}
