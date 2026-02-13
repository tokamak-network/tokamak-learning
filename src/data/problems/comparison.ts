import type { Problem } from "../problems";

export const comparison_problems: Problem[] = [
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
];
