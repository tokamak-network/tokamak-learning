import type { Problem } from "../problems";

export const arithmetic_problems: Problem[] = [
  {
    id: "addition-op",
    title: "Addition (+)",
    category: "arithmetic",
    order: 1,
    difficulty: "beginner",
    description: `# Addition (+)

## What you'll learn
How to use the \`+\` operator to add two numbers in Solidity.

The \`+\` operator adds two numbers. In Solidity 0.8+, overflow automatically reverts the transaction.

\`\`\`solidity
uint256 result = 10 + 20; // 30
\`\`\`

## Task
Return the sum of two numbers in the \`add()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Addition {
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a + b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

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

## What you'll learn
How to use the \`-\` operator and understand underflow protection in Solidity 0.8+.

The \`-\` operator subtracts. In 0.8+, uint underflow (e.g., 3 - 5) automatically reverts.

\`\`\`solidity
uint256 result = 10 - 3; // 7
// uint256 fail = 3 - 5; // revert!
\`\`\`

## Task
Return \`a - b\` in the \`subtract()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Subtraction {
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a - b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

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

## What you'll learn
How to use the \`*\` operator and be aware of overflow with large numbers.

The \`*\` operator multiplies. Watch out for overflow when multiplying large numbers.

\`\`\`solidity
uint256 result = 7 * 8; // 56
\`\`\`

## Task
Return \`a * b\` in the \`multiply()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Multiplication {
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a * b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

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

## What you'll learn
How to use the \`/\` operator and understand that Solidity truncates (no decimals).

The \`/\` operator divides. Division by zero reverts. The result is truncated (no rounding).

\`\`\`solidity
uint256 result = 10 / 3; // 3 (not 3.33)
\`\`\`

## Task
Return \`a / b\` in the \`divide()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Division {
    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: Return a / b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

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

## What you'll learn
How to use the \`%\` operator for remainders and even/odd checks.

The \`%\` operator returns the remainder. Useful for even/odd checks: \`x % 2 == 0\` means even.

\`\`\`solidity
uint256 r = 10 % 3; // 1
bool even = (4 % 2 == 0); // true
\`\`\`

## Task
Write a \`mod()\` function and an \`isEven()\` function that checks if a number is even.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

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
import "hardhat/console.sol";

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

## What you'll learn
How to use the \`**\` operator for powers and the \`10 ** 18\` token unit convention.

The \`**\` operator computes powers. \`10 ** 18\` is commonly used for token units.

\`\`\`solidity
uint256 result = 2 ** 10; // 1024
uint256 unit = 10 ** 18;  // 1 ether
\`\`\`

## Task
Write a \`power()\` function and a \`tokenUnit()\` function that returns \`10 ** 18\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

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
import "hardhat/console.sol";

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

## What you'll learn
How to use shorthand operators (\`+=\`, \`-=\`, \`*=\`) for concise state updates.

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
import "hardhat/console.sol";

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
import "hardhat/console.sol";

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
    id: "multiply-before-divide",
    title: "Multiply Before Divide",
    category: "arithmetic",
    order: 8,
    difficulty: "beginner",
    description: `# Integer Division Pitfalls

## What you'll learn
Why operation order matters in Solidity and how to minimize precision loss.

Solidity has no decimals. \`5/2 = 2\`, and operation order affects precision.

\`\`\`solidity
(a / b) * c  // more precision loss
(a * c) / b  // multiply first for better precision
\`\`\`

## Task
Implement \`divideAndLose()\` with truncating division, and \`betterPrecision()\` with multiply-first approach.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

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
import "hardhat/console.sol";

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
];
