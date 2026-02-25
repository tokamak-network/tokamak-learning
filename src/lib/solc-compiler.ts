// src/lib/solc-compiler.ts

import solc from "solc";
import { ethers } from "ethers";
import { CONSOLE_SOL, injectConsoleImport } from "./console-sol";

export interface CompilationResult {
  success: boolean;
  bytecode?: string;
  runtimeBytecode?: string;
  abi?: unknown[];
  contractName?: string;
  errors?: string[];
  warnings?: string[];
}

export interface CompileOptions {
  contractName?: string;
  optimizerRuns?: number;
  customImports?: Record<string, string>;
}

const COMMON_IMPORTS: Record<string, string> = {
  "hardhat/console.sol": CONSOLE_SOL,
};

function createImportResolver(
  customImports?: Record<string, string>
): (path: string) => { contents: string } | { error: string } {
  const allImports = { ...COMMON_IMPORTS, ...customImports };
  return (path: string) => {
    if (allImports[path]) {
      return { contents: allImports[path] };
    }
    return { error: `File not found: ${path}` };
  };
}

export function compileSolidity(
  sourceCode: string,
  options?: CompileOptions
): CompilationResult {
  const processedSource = injectConsoleImport(sourceCode);

  const input = {
    language: "Solidity" as const,
    sources: {
      "contract.sol": { content: processedSource },
      "hardhat/console.sol": { content: CONSOLE_SOL },
    },
    settings: {
      optimizer: {
        // Disable optimization to preserve state variable initialization
        // This ensures all state variables are properly stored in storage slots
        enabled: options?.optimizerRuns !== undefined ? true : false,
        runs: options?.optimizerRuns ?? 200,
      },
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode.object",
            "evm.deployedBytecode.object",
          ],
        },
      },
    },
  };

  try {
    const output = JSON.parse(
      solc.compile(JSON.stringify(input), {
        import: createImportResolver(options?.customImports),
      })
    );

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

    if (errors.length > 0) {
      return { success: false, errors, warnings };
    }

    const contractFile = output.contracts?.["contract.sol"];
    if (!contractFile) {
      return {
        success: false,
        errors: ["No contract found in source"],
        warnings,
      };
    }

    const contractNames = Object.keys(contractFile);
    if (contractNames.length === 0) {
      return {
        success: false,
        errors: ["No contract found in source"],
        warnings,
      };
    }

    // Try to find a contract with bytecode (skip interfaces/abstract)
    let targetName: string | undefined;
    let contract: { evm?: { bytecode?: { object?: string }; deployedBytecode?: { object?: string } }; abi?: unknown[] } | undefined;
    let bytecode: string | undefined;

    // First, try the explicitly requested contract
    if (options?.contractName && contractNames.includes(options.contractName)) {
      const c = contractFile[options.contractName];
      const bc = c.evm?.bytecode?.object;
      if (bc) {
        targetName = options.contractName;
        contract = c;
        bytecode = bc;
      }
    }

    // If not found, find the first contract with bytecode
    if (!targetName) {
      for (const name of contractNames) {
        const c = contractFile[name];
        const bc = c.evm?.bytecode?.object;
        if (bc) {
          targetName = name;
          contract = c;
          bytecode = bc;
          break;
        }
      }
    }

    if (!targetName || !contract || !bytecode) {
      return {
        success: false,
        errors: ["No deployable contract found (all contracts are abstract or interfaces)"],
        warnings,
      };
    }

    const runtimeBytecode = contract.evm?.deployedBytecode?.object;
    const abi = contract.abi;

    return {
      success: true,
      bytecode,
      runtimeBytecode,
      abi,
      contractName: targetName,
      warnings,
    };
  } catch (err) {
    return {
      success: false,
      errors: [err instanceof Error ? err.message : "Unknown compilation error"],
    };
  }
}

export function encodeConstructorArgs(
  abi: unknown[],
  args: unknown[]
): string {
  if (!args || args.length === 0) return "";

  const constructorAbi = (abi as { type: string; inputs?: unknown[] }[]).find(
    (item) => item.type === "constructor"
  );

  if (!constructorAbi) return "";

  const iface = new ethers.Interface(abi as ethers.InterfaceAbi);
  return iface.encodeDeploy(args).slice(2);
}