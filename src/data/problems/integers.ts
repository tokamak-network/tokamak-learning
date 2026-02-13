import type { Problem } from "../problems";

export const integers_problems: Problem[] = [
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
];
