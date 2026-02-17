import solc from "solc";
import { CONSOLE_SOL } from "./console-sol";

export interface ValidationResult {
  compiles: boolean;
  error?: string;
}

/**
 * Compile Solidity source code and return whether it compiles successfully.
 * Used for validating quiz questions - checking if answer/distractor code compiles.
 */
export function compileSolidity(source: string): ValidationResult {
  const input = {
    language: "Solidity",
    sources: {
      "contract.sol": { content: source },
      "hardhat/console.sol": { content: CONSOLE_SOL },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      const errors = output.errors.filter(
        (e: { severity: string }) => e.severity === "error"
      );
      if (errors.length > 0) {
        return {
          compiles: false,
          error: errors[0].formattedMessage || errors[0].message,
        };
      }
    }

    // Check if any contract was produced
    const contracts = output.contracts?.["contract.sol"];
    if (!contracts || Object.keys(contracts).length === 0) {
      return {
        compiles: false,
        error: "No contract found in source",
      };
    }

    return { compiles: true };
  } catch (err) {
    return {
      compiles: false,
      error: err instanceof Error ? err.message : "Unknown compilation error",
    };
  }
}

export interface CodeQuestionValidation {
  valid: boolean;
  reason?: string;
  answerCompiles?: boolean;
  distractorResults?: { distractor: string; compiles: boolean }[];
}

/**
 * Validate a code quiz question by checking:
 * 1. The answer, when substituted into the blank, produces valid Solidity
 * 2. Each distractor, when substituted, produces INVALID Solidity
 *
 * @param code - Solidity code with ___BLANK___ placeholder
 * @param answer - The correct answer
 * @param distractors - Array of 3 distractors
 * @returns Validation result with detailed breakdown
 */
export function validateCodeQuestion(
  code: string,
  answer: string,
  distractors: string[]
): CodeQuestionValidation {
  // Check answer compiles
  const answerCode = code.replace("___BLANK___", answer);
  const answerResult = compileSolidity(answerCode);

  if (!answerResult.compiles) {
    return {
      valid: false,
      reason: `Answer does not compile: ${answerResult.error}`,
      answerCompiles: false,
    };
  }

  // Check each distractor does NOT compile
  const distractorResults: { distractor: string; compiles: boolean }[] = [];
  const compilingDistractors: string[] = [];

  for (const distractor of distractors) {
    const distractorCode = code.replace("___BLANK___", distractor);
    const result = compileSolidity(distractorCode);
    distractorResults.push({ distractor, compiles: result.compiles });

    if (result.compiles) {
      compilingDistractors.push(distractor);
    }
  }

  if (compilingDistractors.length > 0) {
    return {
      valid: false,
      reason: `Distractor(s) also compile: ${compilingDistractors.join(", ")}`,
      answerCompiles: true,
      distractorResults,
    };
  }

  return {
    valid: true,
    answerCompiles: true,
    distractorResults,
  };
}