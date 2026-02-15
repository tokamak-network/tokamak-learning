import type { Problem } from "../problems";

export const control_flow_problems: Problem[] = [
  {
    id: "for-loop",
    title: "For Loop",
    category: "control-flow",
    order: 1,
    difficulty: "beginner",
    description: `# For Loop

## What you'll learn
How to repeat code using a \`for\` loop.

A \`for\` loop runs a block of code a set number of times. It has three parts: initialization, condition, and increment.

\`\`\`
for (start; condition; step) {
    // code runs while condition is true
}
\`\`\`

## Task

Write a for loop that adds numbers from 1 to \`n\` to \`total\`:

\`\`\`solidity
for (uint i = 1; i <= n; i++) {
    total += i;
}
\`\`\`

> Be careful with loops in Solidity — they cost gas for every iteration!`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ForLoop {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        // TODO: Write a for loop to add 1 through n to total
        return total;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ForLoop {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= n; i++) {
            total += i;
        }
        return total;
    }
}`,
    hints: [
      "A for loop has three parts: for (init; condition; step) { body }",
      "Start i at 1, loop while i <= n, and increment with i++.",
    ],
    testDescription: "Checks that sum() correctly adds numbers from 1 to n.",
    expectedFunctions: ["sum"],
    testCases: [
      { fn: "sum", args: ["5"], expected: "15", message: "sum(5) should return 15 (1+2+3+4+5)" },
      { fn: "sum", args: ["10"], expected: "55", message: "sum(10) should return 55" },
      { fn: "sum", args: ["0"], expected: "0", message: "sum(0) should return 0" },
    ],
  },
  {
    id: "require-statement",
    title: "The require Statement",
    category: "control-flow",
    order: 2,
    difficulty: "beginner",
    description: `# The require Statement

## What you'll learn
How to validate input and revert transactions with \`require\`.

\`require\` checks a condition. If it's \`false\`, the transaction is **reverted** and an error message is shown. It's the most common way to validate inputs.

\`\`\`
require(condition, "Error message");
\`\`\`

## Task

Inside \`setAge()\`, add a require statement before the assignment:

\`\`\`solidity
require(_age > 0, "Age must be positive");
\`\`\`

> \`require\` protects your functions from bad inputs.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract RequireStatement {
    uint public age;

    function setAge(uint _age) public {
        // TODO: Add require to check _age > 0 with message "Age must be positive"
        age = _age;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract RequireStatement {
    uint public age;

    function setAge(uint _age) public {
        require(_age > 0, "Age must be positive");
        age = _age;
    }
}`,
    hints: [
      "require takes a condition and an error message string.",
      "Place the require before the assignment so bad input is rejected first.",
    ],
    testDescription: "Checks that setAge() validates input and reverts on zero.",
    expectedFunctions: ["age", "setAge"],
    testCases: [
      { fn: "age", expected: "0", message: "Initial age() should be 0" },
      { fn: "age", expected: "25", message: "age() should be 25 after setAge(25)", setup: [{ fn: "setAge", args: ["25"] }] },
      { fn: "setAge", args: ["0"], expectRevert: true, message: "setAge(0) should revert because age must be positive" },
    ],
  },
  {
    id: "require-condition-fix",
    title: "Fix: Reversed require Condition",
    category: "control-flow",
    order: 3,
    difficulty: "intermediate",
    description: `# Fix: Reversed require Condition

## What you'll learn
How to read and fix a logical error in a \`require\` statement.

The code below has a logical error — the \`require\` condition is **reversed**. It rejects valid withdrawals and accepts invalid ones!

## Task

1. **First, compile and test it** — try withdrawing 50 from a balance of 100. It will fail even though 100 >= 50!
2. Fix the require condition so it correctly checks that the balance is sufficient

> Remember: \`require\` passes when the condition is \`true\`. Ask yourself: "What must be true for a withdrawal to succeed?"`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract RequireFix {
    uint public balance = 100;

    // This code has a logic error. Test it first!
    function withdraw(uint amount) public {
        require(amount > balance, "Insufficient balance");
        balance -= amount;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract RequireFix {
    uint public balance = 100;

    function withdraw(uint amount) public {
        require(balance >= amount, "Insufficient balance");
        balance -= amount;
    }
}`,
    hints: [
      "For a withdrawal to succeed, the balance must be enough to cover the amount.",
      "The condition should check that balance is greater than or equal to amount.",
    ],
    testDescription: "Checks that withdraw() correctly validates the balance before withdrawing.",
    expectedFunctions: ["balance", "withdraw"],
    testCases: [
      { fn: "balance", expected: "100", message: "Initial balance() should be 100" },
      { fn: "balance", expected: "50", message: "balance() should be 50 after withdraw(50)", setup: [{ fn: "withdraw", args: ["50"] }] },
      { fn: "withdraw", args: ["200"], expectRevert: true, message: "withdraw(200) should revert when balance is only 100" },
    ],
  },
  {
    id: "while-loop",
    title: "While Loop",
    category: "control-flow",
    order: 4,
    difficulty: "beginner",
    description: `# While Loop

## What you'll learn
How to use a \`while\` loop when the number of iterations isn't known in advance.

A \`while\` loop repeats as long as its condition is \`true\`. Unlike \`for\`, you manage the counter yourself.

\`\`\`
while (condition) {
    // code runs while condition is true
}
\`\`\`

## Task

Write a function that counts how many times you can divide \`n\` by 2 before it reaches 0. This gives you the number of bits needed to represent \`n\`.

\`\`\`solidity
while (n > 0) {
    count++;
    n /= 2;
}
\`\`\`

> \`while\` is useful when you don't know in advance how many iterations you need.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract WhileLoop {
    function bitLength(uint n) public pure returns (uint) {
        uint count = 0;
        // TODO: Use a while loop to count how many times n can be divided by 2
        return count;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract WhileLoop {
    function bitLength(uint n) public pure returns (uint) {
        uint count = 0;
        while (n > 0) {
            count++;
            n /= 2;
        }
        return count;
    }
}`,
    hints: [
      "Keep looping while n is greater than 0.",
      "In each iteration, increment count and divide n by 2.",
    ],
    testDescription: "Checks that bitLength() returns the correct number of bits.",
    expectedFunctions: ["bitLength"],
    testCases: [
      { fn: "bitLength", args: ["0"], expected: "0", message: "bitLength(0) should return 0" },
      { fn: "bitLength", args: ["1"], expected: "1", message: "bitLength(1) should return 1" },
      { fn: "bitLength", args: ["8"], expected: "4", message: "bitLength(8) should return 4 (1000 in binary)" },
      { fn: "bitLength", args: ["255"], expected: "8", message: "bitLength(255) should return 8" },
    ],
  },
  {
    id: "break-continue",
    title: "Break & Continue",
    category: "control-flow",
    order: 5,
    difficulty: "beginner",
    description: `# Break & Continue

## What you'll learn
How to use \`break\` and \`continue\` to control loop flow.

- **\`break\`** — exits the loop immediately
- **\`continue\`** — skips to the next iteration

\`\`\`
for (uint i = 0; i < 10; i++) {
    if (i == 5) break;      // stop at 5
    if (i % 2 == 0) continue; // skip even numbers
}
\`\`\`

## Task

Write a function that sums only **odd** numbers from 1 to \`n\`. Use \`continue\` to skip even numbers.

> \`break\` and \`continue\` work in both \`for\` and \`while\` loops.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract BreakContinue {
    function sumOdds(uint n) public pure returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= n; i++) {
            // TODO: Use continue to skip even numbers (i % 2 == 0)
            total += i;
        }
        return total;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract BreakContinue {
    function sumOdds(uint n) public pure returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= n; i++) {
            if (i % 2 == 0) continue;
            total += i;
        }
        return total;
    }
}`,
    hints: [
      "Use if (i % 2 == 0) to check for even numbers.",
      "Place 'continue;' inside the if block to skip even numbers.",
    ],
    testDescription: "Checks that sumOdds() returns the sum of odd numbers from 1 to n.",
    expectedFunctions: ["sumOdds"],
    testCases: [
      { fn: "sumOdds", args: ["5"], expected: "9", message: "sumOdds(5) should return 9 (1+3+5)" },
      { fn: "sumOdds", args: ["10"], expected: "25", message: "sumOdds(10) should return 25 (1+3+5+7+9)" },
      { fn: "sumOdds", args: ["1"], expected: "1", message: "sumOdds(1) should return 1" },
      { fn: "sumOdds", args: ["0"], expected: "0", message: "sumOdds(0) should return 0" },
    ],
  },
  {
    id: "revert-statement",
    title: "The revert Statement",
    category: "control-flow",
    order: 6,
    difficulty: "intermediate",
    description: `# The revert Statement

## What you'll learn
How to use \`revert\` for more complex error conditions.

While \`require\` is great for simple checks, \`revert\` gives you more flexibility. You can use it inside \`if/else\` blocks when the logic is more complex.

\`\`\`
if (condition) {
    revert("Error message");
}
\`\`\`

## Task

Write a \`transfer\` function that checks two conditions:
1. The sender must have enough balance
2. The recipient must not be the zero address

Use \`if\` + \`revert\` for each check:

\`\`\`solidity
if (balances[msg.sender] < amount) revert("Insufficient balance");
if (to == address(0)) revert("Cannot send to zero address");
\`\`\`

> \`revert\` is equivalent to \`require\` but lets you structure complex validation with \`if/else\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract RevertStatement {
    mapping(address => uint) public balances;

    constructor() {
        balances[msg.sender] = 1000;
    }

    function transfer(address to, uint amount) public {
        // TODO: Revert with "Insufficient balance" if sender doesn't have enough
        // TODO: Revert with "Cannot send to zero address" if to is address(0)
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract RevertStatement {
    mapping(address => uint) public balances;

    constructor() {
        balances[msg.sender] = 1000;
    }

    function transfer(address to, uint amount) public {
        if (balances[msg.sender] < amount) revert("Insufficient balance");
        if (to == address(0)) revert("Cannot send to zero address");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`,
    hints: [
      "Use if (condition) revert(\"message\"); for each validation.",
      "Check balance first, then check the recipient address.",
    ],
    testDescription: "Checks that transfer() validates balance and recipient address.",
    expectedFunctions: ["balances", "transfer"],
    testCases: [
      { fn: "transfer", args: ["2000"], expectRevert: true, message: "transfer(2000) should revert with insufficient balance" },
      { fn: "transfer", args: ["0x0000000000000000000000000000000000000000", "100"], expectRevert: true, message: "transfer to zero address should revert" },
    ],
  },
  {
    id: "custom-errors",
    title: "Custom Errors",
    category: "control-flow",
    order: 7,
    difficulty: "intermediate",
    description: `# Custom Errors

## What you'll learn
How to define and use custom errors for cheaper reverts.

Since Solidity 0.8.4, you can define custom errors. They use less gas than \`require\` with string messages because strings are expensive to store.

\`\`\`
error Unauthorized();
error InsufficientBalance(uint requested, uint available);

if (msg.sender != owner) revert Unauthorized();
\`\`\`

## Task

1. Define a custom error \`TooYoung(uint age, uint required)\`
2. In \`register()\`, use \`revert TooYoung(age, 18)\` if \`age < 18\`

> Custom errors save gas and can include data about what went wrong.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

// TODO: Define error TooYoung(uint age, uint required)

contract CustomErrors {
    uint public memberCount;

    function register(uint age) public {
        // TODO: Revert with TooYoung if age < 18
        memberCount++;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

error TooYoung(uint age, uint required);

contract CustomErrors {
    uint public memberCount;

    function register(uint age) public {
        if (age < 18) revert TooYoung(age, 18);
        memberCount++;
    }
}`,
    hints: [
      "Define error TooYoung(uint age, uint required); outside the contract.",
      "Use if (age < 18) revert TooYoung(age, 18); inside register().",
    ],
    testDescription: "Checks that register() reverts with custom error for underage and succeeds otherwise.",
    expectedFunctions: ["memberCount", "register"],
    testCases: [
      { fn: "memberCount", expected: "0", message: "Initial memberCount should be 0" },
      { fn: "memberCount", expected: "1", message: "memberCount should be 1 after register(20)", setup: [{ fn: "register", args: ["20"] }] },
      { fn: "register", args: ["17"], expectRevert: true, message: "register(17) should revert because age < 18" },
      { fn: "register", args: ["18"], expectRevert: false, message: "register(18) should succeed" },
    ],
  },
  {
    id: "assert-vs-require",
    title: "assert vs require",
    category: "control-flow",
    order: 8,
    difficulty: "intermediate",
    description: `# assert vs require

## What you'll learn
The difference between \`assert\` and \`require\` and when to use each.

- **\`require\`** — validates inputs and external conditions. Refunds remaining gas.
- **\`assert\`** — checks for bugs that should **never** happen. Used for internal invariants.

\`\`\`
require(amount > 0, "Amount must be positive");  // input validation
assert(balance >= 0);                             // should always be true
\`\`\`

## Task

1. In \`deposit()\`, use \`require\` to check that \`amount > 0\` with message \`"Must deposit something"\`
2. After updating the balance, add an \`assert\` to verify \`balance >= amount\` (this should always be true if the math is correct)

> Use \`require\` for "this might happen", use \`assert\` for "this should never happen".`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract AssertVsRequire {
    uint public balance;

    function deposit(uint amount) public {
        // TODO: require that amount > 0 with message "Must deposit something"
        balance += amount;
        // TODO: assert that balance >= amount (sanity check)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract AssertVsRequire {
    uint public balance;

    function deposit(uint amount) public {
        require(amount > 0, "Must deposit something");
        balance += amount;
        assert(balance >= amount);
    }
}`,
    hints: [
      "require checks user input — it might fail. assert checks invariants — it should never fail.",
      "Place require before the state change, assert after.",
    ],
    testDescription: "Checks that deposit() validates input with require and verifies invariants with assert.",
    expectedFunctions: ["balance", "deposit"],
    testCases: [
      { fn: "balance", expected: "0", message: "Initial balance should be 0" },
      { fn: "deposit", args: ["0"], expectRevert: true, message: "deposit(0) should revert" },
      { fn: "balance", expected: "100", message: "balance should be 100 after deposit(100)", setup: [{ fn: "deposit", args: ["100"] }] },
      { fn: "balance", expected: "300", message: "balance should be 300 after two deposits", setup: [{ fn: "deposit", args: ["100"] }, { fn: "deposit", args: ["200"] }] },
    ],
  },
  {
    id: "if-else-chain",
    title: "If / Else If / Else",
    category: "control-flow",
    order: 9,
    difficulty: "beginner",
    description: `# If / Else If / Else

## What you'll learn
How to handle multiple conditions with \`if\`, \`else if\`, and \`else\`.

\`\`\`
if (condition1) {
    // runs if condition1 is true
} else if (condition2) {
    // runs if condition2 is true
} else {
    // runs if nothing else matched
}
\`\`\`

## Task

Write a function that returns a grade string based on a score:
- 90 or above → return \`"A"\`
- 80 or above → return \`"B"\`
- 70 or above → return \`"C"\`
- Below 70 → return \`"F"\`

> Order matters! Check the highest threshold first.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract IfElseChain {
    function grade(uint score) public pure returns (string memory) {
        // TODO: Return "A" if score >= 90, "B" if >= 80, "C" if >= 70, "F" otherwise
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract IfElseChain {
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
    hints: [
      "Start with the highest threshold: if (score >= 90).",
      "Use else if for the next levels, and else for the default case.",
    ],
    testDescription: "Checks that grade() returns the correct grade for each score range.",
    expectedFunctions: ["grade"],
    testCases: [
      { fn: "grade", args: ["95"], expected: "A", message: "grade(95) should return 'A'" },
      { fn: "grade", args: ["90"], expected: "A", message: "grade(90) should return 'A'" },
      { fn: "grade", args: ["85"], expected: "B", message: "grade(85) should return 'B'" },
      { fn: "grade", args: ["75"], expected: "C", message: "grade(75) should return 'C'" },
      { fn: "grade", args: ["60"], expected: "F", message: "grade(60) should return 'F'" },
    ],
  },
  {
    id: "do-while-loop",
    title: "Do-While Loop",
    category: "control-flow",
    order: 10,
    difficulty: "beginner",
    description: `# Do-While Loop

## What you'll learn
How to use a \`do-while\` loop that always runs at least once.

Unlike \`while\`, a \`do-while\` loop checks the condition **after** each iteration. This guarantees the body runs at least once.

\`\`\`
do {
    // runs at least once
} while (condition);
\`\`\`

## Task

Write a function that counts the number of digits in a number. Even 0 has 1 digit.

\`\`\`solidity
do {
    digits++;
    n /= 10;
} while (n > 0);
\`\`\`

> \`do-while\` is perfect when you need at least one iteration — like counting digits, since even 0 has 1 digit.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DoWhileLoop {
    function digitCount(uint n) public pure returns (uint) {
        uint digits = 0;
        // TODO: Use a do-while loop to count digits of n
        return digits;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract DoWhileLoop {
    function digitCount(uint n) public pure returns (uint) {
        uint digits = 0;
        do {
            digits++;
            n /= 10;
        } while (n > 0);
        return digits;
    }
}`,
    hints: [
      "do { ... } while (condition); — the body runs first, then the condition is checked.",
      "Increment digits and divide n by 10 each iteration.",
    ],
    testDescription: "Checks that digitCount() returns the correct number of digits.",
    expectedFunctions: ["digitCount"],
    testCases: [
      { fn: "digitCount", args: ["0"], expected: "1", message: "digitCount(0) should return 1" },
      { fn: "digitCount", args: ["9"], expected: "1", message: "digitCount(9) should return 1" },
      { fn: "digitCount", args: ["42"], expected: "2", message: "digitCount(42) should return 2" },
      { fn: "digitCount", args: ["1000"], expected: "4", message: "digitCount(1000) should return 4" },
    ],
  },
];
