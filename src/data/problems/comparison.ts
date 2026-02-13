import type { Problem } from "../problems";

export const comparison_problems: Problem[] = [
  {
    id: "equality-check",
    title: "Equal or Not",
    category: "comparison",
    order: 1,
    difficulty: "beginner",
    description: `# Equal or Not

## What you'll learn
How to check if two values are equal or not equal.

Solidity uses \`==\` to check equality and \`!=\` to check inequality. The result is always a \`bool\` (true or false).

\`\`\`solidity
10 == 10  // true
10 != 5   // true
\`\`\`

## Task

1. In \`isEqual\`, return whether \`a\` equals \`b\`
2. In \`isNotEqual\`, return whether \`a\` does not equal \`b\`

> \`==\` means "is equal to", \`!=\` means "is not equal to". Don't confuse \`==\` with \`=\` (assignment).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EqualityCheck {
    function isEqual(uint a, uint b) public pure returns (bool) {
        // TODO: Return true if a equals b
    }

    function isNotEqual(uint a, uint b) public pure returns (bool) {
        // TODO: Return true if a does not equal b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EqualityCheck {
    function isEqual(uint a, uint b) public pure returns (bool) {
        return a == b;
    }

    function isNotEqual(uint a, uint b) public pure returns (bool) {
        return a != b;
    }
}`,
    hints: [
      "Use == for equality: return a == b;",
      "Use != for inequality: return a != b;",
    ],
    testDescription: "Checks that isEqual and isNotEqual return the correct bool values.",
    expectedFunctions: ["isEqual", "isNotEqual"],
    testCases: [
      { fn: "isEqual", args: ["10", "10"], expected: "true", message: "isEqual(10, 10) should return true" },
      { fn: "isEqual", args: ["10", "20"], expected: "false", message: "isEqual(10, 20) should return false" },
      { fn: "isNotEqual", args: ["10", "20"], expected: "true", message: "isNotEqual(10, 20) should return true" },
    ],
  },
  {
    id: "ordering-comparison",
    title: "Greater and Less",
    category: "comparison",
    order: 2,
    difficulty: "beginner",
    description: `# Greater and Less

## What you'll learn
How to compare which value is larger or smaller.

Solidity provides four ordering operators that return a \`bool\`:

\`\`\`solidity
a > b   // greater than
a < b   // less than
a >= b  // greater than or equal
a <= b  // less than or equal
\`\`\`

## Task

1. In \`isGreater\`, return whether \`a\` is greater than \`b\`
2. In \`isLessOrEqual\`, return whether \`a\` is less than or equal to \`b\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OrderComparison {
    function isGreater(uint a, uint b) public pure returns (bool) {
        // TODO: Return true if a is greater than b
    }

    function isLessOrEqual(uint a, uint b) public pure returns (bool) {
        // TODO: Return true if a is less than or equal to b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OrderComparison {
    function isGreater(uint a, uint b) public pure returns (bool) {
        return a > b;
    }

    function isLessOrEqual(uint a, uint b) public pure returns (bool) {
        return a <= b;
    }
}`,
    hints: [
      "Greater than uses >: return a > b;",
      "Less than or equal uses <=: return a <= b;",
    ],
    testDescription: "Checks that isGreater and isLessOrEqual return correct comparison results.",
    expectedFunctions: ["isGreater", "isLessOrEqual"],
    testCases: [
      { fn: "isGreater", args: ["10", "5"], expected: "true", message: "isGreater(10, 5) should return true" },
      { fn: "isGreater", args: ["5", "10"], expected: "false", message: "isGreater(5, 10) should return false" },
      { fn: "isLessOrEqual", args: ["5", "10"], expected: "true", message: "isLessOrEqual(5, 10) should return true" },
      { fn: "isLessOrEqual", args: ["10", "10"], expected: "true", message: "isLessOrEqual(10, 10) should return true (equal counts!)" },
    ],
  },
  {
    id: "logical-operators",
    title: "Logical Operators",
    category: "comparison",
    order: 3,
    difficulty: "beginner",
    description: `# Logical Operators

## What you'll learn
How to combine multiple conditions with AND, OR, and NOT.

\`&&\` (AND), \`||\` (OR), and \`!\` (NOT) work with \`bool\` values:

\`\`\`solidity
true && false  // false — both must be true
true || false  // true  — at least one must be true
!true          // false — flips the value
\`\`\`

## Task

1. In \`bothTrue\`, return true if **both** \`a\` and \`b\` are true
2. In \`eitherTrue\`, return true if **either** \`a\` or \`b\` is true
3. In \`negate\`, return the **opposite** of \`a\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogicalOps {
    function bothTrue(bool a, bool b) public pure returns (bool) {
        // TODO: Return true if both a AND b are true
    }

    function eitherTrue(bool a, bool b) public pure returns (bool) {
        // TODO: Return true if either a OR b is true
    }

    function negate(bool a) public pure returns (bool) {
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

    function negate(bool a) public pure returns (bool) {
        return !a;
    }
}`,
    hints: [
      "&& means AND, || means OR, ! means NOT.",
      "For AND: return a && b; For NOT: return !a;",
    ],
    testDescription: "Checks that bothTrue, eitherTrue, and negate return correct logical results.",
    expectedFunctions: ["bothTrue", "eitherTrue", "negate"],
    testCases: [
      { fn: "bothTrue", args: ["true", "true"], expected: "true", message: "bothTrue(true, true) should return true" },
      { fn: "bothTrue", args: ["true", "false"], expected: "false", message: "bothTrue(true, false) should return false" },
      { fn: "eitherTrue", args: ["false", "true"], expected: "true", message: "eitherTrue(false, true) should return true" },
      { fn: "negate", args: ["true"], expected: "false", message: "negate(true) should return false" },
    ],
  },
  {
    id: "simple-if-else",
    title: "Simple if/else",
    category: "comparison",
    order: 4,
    difficulty: "intermediate",
    description: `# Simple if/else

## What you'll learn
How to execute different code based on a condition.

\`if/else\` runs one block of code when the condition is true, and another when it's false:

\`\`\`solidity
if (x > 10) {
    return "big";
} else {
    return "small";
}
\`\`\`

## Task

1. Complete the \`isAdult\` function:
   - If \`age >= 18\`, return \`"adult"\`
   - Otherwise, return \`"minor"\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleIfElse {
    function isAdult(uint age) public pure returns (string memory) {
        // TODO: If age >= 18, return "adult", otherwise return "minor"
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleIfElse {
    function isAdult(uint age) public pure returns (string memory) {
        if (age >= 18) {
            return "adult";
        } else {
            return "minor";
        }
    }
}`,
    hints: [
      "Use if (condition) { ... } else { ... }",
      "The condition is: age >= 18",
    ],
    testDescription: "Checks that isAdult returns 'adult' for age >= 18 and 'minor' otherwise.",
    expectedFunctions: ["isAdult"],
    testCases: [
      { fn: "isAdult", args: ["20"], expected: "adult", message: "isAdult(20) should return 'adult'" },
      { fn: "isAdult", args: ["18"], expected: "adult", message: "isAdult(18) should return 'adult'" },
      { fn: "isAdult", args: ["15"], expected: "minor", message: "isAdult(15) should return 'minor'" },
    ],
  },
  {
    id: "assignment-vs-comparison",
    title: "Fix: Assignment in Condition",
    category: "comparison",
    order: 5,
    difficulty: "intermediate",
    description: `# Fix: Assignment in Condition

## What you'll learn
The difference between \`=\` (assignment) and \`==\` (comparison).

The code below uses \`=\` inside an \`if\` condition. In Solidity, \`=\` is for assignment — it sets a value. \`==\` is for comparison — it checks equality.

## Task

1. **First, compile the code as-is** to see the error message
2. Fix the error by changing \`=\` to \`==\`

> This is one of the most common mistakes in programming: using \`=\` when you mean \`==\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AssignmentFix {
    // This code has an error. Try compiling first!
    function isTen(uint x) public pure returns (bool) {
        if (x = 10) {
            return true;
        }
        return false;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AssignmentFix {
    function isTen(uint x) public pure returns (bool) {
        if (x == 10) {
            return true;
        }
        return false;
    }
}`,
    hints: [
      "= assigns a value, == compares values.",
      "Change = to == inside the if condition.",
    ],
    testDescription: "Checks that isTen returns true for 10 and false for other values.",
    expectedFunctions: ["isTen"],
    testCases: [
      { fn: "isTen", args: ["10"], expected: "true", message: "isTen(10) should return true" },
      { fn: "isTen", args: ["5"], expected: "false", message: "isTen(5) should return false" },
    ],
  },
  {
    id: "ternary-operator",
    title: "The Ternary Operator",
    category: "comparison",
    order: 6,
    difficulty: "intermediate",
    description: `# The Ternary Operator

## What you'll learn
A one-line shortcut for simple if/else conditions.

The ternary operator \`condition ? valueIfTrue : valueIfFalse\` lets you write conditionals in a single expression:

\`\`\`solidity
uint result = (a > b) ? a : b;  // returns the larger value
\`\`\`

## Task

1. In \`max\`, use the ternary operator to return the larger of \`a\` and \`b\`
2. In \`min\`, use the ternary operator to return the smaller of \`a\` and \`b\`

> The ternary operator is great for simple conditions. For complex logic, use if/else.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TernaryOperator {
    function max(uint a, uint b) public pure returns (uint) {
        // TODO: Return the larger of a and b using the ternary operator
    }

    function min(uint a, uint b) public pure returns (uint) {
        // TODO: Return the smaller of a and b using the ternary operator
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TernaryOperator {
    function max(uint a, uint b) public pure returns (uint) {
        return a >= b ? a : b;
    }

    function min(uint a, uint b) public pure returns (uint) {
        return a <= b ? a : b;
    }
}`,
    hints: [
      "Pattern: condition ? valueIfTrue : valueIfFalse",
      "For max: a >= b ? a : b",
    ],
    testDescription: "Checks that max and min return the correct values using the ternary operator.",
    expectedFunctions: ["max", "min"],
    testCases: [
      { fn: "max", args: ["10", "20"], expected: "20", message: "max(10, 20) should return 20" },
      { fn: "max", args: ["30", "5"], expected: "30", message: "max(30, 5) should return 30" },
      { fn: "min", args: ["10", "20"], expected: "10", message: "min(10, 20) should return 10" },
      { fn: "min", args: ["5", "5"], expected: "5", message: "min(5, 5) should return 5" },
    ],
  },
  {
    id: "multi-branch",
    title: "Multi-branch Conditions",
    category: "comparison",
    order: 7,
    difficulty: "intermediate",
    description: `# Multi-branch Conditions

## What you'll learn
How to handle more than two possible outcomes with \`if/else if/else\`.

When you have multiple conditions to check, chain them with \`else if\`:

\`\`\`solidity
if (x > 100) {
    return "high";
} else if (x > 50) {
    return "medium";
} else {
    return "low";
}
\`\`\`

## Task

1. Complete the \`grade\` function:
   - Score >= 90: return \`"A"\`
   - Score >= 80: return \`"B"\`
   - Score >= 70: return \`"C"\`
   - Otherwise: return \`"F"\`

> Check the highest condition first. Once a condition is true, the rest are skipped.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultiBranch {
    function grade(uint score) public pure returns (string memory) {
        // TODO: Return "A" if score >= 90, "B" if >= 80, "C" if >= 70, else "F"
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultiBranch {
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
      "Start with the highest threshold: if (score >= 90) { return \"A\"; }",
      "Chain with else if for each lower threshold, ending with else for the default.",
    ],
    testDescription: "Checks that grade returns the correct letter grade for each score range.",
    expectedFunctions: ["grade"],
    testCases: [
      { fn: "grade", args: ["95"], expected: "A", message: "grade(95) should return 'A'" },
      { fn: "grade", args: ["85"], expected: "B", message: "grade(85) should return 'B'" },
      { fn: "grade", args: ["75"], expected: "C", message: "grade(75) should return 'C'" },
      { fn: "grade", args: ["50"], expected: "F", message: "grade(50) should return 'F'" },
    ],
  },
];
