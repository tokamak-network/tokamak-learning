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

contract ForLoop {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        // TODO: Write a for loop to add 1 through n to total
        return total;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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

contract RequireStatement {
    uint public age;

    function setAge(uint _age) public {
        // TODO: Add require to check _age > 0 with message "Age must be positive"
        age = _age;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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
];
