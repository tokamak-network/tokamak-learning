import type { Problem } from "../problems";

export const gotchas_problems: Problem[] = [
  {
    id: "integer-division",
    title: "Integer Division Truncates",
    category: "gotchas",
    order: 1,
    difficulty: "beginner",
    description: `# Integer Division Truncates

## What you'll learn
How division works differently in Solidity compared to most languages.

Solidity has **no floating point numbers**. When you divide integers, the decimal part is simply thrown away (truncated, not rounded).

\`\`\`solidity
7 / 2  // returns 3, not 3.5
5 / 3  // returns 1, not 1.666...
\`\`\`

## Task

1. In \`divide\`, return \`a / b\`

> Try calling divide(7, 2) — you'll get 3, not 3.5. The .5 is silently lost!`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract IntegerDivision {
    function divide(uint a, uint b) public pure returns (uint) {
        // TODO: Return a / b (the decimal part will be truncated!)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract IntegerDivision {
    function divide(uint a, uint b) public pure returns (uint) {
        return a / b;
    }
}`,
    hints: [
      "Simply return a / b — Solidity automatically truncates the decimal.",
      "7 / 2 gives 3, not 4. Solidity truncates (rounds down), never rounds up.",
    ],
    testDescription: "Checks that divide(7, 2) returns 3 and divide(5, 3) returns 1.",
    expectedFunctions: ["divide"],
    testCases: [
      { fn: "divide", args: ["7", "2"], expected: "3", message: "divide(7, 2) should return 3 (not 3.5 — decimals are truncated)" },
      { fn: "divide", args: ["5", "3"], expected: "1", message: "divide(5, 3) should return 1 (not 1.666...)" },
    ],
  },
  {
    id: "no-decimal-literal",
    title: "Fix: No Decimal Numbers",
    category: "gotchas",
    order: 2,
    difficulty: "beginner",
    description: `# Fix: No Decimal Numbers

## What you'll learn
Why you cannot use decimal numbers like \`1.5\` in Solidity.

Since Solidity has no floating point types, you **cannot assign decimal values** to integer variables. The code below tries to do exactly that.

## Task

1. **First, compile the code as-is** to see the error message
2. Fix the error by changing the decimal value to a whole number (use \`2\`)

> In real contracts, developers represent decimals by scaling up: 1.5 ETH is stored as 1500000000000000000 wei (1.5 * 10^18).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DecimalError {
    // This code has an error. Try compiling first!
    uint public ratio = 1.5;
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DecimalError {
    uint public ratio = 2;
}`,
    hints: [
      "Solidity integer types cannot hold decimal values like 1.5.",
      "Replace 1.5 with a whole number, such as 2.",
    ],
    testDescription: "Checks that ratio() returns 2 after fixing the decimal literal.",
    expectedFunctions: ["ratio"],
    testCases: [
      { fn: "ratio", expected: "2", message: "ratio() should return 2" },
    ],
  },
  {
    id: "default-values",
    title: "Default Values",
    category: "gotchas",
    order: 3,
    difficulty: "beginner",
    description: `# Default Values

## What you'll learn
How Solidity initializes variables — there is no \`null\` or \`undefined\`.

In Solidity, every variable has a **default value** when declared without an initial value:

| Type | Default |
|------|---------|
| uint | 0 |
| bool | false |
| address | 0x000...000 |
| string | "" |

## Task

1. In \`getDefaultUint\`, return \`num\` (declared but not initialized)
2. In \`getDefaultBool\`, return \`flag\` (declared but not initialized)

> Unlike JavaScript or Python, Solidity never has "undefined" — everything starts with a default value.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DefaultValues {
    uint public num;
    bool public flag;

    function getDefaultUint() public view returns (uint) {
        // TODO: Return num (it will be 0 by default)
    }

    function getDefaultBool() public view returns (bool) {
        // TODO: Return flag (it will be false by default)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DefaultValues {
    uint public num;
    bool public flag;

    function getDefaultUint() public view returns (uint) {
        return num;
    }

    function getDefaultBool() public view returns (bool) {
        return flag;
    }
}`,
    hints: [
      "Simply return the state variable — it already has a default value.",
      "return num; will return 0, return flag; will return false.",
    ],
    testDescription: "Checks that uninitialized uint returns 0 and bool returns false.",
    expectedFunctions: ["num", "flag", "getDefaultUint", "getDefaultBool"],
    testCases: [
      { fn: "getDefaultUint", expected: "0", message: "getDefaultUint() should return 0 (default value of uint)" },
      { fn: "getDefaultBool", expected: "false", message: "getDefaultBool() should return false (default value of bool)" },
    ],
  },
  {
    id: "delete-resets-value",
    title: "delete Resets, Not Removes",
    category: "gotchas",
    order: 4,
    difficulty: "beginner",
    description: `# The delete Keyword

## What you'll learn
What \`delete\` actually does in Solidity — it's not what you might expect!

In most languages, \`delete\` removes something. In Solidity, \`delete\` **resets a variable to its default value**. It doesn't remove anything.

\`\`\`solidity
uint x = 42;
delete x;    // x is now 0 (not removed!)
\`\`\`

## Task

1. In \`resetCounter\`, use \`delete\` to reset \`counter\` to its default value (0)

> After \`delete counter\`, the variable still exists — it just holds 0 again.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DeleteKeyword {
    uint public counter = 100;

    function resetCounter() public {
        // TODO: Use delete to reset counter to its default value
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DeleteKeyword {
    uint public counter = 100;

    function resetCounter() public {
        delete counter;
    }
}`,
    hints: [
      "The syntax is: delete variableName;",
      "delete counter; resets counter to 0.",
    ],
    testDescription: "Checks that counter starts at 100 and becomes 0 after resetCounter().",
    expectedFunctions: ["counter", "resetCounter"],
    testCases: [
      { fn: "counter", expected: "100", message: "Initial counter() should be 100" },
      { fn: "counter", expected: "0", message: "After resetCounter(), counter() should be 0", setup: [{ fn: "resetCounter" }] },
    ],
  },
  {
    id: "ether-units",
    title: "Ether Units",
    category: "gotchas",
    order: 5,
    difficulty: "intermediate",
    description: `# Ether Units

## What you'll learn
Built-in keywords for converting between ether, gwei, and wei.

Solidity has built-in unit suffixes that convert to wei (the smallest unit):

| Unit | Value in wei |
|------|-------------|
| 1 wei | 1 |
| 1 gwei | 10^9 (1,000,000,000) |
| 1 ether | 10^18 (1,000,000,000,000,000,000) |

\`\`\`solidity
uint oneEth = 1 ether;  // 1000000000000000000
\`\`\`

## Task

1. In \`oneEtherInWei\`, return \`1 ether\`
2. In \`oneGweiInWei\`, return \`1 gwei\`

> All values in Solidity are stored in wei. These keywords are just convenient multipliers.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract EtherUnits {
    function oneEtherInWei() public pure returns (uint) {
        // TODO: Return 1 ether
    }

    function oneGweiInWei() public pure returns (uint) {
        // TODO: Return 1 gwei
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract EtherUnits {
    function oneEtherInWei() public pure returns (uint) {
        return 1 ether;
    }

    function oneGweiInWei() public pure returns (uint) {
        return 1 gwei;
    }
}`,
    hints: [
      "Just write the number followed by the unit: return 1 ether;",
      "The unit keyword automatically converts to wei.",
    ],
    testDescription: "Checks that oneEtherInWei() returns 10^18 and oneGweiInWei() returns 10^9.",
    expectedFunctions: ["oneEtherInWei", "oneGweiInWei"],
    testCases: [
      { fn: "oneEtherInWei", expected: "1000000000000000000", message: "oneEtherInWei() should return 10^18" },
      { fn: "oneGweiInWei", expected: "1000000000", message: "oneGweiInWei() should return 10^9" },
    ],
  },
  {
    id: "time-units",
    title: "Time Units",
    category: "gotchas",
    order: 6,
    difficulty: "intermediate",
    description: `# Time Units

## What you'll learn
Built-in keywords for working with time durations.

Just like ether units, Solidity has time units that convert to seconds:

| Unit | Value in seconds |
|------|-----------------|
| 1 seconds | 1 |
| 1 minutes | 60 |
| 1 hours | 3,600 |
| 1 days | 86,400 |
| 1 weeks | 604,800 |

## Task

1. In \`oneDayInSeconds\`, return \`1 days\`
2. In \`oneWeekInSeconds\`, return \`1 weeks\`

> These are useful for setting deadlines, lock periods, and time-based conditions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TimeUnits {
    function oneDayInSeconds() public pure returns (uint) {
        // TODO: Return 1 days
    }

    function oneWeekInSeconds() public pure returns (uint) {
        // TODO: Return 1 weeks
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TimeUnits {
    function oneDayInSeconds() public pure returns (uint) {
        return 1 days;
    }

    function oneWeekInSeconds() public pure returns (uint) {
        return 1 weeks;
    }
}`,
    hints: [
      "Just write the number followed by the unit: return 1 days;",
      "1 days = 86400 seconds, 1 weeks = 604800 seconds.",
    ],
    testDescription: "Checks that oneDayInSeconds() returns 86400 and oneWeekInSeconds() returns 604800.",
    expectedFunctions: ["oneDayInSeconds", "oneWeekInSeconds"],
    testCases: [
      { fn: "oneDayInSeconds", expected: "86400", message: "oneDayInSeconds() should return 86400" },
      { fn: "oneWeekInSeconds", expected: "604800", message: "oneWeekInSeconds() should return 604800" },
    ],
  },
  {
    id: "string-comparison",
    title: "String Comparison Gotcha",
    category: "gotchas",
    order: 7,
    difficulty: "intermediate",
    description: `# String Comparison Gotcha

## What you'll learn
Why you cannot compare strings with \`==\` in Solidity.

In most languages, \`"hello" == "hello"\` works. In Solidity, strings **cannot be compared directly** with \`==\`. You must compare their hashes using \`keccak256\`:

\`\`\`solidity
keccak256(abi.encodePacked("hello")) == keccak256(abi.encodePacked("hello"))
\`\`\`

## Task

1. In \`isEqual\`, compare \`a\` and \`b\` using their \`keccak256\` hashes

> \`abi.encodePacked()\` converts the string to bytes, and \`keccak256()\` hashes them for comparison.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract StringCompare {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        // TODO: Compare a and b using keccak256(abi.encodePacked(...))
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract StringCompare {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}`,
    hints: [
      "Hash each string: keccak256(abi.encodePacked(a))",
      "Compare the two hashes with ==.",
    ],
    testDescription: "Checks that isEqual returns true for identical strings and false for different ones.",
    expectedFunctions: ["isEqual"],
    testCases: [
      { fn: "isEqual", args: ["hello", "hello"], expected: "true", message: "isEqual('hello', 'hello') should return true" },
      { fn: "isEqual", args: ["hello", "world"], expected: "false", message: "isEqual('hello', 'world') should return false" },
    ],
  },
  {
    id: "safe-downcast",
    title: "Safe Downcasting",
    category: "gotchas",
    order: 8,
    difficulty: "intermediate",
    description: `# Safe Downcasting

## What you'll learn
How to safely convert a larger integer type to a smaller one.

Converting \`uint256\` to \`uint8\` can lose data if the value is too large. In Solidity 0.8+, this automatically reverts, but it's good practice to check explicitly with \`require\`.

\`\`\`solidity
require(x <= type(uint8).max, "Value too large");
return uint8(x);
\`\`\`

## Task

1. In \`toUint8\`, first check that \`x\` fits in uint8 using \`require\`
2. Then cast and return \`uint8(x)\`

> \`type(uint8).max\` is 255. Values above 255 cannot fit in a uint8.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SafeDowncast {
    function toUint8(uint256 x) public pure returns (uint8) {
        // TODO: Use require to check x <= type(uint8).max with message "Value too large"
        // TODO: Return uint8(x)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SafeDowncast {
    function toUint8(uint256 x) public pure returns (uint8) {
        require(x <= type(uint8).max, "Value too large");
        return uint8(x);
    }
}`,
    hints: [
      "require(condition, message) reverts if the condition is false.",
      "type(uint8).max returns 255 — the maximum value for uint8.",
    ],
    testDescription: "Checks that toUint8(100) returns 100 and toUint8(256) reverts.",
    expectedFunctions: ["toUint8"],
    testCases: [
      { fn: "toUint8", args: ["100"], expected: "100", message: "toUint8(100) should return 100" },
      { fn: "toUint8", args: ["255"], expected: "255", message: "toUint8(255) should return 255" },
      { fn: "toUint8", args: ["256"], expectRevert: true, message: "toUint8(256) should revert (value too large for uint8)" },
    ],
  },
];
