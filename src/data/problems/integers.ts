import type { Problem } from "../problems";

export const integers_problems: Problem[] = [
  {
    id: "uint256-explicit",
    title: "uint256: The Explicit Form",
    category: "integers",
    order: 1,
    difficulty: "beginner",
    description: `# uint256: The Explicit Form

## What you'll learn
The full name of the \`uint\` type you've been using.

In the Basics category, you used \`uint\` to store numbers. \`uint\` is actually a shorthand for \`uint256\` — a 256-bit unsigned integer that can hold very large values (up to 2^256 - 1).

## Task

1. Declare a \`uint256 public totalSupply\` with the value \`1000000\`

> Both \`uint\` and \`uint256\` work exactly the same way. Using \`uint256\` makes the size explicit.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerBasics {
    // TODO: Declare uint256 public totalSupply with value 1000000
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerBasics {
    uint256 public totalSupply = 1000000;
}`,
    hints: [
      "The pattern is: uint256 public variableName = value;",
      "Numbers in Solidity don't use commas — write 1000000 without commas.",
    ],
    testDescription: "Checks that totalSupply() returns 1000000.",
    expectedFunctions: ["totalSupply"],
    testCases: [
      { fn: "totalSupply", expected: "1000000", message: "totalSupply() should return 1000000" },
    ],
  },
  {
    id: "uint8-small-integer",
    title: "Small Integers: uint8",
    category: "integers",
    order: 2,
    difficulty: "beginner",
    description: `# Small Integers: uint8

## What you'll learn
A smaller integer type that holds values from 0 to 255.

\`uint8\` uses only 8 bits of storage. It's commonly used for small values like token decimals (most tokens use 18 decimals).

## Task

1. Declare a \`uint8 public decimals\` with the value \`18\`

> The number after \`uint\` indicates the bit size: uint8 (0–255), uint16 (0–65535), uint256 (0–2^256-1).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SmallInteger {
    // TODO: Declare uint8 public decimals with value 18
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SmallInteger {
    uint8 public decimals = 18;
}`,
    hints: [
      "Same pattern as uint256, just use uint8 instead.",
      "uint8 public decimals = 18;",
    ],
    testDescription: "Checks that decimals() returns 18.",
    expectedFunctions: ["decimals"],
    testCases: [
      { fn: "decimals", expected: "18", message: "decimals() should return 18" },
    ],
  },
  {
    id: "int256-signed",
    title: "Signed Integers: int256",
    category: "integers",
    order: 3,
    difficulty: "beginner",
    description: `# Signed Integers: int256

## What you'll learn
An integer type that can hold both positive and negative numbers.

\`uint\` can only hold zero and positive numbers. \`int256\` (or just \`int\`) can hold negative numbers too, with a range from -2^255 to 2^255-1.

## Task

1. Declare \`int256 public temperature\` with the value \`-10\`
2. Declare \`int256 public altitude\` with the value \`500\`

> Just like \`uint\` is short for \`uint256\`, \`int\` is short for \`int256\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SignedInteger {
    // TODO: Declare int256 public temperature with value -10
    // TODO: Declare int256 public altitude with value 500
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SignedInteger {
    int256 public temperature = -10;
    int256 public altitude = 500;
}`,
    hints: [
      "int256 uses the same pattern: int256 public variableName = value;",
      "Negative values are written directly, like -10.",
    ],
    testDescription: "Checks that temperature() returns -10 and altitude() returns 500.",
    expectedFunctions: ["temperature", "altitude"],
    testCases: [
      { fn: "temperature", expected: "-10", message: "temperature() should return -10" },
      { fn: "altitude", expected: "500", message: "altitude() should return 500" },
    ],
  },
  {
    id: "uint-negative-error",
    title: "Fix the Negative Assignment",
    category: "integers",
    order: 4,
    difficulty: "beginner",
    description: `# Fix the Negative Assignment

## What you'll learn
Why \`uint\` cannot hold negative numbers.

The code below tries to assign \`-10\` to a \`uint256\` variable. Since \`uint\` stands for "unsigned integer," it can only hold zero and positive values.

## Task

1. **First, compile the code as-is** to see the error message
2. Fix the error by changing \`uint256\` to the correct type that supports negative numbers

> Remember: \`uint\` = unsigned (0 and positive only), \`int\` = signed (negative and positive).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NegativeFix {
    // This code has an error. Try compiling first!
    uint256 public temperature = -10;
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NegativeFix {
    int256 public temperature = -10;
}`,
    hints: [
      "uint stands for 'unsigned integer' — it cannot store negative numbers.",
      "Replace uint256 with a signed type.",
    ],
    testDescription: "Checks that temperature() returns -10 after fixing the type.",
    expectedFunctions: ["temperature"],
    testCases: [
      { fn: "temperature", expected: "-10", message: "temperature() should return -10" },
    ],
  },
  {
    id: "type-min-max",
    title: "Min and Max Values",
    category: "integers",
    order: 5,
    difficulty: "intermediate",
    description: `# Min and Max Values

## What you'll learn
How to query the minimum and maximum values of any integer type.

Solidity provides \`type(T).min\` and \`type(T).max\` to get the range boundaries of an integer type.

\`\`\`solidity
uint8 maxVal = type(uint8).max;  // 255
int8 minVal = type(int8).min;    // -128
\`\`\`

## Task

1. In \`getMaxUint8\`, return \`type(uint8).max\`
2. In \`getMinInt8\`, return \`type(int8).min\`

> These are useful for checking boundaries before performing arithmetic.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeMinMax {
    function getMaxUint8() public pure returns (uint8) {
        // TODO: Return the maximum value of uint8
    }

    function getMinInt8() public pure returns (int8) {
        // TODO: Return the minimum value of int8
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
}`,
    hints: [
      "Use the pattern: type(T).max or type(T).min",
      "Replace T with the actual type name, like uint8 or int8.",
    ],
    testDescription: "Checks that getMaxUint8() returns 255 and getMinInt8() returns -128.",
    expectedFunctions: ["getMaxUint8", "getMinInt8"],
    testCases: [
      { fn: "getMaxUint8", expected: "255", message: "getMaxUint8() should return 255" },
      { fn: "getMinInt8", expected: "-128", message: "getMinInt8() should return -128" },
    ],
  },
  {
    id: "integer-sizes",
    title: "Integer Size Variants",
    category: "integers",
    order: 6,
    difficulty: "intermediate",
    description: `# Integer Size Variants

## What you'll learn
The different uint sizes available in Solidity.

Solidity offers uint in multiples of 8, from \`uint8\` to \`uint256\`. Each size has a different maximum value:

| Type | Max Value |
|------|-----------|
| uint8 | 255 |
| uint16 | 65,535 |
| uint32 | ~4.2 billion |
| uint256 | enormous |

## Task

1. Declare \`uint8 public small\` with value \`255\`
2. Declare \`uint16 public medium\` with value \`65535\`
3. Declare \`uint256 public large\` with value \`1000000\`

> In practice, \`uint256\` is the most common. Smaller types are used in struct packing for gas optimization.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerSizes {
    // TODO: Declare uint8 public small with value 255
    // TODO: Declare uint16 public medium with value 65535
    // TODO: Declare uint256 public large with value 1000000
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerSizes {
    uint8 public small = 255;
    uint16 public medium = 65535;
    uint256 public large = 1000000;
}`,
    hints: [
      "Same declaration pattern for all sizes: uintN public name = value;",
      "uint8 can hold values from 0 to 255, uint16 from 0 to 65535.",
    ],
    testDescription: "Checks that small(), medium(), and large() return the correct values.",
    expectedFunctions: ["small", "medium", "large"],
    testCases: [
      { fn: "small", expected: "255", message: "small() should return 255" },
      { fn: "medium", expected: "65535", message: "medium() should return 65535" },
      { fn: "large", expected: "1000000", message: "large() should return 1000000" },
    ],
  },
  {
    id: "overflow-protection",
    title: "Overflow Protection",
    category: "integers",
    order: 7,
    difficulty: "intermediate",
    description: `# Overflow Protection

## What you'll learn
How Solidity 0.8+ automatically prevents integer overflow.

What happens when you add 1 to the maximum value of uint8 (255)? In Solidity 0.8+, the transaction **automatically reverts** — no extra code needed.

\`\`\`solidity
// uint8 max is 255
// 255 + 1 would overflow → automatic revert!
\`\`\`

## Task

1. Complete the \`add\` function: return \`a + b\`

> The overflow check happens automatically. Try imagining what happens when add(255, 1) is called!`,
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
    hints: [
      "Simply return the sum: return a + b;",
      "Solidity 0.8+ handles overflow protection automatically — no extra code needed.",
    ],
    testDescription: "Checks that add(1, 2) returns 3 and add(255, 1) reverts due to overflow.",
    expectedFunctions: ["add"],
    testCases: [
      { fn: "add", args: ["1", "2"], expected: "3", message: "add(1, 2) should return 3" },
      { fn: "add", args: ["100", "50"], expected: "150", message: "add(100, 50) should return 150" },
      { fn: "add", args: ["255", "1"], expectRevert: true, message: "add(255, 1) should revert due to overflow" },
    ],
  },
  {
    id: "unchecked-block",
    title: "The unchecked Block",
    category: "integers",
    order: 8,
    difficulty: "intermediate",
    description: `# The unchecked Block

## What you'll learn
How to skip overflow checks for gas savings when you're certain overflow won't happen.

Inside an \`unchecked { }\` block, Solidity skips the automatic overflow checks. This saves gas but should only be used when you're certain the math is safe.

\`\`\`solidity
unchecked {
    counter++;
}
\`\`\`

## Task

1. Inside the \`increment\` function, increment \`counter\` by 1 inside an \`unchecked\` block

> A uint256 counter would need 2^256 increments to overflow — practically impossible. That's why \`unchecked\` is safe here.`,
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
    hints: [
      "Wrap the increment in: unchecked { counter++; }",
      "The unchecked keyword needs curly braces around the code.",
    ],
    testDescription: "Checks that counter starts at 0 and becomes 1 after calling increment().",
    expectedFunctions: ["counter", "increment"],
    testCases: [
      { fn: "counter", expected: "0", message: "Initial counter() should be 0" },
      { fn: "counter", expected: "1", message: "After calling increment(), counter() should be 1", setup: [{ fn: "increment" }] },
    ],
  },
];
