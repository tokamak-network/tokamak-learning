import type { Problem } from "../problems";

export const variables_problems: Problem[] = [
  {
    id: "local-variables",
    title: "Local Variables",
    category: "variables",
    order: 1,
    difficulty: "beginner",
    description: `# Local Variables

## What you'll learn
How to use variables inside a function.

Local variables are declared inside a function. They only exist while the function runs and are **not stored on the blockchain** — they disappear when the function finishes.

## Task

Inside the function, complete the two lines:

1. Declare a local variable \`result\` equal to \`x * 2\`
2. Return \`result\`

> Local variables are cheap because they live in memory, not in storage.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function getDouble(uint x) public pure returns (uint) {
        // TODO: Declare a local variable result equal to x * 2
        // TODO: Return result
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function getDouble(uint x) public pure returns (uint) {
        uint result = x * 2;
        return result;
    }
}`,
    hints: [
      "Declare a local variable the same way as a state variable: uint result = x * 2;",
      "Use the return keyword to send the value back to the caller.",
    ],
    testDescription: "Checks that getDouble() correctly doubles the input value.",
    expectedFunctions: ["getDouble"],
    testCases: [
      { fn: "getDouble", args: ["5"], expected: "10", message: "getDouble(5) should return 10" },
      { fn: "getDouble", args: ["0"], expected: "0", message: "getDouble(0) should return 0" },
    ],
  },
  {
    id: "global-variables",
    title: "Global Variables",
    category: "variables",
    order: 2,
    difficulty: "beginner",
    description: `# Global Variables

## What you'll learn
How to use Solidity's built-in global variables.

Solidity provides special global variables you can use anywhere:
- \`msg.sender\`: the address that called the function
- \`block.timestamp\`: the current block's timestamp (in seconds)

## Task

1. Inside \`getSender()\`, return \`msg.sender\`
2. Inside \`getTimestamp()\`, return \`block.timestamp\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GlobalVariables {
    function getSender() public view returns (address) {
        // TODO: Return the caller's address
    }

    function getTimestamp() public view returns (uint) {
        // TODO: Return the current block timestamp
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
}`,
    hints: [
      "msg.sender gives you the address of whoever called the function.",
      "block.timestamp gives the current block's time as a Unix timestamp.",
    ],
    testDescription: "Checks that getSender() and getTimestamp() return the correct global values.",
    expectedFunctions: ["getSender", "getTimestamp"],
    testCases: [
      { fn: "getSender", expected: "DEPLOYER", message: "getSender() should return the caller's address" },
      { fn: "getTimestamp", message: "getTimestamp() should return a timestamp value" },
    ],
  },
  {
    id: "visibility-basics",
    title: "Visibility",
    category: "variables",
    order: 3,
    difficulty: "beginner",
    description: `# Visibility

## What you'll learn
How to control who can access variables and functions.

Solidity has visibility keywords that control access:
- \`public\`: anyone can access
- \`private\`: only the current contract

## Task

1. Add the \`private\` keyword to \`secretNumber\` to hide it from direct access
2. Add the \`public\` keyword to \`getSecret()\` so anyone can call it

> Even \`private\` variables are visible on the blockchain — \`private\` only prevents other contracts from reading them directly.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    // TODO: Add the private keyword
    uint secretNumber = 42;

    // TODO: Add the public keyword
    function getSecret() view returns (uint) {
        return secretNumber;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    uint private secretNumber = 42;

    function getSecret() public view returns (uint) {
        return secretNumber;
    }
}`,
    hints: [
      "Visibility keywords go after the type for variables: uint private name;",
      "For functions, visibility goes after the parentheses: function name() public ...",
    ],
    testDescription: "Checks that getSecret() returns the secret number.",
    expectedFunctions: ["getSecret"],
    testCases: [
      { fn: "getSecret", expected: "42", message: "getSecret() should return 42" },
    ],
  },
  {
    id: "view-functions",
    title: "View Functions",
    category: "variables",
    order: 4,
    difficulty: "beginner",
    description: `# View Functions

## What you'll learn
What the \`view\` keyword means for functions.

A \`view\` function can **read** state variables but **cannot modify** them. It's like looking through a window — you can see inside, but you can't change anything.

## Task

Write the body of \`getCount()\` — return the value of \`count\`:

\`\`\`solidity
return count;
\`\`\`

> \`view\` tells the compiler: "This function only reads data, it doesn't change anything."`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewFunctions {
    uint public count = 10;

    function getCount() public view returns (uint) {
        // TODO: Return count
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewFunctions {
    uint public count = 10;

    function getCount() public view returns (uint) {
        return count;
    }
}`,
    hints: [
      "A view function reads state but doesn't change it.",
      "Use the return keyword followed by the variable name.",
    ],
    testDescription: "Checks that getCount() returns the stored count value.",
    expectedFunctions: ["count", "getCount"],
    testCases: [
      { fn: "getCount", expected: "10", message: "getCount() should return 10" },
    ],
  },
  {
    id: "pure-functions",
    title: "Pure Functions",
    category: "variables",
    order: 5,
    difficulty: "beginner",
    description: `# Pure Functions

## What you'll learn
What the \`pure\` keyword means for functions.

A \`pure\` function **cannot read or modify** any state. It only works with its parameters and local variables — like a calculator that doesn't need to look anything up.

- \`view\`: can read state (like the previous problem)
- \`pure\`: cannot even read state

## Task

Write the body of \`add()\` — return the sum of \`a\` and \`b\`:

\`\`\`solidity
return a + b;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PureFunctions {
    function add(uint a, uint b) public pure returns (uint) {
        // TODO: Return a + b
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PureFunctions {
    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }
}`,
    hints: [
      "Pure functions only use parameters and local variables — no state access.",
      "Return the result of the arithmetic operation.",
    ],
    testDescription: "Checks that add() returns the correct sum.",
    expectedFunctions: ["add"],
    testCases: [
      { fn: "add", args: ["3", "7"], expected: "10", message: "add(3, 7) should return 10" },
      { fn: "add", args: ["0", "0"], expected: "0", message: "add(0, 0) should return 0" },
    ],
  },
  {
    id: "pure-state-error",
    title: "Fix: State Access in Pure",
    category: "variables",
    order: 6,
    difficulty: "intermediate",
    description: `# Fix: State Access in Pure

## What you'll learn
That \`pure\` functions cannot read state variables.

The code below has a \`pure\` function that tries to read a state variable. This is not allowed — \`pure\` means "no state access at all."

## Task

1. **First, compile it as-is** to see the error message
2. Change the function keyword so it can read state

> If a function needs to read state, it should be \`view\`, not \`pure\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PureStateError {
    uint public value = 42;

    // This code has an error. Try compiling first!
    function getValue() public pure returns (uint) {
        return value;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PureStateError {
    uint public value = 42;

    function getValue() public view returns (uint) {
        return value;
    }
}`,
    hints: [
      "The function reads the state variable 'value'. Can a pure function do that?",
      "Change one keyword to allow reading state without modifying it.",
    ],
    testDescription: "Checks that getValue() returns 42 after fixing the function modifier.",
    expectedFunctions: ["value", "getValue"],
    testCases: [
      { fn: "getValue", expected: "42", message: "getValue() should return 42" },
    ],
  },
  {
    id: "delete-keyword",
    title: "The delete Keyword",
    category: "variables",
    order: 7,
    difficulty: "intermediate",
    description: `# The delete Keyword

## What you'll learn
How to reset variables to their default values using \`delete\`.

\`delete\` resets a variable to its type's default value:
- \`uint\` becomes \`0\`
- \`bool\` becomes \`false\`
- \`address\` becomes \`address(0)\`

## Task

Inside the \`reset()\` function, use \`delete\` to reset both \`value\` and \`flag\`:

\`\`\`solidity
delete value;
delete flag;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeleteKeyword {
    uint public value = 100;
    bool public flag = true;

    function reset() public {
        // TODO: Use delete to reset value and flag
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
    hints: [
      "The syntax is: delete variableName;",
      "Each variable needs its own delete statement.",
    ],
    testDescription: "Checks that value becomes 0 and flag becomes false after reset().",
    expectedFunctions: ["value", "flag", "reset"],
    testCases: [
      { fn: "value", expected: "100", message: "Initial value() should be 100" },
      { fn: "flag", expected: "true", message: "Initial flag() should be true" },
      { fn: "value", expected: "0", message: "value() should be 0 after reset()", setup: [{ fn: "reset" }] },
      { fn: "flag", expected: "false", message: "flag() should be false after reset()", setup: [{ fn: "reset" }] },
    ],
  },
];
