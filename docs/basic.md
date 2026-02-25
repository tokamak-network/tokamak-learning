# TokamakLearn[:run] - Technical Deep Dive Report

## Executive Summary

**TokamakLearn[:run]** is an interactive, browser-based Solidity smart contract learning platform developed by Tokamak Network. It provides a hands-on coding environment where users learn Solidity by writing, compiling, and executing real smart contracts entirely in the browser—no external dependencies, installations, or blockchain connections required.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Technologies](#core-technologies)
4. [Learning System](#learning-system)
5. [Execution Engine](#execution-engine)
6. [Vulnerability Playground](#vulnerability-playground)
7. [Frontend Architecture](#frontend-architecture)
8. [API Layer](#api-layer)
9. [Key Design Decisions](#key-design-decisions)
10. [File Structure](#file-structure)
11. [Configuration & Tooling](#configuration--tooling)
12. [Future Roadmap](#future-roadmap)

---

## Project Overview

### Mission

> "Write, compile, repeat — context isn't given, it's earned."

TokamakLearn embodies a **"learn by doing"** philosophy where users acquire Solidity knowledge through direct coding experience. The platform prioritizes:

- **Typing over copy-pasting** — Users learn by writing code themselves
- **Error-driven learning** — Intentional error experiences teach debugging
- **Incremental progression** — One concept per problem, building on previous knowledge
- **Immediate feedback** — Real-time compilation and test results

### Target Audience

- Web3 developers learning Solidity
- Developers transitioning from other languages
- Security researchers studying smart contract vulnerabilities
- Students in blockchain development courses

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER (Client)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Next.js Frontend                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │    │
│  │  │   Monaco    │  │   Framer    │  │   Theme     │  │   React     │ │    │
│  │  │   Editor    │  │   Motion    │  │   Provider  │  │   State     │ │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS SERVER (API Routes)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │  /api/run       │  │  /api/compile   │  │  /api/vulnerability/run     │  │
│  │  (Execute)      │  │  (Test)         │  │  (Exploit Runner)           │  │
│  └────────┬────────┘  └────────┬────────┘  └──────────────┬──────────────┘  │
│           │                    │                          │                  │
│           ▼                    ▼                          ▼                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Execution Layer (Server-Side)                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │    │
│  │  │    Solc     │  │  EthereumJS │  │    TEVM     │  │   Viem      │ │    │
│  │  │  Compiler   │  │      VM     │  │  (Memory)   │  │   Utils     │ │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input (Solidity Code)
        │
        ▼
┌───────────────────┐
│  Monaco Editor    │  ← Syntax highlighting, VIM mode
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   API Request     │  ← POST /api/compile or /api/run
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   Solc Compiler   │  ← Source → ABI + Bytecode
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   EVM Execution   │  ← EthereumJS VM or TEVM
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Test Results     │  ← Pass/Fail + Console logs
└───────────────────┘
```

---

## Core Technologies

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling with custom theme |
| **Monaco Editor** | 4.7.0 | Code editor (VS Code engine) |
| **Framer Motion** | 12.34.0 | Animations |
| **monaco-vim** | 0.4.4 | VIM keybindings support |

### Backend/Execution Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **solc** | 0.8.33 | Solidity compiler (JavaScript port) |
| **@ethereumjs/vm** | 10.1.1 | EVM implementation for test execution |
| **tevm** | 1.0.0-next.149 | TypeScript EVM for vulnerability challenges |
| **viem** | 2.46.0 | Ethereum utility library |
| **ethers** | 6.16.0 | Ethereum interactions & ABI encoding |

---

## Learning System

### Problem Structure

The platform currently contains **80+ problems** organized into **11 categories**:

```typescript
interface Problem {
  id: string;                    // Unique identifier
  title: string;                 // Display name
  category: string;              // Category ID
  order: number;                 // Position within category
  difficulty: "beginner" | "intermediate" | "advanced";
  
  description: string;           // Markdown instruction
  starterCode: string;           // Initial code template
  solution: string;              // Reference solution
  
  hints: string[];               // Progressive hints
  testDescription: string;       // What's being tested
  
  expectedFunctions?: string[];  // Function names to verify
  expectedEvents?: string[];     // Event names to verify
  testCases?: TestCase[];        // EVM test execution
  constructorArgs?: string[];    // Deployment arguments
  expectedContractName?: string; // Contract naming requirement
}
```

### Category Progression

| Order | Category | Description |
|-------|----------|-------------|
| 1 | **basics** | Contract structure, syntax, contracts |
| 2 | **integers** | uint/int types and ranges |
| 3 | **basic-types** | bool, address, bytes, string, enum |
| 4 | **arithmetic** | +, -, *, /, %, ** |
| 5 | **comparison** | Operators, conditionals, ternary |
| 6 | **variables** | Scope, visibility, view/pure |
| 7 | **gotchas** | Overflow, delete behavior, decimals |
| 8 | **control-flow** | Loops, require/assert/revert |
| 9 | **data-structures** | Arrays, mappings, structs |
| 10 | **advanced** | Inheritance, interfaces, modifiers |
| 11 | **patterns** | ERC20, real-world patterns |

### Problem Types

#### Type A: Write
Users fill in TODO sections with specific code:

```typescript
starterCode: `
contract Storage {
    // TODO: Declare a public uint variable named value
}`
```

#### Type B: Fix (Error Experience)
Intentionally broken code that teaches error handling:

```typescript
description: `
# Fix a Type Error
**First, compile it as-is to see the error message.**
Then fix it with the correct type.
`,
starterCode: `
contract TypeErrorFix {
    uint public name = "Alice";  // Wrong type!
}`
```

#### Type C: Extend
Build upon previous solutions:

```typescript
description: `
In the previous problem, you declared a state variable.
Now let's create a function to change its value.
`
```

### Test Case Execution

```typescript
interface TestCase {
  fn: string;           // Function to call
  args?: string[];      // Arguments
  expected?: string;    // Expected return value
  message: string;      // Test description
  value?: string;       // ETH to send
  setup?: {             // Pre-test setup calls
    fn: string;
    args?: string[];
    value?: string;
  }[];
  expectRevert?: boolean; // Test should revert
}
```

### Spaced Repetition System

For daily challenges, the platform implements a SuperMemo-style spaced repetition algorithm:

```typescript
interface QuestionState {
  questionId: string;
  type: "code" | "concept";
  category: string;
  easeFactor: number;      // Difficulty adjustment (1.3–2.5+)
  interval: number;        // Days between reviews
  repetitions: number;     // Consecutive correct answers
  nextReviewDate: number;  // Timestamp for next review
  lastAnsweredAt: number;  // Last interaction
}
```

**Algorithm:**
- First correct: interval = 1 day
- Second correct: interval = 3 days
- Subsequent: interval = previous × easeFactor
- Incorrect: reset repetitions, decrease easeFactor

---

## Execution Engine

### Dual EVM Architecture

The platform uses **two different EVM implementations**:

#### 1. EthereumJS VM (Problem Execution)

Used for standard problem testing in `/api/compile`:

```typescript
// src/lib/evm-runner.ts
import { createVM } from "@ethereumjs/vm";
import { Common, Hardfork, Mainnet } from "@ethereumjs/common";

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Osaka });
const vm = await createVM({ common });

// Run deployment
const deployResult = await vm.evm.runCall({
  caller: deployerAddr,
  data: hexToBytes(deployHex),
  gasLimit: BigInt(5_000_000),
});

// Run test calls
const callResult = await vm.evm.runCall({
  caller: deployerAddr,
  to: contractAddr,
  data: hexToBytes(calldata),
});
```

**Key Features:**
- Full EVM opcode support
- Console.log capture via Hardhat's console.sol
- Deployed contract persistence within session
- Gas calculation

#### 2. TEVM (Vulnerability Challenges)

Used for exploit challenges in `/api/vulnerability/run`:

```typescript
// src/lib/challenge-runner.ts
import { createMemoryClient } from "tevm";
import { mainnet } from "tevm/common";

const client = createMemoryClient({
  common: mainnet,
  miningConfig: { type: "auto" },  // Auto-mine transactions
});

await client.tevmReady();

// Set up attacker account
await client.tevmSetAccount({
  address: ATTACKER_ADDRESS,
  balance: parseEther("10"),
});

// Deploy challenge contract
const result = await client.tevmCall({
  from: ATTACKER_ADDRESS,
  data: deployData,
  addToBlockchain: true,
});
```

**Why TEVM for Vulnerabilities?**
- **Local-only operation** — No RPC endpoints required
- **Full blockchain simulation** — State persistence across calls
- **Address pre-deployment** — Set up vulnerable contracts deterministically
- **Better state inspection** — Read storage slots directly

### Compilation Pipeline

```typescript
// src/lib/solc-compiler.ts
export function compileSolidity(sourceCode: string): CompilationResult {
  const input = {
    language: "Solidity",
    sources: {
      "contract.sol": { content: processedSource },
      "hardhat/console.sol": { content: CONSOLE_SOL },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": { "*": ["abi", "evm.bytecode.object"] },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  // Returns: { success, bytecode, abi, errors, warnings }
}
```

### Console.log Implementation

Hardhat-style console.log support for debugging:

```typescript
// src/lib/console-sol.ts
export const CONSOLE_ADDRESS = "0x000000000000000000636f6e736f6c652e6c6f67";

export const CONSOLE_SOL = `
library console {
    function log(string memory p0) internal view {
        _sendLogPayload(abi.encodeWithSignature("log(string)", p0));
    }
    // ... overloads for all types
}
`;

// Capture in EVM
vm.evm.events.on("beforeMessage", (data) => {
  if (data.to?.toString() === CONSOLE_ADDRESS) {
    const decoded = decodeConsoleLog(data.data);
    consoleLogs.push(decoded);
  }
});
```

---

## Vulnerability Playground

### Purpose

A hands-on security training module where users:
1. Learn about real-world vulnerabilities
2. Deploy exploit contracts against vulnerable targets
3. Experience actual attack vectors in a safe environment

### Challenge Structure

```typescript
interface VulnerabilityChallenge {
  id: string;
  title: string;
  category: VulnerabilityCategory;
  difficulty: Difficulty;

  incident: {
    name: string;        // Real incident name
    date: string;        // When it occurred
    losses?: string;     // Financial impact
    references: string[] // Learning resources
  };

  description: string;   // Markdown explanation
  starterCode: string;   // Exploit template
  hint: string;

  setup: {
    contracts: ChallengeContract[];  // Vulnerable contracts to deploy
    accounts?: ChallengeAccount[];   // Pre-funded accounts
    attackerBalance?: string;        // Starting ETH
  };

  successCondition: SuccessCondition;  // Win condition
  solution?: string;                    // Reference exploit
}
```

### Success Conditions

```typescript
interface SuccessCondition {
  checkStorage?: {
    address: `0x${string}`;
    slot: `0x${string}`;
    expectedValue?: string;
  };
  
  checkBalance?: {
    address: `0x${string}`;
    minBalance?: string;
    maxBalance?: string;
  };
  
  checkOwnership?: {
    contract: `0x${string}`;
    ownerSlot?: `0x${string}`;
    expectedOwner?: `0x${string}`;
  };
  
  checkDrained?: {
    contract: `0x${string}`;
    maxRemaining?: string;
  };
}
```

### Example: Parity Wallet Challenge

```typescript
export const parityWalletChallenge: VulnerabilityChallenge = {
  id: "parity-wallet-library",
  title: "Parity Wallet Library Hack",
  category: "access-control",
  
  incident: {
    name: "Parity Wallet Library Hack",
    date: "November 2017",
    losses: "150,000 ETH (~30M USD)",
    references: ["https://..."],
  },

  setup: {
    contracts: [{
      name: "WalletLibrary",
      source: WALLET_LIBRARY_SOURCE,  // Vulnerable contract
    }],
    attackerBalance: "10",
  },

  successCondition: {
    checkOwnership: {
      contract: "WalletLibrary",
    },
  },
};
```

### Challenge Runner Flow

```
1. PUT /api/vulnerability/run
   └─→ Create TEVM client
   └─→ Fund attacker account (10 ETH)
   └─→ Deploy vulnerable contracts
   └─→ Return deployed addresses

2. POST /api/vulnerability/run
   └─→ Compile user's exploit contract
   └─→ Deploy exploit contract
   └─→ Call attack() function
   └─→ Validate success conditions
   └─→ Return results
```

---

## Frontend Architecture

### Component Hierarchy

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, theme, header)
│   ├── page.tsx                # Landing page
│   ├── globals.css             # CSS variables, Tailwind config
│   │
│   ├── problems/
│   │   └── [id]/
│   │       ├── page.tsx        # Server component (data fetching)
│   │       └── ProblemClient.tsx   # Client component (state, editor)
│   │
│   ├── vulnerabilities/
│   │   ├── page.tsx            # Challenge list
│   │   └── [id]/
│   │       ├── page.tsx        # Server component
│   │       └── VulnerabilityClient.tsx
│   │
│   ├── daily/
│   │   ├── page.tsx
│   │   └── DailyClient.tsx
│   │
│   └── api/
│       ├── compile/route.ts    # Test endpoint
│       ├── run/route.ts        # Execute endpoint
│       └── vulnerability/run/route.ts
│
└── components/
    ├── Header.tsx              # Navigation, theme toggle
    ├── SolidityEditor.tsx      # Monaco wrapper with VIM support
    ├── Markdown.tsx            # Description rendering
    ├── ThemeProvider.tsx       # Dark/light mode
    ├── PlasmaCanvas.tsx        # Animated hero graphic
    └── vulnerabilities/
        └── ResultPanel.tsx     # Exploit execution results
```

### Monaco Editor Configuration

```typescript
// src/components/SolidityEditor.tsx
<Editor
  language="sol"
  theme="solidity-dark" // Custom theme
  options={{
    fontSize: 14,
    fontFamily: "Geist Mono",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on",
    tabSize: 4,
    automaticLayout: true,
    bracketPairColorization: { enabled: true },
    suggest: { showWords: false },
  }}
/>
```

**Custom Solidity Syntax Highlighting:**

```typescript
monaco.languages.setMonarchTokensProvider("sol", {
  keywords: [
    "pragma", "contract", "function", "modifier", "event", "struct",
    "address", "bool", "string", "uint", "int", "bytes",
    "public", "private", "internal", "external", "pure", "view", "payable",
    // ... more keywords
  ],
  tokenizer: {
    root: [
      [/\/\/.*$/, "comment"],
      [/\/\*/, "comment", "@comment"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],
      // ... more patterns
    ],
  },
});
```

### Theme System

CSS variables with dark (default) and light modes:

```css
@theme inline {
  --color-background: #080c14;
  --color-foreground: #e2e8f0;
  --color-accent: #38bdf8;        /* Sky blue */
  --color-accent-secondary: #8b5cf6; /* Purple */
  --color-success: #34d399;
  --color-danger: #f87171;
  --shadow-glow: 0 0 20px rgba(56, 189, 248, 0.15);
}

[data-theme="light"] {
  --color-background: #f8fafc;
  --color-foreground: #0f172a;
  --color-accent: #0284c7;
  --shadow-glow: 0 0 20px rgba(2, 132, 199, 0.1);
}
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Enter` | Run code |
| `Cmd/Ctrl + Shift + Enter` | Run tests |
| `Cmd/Ctrl + Shift + H` | Toggle hints |
| `Cmd/Ctrl + Shift + S` | Toggle solution |

---

## API Layer

### Endpoints

#### POST `/api/compile` - Test Execution

```typescript
// Request
{
  source: string;
  expectedFunctions?: string[];
  expectedEvents?: string[];
  testCases?: TestCase[];
  constructorArgs?: string[];
  expectedContractName?: string;
}

// Response
{
  results: Array<{
    passed: boolean;
    message: string;
  }>;
}
```

#### POST `/api/run` - Code Execution

```typescript
// Request
{ source: string }

// Response
{
  compiled: boolean;
  deployed: boolean;
  error?: string;
  consoleLogs: string[];
}
```

#### PUT `/api/vulnerability/run` - Initialize Challenge

```typescript
// Request
{ challengeId: string }

// Response
{
  success: boolean;
  sessionId: string;
  deployedContracts: Record<string, string>;
}
```

#### POST `/api/vulnerability/run` - Run Exploit

```typescript
// Request
{
  challengeId: string;
  userCode: string;
  sessionId?: string;
}

// Response
{
  success: boolean;
  logs: Array<{ type: string; message: string }>;
  validation?: { passed: boolean; message: string; details: string[] };
}
```

### Rate Limiting

In-memory rate limiting is implemented:

```typescript
const RATE_LIMIT = 10;      // Requests per window
const RATE_WINDOW = 60_000; // 60 seconds
const MAX_SOURCE_SIZE = 50_000; // 50KB max code size
```

### Error Humanization

Compiler errors are processed for better UX:

```typescript
// src/lib/humanize-error.ts
export function humanizeError(error: string, source: string): string {
  // Converts cryptic solc errors into friendly messages
  // Highlights line numbers and specific issues
  // Suggests common fixes
}
```

---

## Key Design Decisions

### 1. In-Browser EVM vs Remote Backend

**Decision:** Run EVM entirely in the browser via Next.js API routes.

**Rationale:**
- No external RPC dependencies
- Instant execution (no network latency)
- Works offline once loaded
- No gas costs or blockchain transaction fees
- Security: code runs server-side, not in user's browser

### 2. Dual EVM Implementations

**Decision:** Use EthereumJS VM for problems, TEVM for vulnerabilities.

**Rationale:**
- EthereumJS VM is stable and well-tested for simple contract execution
- TEVM provides better state management for complex vulnerability scenarios
- TEVM's memory client enables "local mode" without forking

### 3. Monaco Editor vs CodeMirror

**Decision:** Monaco Editor with optional VIM mode.

**Rationale:**
- VS Code engine familiar to developers
- Built-in TypeScript/JavaScript support
- Excellent Solidity syntax highlighting via custom tokenizer
- VIM mode via monaco-vim for advanced users

### 4. No Database

**Decision:** All state stored in localStorage (client) and memory (server).

**Rationale:**
- No user accounts needed
- Privacy by design
- Simpler infrastructure
- Stateless API routes

### 5. One Concept Per Problem

**Decision:** Each problem teaches exactly one new concept.

**Rationale:**
- Reduces cognitive load
- Enables targeted error experiences
- Allows precise progress tracking
- Supports the "typing is learning" philosophy

---

## File Structure

```
toka-learn/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── problems/           # Problem pages
│   │   ├── vulnerabilities/    # Security challenges
│   │   └── daily/              # Spaced repetition
│   │
│   ├── components/             # React components
│   │   ├── SolidityEditor.tsx  # Monaco wrapper
│   │   ├── Header.tsx
│   │   └── ...
│   │
│   ├── data/                   # Static data
│   │   ├── problems.ts         # Problem aggregation
│   │   ├── problems/           # Category files (11 categories)
│   │   │   ├── basics.ts
│   │   │   ├── integers.ts
│   │   │   └── ...
│   │   ├── vulnerabilities/    # Security challenges
│   │   │   ├── index.ts
│   │   │   └── access-control/
│   │   │       └── parity-wallet.ts
│   │   └── daily-challenges.ts
│   │
│   ├── lib/                    # Core libraries
│   │   ├── solc-compiler.ts    # Solidity compilation
│   │   ├── evm-runner.ts       # EthereumJS executor
│   │   ├── challenge-runner.ts # TEVM executor
│   │   ├── console-sol.ts      # Hardhat console
│   │   └── spaced-repetition.ts
│   │
│   └── types/                  # TypeScript definitions
│       └── vulnerability.ts
│
├── public/                     # Static assets
├── docs/                       # Documentation
├── scripts/                    # Build/utility scripts
│   ├── validate-data.ts
│   └── generate-daily.ts
│
├── research.md                 # Solidity vulnerability research
├── PLAN.md                     # Vulnerability implementation plan
├── AGENTS.md                   # Problem design guide
└── package.json
```

---

## Configuration & Tooling

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve"
  }
}
```

### Build Process

```json
{
  "scripts": {
    "dev": "next dev",
    "validate": "tsx scripts/validate-data.ts",
    "build": "npm run validate && next build",
    "test": "vitest run"
  }
}
```

**Pre-build Validation:**
- Runs `validate-data.ts` to check problem data integrity
- Verifies problem IDs are unique
- Validates category references
- Checks test case structure

### VITEST Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
});
```

---

## Future Roadmap

### Planned Features

1. **More Vulnerability Challenges**
   - DAO Reentrancy
   - BEC Token Overflow
   - Flash Loan Oracle Manipulation
   - Honeypot Detection

2. **Enhanced Analytics**
   - Learning progress visualization
   - Problem completion streaks
   - Time-to-solution tracking

3. **Social Features**
   - Share solutions
   - Custom challenges
   - Leaderboards

4. **Additional Languages**
   - Move (Sui/Aptos)
   - Rust (Solana)
   - Cairo (StarkNet)

5. **Mobile Improvements**
   - Better touch editor
   - Offline support
   - Progress sync

### Known Limitations

- **Session persistence**: EVM state lost on server restart
- **No actual blockchain**: Real-world contract testing requires testnets
- **Rate limiting**: In-memory only, resets on deploy
- **No user accounts**: Progress tied to localStorage

---

## Conclusion

TokamakLearn[:run] is a well-architected educational platform that successfully brings Solidity learning into the browser. Key strengths include:

- **Complete in-browser execution** without external dependencies
- **Dual EVM architecture** optimized for different use cases
- **Structured curriculum** with intentional pedagogical design
- **Vulnerability playground** for hands-on security training
- **Polished UX** with Monaco editor, animations, and responsive design

The platform serves as an excellent foundation for blockchain education and demonstrates sophisticated use of modern web technologies combined with EVM internals.