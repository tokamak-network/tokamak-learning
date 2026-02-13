export interface TestCase {
  fn: string;
  args?: string[];
  expected?: string;
  message: string;
  value?: string;
  setup?: { fn: string; args?: string[]; value?: string }[];
  expectRevert?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testDescription: string;
  expectedFunctions?: string[];
  expectedEvents?: string[];
  testCases?: TestCase[];
  constructorArgs?: string[];
  expectedContractName?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  order: number;
}

export const categories: Category[] = [
  { id: "basics", title: "Basics", description: "Learn the basic structure and syntax of Solidity", order: 1 },
  { id: "integers", title: "Integers", description: "Learn about various sizes and properties of uint and int", order: 2 },
  { id: "basic-types", title: "Basic Types", description: "Learn bool, address, bytes, string, and enum types", order: 3 },
  { id: "arithmetic", title: "Arithmetic", description: "Learn Solidity arithmetic operators one by one", order: 4 },
  { id: "comparison", title: "Comparison & Logic", description: "Learn comparison, logical operators, and conditionals", order: 5 },
  { id: "variables", title: "Variables & Functions", description: "Learn variable types, visibility, and function basics", order: 6 },
  { id: "gotchas", title: "Solidity Gotchas", description: "Learn unique characteristics of Solidity that differ from other languages", order: 7 },
  { id: "control-flow", title: "Control Flow", description: "Learn loops and error handling", order: 8 },
  { id: "data-structures", title: "Data Structures", description: "Learn arrays, mappings, and structs", order: 9 },
  { id: "advanced", title: "Advanced", description: "Learn inheritance, interfaces, events, and other advanced features", order: 10 },
  { id: "patterns", title: "Design Patterns", description: "Learn smart contract patterns used in production", order: 11 },
];

export const problems: Problem[] = [
  // ==========================================
  // BASICS — 10 problems
  // ==========================================
  {
    id: "hello-solidity",
    title: "Your First Contract",
    category: "basics",
    order: 1,
    difficulty: "beginner",
    description: `# Your First Contract

In Solidity, all code lives inside a \`contract\`.
Just like building a house starts with an empty room, let's start with an empty contract.

## Task

Type the following code:

\`\`\`solidity
contract HelloSolidity {
}
\`\`\`

> \`contract\` — the keyword used to declare a smart contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: Declare a HelloSolidity contract`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloSolidity {
}`,
    hints: ["Write the name after the contract keyword and wrap it with { }.", "contract HelloSolidity { }"],
    testDescription: "Checks that the HelloSolidity contract compiles successfully.",
    expectedFunctions: [],
    expectedContractName: "HelloSolidity",
  },
  {
    id: "contract-rename",
    title: "Rename a Contract",
    category: "basics",
    order: 2,
    difficulty: "beginner",
    description: `# Rename a Contract

Contract names should **start with an uppercase letter**.
If there are multiple words, capitalize the first letter of each word.

Examples: \`MyToken\`, \`SimpleStorage\`, \`HelloWorld\`

## Task

Rename the contract from \`MyContract\` to \`MyStorage\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyStorage {
}`,
    hints: ["Just change the name after the contract keyword.", "MyContract → MyStorage"],
    testDescription: "Checks that the contract name is MyStorage.",
    expectedFunctions: [],
    expectedContractName: "MyStorage",
  },
  {
    id: "first-variable",
    title: "Store a Number",
    category: "basics",
    order: 3,
    difficulty: "beginner",
    description: `# Store a Number

You can store data inside a contract. These are called **state variables**.

\`uint\` is a type that stores unsigned integers (0, 1, 2, 3...).

## Task

Type the following code inside the contract:

\`\`\`solidity
uint public myNumber = 42;
\`\`\`

> Adding \`public\` makes this value readable from outside the contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstVariable {
    // TODO: Declare uint public myNumber and initialize it to 42
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstVariable {
    uint public myNumber = 42;
}`,
    hints: ["Declare it as: uint public variableName = value;", "uint public myNumber = 42;"],
    testDescription: "Checks that myNumber() returns 42.",
    expectedFunctions: ["myNumber"],
    testCases: [
      { fn: "myNumber", expected: "42", message: "myNumber() should return 42" },
    ],
  },
  {
    id: "string-variable",
    title: "Store a String",
    category: "basics",
    order: 4,
    difficulty: "beginner",
    description: `# Store a String

You can store not only numbers but also text.

\`string\` is a type that stores text. Values are wrapped in double quotes (\`""\`).

## Task

Type the following code inside the contract:

\`\`\`solidity
string public greeting = "Hello Tokamak";
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringVariable {
    // TODO: Declare string public greeting and initialize it to "Hello Tokamak"
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringVariable {
    string public greeting = "Hello Tokamak";
}`,
    hints: ["Declare it as: string public variableName = \"value\";", "string public greeting = \"Hello Tokamak\";"],
    testDescription: "Checks that greeting() returns 'Hello Tokamak'.",
    expectedFunctions: ["greeting"],
    testCases: [
      { fn: "greeting", expected: "Hello Tokamak", message: "greeting() should return 'Hello Tokamak'" },
    ],
  },
  {
    id: "state-variables",
    title: "Two State Variables",
    category: "basics",
    order: 5,
    difficulty: "beginner",
    description: `# Two State Variables

In the previous problems, you declared \`uint\` and \`string\` separately.
Now let's declare both variables together in a single contract.

## Task

1. Declare \`string public greeting\` with the value \`"Hello Tokamak"\`
2. Declare \`uint public version\` with the value \`1\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StateVariables {
    // TODO: Declare string public greeting and initialize it to "Hello Tokamak"
    // TODO: Declare uint public version and initialize it to 1
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StateVariables {
    string public greeting = "Hello Tokamak";
    uint public version = 1;
}`,
    hints: ["Write two lines using the same pattern you learned before.", "string public greeting = \"Hello Tokamak\";\nuint public version = 1;"],
    testDescription: "Checks that greeting() returns 'Hello Tokamak' and version() returns 1.",
    expectedFunctions: ["greeting", "version"],
    testCases: [
      { fn: "greeting", expected: "Hello Tokamak", message: "greeting() should return 'Hello Tokamak'" },
      { fn: "version", expected: "1", message: "version() should return 1" },
    ],
  },
  {
    id: "type-error-fix",
    title: "Fix a Type Error",
    category: "basics",
    order: 6,
    difficulty: "beginner",
    description: `# Fix a Type Error

The code below has a **type error**.

## Task

1. **First, try compiling it as-is** — check the error message
2. Once you see the error, fix it with the correct type

> Hint: \`uint\` can only store numbers. It cannot store the string \`"Alice"\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeErrorFix {
    // This code has an error. Try compiling it first!
    uint public name = "Alice";
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeErrorFix {
    string public name = "Alice";
}`,
    hints: ["\"Alice\" is a string. What type stores strings?", "Change uint to string."],
    testDescription: "Checks that name() returns 'Alice'.",
    expectedFunctions: ["name"],
    testCases: [
      { fn: "name", expected: "Alice", message: "name() should return 'Alice'" },
    ],
  },
  {
    id: "constructor-basics",
    title: "Constructor",
    category: "basics",
    order: 7,
    difficulty: "beginner",
    description: `# Constructor

The \`constructor\` is a special function that runs **only once** when the contract is deployed.
It's like setting up initial configurations when you first install an app.

\`msg.sender\` is the address of the person who deployed this contract.

## Task

Type the following code inside the constructor:

\`\`\`solidity
owner = msg.sender;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstructorBasics {
    address public owner;

    constructor() {
        // TODO: Set owner to msg.sender
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstructorBasics {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}`,
    hints: ["msg.sender is the address of the person who deployed the contract.", "owner = msg.sender;"],
    testDescription: "Checks that the deployer's address is stored in owner.",
    expectedFunctions: ["owner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
    ],
  },
  {
    id: "constant-keyword",
    title: "Constant",
    category: "basics",
    order: 8,
    difficulty: "beginner",
    description: `# Constant

A variable declared with \`constant\` **can never be changed**.
It's used for fixed configuration values, and by convention the name is written in \`UPPERCASE\`.

## Task

Type the following code:

\`\`\`solidity
uint256 public constant MAX_SUPPLY = 10000;
\`\`\`

> \`constant\` is placed between \`public\` and the variable name.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstantKeyword {
    // TODO: Declare uint256 public constant MAX_SUPPLY with value 10000
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstantKeyword {
    uint256 public constant MAX_SUPPLY = 10000;
}`,
    hints: ["The pattern is: uint256 public constant NAME = value;", "uint256 public constant MAX_SUPPLY = 10000;"],
    testDescription: "Checks that MAX_SUPPLY() returns 10000.",
    expectedFunctions: ["MAX_SUPPLY"],
    testCases: [
      { fn: "MAX_SUPPLY", expected: "10000", message: "MAX_SUPPLY() should return 10000" },
    ],
  },
  {
    id: "immutable-keyword",
    title: "Immutable",
    category: "basics",
    order: 9,
    difficulty: "beginner",
    description: `# Immutable

\`immutable\` is similar to \`constant\`, but **its value can be set once in the constructor**.

- \`constant\`: value must be hardcoded (e.g., \`= 10000\`)
- \`immutable\`: value can be set at deployment (e.g., \`msg.sender\`)

## Task

1. Declare \`DEPLOYER\` as \`immutable\`
2. Assign \`msg.sender\` to it in the constructor`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ImmutableKeyword {
    // TODO: Declare address public immutable DEPLOYER

    constructor() {
        // TODO: Assign msg.sender to DEPLOYER
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ImmutableKeyword {
    address public immutable DEPLOYER;

    constructor() {
        DEPLOYER = msg.sender;
    }
}`,
    hints: ["immutable goes between public and the variable name: address public immutable DEPLOYER;", "Inside the constructor: DEPLOYER = msg.sender;"],
    testDescription: "Checks that DEPLOYER() returns the deployer's address.",
    expectedFunctions: ["DEPLOYER"],
    testCases: [
      { fn: "DEPLOYER", expected: "DEPLOYER", message: "DEPLOYER() should return the deployer's address" },
    ],
  },
  {
    id: "multiple-state-vars",
    title: "Putting It Together: Multiple State Variables",
    category: "basics",
    order: 10,
    difficulty: "beginner",
    description: `# Putting It Together: Multiple State Variables

Let's combine what you've learned so far.
Declare three variables of types \`string\`, \`uint256\`, and \`bool\` in a single contract.

## Task

1. Declare \`string public name\` with the value \`"Tokamak"\`
2. Declare \`uint256 public level\` with the value \`1\`
3. Declare \`bool public isActive\` with the value \`true\`

> \`bool\` is a type that can only hold \`true\` or \`false\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultipleStateVars {
    // TODO: Declare string public name with value "Tokamak"
    // TODO: Declare uint256 public level with value 1
    // TODO: Declare bool public isActive with value true
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultipleStateVars {
    string public name = "Tokamak";
    uint256 public level = 1;
    bool public isActive = true;
}`,
    hints: ["They all follow the same pattern: type public name = value;", "bool public isActive = true;"],
    testDescription: "Checks that name, level, and isActive return the correct values.",
    expectedFunctions: ["name", "level", "isActive"],
    testCases: [
      { fn: "name", expected: "Tokamak", message: "name() should return 'Tokamak'" },
      { fn: "level", expected: "1", message: "level() should return 1" },
      { fn: "isActive", expected: "true", message: "isActive() should return true" },
    ],
  },
  {
    id: "uint256-basics",
    title: "uint256 Basics",
    category: "integers",
    order: 1,
    difficulty: "beginner",
    description: `# uint256 Basics

\`uint256\` is Solidity's default unsigned integer type. It can store values from 0 to 2^256-1.

\`\`\`solidity
uint256 public amount = 500;
\`\`\`

## Task
Declare two uint256 public variables: \`totalSupply\` (value: 1000000) and \`price\` (value: 100).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint256Basics {
    // TODO: Declare uint256 public totalSupply with value 1000000
    // TODO: Declare uint256 public price with value 100
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint256Basics {
    uint256 public totalSupply = 1000000;
    uint256 public price = 100;
}`,
    hints: ["Declare as: uint256 public variableName = value;", "Numbers in Solidity don't use commas."],
    testDescription: "Checks that totalSupply() returns 1000000 and price() returns 100.",
    expectedFunctions: ["totalSupply", "price"],
    testCases: [
      { fn: "totalSupply", expected: "1000000", message: "totalSupply() should return 1000000" },
      { fn: "price", expected: "100", message: "price() should return 100" },
    ],
  },
  {
    id: "uint8-range",
    title: "uint8 Range (0~255)",
    category: "integers",
    order: 2,
    difficulty: "beginner",
    description: `# uint8 Range (0~255)

\`uint8\` is a small integer type that can store values from 0 to 255. It's used for small values like token decimals.

\`\`\`solidity
uint8 public myVal = 42;
\`\`\`

## Task
Declare \`decimals\` (uint8, value: 18) and write a \`setDecimals\` function to change its value.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint8Range {
    // TODO: Declare uint8 public decimals with value 18

    // TODO: Write a setDecimals(uint8 _decimals) public function
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint8Range {
    uint8 public decimals = 18;

    function setDecimals(uint8 _decimals) public {
        decimals = _decimals;
    }
}`,
    hints: ["Function declaration: function setDecimals(uint8 _decimals) public { ... }", "Inside the function: decimals = _decimals;"],
    testDescription: "Checks that decimals() returns 18 and setDecimals can change the value.",
    expectedFunctions: ["decimals", "setDecimals"],
    testCases: [
      { fn: "decimals", expected: "18", message: "Initial decimals() should return 18" },
      { fn: "decimals", expected: "42", message: "After setDecimals(42), decimals() should return 42", setup: [{ fn: "setDecimals", args: ["42"] }] },
    ],
  },
  {
    id: "uint-sizes",
    title: "uint Size Variants",
    category: "integers",
    order: 3,
    difficulty: "beginner",
    description: `# uint Size Variants

Solidity provides various sizes: uint8, uint16, uint32, uint64, uint128, uint256. Gas cost is the same in most cases.

\`\`\`solidity
uint16 public small = 100;
uint128 public medium = 50000;
\`\`\`

## Task
Declare \`a\`(uint16), \`b\`(uint32), \`c\`(uint64), \`d\`(uint128), \`e\`(uint256) as public with any value you like.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UintSizes {
    // TODO: Declare uint16 public a
    // TODO: Declare uint32 public b
    // TODO: Declare uint64 public c
    // TODO: Declare uint128 public d
    // TODO: Declare uint256 public e
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UintSizes {
    uint16 public a = 100;
    uint32 public b = 1000;
    uint64 public c = 10000;
    uint128 public d = 100000;
    uint256 public e = 1000000;
}`,
    hints: ["Declare a public variable for each type and assign an initial value.", "Example: uint16 public a = 100;"],
    testDescription: "Checks that all 5 getter functions (a, b, c, d, e) exist.",
    expectedFunctions: ["a", "b", "c", "d", "e"],
    testCases: [
      { fn: "a", message: "a() should return successfully" },
      { fn: "b", message: "b() should return successfully" },
      { fn: "c", message: "c() should return successfully" },
      { fn: "d", message: "d() should return successfully" },
      { fn: "e", message: "e() should return successfully" },
    ],
  },
  {
    id: "int256-basics",
    title: "int256 Signed Integer",
    category: "integers",
    order: 4,
    difficulty: "beginner",
    description: `# int256 Signed Integer

\`int256\` can store both negative and positive numbers. Range: -2^255 to 2^255-1.

\`\`\`solidity
int256 public balance = -100;
\`\`\`

## Task
Declare two int256 public variables: \`temperature\` (value: -10) and \`altitude\` (value: 500).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Int256Basics {
    // TODO: Declare int256 public temperature with value -10
    // TODO: Declare int256 public altitude with value 500
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Int256Basics {
    int256 public temperature = -10;
    int256 public altitude = 500;
}`,
    hints: ["int256 can be assigned negative values directly.", "int256 public temperature = -10;"],
    testDescription: "Checks that temperature() returns -10 and altitude() returns 500.",
    expectedFunctions: ["temperature", "altitude"],
    testCases: [
      { fn: "temperature", expected: "-10", message: "temperature() should return -10" },
      { fn: "altitude", expected: "500", message: "altitude() should return 500" },
    ],
  },
  {
    id: "int-negative",
    title: "Working with Negatives",
    category: "integers",
    order: 5,
    difficulty: "beginner",
    description: `# Working with Negatives

The unary \`-\` operator flips the sign, and you can compute absolute value with a ternary operator.

\`\`\`solidity
int256 y = -x;
int256 absVal = x >= 0 ? x : -x;
\`\`\`

## Task
Complete the \`negate\` function (flip sign) and the \`abs\` function (absolute value).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntNegative {
    function negate(int256 x) public pure returns (int256) {
        // TODO: Return x with its sign flipped
    }

    function abs(int256 x) public pure returns (int256) {
        // TODO: Return the absolute value of x using a ternary operator
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntNegative {
    function negate(int256 x) public pure returns (int256) {
        return -x;
    }

    function abs(int256 x) public pure returns (int256) {
        return x >= 0 ? x : -x;
    }
}`,
    hints: ["To flip the sign: return -x;", "Ternary operator: condition ? valueIfTrue : valueIfFalse"],
    testDescription: "Checks that negate(5) returns -5 and abs(-3) returns 3.",
    expectedFunctions: ["negate", "abs"],
    testCases: [
      { fn: "negate", args: ["5"], expected: "-5", message: "negate(5) should return -5" },
      { fn: "negate", args: ["-3"], expected: "3", message: "negate(-3) should return 3" },
      { fn: "abs", args: ["-3"], expected: "3", message: "abs(-3) should return 3" },
      { fn: "abs", args: ["7"], expected: "7", message: "abs(7) should return 7" },
    ],
  },
  {
    id: "type-min-max",
    title: "Type Min and Max Values",
    category: "integers",
    order: 6,
    difficulty: "beginner",
    description: `# Type Min and Max Values

Use \`type(T).min\` and \`type(T).max\` to query the range of each integer type.

\`\`\`solidity
uint8 maxVal = type(uint8).max; // 255
int8 minVal = type(int8).min;   // -128
\`\`\`

## Task
Write three functions: \`getMaxUint8\`, \`getMinInt8\`, and \`getMaxUint256\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeMinMax {
    function getMaxUint8() public pure returns (uint8) {
        // TODO: Return type(uint8).max
    }

    function getMinInt8() public pure returns (int8) {
        // TODO: Return type(int8).min
    }

    function getMaxUint256() public pure returns (uint256) {
        // TODO: Return type(uint256).max
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeMinMax {
    function getMaxUint8() public pure returns (uint8) {
        return type(uint8).max;
    }

    function getMinInt8() public pure returns (int8) {
        return type(int8).min;
    }

    function getMaxUint256() public pure returns (uint256) {
        return type(uint256).max;
    }
}`,
    hints: ["type(uint8).max returns 255.", "return type(T).max; or return type(T).min;"],
    testDescription: "Checks that getMaxUint8() returns 255 and getMinInt8() returns -128.",
    expectedFunctions: ["getMaxUint8", "getMinInt8", "getMaxUint256"],
    testCases: [
      { fn: "getMaxUint8", expected: "255", message: "getMaxUint8() should return 255" },
      { fn: "getMinInt8", expected: "-128", message: "getMinInt8() should return -128" },
      { fn: "getMaxUint256", expected: "115792089237316195423570985008687907853269984665640564039457584007913129639935", message: "getMaxUint256() should return 2^256-1" },
    ],
  },
  {
    id: "overflow-protection",
    title: "Overflow Protection",
    category: "integers",
    order: 7,
    difficulty: "beginner",
    description: `# Overflow Protection

In Solidity 0.8+, integer overflow automatically reverts the transaction. For example, uint8(255) + 1 causes an error.

\`\`\`solidity
function safeAdd(uint8 a, uint8 b) public pure returns (uint8) {
    return a + b; // auto-reverts on overflow
}
\`\`\`

## Task
Write the body of the \`add\` function. Simply return a + b.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OverflowProtection {
    function add(uint8 a, uint8 b) public pure returns (uint8) {
        // TODO: Return a + b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OverflowProtection {
    function add(uint8 a, uint8 b) public pure returns (uint8) {
        return a + b;
    }
}`,
    hints: ["Just write return a + b;", "In 0.8+, overflow checks are performed automatically."],
    testDescription: "Checks that add(1, 2) returns 3 and add(255, 1) reverts.",
    expectedFunctions: ["add"],
    testCases: [
      { fn: "add", args: ["1", "2"], expected: "3", message: "add(1, 2) should return 3" },
      { fn: "add", args: ["100", "50"], expected: "150", message: "add(100, 50) should return 150" },
      { fn: "add", args: ["255", "1"], expectRevert: true, message: "add(255, 1) should revert due to overflow" },
    ],
  },
  {
    id: "unchecked-block",
    title: "unchecked Block",
    category: "integers",
    order: 8,
    difficulty: "beginner",
    description: `# unchecked Block

Inside an \`unchecked { }\` block, overflow checks are skipped to save gas. Only use this when you're certain overflow won't occur.

\`\`\`solidity
unchecked { counter++; }
\`\`\`

## Task
In the \`increment\` function, increment \`counter\` by 1 inside an \`unchecked\` block.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UncheckedBlock {
    uint256 public counter;

    function increment() public {
        // TODO: Increment counter by 1 inside an unchecked block
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UncheckedBlock {
    uint256 public counter;

    function increment() public {
        unchecked {
            counter++;
        }
    }
}`,
    hints: ["Write it as: unchecked { counter++; }", "The unchecked block must be wrapped with curly braces."],
    testDescription: "Checks that counter increments by 1 after calling increment().",
    expectedFunctions: ["counter", "increment"],
    testCases: [
      { fn: "counter", expected: "0", message: "Initial counter() should be 0" },
      { fn: "counter", expected: "1", message: "After increment(), counter() should be 1", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "bool-type",
    title: "bool Type",
    category: "basic-types",
    order: 1,
    difficulty: "beginner",
    description: `# bool Type

\`bool\` stores \`true\` or \`false\` values. It's used for conditionals, flags, and more.

\`\`\`solidity
bool public isOpen = true;
bool public isClosed = false;
isOpen = !isOpen; // true → false
\`\`\`

## Task
Declare \`isActive\` as \`true\`, \`isPaused\` as \`false\`, and write a \`toggle()\` function that flips \`isActive\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    // TODO: Declare bool public isActive with value true
    // TODO: Declare bool public isPaused with value false

    function toggle() public {
        // TODO: Flip isActive (use the ! operator)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    bool public isActive = true;
    bool public isPaused = false;

    function toggle() public {
        isActive = !isActive;
    }
}`,
    hints: ["bool variables are initialized with true or false", "The ! operator flips a bool value: !true → false"],
    testDescription: "Tests that isActive is true, isPaused is false, and toggle() flips isActive.",
    expectedFunctions: ["isActive", "isPaused", "toggle"],
    testCases: [
      { fn: "isActive", expected: "true", message: "Initial isActive() should be true" },
      { fn: "isPaused", expected: "false", message: "Initial isPaused() should be false" },
      { fn: "isActive", expected: "false", message: "After toggle(), isActive() should be false", setup: [{ fn: "toggle" }] },
    ],
  },
  {
    id: "address-type",
    title: "address Type",
    category: "basic-types",
    order: 2,
    difficulty: "beginner",
    description: `# address Type

\`address\` stores a 20-byte Ethereum address. \`msg.sender\` is the address that called the function.

\`\`\`solidity
address public owner;
constructor() {
    owner = msg.sender;
}
\`\`\`

## Task
Set \`owner\` to \`msg.sender\` in the constructor, and write a \`getOwner()\` view function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    address public owner;

    constructor() {
        // TODO: Set owner to msg.sender
    }

    // TODO: Write a getOwner() public view function (returns owner)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}`,
    hints: ["In the constructor: owner = msg.sender; stores the deployer's address", "A view function reads state but does not modify it"],
    testDescription: "Tests that owner is set to the deployer's address and getOwner() returns the same.",
    expectedFunctions: ["owner", "getOwner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
      { fn: "getOwner", expected: "DEPLOYER", message: "getOwner() should return the deployer's address" },
    ],
  },
  {
    id: "address-payable",
    title: "address payable",
    category: "basic-types",
    order: 3,
    difficulty: "beginner",
    description: `# address payable

\`address payable\` is an address that can receive ETH. It supports \`.transfer()\` and \`.send()\`.

\`\`\`solidity
address payable public wallet = payable(msg.sender);
uint256 bal = address(this).balance;
\`\`\`

## Task
Set \`recipient\` to \`payable(msg.sender)\` in the constructor, and write a \`getBalance()\` function that returns the contract's balance.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayable {
    address payable public recipient;

    constructor() {
        // TODO: Set recipient to payable(msg.sender)
    }

    // TODO: Write a getBalance() public view function (returns address(this).balance)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayable {
    address payable public recipient;

    constructor() {
        recipient = payable(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}`,
    hints: ["payable() converts a regular address to address payable", "address(this).balance is the contract's current ETH balance"],
    testDescription: "Tests that recipient is set to the deployer's payable address and getBalance() returns the contract balance.",
    expectedFunctions: ["recipient", "getBalance"],
    testCases: [
      { fn: "recipient", expected: "DEPLOYER", message: "recipient() should return the deployer's address" },
      { fn: "getBalance", expected: "0", message: "Initial getBalance() should be 0" },
    ],
  },
  {
    id: "bytes1-type",
    title: "bytes1 Fixed Bytes",
    category: "basic-types",
    order: 4,
    difficulty: "beginner",
    description: `# bytes1 Fixed Bytes

\`bytes1\` stores exactly 1 byte (0x00~0xff). There are also \`bytes2\`, \`bytes3\` ... up to \`bytes32\`.

\`\`\`solidity
bytes1 public a = 0x41; // ASCII 'A'
bytes2 public b = 0xffff;
\`\`\`

## Task
Declare \`initial\` as \`0x41\` and \`flag\` as \`0xffff\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes1Type {
    // TODO: Declare bytes1 public initial with value 0x41
    // TODO: Declare bytes2 public flag with value 0xffff
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes1Type {
    bytes1 public initial = 0x41;
    bytes2 public flag = 0xffff;
}`,
    hints: ["bytes1 stores 1 byte, bytes2 stores 2 bytes", "0x41 corresponds to ASCII character 'A'"],
    testDescription: "Tests that initial is 0x41 and flag is 0xffff.",
    expectedFunctions: ["initial", "flag"],
    testCases: [
      { fn: "initial", expected: "0x41", message: "initial() should return 0x41" },
      { fn: "flag", expected: "0xffff", message: "flag() should return 0xffff" },
    ],
  },
  {
    id: "bytes32-type",
    title: "bytes32 Fixed Bytes",
    category: "basic-types",
    order: 5,
    difficulty: "beginner",
    description: `# bytes32 Fixed Bytes

\`bytes32\` is commonly used for storing hashes and identifiers. It stores 32 bytes (256 bits).

\`\`\`solidity
bytes32 public myHash;
myHash = keccak256("hello");
\`\`\`

## Task
Declare \`bytes32 public hash\` and write a \`setHash(bytes32 _hash)\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes32Type {
    // TODO: Declare bytes32 public hash

    // TODO: Write a setHash(bytes32 _hash) public function
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes32Type {
    bytes32 public hash;

    function setHash(bytes32 _hash) public {
        hash = _hash;
    }
}`,
    hints: ["bytes32 declared without an initial value defaults to 0x0...0", "The function receives bytes32 _hash as a parameter and stores it in the state variable"],
    testDescription: "Tests that hash is declared and setHash() can set its value.",
    expectedFunctions: ["hash", "setHash"],
    testCases: [
      { fn: "hash", expected: "0x0000000000000000000000000000000000000000000000000000000000000000", message: "Initial hash() should be 0x0...0" },
      { fn: "hash", expected: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", message: "After setHash(), hash() should return the set value", setup: [{ fn: "setHash", args: ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"] }] },
    ],
  },
  {
    id: "bytes-dynamic",
    title: "bytes Dynamic Bytes",
    category: "basic-types",
    order: 6,
    difficulty: "beginner",
    description: `# bytes Dynamic Bytes

\`bytes\` is a dynamic-length byte array. It is more gas-efficient than \`byte[]\`.

\`\`\`solidity
bytes public data;
data = hex"cafebabe";
uint256 len = data.length;
\`\`\`

## Task
Write the \`data\` variable, a \`setData()\` function, and a \`getLength()\` function that returns \`data.length\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BytesDynamic {
    // TODO: Declare bytes public data

    // TODO: Write a setData(bytes calldata _data) public function

    // TODO: Write a getLength() public view function (returns data.length)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BytesDynamic {
    bytes public data;

    function setData(bytes calldata _data) public {
        data = _data;
    }

    function getLength() public view returns (uint256) {
        return data.length;
    }
}`,
    hints: ["calldata is a read-only data location for external function parameters", "data.length gives the length of the byte array"],
    testDescription: "Tests that getLength() returns the correct length after setting data.",
    expectedFunctions: ["data", "setData", "getLength"],
    testCases: [
      { fn: "getLength", expected: "0", message: "Initial getLength() should be 0" },
      { fn: "getLength", expected: "4", message: "After setData(), getLength() should return the correct length", setup: [{ fn: "setData", args: ["0xcafebabe"] }] },
    ],
  },
  {
    id: "string-type",
    title: "string Type",
    category: "basic-types",
    order: 7,
    difficulty: "beginner",
    description: `# string Type

\`string\` is UTF-8 encoded text. Unlike other languages, you cannot directly use indexing or \`.length\`.

\`\`\`solidity
string public name = "Solidity";
name = "New Value";
\`\`\`

## Task
Initialize \`message\` to \`"Hello"\` and write a \`setMessage()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringType {
    // TODO: Declare string public message with value "Hello"

    // TODO: Write a setMessage(string calldata _msg) public function
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringType {
    string public message = "Hello";

    function setMessage(string calldata _msg) public {
        message = _msg;
    }
}`,
    hints: ["Strings are initialized with double quotes", "calldata is a read-only reference to externally passed data"],
    testDescription: "Tests that message is initialized to 'Hello' and can be changed via setMessage().",
    expectedFunctions: ["message", "setMessage"],
    testCases: [
      { fn: "message", expected: "Hello", message: "Initial message() should be 'Hello'" },
      { fn: "message", expected: "World", message: "After setMessage('World'), message() should be 'World'", setup: [{ fn: "setMessage", args: ["World"] }] },
    ],
  },
  {
    id: "enum-type",
    title: "Enum",
    category: "basic-types",
    order: 8,
    difficulty: "beginner",
    description: `# Enum

\`enum\` is a custom type with a fixed set of choices. Internally it's stored as a \`uint\`.

\`\`\`solidity
enum Color { Red, Green, Blue }
Color public selected = Color.Red;
selected = Color.Blue;
\`\`\`

## Task
Fill in the enum values, and write the bodies of \`ship()\` and \`deliver()\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    // TODO: Fill in the values: None, Pending, Shipped, Delivered, Cancelled
    enum OrderStatus { }

    OrderStatus public status;

    function ship() public {
        // TODO: Set status to OrderStatus.Shipped
    }

    function deliver() public {
        // TODO: Set status to OrderStatus.Delivered
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    enum OrderStatus { None, Pending, Shipped, Delivered, Cancelled }

    OrderStatus public status;

    function ship() public {
        status = OrderStatus.Shipped;
    }

    function deliver() public {
        status = OrderStatus.Delivered;
    }
}`,
    hints: ["Enum values are listed separated by commas", "Reference an enum value as: EnumName.Value"],
    testDescription: "Tests that the enum is correctly defined and ship()/deliver() change the status.",
    expectedFunctions: ["status", "ship", "deliver"],
    testCases: [
      { fn: "status", expected: "0", message: "Initial status() should be 0 (None)" },
      { fn: "status", expected: "2", message: "After ship(), status() should be 2 (Shipped)", setup: [{ fn: "ship" }] },
      { fn: "status", expected: "3", message: "After deliver(), status() should be 3 (Delivered)", setup: [{ fn: "deliver" }] },
    ],
  },
  {
    id: "addition-op",
    title: "Addition (+)",
    category: "arithmetic",
    order: 1,
    difficulty: "beginner",
    description: `# Addition (+)

The \`+\` operator adds two numbers. In Solidity 0.8+, overflow automatically reverts the transaction.

\`\`\`solidity
uint256 result = 10 + 20; // 30
\`\`\`

## Task
Return the sum of two numbers in the \`add()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Addition {
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a + b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Addition {
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}`,
    hints: ["Use the return keyword to return a value", "a + b computes the sum of two uint256 values"],
    testDescription: "Tests that add(2, 3) returns 5.",
    expectedFunctions: ["add"],
    testCases: [
      { fn: "add", args: ["2", "3"], expected: "5", message: "add(2, 3) should return 5" },
      { fn: "add", args: ["0", "0"], expected: "0", message: "add(0, 0) should return 0" },
    ],
  },
  {
    id: "subtraction-op",
    title: "Subtraction (-)",
    category: "arithmetic",
    order: 2,
    difficulty: "beginner",
    description: `# Subtraction (-)

The \`-\` operator subtracts. In 0.8+, uint underflow (e.g., 3 - 5) automatically reverts.

\`\`\`solidity
uint256 result = 10 - 3; // 7
// uint256 fail = 3 - 5; // revert!
\`\`\`

## Task
Return \`a - b\` in the \`subtract()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Subtraction {
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a - b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Subtraction {
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        return a - b;
    }
}`,
    hints: ["If a is less than b in a - b, the transaction reverts", "uint256 cannot represent negative numbers, so be careful with subtraction order"],
    testDescription: "Tests that subtract(10, 3) returns 7.",
    expectedFunctions: ["subtract"],
    testCases: [
      { fn: "subtract", args: ["10", "3"], expected: "7", message: "subtract(10, 3) should return 7" },
      { fn: "subtract", args: ["100", "100"], expected: "0", message: "subtract(100, 100) should return 0" },
    ],
  },
  {
    id: "multiplication-op",
    title: "Multiplication (*)",
    category: "arithmetic",
    order: 3,
    difficulty: "beginner",
    description: `# Multiplication (*)

The \`*\` operator multiplies. Watch out for overflow when multiplying large numbers.

\`\`\`solidity
uint256 result = 7 * 8; // 56
\`\`\`

## Task
Return \`a * b\` in the \`multiply()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Multiplication {
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a * b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Multiplication {
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        return a * b;
    }
}`,
    hints: ["return a * b; returns the multiplication result", "Exceeding uint256 max causes an overflow revert"],
    testDescription: "Tests that multiply(7, 8) returns 56.",
    expectedFunctions: ["multiply"],
    testCases: [
      { fn: "multiply", args: ["7", "8"], expected: "56", message: "multiply(7, 8) should return 56" },
      { fn: "multiply", args: ["0", "999"], expected: "0", message: "multiply(0, 999) should return 0" },
    ],
  },
  {
    id: "division-op",
    title: "Division (/)",
    category: "arithmetic",
    order: 4,
    difficulty: "beginner",
    description: `# Division (/)

The \`/\` operator divides. Division by zero reverts. The result is truncated (no rounding).

\`\`\`solidity
uint256 result = 10 / 3; // 3 (not 3.33)
\`\`\`

## Task
Return \`a / b\` in the \`divide()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Division {
    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a / b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Division {
    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        return a / b;
    }
}`,
    hints: ["Division result is truncated (no decimals)", "If b is 0, it automatically reverts"],
    testDescription: "Tests that divide(10, 3) returns 3.",
    expectedFunctions: ["divide"],
    testCases: [
      { fn: "divide", args: ["10", "3"], expected: "3", message: "divide(10, 3) should return 3 (truncated)" },
      { fn: "divide", args: ["100", "10"], expected: "10", message: "divide(100, 10) should return 10" },
    ],
  },
  {
    id: "modulo-op",
    title: "Modulo (%)",
    category: "arithmetic",
    order: 5,
    difficulty: "beginner",
    description: `# Modulo (%)

The \`%\` operator returns the remainder. Useful for even/odd checks: \`x % 2 == 0\` means even.

\`\`\`solidity
uint256 r = 10 % 3; // 1
bool even = (4 % 2 == 0); // true
\`\`\`

## Task
Write a \`mod()\` function and an \`isEven()\` function that checks if a number is even.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Modulo {
    function mod(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a % b
    }

    function isEven(uint256 x) public pure returns (bool) {
        // TODO: Return whether x is even (x % 2 == 0)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Modulo {
    function mod(uint256 a, uint256 b) public pure returns (uint256) {
        return a % b;
    }

    function isEven(uint256 x) public pure returns (bool) {
        return x % 2 == 0;
    }
}`,
    hints: ["The % operator returns the remainder of division", "An even number has a remainder of 0 when divided by 2"],
    testDescription: "Tests that mod(10, 3) returns 1 and isEven(4) returns true.",
    expectedFunctions: ["mod", "isEven"],
    testCases: [
      { fn: "mod", args: ["10", "3"], expected: "1", message: "mod(10, 3) should return 1" },
      { fn: "isEven", args: ["4"], expected: "true", message: "isEven(4) should return true" },
      { fn: "isEven", args: ["7"], expected: "false", message: "isEven(7) should return false" },
    ],
  },
  {
    id: "exponent-op",
    title: "Exponentiation (**)",
    category: "arithmetic",
    order: 6,
    difficulty: "beginner",
    description: `# Exponentiation (**)

The \`**\` operator computes powers. \`10 ** 18\` is commonly used for token units.

\`\`\`solidity
uint256 result = 2 ** 10; // 1024
uint256 unit = 10 ** 18;  // 1 ether
\`\`\`

## Task
Write a \`power()\` function and a \`tokenUnit()\` function that returns \`10 ** 18\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Exponent {
    function power(uint256 base, uint256 exp) public pure returns (uint256) {
        // TODO: Return base ** exp
    }

    function tokenUnit() public pure returns (uint256) {
        // TODO: Return 10 ** 18
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Exponent {
    function power(uint256 base, uint256 exp) public pure returns (uint256) {
        return base ** exp;
    }

    function tokenUnit() public pure returns (uint256) {
        return 10 ** 18;
    }
}`,
    hints: ["The ** operator raises the left value to the power of the right value", "10 ** 18 is the standard unit for ERC-20 tokens (1 token)"],
    testDescription: "Tests that power(2, 10) returns 1024 and tokenUnit() returns 10^18.",
    expectedFunctions: ["power", "tokenUnit"],
    testCases: [
      { fn: "power", args: ["2", "10"], expected: "1024", message: "power(2, 10) should return 1024" },
      { fn: "power", args: ["3", "3"], expected: "27", message: "power(3, 3) should return 27" },
      { fn: "tokenUnit", expected: "1000000000000000000", message: "tokenUnit() should return 10^18" },
    ],
  },
  {
    id: "compound-assign",
    title: "Compound Assignment Operators",
    category: "arithmetic",
    order: 7,
    difficulty: "beginner",
    description: `# Compound Assignment Operators

\`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\` are shorthand operators that combine an operation with assignment.

\`\`\`solidity
uint256 x = 10;
x += 5;  // x = x + 5 → 15
x -= 3;  // x = x - 3 → 12
x *= 2;  // x = x * 2 → 24
\`\`\`

## Task
Use compound assignment operators to modify \`value\` in each function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CompoundAssign {
    uint256 public value = 100;

    function addTo(uint256 x) public {
        // TODO: Add x to value (+=)
    }

    function subFrom(uint256 x) public {
        // TODO: Subtract x from value (-=)
    }

    function mulBy(uint256 x) public {
        // TODO: Multiply value by x (*=)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CompoundAssign {
    uint256 public value = 100;

    function addTo(uint256 x) public {
        value += x;
    }

    function subFrom(uint256 x) public {
        value -= x;
    }

    function mulBy(uint256 x) public {
        value *= x;
    }
}`,
    hints: ["value += x; is the same as value = value + x;", "-= and *= follow the same pattern: value -= x; value *= x;"],
    testDescription: "Tests that addTo, subFrom, and mulBy correctly modify value using compound assignment.",
    expectedFunctions: ["value", "addTo", "subFrom", "mulBy"],
    testCases: [
      { fn: "value", expected: "100", message: "Initial value() should be 100" },
      { fn: "value", expected: "150", message: "After addTo(50), value() should be 150", setup: [{ fn: "addTo", args: ["50"] }] },
      { fn: "value", expected: "80", message: "After subFrom(20), value() should be 80", setup: [{ fn: "subFrom", args: ["20"] }] },
      { fn: "value", expected: "300", message: "After mulBy(3), value() should be 300", setup: [{ fn: "mulBy", args: ["3"] }] },
    ],
  },
  {
    id: "integer-division",
    title: "Integer Division Pitfalls",
    category: "arithmetic",
    order: 8,
    difficulty: "beginner",
    description: `# Integer Division Pitfalls

Solidity has no decimals. \`5/2 = 2\`, and operation order affects precision.

\`\`\`solidity
(a / b) * c  // more precision loss
(a * c) / b  // multiply first for better precision
\`\`\`

## Task
Implement \`divideAndLose()\` with truncating division, and \`betterPrecision()\` with multiply-first approach.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerDivision {
    function divideAndLose(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a / b (precision loss occurs)
    }

    function betterPrecision(uint256 a, uint256 b, uint256 c) public pure returns (uint256) {
        // TODO: Return (a * c) / b (multiply first for better precision)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerDivision {
    function divideAndLose(uint256 a, uint256 b) public pure returns (uint256) {
        return a / b;
    }

    function betterPrecision(uint256 a, uint256 b, uint256 c) public pure returns (uint256) {
        return (a * c) / b;
    }
}`,
    hints: ["Integer division truncates decimals: 5 / 2 = 2", "Multiplying first produces a larger intermediate value, reducing precision loss"],
    testDescription: "Tests that divideAndLose(5, 2) returns 2 and betterPrecision(5, 2, 100) returns 250.",
    expectedFunctions: ["divideAndLose", "betterPrecision"],
    testCases: [
      { fn: "divideAndLose", args: ["5", "2"], expected: "2", message: "divideAndLose(5, 2) should return 2" },
      { fn: "betterPrecision", args: ["5", "2", "100"], expected: "250", message: "betterPrecision(5, 2, 100) should return 250" },
    ],
  },
  {
    id: "comparison-ops",
    title: "Comparison Operators",
    category: "comparison",
    order: 1,
    difficulty: "beginner",
    description: `# Comparison Operators

Solidity uses \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\` to compare values. The result is always a \`bool\`.

\`\`\`solidity
uint a = 10;
bool result = (a == 10); // true
bool bigger = (a > 5);   // true
\`\`\`

## Task
Complete the three functions using comparison operators.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ComparisonOps {
    function isEqual(uint a, uint b) public pure returns (bool) {
        // TODO: Return true if a equals b
    }

    function isGreater(uint a, uint b) public pure returns (bool) {
        // TODO: Return true if a is greater than b
    }

    function isLessOrEqual(uint a, uint b) public pure returns (bool) {
        // TODO: Return true if a is less than or equal to b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ComparisonOps {
    function isEqual(uint a, uint b) public pure returns (bool) {
        return a == b;
    }

    function isGreater(uint a, uint b) public pure returns (bool) {
        return a > b;
    }

    function isLessOrEqual(uint a, uint b) public pure returns (bool) {
        return a <= b;
    }
}`,
    hints: ["Comparison operators compare two values and return a bool.", "== means equal, > means greater than, <= means less than or equal."],
    testDescription: "Checks that isEqual, isGreater, and isLessOrEqual return the correct bool values.",
    expectedFunctions: ["isEqual", "isGreater", "isLessOrEqual"],
    testCases: [
      { fn: "isEqual", args: ["10", "10"], expected: "true", message: "isEqual(10, 10) should return true" },
      { fn: "isEqual", args: ["10", "20"], expected: "false", message: "isEqual(10, 20) should return false" },
      { fn: "isGreater", args: ["10", "5"], expected: "true", message: "isGreater(10, 5) should return true" },
      { fn: "isGreater", args: ["5", "10"], expected: "false", message: "isGreater(5, 10) should return false" },
      { fn: "isLessOrEqual", args: ["5", "10"], expected: "true", message: "isLessOrEqual(5, 10) should return true" },
      { fn: "isLessOrEqual", args: ["10", "10"], expected: "true", message: "isLessOrEqual(10, 10) should return true" },
    ],
  },
  {
    id: "logical-ops",
    title: "Logical Operators",
    category: "comparison",
    order: 2,
    difficulty: "beginner",
    description: `# Logical Operators

\`&&\`(AND), \`||\`(OR), \`!\`(NOT) combine bool values.

\`\`\`solidity
bool result = true && false; // false
bool either = true || false; // true
bool negated = !true;        // false
\`\`\`

## Task
Complete the three functions using logical operators.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogicalOps {
    function bothTrue(bool a, bool b) public pure returns (bool) {
        // TODO: Return true if both a and b are true
    }

    function eitherTrue(bool a, bool b) public pure returns (bool) {
        // TODO: Return true if either a or b is true
    }

    function notValue(bool a) public pure returns (bool) {
        // TODO: Return the opposite of a
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogicalOps {
    function bothTrue(bool a, bool b) public pure returns (bool) {
        return a && b;
    }

    function eitherTrue(bool a, bool b) public pure returns (bool) {
        return a || b;
    }

    function notValue(bool a) public pure returns (bool) {
        return !a;
    }
}`,
    hints: ["&& is true only when both are true.", "|| is true if at least one is true, ! flips the value."],
    testDescription: "Checks that bothTrue, eitherTrue, and notValue return correct logical results.",
    expectedFunctions: ["bothTrue", "eitherTrue", "notValue"],
    testCases: [
      { fn: "bothTrue", args: ["true", "true"], expected: "true", message: "bothTrue(true, true) should return true" },
      { fn: "bothTrue", args: ["true", "false"], expected: "false", message: "bothTrue(true, false) should return false" },
      { fn: "eitherTrue", args: ["false", "true"], expected: "true", message: "eitherTrue(false, true) should return true" },
      { fn: "eitherTrue", args: ["false", "false"], expected: "false", message: "eitherTrue(false, false) should return false" },
      { fn: "notValue", args: ["true"], expected: "false", message: "notValue(true) should return false" },
    ],
  },
  {
    id: "ternary-op",
    title: "Ternary Operator",
    category: "comparison",
    order: 3,
    difficulty: "beginner",
    description: `# Ternary Operator

\`condition ? valueIfTrue : valueIfFalse\` lets you write simple conditionals in one line.

\`\`\`solidity
uint result = (a > b) ? a : b; // if a is bigger, a; otherwise b
\`\`\`

## Task
Use the ternary operator to complete the max and min functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TernaryOp {
    function max(uint a, uint b) public pure returns (uint) {
        // TODO: Use the ternary operator to return the larger of a and b
    }

    function min(uint a, uint b) public pure returns (uint) {
        // TODO: Use the ternary operator to return the smaller of a and b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TernaryOp {
    function max(uint a, uint b) public pure returns (uint) {
        return a >= b ? a : b;
    }

    function min(uint a, uint b) public pure returns (uint) {
        return a <= b ? a : b;
    }
}`,
    hints: ["Ternary: condition ? ifTrue : ifFalse", "max returns a if a >= b, min returns a if a <= b."],
    testDescription: "Checks that max and min return the correct value from two numbers.",
    expectedFunctions: ["max", "min"],
    testCases: [
      { fn: "max", args: ["10", "20"], expected: "20", message: "max(10, 20) should return 20" },
      { fn: "max", args: ["30", "5"], expected: "30", message: "max(30, 5) should return 30" },
      { fn: "min", args: ["10", "20"], expected: "10", message: "min(10, 20) should return 10" },
      { fn: "min", args: ["5", "5"], expected: "5", message: "min(5, 5) should return 5" },
    ],
  },
  {
    id: "bitwise-ops",
    title: "Bitwise Operators",
    category: "comparison",
    order: 4,
    difficulty: "beginner",
    description: `# Bitwise Operators

Solidity supports bitwise operations: \`&\`(AND), \`|\`(OR), \`^\`(XOR), \`~\`(NOT), \`<<\`(left shift), \`>>\`(right shift).

\`\`\`solidity
uint8 a = 5;      // 00000101
uint8 b = 3;      // 00000011
uint8 c = a & b;  // 00000001 = 1
uint8 d = a << 1; // 00001010 = 10
\`\`\`

## Task
Complete the two functions using bitwise operators.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BitwiseOps {
    function bitwiseAnd(uint8 a, uint8 b) public pure returns (uint8) {
        // TODO: Return the bitwise AND of a and b
    }

    function leftShift(uint8 a, uint8 bits) public pure returns (uint8) {
        // TODO: Return a shifted left by bits positions
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BitwiseOps {
    function bitwiseAnd(uint8 a, uint8 b) public pure returns (uint8) {
        return a & b;
    }

    function leftShift(uint8 a, uint8 bits) public pure returns (uint8) {
        return a << bits;
    }
}`,
    hints: ["& returns 1 only when both bits are 1.", "<< shifts bits to the left, filling empty positions with 0."],
    testDescription: "Checks that bitwiseAnd and leftShift return correct bitwise results.",
    expectedFunctions: ["bitwiseAnd", "leftShift"],
    testCases: [
      { fn: "bitwiseAnd", args: ["5", "3"], expected: "1", message: "bitwiseAnd(5, 3) should return 1" },
      { fn: "leftShift", args: ["5", "1"], expected: "10", message: "leftShift(5, 1) should return 10" },
      { fn: "leftShift", args: ["1", "3"], expected: "8", message: "leftShift(1, 3) should return 8" },
    ],
  },
  {
    id: "if-else-basics",
    title: "Conditionals (if/else)",
    category: "comparison",
    order: 5,
    difficulty: "beginner",
    description: `# Conditionals (if/else)

\`if\`, \`else if\`, \`else\` execute different code based on conditions.

\`\`\`solidity
if (x > 10) {
    return "big";
} else if (x > 5) {
    return "medium";
} else {
    return "small";
}
\`\`\`

## Task
Complete the grade function that returns a grade based on score: >= 90 "A", >= 80 "B", >= 70 "C", else "F".`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IfElseBasics {
    function grade(uint score) public pure returns (string memory) {
        // TODO: Use if/else if/else to return the grade
        // score >= 90 → "A", >= 80 → "B", >= 70 → "C", else → "F"
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IfElseBasics {
    function grade(uint score) public pure returns (string memory) {
        if (score >= 90) {
            return "A";
        } else if (score >= 80) {
            return "B";
        } else if (score >= 70) {
            return "C";
        } else {
            return "F";
        }
    }
}`,
    hints: ["Check the highest score condition first.", "Return a string in each branch."],
    testDescription: "Checks that the grade function returns the correct grade string for each score.",
    expectedFunctions: ["grade"],
    testCases: [
      { fn: "grade", args: ["95"], expected: "A", message: "grade(95) should return 'A'" },
      { fn: "grade", args: ["85"], expected: "B", message: "grade(85) should return 'B'" },
      { fn: "grade", args: ["75"], expected: "C", message: "grade(75) should return 'C'" },
      { fn: "grade", args: ["50"], expected: "F", message: "grade(50) should return 'F'" },
    ],
  },
  {
    id: "local-variables",
    title: "Local Variables",
    category: "variables",
    order: 1,
    difficulty: "beginner",
    description: `# Local Variables

Local variables only exist inside a function and are not stored on the blockchain. They disappear when the function finishes.

\`\`\`solidity
function example() public pure returns (uint) {
    uint temp = 10;    // local variable
    uint result = temp * 2;
    return result;
}
\`\`\`

## Task
Complete the calculate function using local variables. Return the sum plus the product.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function calculate(uint a, uint b) public pure returns (uint) {
        // TODO: Declare local variables sum (a+b) and product (a*b)
        // and return sum + product
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function calculate(uint a, uint b) public pure returns (uint) {
        uint sum = a + b;
        uint product = a * b;
        return sum + product;
    }
}`,
    hints: ["You can declare local variables using the uint keyword.", "Declare and assign at the same time: uint sum = a + b;"],
    testDescription: "Checks that the calculate function correctly returns the sum of two numbers' addition and multiplication.",
    expectedFunctions: ["calculate"],
    testCases: [
      { fn: "calculate", args: ["3", "4"], expected: "19", message: "calculate(3, 4) should return 19 (3+4 + 3*4 = 19)" },
      { fn: "calculate", args: ["5", "2"], expected: "17", message: "calculate(5, 2) should return 17 (5+2 + 5*2 = 17)" },
    ],
  },
  {
    id: "global-variables",
    title: "Global Variables",
    category: "variables",
    order: 2,
    difficulty: "beginner",
    description: `# Global Variables

Solidity has global variables accessible from anywhere:
- \`msg.sender\`: the address that called the function
- \`block.timestamp\`: the current block's timestamp
- \`block.number\`: the current block number

\`\`\`solidity
address caller = msg.sender;
uint time = block.timestamp;
\`\`\`

## Task
Complete the three functions that return each global variable.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GlobalVariables {
    function getSender() public view returns (address) {
        // TODO: Return the caller's address
    }

    function getTimestamp() public view returns (uint) {
        // TODO: Return the current block's timestamp
    }

    function getBlockNumber() public view returns (uint) {
        // TODO: Return the current block number
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GlobalVariables {
    function getSender() public view returns (address) {
        return msg.sender;
    }

    function getTimestamp() public view returns (uint) {
        return block.timestamp;
    }

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }
}`,
    hints: ["msg.sender is the wallet address that called the current function.", "block.timestamp and block.number contain current block information."],
    testDescription: "Checks that getSender, getTimestamp, and getBlockNumber return the correct global variable values.",
    expectedFunctions: ["getSender", "getTimestamp", "getBlockNumber"],
    testCases: [
      { fn: "getSender", expected: "DEPLOYER", message: "getSender() should return the caller's address" },
      { fn: "getTimestamp", message: "getTimestamp() should return successfully" },
      { fn: "getBlockNumber", message: "getBlockNumber() should return successfully" },
    ],
  },
  {
    id: "msg-value-payable",
    title: "msg.value and payable",
    category: "variables",
    order: 3,
    difficulty: "beginner",
    description: `# msg.value and payable

A \`payable\` function can receive ETH. \`msg.value\` is the amount of ETH sent (in wei).

\`\`\`solidity
function deposit() public payable {
    totalDeposited += msg.value;
}
uint bal = address(this).balance; // contract balance
\`\`\`

## Task
Complete the deposit and getBalance functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MsgValuePayable {
    uint public totalDeposited;

    function deposit() public payable {
        // TODO: Add msg.value to totalDeposited
    }

    function getBalance() public view returns (uint) {
        // TODO: Return this contract's ETH balance
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MsgValuePayable {
    uint public totalDeposited;

    function deposit() public payable {
        totalDeposited += msg.value;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    hints: ["msg.value is the amount of ETH (in wei) sent with the function call.", "Use address(this).balance to check the contract's current ETH balance."],
    testDescription: "Checks that totalDeposited increases on deposit and getBalance returns the contract balance.",
    expectedFunctions: ["totalDeposited", "deposit", "getBalance"],
    testCases: [
      { fn: "totalDeposited", expected: "0", message: "Initial totalDeposited() should be 0" },
      { fn: "totalDeposited", expected: "1000", message: "totalDeposited() should be 1000 after deposit(1000 wei)", setup: [{ fn: "deposit", value: "1000" }] },
      { fn: "getBalance", expected: "500", message: "getBalance() should be 500 after deposit(500 wei)", setup: [{ fn: "deposit", value: "500" }] },
    ],
  },
  {
    id: "visibility-basics",
    title: "Visibility",
    category: "variables",
    order: 4,
    difficulty: "beginner",
    description: `# Visibility

Specify access levels for functions and variables:
- \`public\`: accessible by anyone
- \`private\`: only the current contract
- \`internal\`: current + inherited contracts
- \`external\`: callable only from outside

\`\`\`solidity
uint private secret = 42;
function getSecret() public view returns (uint) { return secret; }
\`\`\`

## Task
Fill in the correct visibility keywords to complete the code.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    // TODO: Add the private keyword to prevent direct external access
    uint secretNumber = 42;

    // TODO: Add the public keyword so anyone can call this
    function getSecret() view returns (uint) {
        return secretNumber;
    }

    // TODO: Add the internal keyword so only inherited contracts can access this
    function _helper() pure returns (uint) {
        return 1;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    uint private secretNumber = 42;

    function getSecret() public view returns (uint) {
        return secretNumber;
    }

    function _helper() internal pure returns (uint) {
        return 1;
    }
}`,
    hints: ["Private variables cannot be read directly from outside.", "Public functions can be called by anyone, and internal functions can only be called within the contract and its child contracts."],
    testDescription: "Checks that getSecret correctly returns secretNumber.",
    expectedFunctions: ["getSecret"],
    testCases: [
      { fn: "getSecret", expected: "42", message: "getSecret() should return 42" },
    ],
  },
  {
    id: "view-pure",
    title: "view and pure",
    category: "variables",
    order: 5,
    difficulty: "beginner",
    description: `# view and pure

- \`view\`: reads state but does not modify it
- \`pure\`: neither reads nor modifies state
- Neither: can modify state

\`\`\`solidity
uint public counter;
function getCounter() public view returns (uint) { return counter; }
function add(uint a, uint b) public pure returns (uint) { return a + b; }
function increment() public { counter++; }
\`\`\`

## Task
Complete the body of each of the three functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewPure {
    uint public counter;

    function getCounter() public view returns (uint) {
        // TODO: Return the counter value
    }

    function add(uint a, uint b) public pure returns (uint) {
        // TODO: Return a + b
    }

    function increment() public {
        // TODO: Increment counter by 1
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewPure {
    uint public counter;

    function getCounter() public view returns (uint) {
        return counter;
    }

    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function increment() public {
        counter++;
    }
}`,
    hints: ["A view function can read state variables but cannot modify them.", "A pure function neither reads nor modifies state variables. You can increment a value with counter++."],
    testDescription: "Checks that getCounter reads state, add does a pure calculation, and increment modifies state.",
    expectedFunctions: ["counter", "getCounter", "add", "increment"],
    testCases: [
      { fn: "getCounter", expected: "0", message: "Initial getCounter() should be 0" },
      { fn: "add", args: ["3", "7"], expected: "10", message: "add(3, 7) should return 10" },
      { fn: "getCounter", expected: "1", message: "getCounter() should be 1 after increment()", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "type-conversion",
    title: "Type Conversion",
    category: "variables",
    order: 6,
    difficulty: "beginner",
    description: `# Type Conversion

Solidity requires explicit type conversions.

\`\`\`solidity
uint256 big = 100;
uint8 small = uint8(big);        // explicit conversion
uint256 back = uint256(small);   // convert back
address payable p = payable(addr); // convert to payable
\`\`\`

## Task
Complete the three type conversion functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeConversion {
    function toUint8(uint256 x) public pure returns (uint8) {
        // TODO: Convert x to uint8 and return it
    }

    function toUint256(uint8 x) public pure returns (uint256) {
        // TODO: Convert x to uint256 and return it
    }

    function toPayable(address addr) public pure returns (address payable) {
        // TODO: Convert addr to address payable and return it
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeConversion {
    function toUint8(uint256 x) public pure returns (uint8) {
        return uint8(x);
    }

    function toUint256(uint8 x) public pure returns (uint256) {
        return uint256(x);
    }

    function toPayable(address addr) public pure returns (address payable) {
        return payable(addr);
    }
}`,
    hints: ["Use uint8(x) for explicit type conversion.", "Use payable(addr) to convert address to address payable."],
    testDescription: "Checks that toUint8, toUint256, and toPayable correctly convert types.",
    expectedFunctions: ["toUint8", "toUint256", "toPayable"],
    testCases: [
      { fn: "toUint8", args: ["200"], expected: "200", message: "toUint8(200) should return 200" },
      { fn: "toUint256", args: ["100"], expected: "100", message: "toUint256(100) should return 100" },
      { fn: "toPayable", args: ["0x1000000000000000000000000000000000000001"], message: "toPayable() should return successfully" },
    ],
  },
  {
    id: "delete-keyword",
    title: "delete Keyword",
    category: "variables",
    order: 7,
    difficulty: "beginner",
    description: `# delete Keyword

\`delete\` resets a variable to its default value. uint becomes 0, bool becomes false, address becomes address(0).

\`\`\`solidity
uint public value = 100;
function reset() public {
    delete value; // value = 0
}
\`\`\`

## Task
Use delete in the reset function to reset value and flag to their defaults.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeleteKeyword {
    uint public value = 100;
    bool public flag = true;

    function reset() public {
        // TODO: Use delete to reset value and flag to their default values
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeleteKeyword {
    uint public value = 100;
    bool public flag = true;

    function reset() public {
        delete value;
        delete flag;
    }
}`,
    hints: ["Use delete value; to reset a variable to its default.", "After delete, uint becomes 0 and bool becomes false."],
    testDescription: "Checks that value is 0 and flag is false after calling reset.",
    expectedFunctions: ["value", "flag", "reset"],
    testCases: [
      { fn: "value", expected: "100", message: "Initial value() should be 100" },
      { fn: "flag", expected: "true", message: "Initial flag() should be true" },
      { fn: "value", expected: "0", message: "value() should be 0 after reset()", setup: [{ fn: "reset" }] },
      { fn: "flag", expected: "false", message: "flag() should be false after reset()", setup: [{ fn: "reset" }] },
    ],
  },
  {
    id: "no-float",
    title: "No Decimals!",
    category: "gotchas",
    order: 1,
    difficulty: "beginner",
    description: `# No Decimals!

Solidity has **no** floating point numbers (float/double). Integer division truncates the decimal part.

\`\`\`solidity
uint result = 5 / 2; // 2 (not 2.5!)
uint scaled = (5 * 1e18) / 2; // 2500000000000000000 (preserves precision)
\`\`\`

## Task
Complete both the regular division and scaled division functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NoFloat {
    function wrongDivide(uint a, uint b) public pure returns (uint) {
        // TODO: Simply return a / b (decimals will be truncated)
    }

    function scaledDivide(uint a, uint b) public pure returns (uint) {
        // TODO: Return (a * 1e18) / b to preserve precision
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NoFloat {
    function wrongDivide(uint a, uint b) public pure returns (uint) {
        return a / b;
    }

    function scaledDivide(uint a, uint b) public pure returns (uint) {
        return (a * 1e18) / b;
    }
}`,
    hints: ["Solidity integer division always rounds down.", "Multiplying by 1e18 before dividing preserves up to 18 decimal places of precision."],
    testDescription: "Checks that wrongDivide(5,2) returns 2 and scaledDivide(5,2) returns 2.5*1e18.",
    expectedFunctions: ["wrongDivide", "scaledDivide"],
    testCases: [
      { fn: "wrongDivide", args: ["5", "2"], expected: "2", message: "wrongDivide(5, 2) should return 2 (decimal truncated)" },
      { fn: "scaledDivide", args: ["5", "2"], expected: "2500000000000000000", message: "scaledDivide(5, 2) should return 2.5e18" },
    ],
  },
  {
    id: "default-values",
    title: "Default Values",
    category: "gotchas",
    order: 2,
    difficulty: "beginner",
    description: `# Default Values

Solidity variables are automatically assigned default values when declared. There is **no** null or undefined.
- \`uint\` → 0, \`bool\` → false, \`address\` → address(0), \`string\` → ""

\`\`\`solidity
uint x;     // 0
bool b;     // false
address a;  // 0x0000...0000
\`\`\`

## Task
Write a condition in isDefault that checks whether all variables are at their default values.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DefaultValues {
    uint public num;
    bool public flag;
    address public addr;
    string public text;

    function isDefault() public view returns (bool) {
        // TODO: Check that num == 0, flag == false, and addr == address(0), then return the result
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DefaultValues {
    uint public num;
    bool public flag;
    address public addr;
    string public text;

    function isDefault() public view returns (bool) {
        return num == 0 && !flag && addr == address(0);
    }
}`,
    hints: ["The default value of bool (false) can be checked with !flag.", "The default value of address is address(0)."],
    testDescription: "Checks that isDefault() returns true in the initial state.",
    expectedFunctions: ["num", "flag", "addr", "text", "isDefault"],
    testCases: [
      { fn: "num", expected: "0", message: "Initial num() should be 0" },
      { fn: "flag", expected: "false", message: "Initial flag() should be false" },
      { fn: "isDefault", expected: "true", message: "isDefault() should return true in the initial state" },
    ],
  },
  {
    id: "string-comparison",
    title: "String Comparison",
    category: "gotchas",
    order: 3,
    difficulty: "beginner",
    description: `# String Comparison

In Solidity, strings **cannot** be compared directly with \`==\`. You must compare their \`keccak256\` hashes.

\`\`\`solidity
// Wrong: "hello" == "hello" (compile error!)
// Correct:
keccak256(abi.encodePacked("hello")) == keccak256(abi.encodePacked("hello"))
\`\`\`

## Task
Complete the isEqual function that compares two strings using keccak256 hashes.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringComparison {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        // TODO: Compare a and b using keccak256 and abi.encodePacked
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringComparison {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}`,
    hints: ["keccak256() takes bytes and returns a bytes32 hash.", "Use abi.encodePacked(str) to convert a string to bytes."],
    testDescription: "Checks that isEqual returns true for identical strings and false for different ones.",
    expectedFunctions: ["isEqual"],
    testCases: [
      { fn: "isEqual", args: ["hello", "hello"], expected: "true", message: "isEqual('hello', 'hello') should return true" },
      { fn: "isEqual", args: ["hello", "world"], expected: "false", message: "isEqual('hello', 'world') should return false" },
    ],
  },
  {
    id: "string-concat",
    title: "String Concatenation",
    category: "gotchas",
    order: 4,
    difficulty: "beginner",
    description: `# String Concatenation

Since Solidity 0.8.12, you can concatenate strings with \`string.concat()\`.

\`\`\`solidity
string memory result = string.concat("Hello", " ", "World");
// result = "Hello World"
\`\`\`

## Task
Complete the concat function that joins two strings using string.concat.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringConcat {
    function concat(string memory a, string memory b) public pure returns (string memory) {
        // TODO: Use string.concat to join a and b, then return the result
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringConcat {
    function concat(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }
}`,
    hints: ["Use string.concat(a, b) format.", "You can also concatenate multiple strings at once: string.concat(a, b, c)"],
    testDescription: "Checks that the concat function correctly joins two strings.",
    expectedFunctions: ["concat"],
    testCases: [
      { fn: "concat", args: ["Hello", " World"], expected: "Hello World", message: "concat('Hello', ' World') should return 'Hello World'" },
      { fn: "concat", args: ["a", "b"], expected: "ab", message: "concat('a', 'b') should return 'ab'" },
    ],
  },
  {
    id: "address-vs-payable-diff",
    title: "address vs address payable",
    category: "gotchas",
    order: 5,
    difficulty: "beginner",
    description: `# address vs address payable

\`address\` cannot send ETH. Only \`address payable\` can use \`.transfer()\` and \`.send()\`.

\`\`\`solidity
address payable to = payable(0x123...);
to.transfer(1 ether); // send ETH
address payable converted = payable(someAddress);
\`\`\`

## Task
Complete the sendETH and makePayable functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayableDiff {
    receive() external payable {}

    function sendETH(address payable to, uint amount) public {
        // TODO: Send amount of ETH to the address using transfer
    }

    function makePayable(address addr) public pure returns (address payable) {
        // TODO: Convert addr to address payable and return it
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayableDiff {
    receive() external payable {}

    function sendETH(address payable to, uint amount) public {
        to.transfer(amount);
    }

    function makePayable(address addr) public pure returns (address payable) {
        return payable(addr);
    }
}`,
    hints: ["Call .transfer(amount) on an address payable variable to send ETH.", "Use payable(addr) to convert a regular address to address payable."],
    testDescription: "Checks that sendETH transfers ETH and makePayable correctly converts the address.",
    expectedFunctions: ["sendETH", "makePayable"],
    testCases: [
      { fn: "makePayable", args: ["0x1000000000000000000000000000000000000001"], message: "makePayable() should return successfully" },
    ],
  },
  {
    id: "ether-units",
    title: "Ether Units",
    category: "gotchas",
    order: 6,
    difficulty: "beginner",
    description: `# Ether Units

Solidity has built-in ether units:
- \`1 ether\` = 10^18 wei
- \`1 gwei\` = 10^9 wei
- \`1 wei\` = 1

\`\`\`solidity
uint oneEth = 1 ether;  // 1000000000000000000
uint oneG = 1 gwei;     // 1000000000
\`\`\`

## Task
Complete the three functions that return each unit.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherUnits {
    function oneEther() public pure returns (uint) {
        // TODO: Return 1 ether
    }

    function oneGwei() public pure returns (uint) {
        // TODO: Return 1 gwei
    }

    function tenWei() public pure returns (uint) {
        // TODO: Return 10 wei
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherUnits {
    function oneEther() public pure returns (uint) {
        return 1 ether;
    }

    function oneGwei() public pure returns (uint) {
        return 1 gwei;
    }

    function tenWei() public pure returns (uint) {
        return 10 wei;
    }
}`,
    hints: ["Appending ether, gwei, or wei after a number automatically converts it.", "1 ether = 1e18, 1 gwei = 1e9."],
    testDescription: "Checks that oneEther, oneGwei, and tenWei return the correct wei values.",
    expectedFunctions: ["oneEther", "oneGwei", "tenWei"],
    testCases: [
      { fn: "oneEther", expected: "1000000000000000000", message: "oneEther() should return 10^18" },
      { fn: "oneGwei", expected: "1000000000", message: "oneGwei() should return 10^9" },
      { fn: "tenWei", expected: "10", message: "tenWei() should return 10" },
    ],
  },
  {
    id: "time-units",
    title: "Time Units",
    category: "gotchas",
    order: 7,
    difficulty: "beginner",
    description: `# Time Units

Solidity has built-in time units:
- \`1 seconds\`, \`1 minutes\` (60), \`1 hours\` (3600), \`1 days\` (86400), \`1 weeks\` (604800)

\`\`\`solidity
uint oneDay = 1 days;   // 86400
uint deadline = block.timestamp + 7 days;
\`\`\`

## Task
Complete the three functions that use time units.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeUnits {
    function oneDay() public pure returns (uint) {
        // TODO: Return 1 days
    }

    function oneWeek() public pure returns (uint) {
        // TODO: Return 1 weeks
    }

    function futureTimestamp(uint daysFromNow) public view returns (uint) {
        // TODO: Return the timestamp daysFromNow days from the current timestamp
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeUnits {
    function oneDay() public pure returns (uint) {
        return 1 days;
    }

    function oneWeek() public pure returns (uint) {
        return 1 weeks;
    }

    function futureTimestamp(uint daysFromNow) public view returns (uint) {
        return block.timestamp + daysFromNow * 1 days;
    }
}`,
    hints: ["Appending days, weeks, etc. after a number automatically converts to seconds.", "Use block.timestamp + n * 1 days to calculate a future timestamp."],
    testDescription: "Checks that oneDay, oneWeek, and futureTimestamp return the correct time values.",
    expectedFunctions: ["oneDay", "oneWeek", "futureTimestamp"],
    testCases: [
      { fn: "oneDay", expected: "86400", message: "oneDay() should return 86400" },
      { fn: "oneWeek", expected: "604800", message: "oneWeek() should return 604800" },
      { fn: "futureTimestamp", args: ["1"], message: "futureTimestamp(1) should return successfully" },
    ],
  },
  {
    id: "type-casting-danger",
    title: "Downcasting Caution",
    category: "gotchas",
    order: 8,
    difficulty: "beginner",
    description: `# Downcasting Caution

When converting \`uint256\` to \`uint8\`, if the value exceeds 255, Solidity 0.8+ will revert. Use \`require\` to check for safe casting.

\`\`\`solidity
require(x <= type(uint8).max, "Overflow");
return uint8(x);
\`\`\`

## Task
Complete the safeCast function that checks for overflow with require before casting.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeCastingDanger {
    function safeCast(uint256 x) public pure returns (uint8) {
        // TODO: Use require to check that x is within uint8 max value
        // then convert to uint8 and return
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeCastingDanger {
    function safeCast(uint256 x) public pure returns (uint8) {
        require(x <= type(uint8).max, "Overflow");
        return uint8(x);
    }
}`,
    hints: ["type(uint8).max is the maximum value of uint8, which is 255.", "require(condition, errorMessage) reverts the transaction if the condition is false."],
    testDescription: "Checks that safeCast converts values <= 255 and reverts for values > 255.",
    expectedFunctions: ["safeCast"],
    testCases: [
      { fn: "safeCast", args: ["100"], expected: "100", message: "safeCast(100) should return 100" },
      { fn: "safeCast", args: ["255"], expected: "255", message: "safeCast(255) should return 255" },
      { fn: "safeCast", args: ["256"], expectRevert: true, message: "safeCast(256) should revert" },
    ],
  },
  {
    id: "function-modifier",
    title: "Function Modifier",
    category: "control-flow",
    order: 1,
    difficulty: "intermediate",
    description: `# Function Modifier

Learn about modifiers that check conditions before/after function execution.

## What you'll learn
- Declaring a modifier
- The meaning of \`_;\` (underscore)
- Access control patterns

## Explanation
\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _; // the original function body executes here
}

function restricted() public onlyOwner {
    // only owner can execute
}
\`\`\`

\`_;\` marks where the modified function's body is executed.

## Task
1. Complete the onlyOwner modifier's TODO
2. Apply the onlyOwner modifier to the increment function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionModifier {
    address public owner;
    uint public count = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        // TODO: Use require to check that msg.sender is the owner
        // TODO: Add _;
    }

    function increment() public /* TODO: apply onlyOwner modifier */ {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionModifier {
    address public owner;
    uint public count = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function increment() public onlyOwner {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}`,
    hints: [
      "Use require(condition, \"error message\"); to check conditions",
      "Add _; at the end of the modifier body so the original function executes",
    ],
    testDescription: "Checks that the modifier is correctly applied.",
    expectedFunctions: ["owner", "count", "increment", "getCount"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
      { fn: "getCount", expected: "0", message: "Initial getCount() should be 0" },
      { fn: "getCount", expected: "1", message: "getCount() should be 1 after increment()", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "loops",
    title: "Loops",
    category: "control-flow",
    order: 2,
    difficulty: "beginner",
    description: `# Loops

Learn about loops in Solidity.

## What you'll learn
- for and while loops
- The relationship between gas cost and loops

## Explanation
\`\`\`solidity
// for loop
uint total = 0;
for (uint i = 0; i < n; i++) {
    total += i;
}

// while loop
uint i = n;
while (i > 0) {
    result *= base;
    i--;
}
\`\`\`

⚠️ **Warning**: Infinite loops consume all gas and cause the transaction to fail!

## Task
1. sum: Use a for loop to calculate the sum from 1 to n
2. power: Use a while loop to calculate base^exp`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Loops {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        // TODO: Use a for loop to add 1 through n to total
        return total;
    }

    function power(uint base, uint exp) public pure returns (uint) {
        uint result = 1;
        uint i = exp;
        // TODO: Use a while loop to multiply result by base, i times
        return result;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Loops {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= n; i++) {
            total += i;
        }
        return total;
    }

    function power(uint base, uint exp) public pure returns (uint) {
        uint result = 1;
        uint i = exp;
        while (i > 0) {
            result *= base;
            i--;
        }
        return result;
    }
}`,
    hints: [
      "for (uint i = 1; i <= n; i++) { total += i; }",
      "while (i > 0) { result *= base; i--; }",
    ],
    testDescription: "Checks that the loops work correctly.",
    expectedFunctions: ["sum", "power"],
    testCases: [
      { fn: "sum", args: ["10"], expected: "55", message: "sum(10) should return 55" },
      { fn: "sum", args: ["0"], expected: "0", message: "sum(0) should return 0" },
      { fn: "power", args: ["2", "10"], expected: "1024", message: "power(2, 10) should return 1024" },
      { fn: "power", args: ["3", "0"], expected: "1", message: "power(3, 0) should return 1" },
    ],
  },
  {
    id: "error-handling",
    title: "Error Handling",
    category: "control-flow",
    order: 3,
    difficulty: "intermediate",
    description: `# Error Handling

Learn how to safely revert transactions.

## What you'll learn
- require, revert, assert
- Custom errors

## Explanation
\`\`\`solidity
// require: input validation
require(amount > 0, "Amount must be > 0");

// revert + custom error: saves gas
error Unauthorized(address caller);
if (msg.sender != owner) {
    revert Unauthorized(msg.sender);
}
\`\`\`

## Task
1. Declare a custom error
2. Complete the TODOs in deposit and withdraw functions`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: Declare a custom error: error Unauthorized(address caller);

contract ErrorHandling {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        // TODO: Use require to check msg.value > 0 (message: "Must send ETH")
    }

    function withdraw(uint amount) public {
        // TODO: If msg.sender is not owner, revert with the Unauthorized custom error
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error Unauthorized(address caller);

contract ErrorHandling {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Must send ETH");
    }

    function withdraw(uint amount) public {
        if (msg.sender != owner) {
            revert Unauthorized(msg.sender);
        }
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    hints: [
      "Declare custom errors at the top, outside the contract: error Unauthorized(address caller);",
      "Use revert Unauthorized(msg.sender); to trigger a custom error",
    ],
    testDescription: "Checks that error handling is correctly implemented.",
    expectedFunctions: ["owner", "deposit", "withdraw", "getBalance"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
      { fn: "deposit", value: "1000", message: "deposit() should accept ETH" },
      { fn: "deposit", expectRevert: true, message: "deposit() should revert when sending 0 wei" },
      { fn: "getBalance", expected: "1000", message: "getBalance() should be 1000 after deposit(1000)", setup: [{ fn: "deposit", value: "1000" }] },
    ],
  },
  {
    id: "arrays",
    title: "Arrays",
    category: "data-structures",
    order: 1,
    difficulty: "beginner",
    description: `# Arrays

Learn about dynamic and fixed-size arrays.

## What you'll learn
- Declaring dynamic arrays
- push, pop, length, index access

## Explanation
\`\`\`solidity
uint[] public arr;
arr.push(123);     // add to end
arr.pop();         // remove last
arr.length;        // length
arr[0];            // index access
\`\`\`

## Task
Complete each function's TODO in a single line.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayExample {
    uint[] public numbers;

    function addNumber(uint num) public {
        // TODO: Add num to the numbers array
    }

    function removeLastNumber() public {
        // TODO: Remove the last element from the numbers array
    }

    function getNumber(uint index) public view returns (uint) {
        // TODO: Return numbers[index]
    }

    function getLength() public view returns (uint) {
        // TODO: Return numbers.length
    }

    function getAllNumbers() public view returns (uint[] memory) {
        // TODO: Return the entire numbers array
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayExample {
    uint[] public numbers;

    function addNumber(uint num) public {
        numbers.push(num);
    }

    function removeLastNumber() public {
        numbers.pop();
    }

    function getNumber(uint index) public view returns (uint) {
        return numbers[index];
    }

    function getLength() public view returns (uint) {
        return numbers.length;
    }

    function getAllNumbers() public view returns (uint[] memory) {
        return numbers;
    }
}`,
    hints: [
      "push: numbers.push(num); / pop: numbers.pop();",
      "To return the entire array: return numbers;",
    ],
    testDescription: "Checks that array manipulation functions are correctly implemented.",
    expectedFunctions: [
      "numbers",
      "addNumber",
      "removeLastNumber",
      "getNumber",
      "getLength",
      "getAllNumbers",
    ],
    testCases: [
      { fn: "getLength", expected: "0", message: "Initial getLength() should be 0" },
      { fn: "getLength", expected: "2", message: "getLength() should be 2 after calling addNumber twice", setup: [{ fn: "addNumber", args: ["10"] }, { fn: "addNumber", args: ["20"] }] },
      { fn: "getNumber", args: ["0"], expected: "10", message: "getNumber(0) should be 10 after addNumber(10)", setup: [{ fn: "addNumber", args: ["10"] }] },
    ],
  },
  {
    id: "mapping",
    title: "Mapping",
    category: "data-structures",
    order: 2,
    difficulty: "beginner",
    description: `# Mapping

Learn about mappings that store data as key-value pairs.

## What you'll learn
- Declaring and using mappings
- Setting and reading values

## Explanation
\`\`\`solidity
mapping(address => uint) public balances;

balances[addr] = 100;     // set value
balances[addr];           // read value
balances[addr] += 50;     // increase value
\`\`\`

**Mapping note:** Non-existent keys return the default value (0).

## Task
Complete each function's TODO in a single line.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MappingExample {
    mapping(address => uint) public balances;

    function setBalance(address addr, uint amount) public {
        // TODO: Set balances[addr] to amount
    }

    function getBalance(address addr) public view returns (uint) {
        // TODO: Return balances[addr]
    }

    function addBalance(address addr, uint amount) public {
        // TODO: Add amount to balances[addr]
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MappingExample {
    mapping(address => uint) public balances;

    function setBalance(address addr, uint amount) public {
        balances[addr] = amount;
    }

    function getBalance(address addr) public view returns (uint) {
        return balances[addr];
    }

    function addBalance(address addr, uint amount) public {
        balances[addr] += amount;
    }
}`,
    hints: [
      "Set: balances[addr] = amount;",
      "Add: balances[addr] += amount;",
    ],
    testDescription: "Checks that mapping functions are correctly implemented.",
    expectedFunctions: ["balances", "setBalance", "getBalance", "addBalance"],
    testCases: [
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "0", message: "Initial getBalance() should be 0" },
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "100", message: "getBalance() should be 100 after setBalance(100)", setup: [{ fn: "setBalance", args: ["0x1000000000000000000000000000000000000001", "100"] }] },
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "150", message: "getBalance() should be 150 after addBalance(50)", setup: [{ fn: "setBalance", args: ["0x1000000000000000000000000000000000000001", "100"] }, { fn: "addBalance", args: ["0x1000000000000000000000000000000000000001", "50"] }] },
    ],
  },
  {
    id: "struct",
    title: "Struct",
    category: "data-structures",
    order: 3,
    difficulty: "intermediate",
    description: `# Struct

Learn about structs that bundle related data into custom types.

## What you'll learn
- Declaring a struct
- Creating and accessing struct instances

## Explanation
\`\`\`solidity
struct Todo {
    string text;
    bool completed;
}
Todo[] public todos;

// create
todos.push(Todo("Buy milk", false));

// access
todos[0].completed = true;
\`\`\`

## Task
1. Fill in the Student struct fields
2. Complete each function's TODO`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StructExample {
    struct Student {
        // TODO: Add fields: name (string), score (uint), isEnrolled (bool)
    }

    Student[] public students;

    function addStudent(string calldata name, uint score) public {
        // TODO: Push Student(name, score, true) to students
    }

    function getStudent(uint index) public view returns (string memory, uint, bool) {
        Student storage s = students[index];
        // TODO: Return s.name, s.score, s.isEnrolled
    }

    function updateScore(uint index, uint newScore) public {
        // TODO: Set students[index].score to newScore
    }

    function getStudentCount() public view returns (uint) {
        // TODO: Return students.length
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StructExample {
    struct Student {
        string name;
        uint score;
        bool isEnrolled;
    }

    Student[] public students;

    function addStudent(string calldata name, uint score) public {
        students.push(Student(name, score, true));
    }

    function getStudent(uint index) public view returns (string memory, uint, bool) {
        Student storage s = students[index];
        return (s.name, s.score, s.isEnrolled);
    }

    function updateScore(uint index, uint newScore) public {
        students[index].score = newScore;
    }

    function getStudentCount() public view returns (uint) {
        return students.length;
    }
}`,
    hints: [
      "Struct fields: string name; uint score; bool isEnrolled;",
      "Return multiple values: return (s.name, s.score, s.isEnrolled);",
    ],
    testDescription: "Checks that the struct and related functions are correctly implemented.",
    expectedFunctions: [
      "students",
      "addStudent",
      "getStudent",
      "updateScore",
      "getStudentCount",
    ],
    testCases: [
      { fn: "getStudentCount", expected: "0", message: "Initial getStudentCount() should be 0" },
      { fn: "getStudentCount", expected: "1", message: "getStudentCount() should be 1 after addStudent", setup: [{ fn: "addStudent", args: ["Alice", "90"] }] },
    ],
  },
  {
    id: "events",
    title: "Events",
    category: "advanced",
    order: 1,
    difficulty: "intermediate",
    description: `# Events

Learn about events that log smart contract activity.

## What you'll learn
- Declaring and emitting events
- Indexed parameters

## Explanation
\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint amount);

function transfer(address to, uint amount) public {
    emit Transfer(msg.sender, to, amount);
}
\`\`\`

- \`indexed\`: used for event filtering (max 3)
- Use the \`emit\` keyword to fire events

## Task
1. Declare two events
2. Emit the events in each function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    // TODO: Declare event MessageSent(address indexed sender, string message, uint timestamp)
    // TODO: Declare event ValueChanged(uint indexed oldValue, uint indexed newValue)

    uint public value = 0;

    function sendMessage(string calldata message) public {
        // TODO: Emit the MessageSent event (sender: msg.sender, timestamp: block.timestamp)
    }

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        // TODO: Emit the ValueChanged event
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    event MessageSent(address indexed sender, string message, uint timestamp);
    event ValueChanged(uint indexed oldValue, uint indexed newValue);

    uint public value = 0;

    function sendMessage(string calldata message) public {
        emit MessageSent(msg.sender, message, block.timestamp);
    }

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        emit ValueChanged(oldValue, newValue);
    }
}`,
    hints: [
      "Event declaration: event Name(parameters);",
      "Emit event: emit EventName(values);",
    ],
    testDescription: "Checks that events are correctly declared and emitted.",
    expectedEvents: ["MessageSent", "ValueChanged"],
    expectedFunctions: ["value", "sendMessage", "setValue"],
    testCases: [
      { fn: "value", expected: "0", message: "Initial value() should be 0" },
      { fn: "sendMessage", args: ["hello"], message: "sendMessage() should execute successfully" },
      { fn: "value", expected: "42", message: "value() should be 42 after setValue(42)", setup: [{ fn: "setValue", args: ["42"] }] },
    ],
  },
  {
    id: "inheritance",
    title: "Inheritance",
    category: "advanced",
    order: 2,
    difficulty: "intermediate",
    description: `# Inheritance

Learn about inheritance for code reuse between contracts.

## What you'll learn
- Inheriting with the \`is\` keyword
- virtual and override

## Explanation
\`\`\`solidity
contract Animal {
    function speak() public pure virtual returns (string memory) {
        return "...";
    }
}

contract Dog is Animal {
    function speak() public pure override returns (string memory) {
        return "Woof!";
    }
}
\`\`\`

- \`virtual\`: can be overridden by child contracts
- \`override\`: redefines a parent function

## Task
The Shape contract is already written. Complete the TODO in the Rectangle contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Shape {
    function getArea() public pure virtual returns (uint) {
        return 0;
    }
}

contract Rectangle is Shape {
    uint public width;
    uint public height;

    constructor(uint _width, uint _height) {
        // TODO: Set width and height
    }

    function getArea() public view override returns (uint) {
        // TODO: Return width * height
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Shape {
    function getArea() public pure virtual returns (uint) {
        return 0;
    }
}

contract Rectangle is Shape {
    uint public width;
    uint public height;

    constructor(uint _width, uint _height) {
        width = _width;
        height = _height;
    }

    function getArea() public view override returns (uint) {
        return width * height;
    }
}`,
    hints: [
      "In the constructor: width = _width; height = _height;",
      "getArea: return width * height;",
    ],
    testDescription: "Checks that inheritance and override are correctly implemented.",
    expectedFunctions: ["getArea", "width", "height"],
    constructorArgs: ["3", "4"],
    testCases: [
      { fn: "width", expected: "3", message: "width() should return 3" },
      { fn: "height", expected: "4", message: "height() should return 4" },
      { fn: "getArea", expected: "12", message: "getArea() should return 12 (3*4)" },
    ],
  },
  {
    id: "interface",
    title: "Interface",
    category: "advanced",
    order: 3,
    difficulty: "intermediate",
    description: `# Interface

Learn about interfaces — communication contracts between contracts.

## What you'll learn
- Declaring an interface
- Implementing an interface

## Explanation
\`\`\`solidity
interface IToken {
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract MyToken is IToken {
    // must implement all interface functions
}
\`\`\`

**Interface rules:** Only function declarations, no state variables, all functions must be external

## Task
The ICounter interface is provided. Complete the TODO in the Counter contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICounter {
    function increment() external;
    function decrement() external;
    function getCount() external view returns (uint);
}

contract Counter is ICounter {
    uint private count = 0;

    function increment() external {
        // TODO: Increment count by 1
    }

    function decrement() external {
        // TODO: Use require to check count > 0, then decrement count by 1
    }

    function getCount() external view returns (uint) {
        // TODO: Return count
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICounter {
    function increment() external;
    function decrement() external;
    function getCount() external view returns (uint);
}

contract Counter is ICounter {
    uint private count = 0;

    function increment() external {
        count += 1;
    }

    function decrement() external {
        require(count > 0, "Count is zero");
        count -= 1;
    }

    function getCount() external view returns (uint) {
        return count;
    }
}`,
    hints: [
      "increment: count += 1;",
      "decrement: require(count > 0, ...) then count -= 1;",
    ],
    testDescription: "Checks that the interface is correctly implemented.",
    expectedFunctions: ["increment", "decrement", "getCount"],
    testCases: [
      { fn: "getCount", expected: "0", message: "Initial getCount() should be 0" },
      { fn: "getCount", expected: "1", message: "getCount() should be 1 after increment()", setup: [{ fn: "increment" }] },
      { fn: "getCount", expected: "1", message: "getCount() should be 1 after 2x increment() and 1x decrement()", setup: [{ fn: "increment" }, { fn: "increment" }, { fn: "decrement" }] },
      { fn: "decrement", expectRevert: true, message: "decrement() should revert when count is 0" },
    ],
  },
  {
    id: "simple-storage",
    title: "Simple Storage",
    category: "patterns",
    order: 1,
    difficulty: "beginner",
    description: `# Simple Storage Pattern

Let's implement the most basic smart contract pattern.

## What you'll learn
- Store and retrieve pattern
- Event logging

## Task
1. Declare an event
2. Store value + emit event in the set function
3. Return value in the get function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    // TODO: Declare event DataStored(address indexed user, uint value)

    uint public storedData;

    function set(uint value) public {
        // TODO: Store value in storedData
        // TODO: Emit the DataStored event (user: msg.sender)
    }

    function get() public view returns (uint) {
        // TODO: Return storedData
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    event DataStored(address indexed user, uint value);

    uint public storedData;

    function set(uint value) public {
        storedData = value;
        emit DataStored(msg.sender, value);
    }

    function get() public view returns (uint) {
        return storedData;
    }
}`,
    hints: [
      "event DataStored(address indexed user, uint value);",
      "emit DataStored(msg.sender, value);",
    ],
    testDescription: "Checks that the SimpleStorage pattern is correctly implemented.",
    expectedFunctions: ["storedData", "set", "get"],
    expectedEvents: ["DataStored"],
    testCases: [
      { fn: "get", expected: "0", message: "Initial get() should be 0" },
      { fn: "get", expected: "42", message: "get() should return 42 after set(42)", setup: [{ fn: "set", args: ["42"] }] },
      { fn: "storedData", expected: "100", message: "storedData() should be 100 after set(100)", setup: [{ fn: "set", args: ["100"] }] },
    ],
  },
  {
    id: "erc20-basic",
    title: "ERC-20 Basics",
    category: "patterns",
    order: 2,
    difficulty: "advanced",
    description: `# ERC-20 Token Basics

Let's implement the basics of ERC-20, the most widely used token standard on Ethereum.

## What you'll learn
- Understanding the ERC-20 standard
- Minting tokens
- Transferring tokens

## Explanation
ERC-20 is the standard for fungible tokens.
Core functions: totalSupply, balanceOf, transfer

## Task
1. Write the initial token minting logic in the constructor
2. Complete the transfer logic in the transfer function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10**18;
        // TODO: Set totalSupply to initialSupply
        // TODO: Set balanceOf[msg.sender] to initialSupply
        // TODO: Emit Transfer event (from: address(0), to: msg.sender, amount: initialSupply)
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        // TODO: Subtract amount from sender's balance
        // TODO: Add amount to receiver's balance
        // TODO: Emit Transfer event (from: msg.sender)

        return true;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10**18;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);

        return true;
    }
}`,
    hints: [
      "Constructor: totalSupply = initialSupply; balanceOf[msg.sender] = initialSupply;",
      "Transfer: balanceOf[msg.sender] -= amount; balanceOf[to] += amount;",
    ],
    testDescription: "Checks that the basic ERC-20 implementation is correct.",
    expectedFunctions: [
      "name",
      "symbol",
      "decimals",
      "totalSupply",
      "balanceOf",
      "transfer",
    ],
    expectedEvents: ["Transfer"],
    testCases: [
      { fn: "name", expected: "Toka Token", message: "name() should return 'Toka Token'" },
      { fn: "symbol", expected: "TOKA", message: "symbol() should return 'TOKA'" },
      { fn: "decimals", expected: "18", message: "decimals() should return 18" },
      { fn: "totalSupply", expected: "1000000000000000000000000", message: "totalSupply() should be 1000000 * 10^18" },
      { fn: "balanceOf", args: ["DEPLOYER"], expected: "1000000000000000000000000", message: "Deployer's balanceOf should equal total supply" },
    ],
  },];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblemsByCategory(categoryId: string): Problem[] {
  return problems
    .filter((p) => p.category === categoryId)
    .sort((a, b) => a.order - b.order);
}

export function getNextProblem(currentId: string): Problem | undefined {
  const current = getProblemById(currentId);
  if (!current) return undefined;

  const sameCategory = getProblemsByCategory(current.category);
  const idx = sameCategory.findIndex((p) => p.id === currentId);
  if (idx < sameCategory.length - 1) return sameCategory[idx + 1];

  const cat = categories.find((c) => c.id === current.category);
  if (!cat) return undefined;
  const nextCat = categories.find((c) => c.order === cat.order + 1);
  if (!nextCat) return undefined;
  const nextProblems = getProblemsByCategory(nextCat.id);
  return nextProblems[0];
}

export function getPrevProblem(currentId: string): Problem | undefined {
  const current = getProblemById(currentId);
  if (!current) return undefined;

  const sameCategory = getProblemsByCategory(current.category);
  const idx = sameCategory.findIndex((p) => p.id === currentId);
  if (idx > 0) return sameCategory[idx - 1];

  const cat = categories.find((c) => c.id === current.category);
  if (!cat) return undefined;
  const prevCat = categories.find((c) => c.order === cat.order - 1);
  if (!prevCat) return undefined;
  const prevProblems = getProblemsByCategory(prevCat.id);
  return prevProblems[prevProblems.length - 1];
}
