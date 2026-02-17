/**
 * Blank Position Analyzer
 * 
 * Analyzes Solidity code to find safe positions for fill-in-the-blank questions.
 * Safe positions are where only one answer is valid (not multiple keywords that compile).
 */

export type BlankPosition = {
  type: "keyword" | "operator" | "builtin" | "type" | "modifier" | "statement";
  line: number;
  startCol: number;
  endCol: number;
  answer: string;
  context: string;
  explanation: string;
};

/**
 * Pattern rules for finding safe blank positions
 */
const BLANK_PATTERNS: Array<{
  name: string;
  pattern: RegExp;
  type: BlankPosition["type"];
  getAnswer: (match: RegExpMatchArray, code: string) => string;
  getDistractors: (answer: string) => string[];
  explanation: string;
}> = [
  {
    name: "return statement",
    pattern: /\breturn\s+([^;]+);/g,
    type: "statement",
    getAnswer: (match) => match[1].trim(),
    getDistractors: (answer) => {
      // Generate plausible wrong answers based on expression type
      if (answer.includes("+")) return ["a - b", "a * b", "a / b"];
      if (answer.includes("*")) return ["a + b", "a - b", "a / b"];
      if (answer.includes("/")) return ["a * b", "a + b", "a - b"];
      if (answer.includes("%")) return ["a / b", "a * b", "a - b"];
      if (answer.includes("-")) return ["a + b", "a * b", "a / b"];
      if (answer === "a + b") return ["a - b", "a * b", "a / b"];
      if (answer === "a - b") return ["a + b", "a * b", "a / b"];
      if (answer === "a * b") return ["a + b", "a - b", "a / b"];
      if (answer === "a / b") return ["a + b", "a * b", "a - b"];
      return ["0", "1", "true"];
    },
    explanation: "Fill in the missing expression in the return statement",
  },
  {
    name: "variable declaration with assignment",
    pattern: /(uint256|uint|int256|int|uint8|uint16|uint32|uint64|uint128|int8|int16|int32|int64|int128|address|bool|string|bytes|bytes32)\s+(public\s+)?(\w+)\s*=\s*([^;]+);/g,
    type: "type",
    getAnswer: (match) => match[1],
    getDistractors: (answer) => {
      const typeMap: Record<string, string[]> = {
        "uint256": ["uint128", "uint64", "uint32"],
        "uint": ["uint128", "uint64", "uint32"],
        "int256": ["int128", "int64", "int32"],
        "int": ["int128", "int64", "int32"],
        "uint8": ["uint16", "uint32", "uint256"],
        "int8": ["int16", "int32", "int256"],
        "address": ["uint256", "bytes32", "string"],
        "bool": ["uint256", "address", "string"],
        "string": ["address", "bytes", "uint256"],
        "bytes32": ["bytes", "string", "uint256"],
      };
      return typeMap[answer] || ["uint256", "int256", "bool"];
    },
    explanation: "Choose the correct type for the variable",
  },
  {
    name: "visibility modifier",
    pattern: /(function\s+\w+)\s+(public|private|internal|external|view|pure|payable)\s*[\(\{]/g,
    type: "modifier",
    getAnswer: (match) => match[2],
    getDistractors: (answer) => {
      const visMap: Record<string, string[]> = {
        public: ["private", "internal", "external"],
        private: ["public", "internal", "external"],
        internal: ["public", "private", "external"],
        external: ["public", "internal", "private"],
        view: ["pure", "nonpayable", ""],
        pure: ["view", "nonpayable", ""],
        payable: ["view", "pure", ""],
      };
      return visMap[answer] || ["public", "private", "internal"];
    },
    explanation: "Choose the correct visibility or mutability modifier",
  },
  {
    name: "state mutability",
    pattern: /(function\s+\w+\([^)]*\))\s+(view|pure)\s*(returns\s*\([^)]+\))?\s*\{/g,
    type: "modifier",
    getAnswer: (match) => match[2],
    getDistractors: (answer) => {
      if (answer === "view") return ["pure", "", "nonpayable"];
      if (answer === "pure") return ["view", "", "nonpayable"];
      return ["view", "pure", ""];
    },
    explanation: "Choose the correct state mutability (view reads state, pure doesn't)",
  },
  {
    name: "event emission",
    pattern: /\bemit\s+(\w+)/g,
    type: "keyword",
    getAnswer: (match) => match[1],
    getDistractors: (answer) => {
      // Common event names that sound similar but are different
      return ["Transfer", "Approval", "Mint", "Burn", "Deposit", "Withdraw"].filter(e => e !== answer).slice(0, 3);
    },
    explanation: "Choose the correct event to emit",
  },
  {
    name: "require statement",
    pattern: /\brequire\(([^,]+),\s*([^)]+)\)/g,
    type: "keyword",
    getAnswer: (match) => match[1].trim(),
    getDistractors: (answer) => {
      if (answer.includes(">") || answer.includes("<") || answer.includes("==")) {
        // It's a condition - flip it
        return [
          answer.replace(">", " < ").replace("<", " > ").replace("==", " !="),
          "true",
          "false",
        ];
      }
      return ["true", "false", "1 == 1"];
    },
    explanation: "Fill in the condition for the require statement",
  },
  {
    name: "mapping declaration",
    pattern: /\bmapping\((\w+)\s*=>\s*(\w+)\)\s+(public\s+)?(\w+)/g,
    type: "type",
    getAnswer: (match) => match[1],
    getDistractors: (answer) => {
      const keyTypes = ["address", "uint256", "bytes32", "string"];
      return keyTypes.filter(t => t !== answer).slice(0, 3);
    },
    explanation: "Choose the correct key type for the mapping",
  },
  {
    name: "data location",
    pattern: /(\w+)\s+(memory|calldata|storage)\s+(\w+)/g,
    type: "keyword",
    getAnswer: (match) => match[2],
    getDistractors: (answer) => {
      const locs = ["memory", "calldata", "storage"];
      return locs.filter(l => l !== answer).slice(0, 3);
    },
    explanation: "Choose the correct data location (memory, calldata, or storage)",
  },
  {
    name: "arithmetic operator in expression",
    pattern: /(\w+)\s+(\+\+|--|\+=|-=|\*=|\/=|%=|=)\s+(\w+)/g,
    type: "operator",
    getAnswer: (match) => match[2],
    getDistractors: (answer) => {
      const ops = ["+", "-", "*", "/", "%", "++", "--", "+=", "-=", "*=", "/=", "%="];
      return ops.filter(op => op !== answer).slice(0, 3);
    },
    explanation: "Choose the correct arithmetic operator",
  },
  {
    name: "msg.sender usage",
    pattern: /\bmsg\.sender\b/g,
    type: "builtin",
    getAnswer: () => "msg.sender",
    getDistractors: () => ["msg.value", "block.timestamp", "tx.origin"],
    explanation: "msg.sender is the address that called the current function",
  },
  {
    name: "block.timestamp usage",
    pattern: /\bblock\.timestamp\b/g,
    type: "builtin",
    getAnswer: () => "block.timestamp",
    getDistractors: () => ["block.number", "block.chainid", "msg.sender"],
    explanation: "block.timestamp is the timestamp of the current block",
  },
  {
    name: "constructor assignment",
    pattern: /constructor\s*\([^)]*\)\s*\{[^}]*(\w+)\s*=\s*([^;]+);/g,
    type: "statement",
    getAnswer: (match) => match[2].trim(),
    getDistractors: (answer) => {
      if (answer === "msg.sender") return ["tx.origin", "address(this)", "block.coinbase"];
      return ["0", "1", "true"];
    },
    explanation: "Fill in the value to assign in the constructor",
  },
];

/**
 * Analyze a solution code and extract blank positions
 */
export function analyzeBlankPositions(code: string): BlankPosition[] {
  const positions: BlankPosition[] = [];
  
  // Remove comments and normalize
  const cleanCode = code
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  
  for (const rule of BLANK_PATTERNS) {
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match;
    
    while ((match = regex.exec(cleanCode)) !== null) {
      try {
        const answer = rule.getAnswer(match, cleanCode);
        
        // Skip if answer is too long or contains special chars
        if (answer.length > 50 || answer.includes("\n")) continue;
        
        // Get context (surrounding code)
        const matchStart = match.index;
        const lineNum = cleanCode.substring(0, matchStart).split("\n").length;
        
        const distractors = rule.getDistractors(answer);
        
        positions.push({
          type: rule.type,
          line: lineNum,
          startCol: matchStart,
          endCol: matchStart + match[0].length,
          answer,
          context: match[0],
          explanation: rule.explanation,
        });
      } catch {
        // Skip invalid matches
      }
    }
  }
  
  return positions;
}

/**
 * Filter positions to get only high-quality blanks
 */
export function filterHighQualityPositions(positions: BlankPosition[]): BlankPosition[] {
  // Prefer certain types for better quiz questions
  const typePriority: Record<BlankPosition["type"], number> = {
    keyword: 1,
    operator: 2,
    builtin: 3,
    type: 4,
    modifier: 5,
    statement: 6,
  };
  
  return positions
    .filter(p => {
      // Filter out duplicates by answer
      const seen = new Set<string>();
      if (seen.has(p.answer)) return false;
      seen.add(p.answer);
      
      // Skip if answer is too short (single char)
      if (p.answer.length <= 1) return false;
      
      return true;
    })
    .sort((a, b) => typePriority[a.type] - typePriority[b.type]);
}

/**
 * Generate a code question from a blank position
 */
export function generateCodeQuestion(
  problemId: string,
  category: string,
  position: BlankPosition,
  problemDescription: string
): {
  type: "code";
  id: string;
  category: string;
  code: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
} {
  // Replace the answer in the code with blank marker
  const codeWithBlank = position.context.replace(position.answer, "___BLANK___");
  
  // Get full code context
  const fullCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Quiz {
${"    " + codeWithBlank.replace(/\n/g, "\n    ")}
}`;
  
  // Generate distractors
  const allDistractors = generateDistractors(position);
  const distractors = allDistractors.slice(0, 3) as [string, string, string];
  
  return {
    type: "code",
    id: `${problemId}-${Date.now()}`,
    category,
    code: fullCode,
    answer: position.answer,
    distractors,
    explanation: position.explanation,
  };
}

/**
 * Generate distractors for a given position
 */
function generateDistractors(position: BlankPosition): string[] {
  switch (position.type) {
    case "keyword":
      return getKeywordDistractors(position.answer);
    case "operator":
      return getOperatorDistractors(position.answer);
    case "builtin":
      return getBuiltinDistractors(position.answer);
    case "type":
      return getTypeDistractors(position.answer);
    default:
      return ["wrong1", "wrong2", "wrong3"];
  }
}

function getKeywordDistractors(answer: string): string[] {
  const keywordGroups: Record<string, string[]> = {
    emit: ["log", "return", "throw"],
    require: ["assert", "revert", "if"],
    revert: ["return", "throw", "require"],
    assert: ["require", "revert", "if"],
    mapping: ["array", "struct", "enum"],
    struct: ["enum", "mapping", "array"],
    event: ["function", "modifier", "error"],
    modifier: ["function", "event", "error"],
    override: ["virtual", "abstract", "static"],
    virtual: ["override", "abstract", "final"],
    public: ["private", "internal", "external"],
    private: ["public", "internal", "external"],
    internal: ["public", "private", "external"],
    external: ["public", "internal", "private"],
    view: ["pure", "payable", ""],
    pure: ["view", "payable", ""],
    payable: ["view", "pure", ""],
    contract: ["library", "interface", "abstract"],
    library: ["contract", "interface", "abstract"],
    interface: ["contract", "library", "abstract"],
    import: ["include", "require", "using"],
    using: ["import", "require", "for"],
    for: ["while", "do", "foreach"],
    while: ["for", "do", "if"],
    break: ["continue", "return", "exit"],
    continue: ["break", "return", "exit"],
    return: ["yield", "throw", "revert"],
    if: ["unless", "when", "switch"],
    else: ["then", "endif", "otherwise"],
    true: ["false", "null", "0"],
    false: ["true", "null", "1"],
  };
  
  return keywordGroups[answer] || ["keyword1", "keyword2", "keyword3"];
}

function getOperatorDistractors(answer: string): string[] {
  const operatorGroups: Record<string, string[]> = {
    "+": ["-", "*", "/"],
    "-": ["+", "*", "/"],
    "*": ["+", "-", "/"],
    "/": ["+", "-", "*"],
    "%": ["+", "-", "*"],
    "++": ["--", "+=1", "-=1"],
    "--": ["++", "+=1", "-=1"],
    "+=": ["-=", "*=", "/="],
    "-=": ["+=", "*=", "/="],
    "*=": ["+=", "-=", "/="],
    "==": ["!=", "<", ">"],
    "!=": ["==", "<=", ">="],
    ">": [">=", "<", "=="],
    "<": ["<=", ">", "=="],
    ">=": [">", "<=", "=="],
    "<=": ["<", ">=", "=="],
    "&&": ["||", "&", "|"],
    "||": ["&&", "|", "&"],
    "&": ["|", "&&", "||"],
    "|": ["&", "&&", "||"],
  };
  
  return operatorGroups[answer] || ["op1", "op2", "op3"];
}

function getBuiltinDistractors(answer: string): string[] {
  const builtinGroups: Record<string, string[]> = {
    "msg.sender": ["msg.value", "tx.origin", "block.coinbase"],
    "msg.value": ["msg.sender", "tx.origin", "block.coinbase"],
    "tx.origin": ["msg.sender", "msg.value", "block.coinbase"],
    "block.timestamp": ["block.number", "block.chainid", "block.difficulty"],
    "block.number": ["block.timestamp", "block.chainid", "block.difficulty"],
    "block.chainid": ["block.timestamp", "block.number", "block.difficulty"],
    "block.difficulty": ["block.timestamp", "block.number", "block.gaslimit"],
    "block.gaslimit": ["block.gasleft", "block.difficulty", "block.number"],
    "block.gasleft": ["block.gaslimit", "gasleft()", "msg.gas"],
    "gasleft()": ["block.gasleft", "msg.gas", "tx.gasprice"],
    "msg.gas": ["gasleft()", "block.gasleft", "tx.gasprice"],
    "tx.gasprice": ["msg.gas", "gasleft()", "block.gaslimit"],
    "msg.data": ["msg.sender", "msg.sig", "msg.value"],
    "msg.sig": ["msg.sender", "msg.data", "msg.value"],
    "abi.encode": ["abi.encodePacked", "abi.decode", "abi.encodeWithSelector"],
    "abi.encodePacked": ["abi.encode", "abi.decode", "abi.encodeWithSignature"],
    "type(T).max": ["type(T).min", "type(T).max", "type(T).min"],
    "type(T).min": ["type(T).max", "type(T).min", "type(T).max"],
    "address(this)": ["msg.sender", "tx.origin", "block.coinbase"],
  };
  
  return builtinGroups[answer] || ["builtin1", "builtin2", "builtin3"];
}

function getTypeDistractors(answer: string): string[] {
  const typeGroups: Record<string, string[]> = {
    "uint256": ["uint128", "uint64", "uint32"],
    "uint": ["uint128", "uint64", "uint32"],
    "uint8": ["uint16", "uint32", "uint256"],
    "uint16": ["uint8", "uint32", "uint256"],
    "uint32": ["uint16", "uint64", "uint256"],
    "uint64": ["uint32", "uint128", "uint256"],
    "uint128": ["uint64", "uint256", "uint32"],
    "int256": ["int128", "int64", "int32"],
    "int": ["int128", "int64", "int32"],
    "int8": ["int16", "int32", "int256"],
    "int16": ["int8", "int32", "int256"],
    "int32": ["int16", "int64", "int256"],
    "int64": ["int32", "int128", "int256"],
    "int128": ["int64", "int256", "int32"],
    "address": ["uint256", "bytes32", "string"],
    "bool": ["uint256", "address", "string"],
    "string": ["address", "bytes", "uint256"],
    "bytes": ["bytes32", "string", "uint256"],
    "bytes32": ["bytes", "string", "address"],
    "byte": ["bytes", "bytes32", "uint8"],
    "memory": ["calldata", "storage", "uint256"],
    "calldata": ["memory", "storage", "uint256"],
    "storage": ["memory", "calldata", "uint256"],
  };
  
  return typeGroups[answer] || ["type1", "type2", "type3"];
}
