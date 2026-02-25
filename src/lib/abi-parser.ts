import type { ExposedFunction } from "@/types/vulnerability";

/**
 * Parse a Human-Readable ABI string into ExposedFunction format
 * Supports formats like:
 * - "function balanceOf(address) view returns (uint256)"
 * - "function transfer(address to, uint256 amount)"
 * - "function deposit() payable"
 */
export function parseAbiFunction(abiString: string): ExposedFunction | null {
  // Match function signature
  const functionMatch = abiString.match(
    /^function\s+(\w+)\s*\(([^)]*)\)\s*(payable|pure|view|nonpayable)?\s*(?:returns\s*\(([^)]+)\))?$/
  );

  if (!functionMatch) return null;

  const [, name, paramsStr, stateMutability, returnsStr] = functionMatch;

  // Parse inputs
  const inputs: { name: string; type: string }[] = [];
  if (paramsStr.trim()) {
    const params = splitParams(paramsStr);
    for (const param of params) {
      const parsed = parseParam(param.trim());
      if (parsed) inputs.push(parsed);
    }
  }

  // Parse outputs
  const outputs: { name: string; type: string }[] = [];
  if (returnsStr?.trim()) {
    const returns = splitParams(returnsStr);
    for (const ret of returns) {
      const parsed = parseParam(ret.trim());
      if (parsed) outputs.push(parsed);
    }
  }

  // Build signature
  const inputTypes = inputs.map(i => i.type).join(",");
  const signature = `${name}(${inputTypes})`;

  return {
    name,
    signature,
    inputs: inputs.length > 0 ? inputs : undefined,
    outputs: outputs.length > 0 ? outputs : undefined,
    stateMutability: stateMutability as ExposedFunction["stateMutability"] || undefined,
  };
}

/**
 * Parse a single parameter like "address to" or "uint256" or "bytes memory data"
 */
function parseParam(param: string): { name: string; type: string } | null {
  // Handle tuple types
  if (param.startsWith("(")) {
    // For tuple types, just use the whole thing as type
    return { name: "", type: param };
  }

  const parts = param.trim().split(/\s+/);

  // Handle "type name" or just "type"
  if (parts.length === 1) {
    return { name: "", type: parts[0] };
  }

  // Handle storage location modifiers (memory, calldata, storage)
  const validTypes = ["address", "uint", "uint256", "uint8", "uint16", "uint32", "uint64", "uint128",
    "int", "int256", "int8", "int16", "int32", "int64", "int128",
    "bool", "string", "bytes", "bytes1", "bytes32",
    "bytes4", "bytes8", "bytes16", "bytes20", "bytes24", "bytes28"];

  // Find the type and name, skipping storage locations
  let type = "";
  let name = "";
  for (let i = 0; i < parts.length; i++) {
    if (validTypes.some(t => parts[i].startsWith(t)) || parts[i].startsWith("uint") || parts[i].startsWith("int") || parts[i].startsWith("bytes")) {
      type = parts[i];
      if (i + 1 < parts.length && !["memory", "calldata", "storage"].includes(parts[i + 1])) {
        name = parts[i + 1];
      } else if (i + 2 < parts.length) {
        name = parts[i + 2];
      }
      break;
    }
  }

  if (!type) {
    // Fallback: first part is type, last part is name
    type = parts[0];
    name = parts.length > 1 ? parts[parts.length - 1] : "";
  }

  return { name, type };
}

/**
 * Split parameters handling nested parentheses and brackets
 */
function splitParams(str: string): string[] {
  const result: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of str) {
    if (char === "(" || char === "[" ) {
      depth++;
      current += char;
    } else if (char === ")" || char === "]") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Parse an array of Human-Readable ABI strings into ExposedFunction array
 */
export function parseContractAbi(abiStrings: string[]): ExposedFunction[] {
  const functions: ExposedFunction[] = [];

  for (const abiString of abiStrings) {
    // Skip non-function ABI entries (events, errors, etc.)
    if (!abiString.startsWith("function ")) continue;

    const parsed = parseAbiFunction(abiString);
    if (parsed) {
      functions.push(parsed);
    }
  }

  return functions;
}

/**
 * Filter functions by type for Quick Call buttons
 */
export function getViewFunctions(functions: ExposedFunction[]): ExposedFunction[] {
  return functions.filter(fn => fn.stateMutability === "view" || fn.stateMutability === "pure");
}

export function getWriteFunctions(functions: ExposedFunction[]): ExposedFunction[] {
  return functions.filter(fn => fn.stateMutability !== "view" && fn.stateMutability !== "pure");
}