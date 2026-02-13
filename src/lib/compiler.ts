export interface CompileResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  contracts: Record<
    string,
    {
      abi: unknown[];
      evm: { bytecode: { object: string } };
    }
  >;
}

export async function compileSolidity(
  source: string
): Promise<CompileResult> {
  try {
    // Dynamic import solc for browser
    const solc = (await import("solc")).default;

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

    const contracts: CompileResult["contracts"] = {};
    if (output.contracts && output.contracts["contract.sol"]) {
      for (const [name, data] of Object.entries(
        output.contracts["contract.sol"]
      )) {
        contracts[name] = data as CompileResult["contracts"][string];
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      contracts,
    };
  } catch (err) {
    return {
      success: false,
      errors: [err instanceof Error ? err.message : "Compilation failed"],
      warnings: [],
      contracts: {},
    };
  }
}

export interface TestResult {
  passed: boolean;
  message: string;
}

export function runTests(
  compileResult: CompileResult,
  expectedFunctions?: string[],
  expectedEvents?: string[]
): TestResult[] {
  const results: TestResult[] = [];

  // Test 1: Compilation success
  if (!compileResult.success) {
    results.push({
      passed: false,
      message: `컴파일 실패: ${compileResult.errors[0]}`,
    });
    return results;
  }

  results.push({
    passed: true,
    message: "컴파일 성공",
  });

  const contractNames = Object.keys(compileResult.contracts);
  if (contractNames.length === 0) {
    results.push({
      passed: false,
      message: "컨트랙트를 찾을 수 없습니다",
    });
    return results;
  }

  // Use the last contract (usually the main one)
  const mainContract =
    compileResult.contracts[contractNames[contractNames.length - 1]];
  const abi = mainContract.abi as Array<{
    type: string;
    name: string;
    inputs?: Array<{ type: string }>;
  }>;

  // Test: Expected functions
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

  // Test: Expected events
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

  // Test: Bytecode generated
  if (mainContract.evm?.bytecode?.object) {
    results.push({
      passed: true,
      message: "바이트코드 생성 성공",
    });
  }

  return results;
}
