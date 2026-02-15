import type { Problem } from "../problems";

export const basics_problems: Problem[] = [
  {
    id: "hello-solidity",
    title: "Your First Contract",
    category: "basics",
    order: 1,
    difficulty: "beginner",
    description: `# Your First Contract

## What you'll learn
How to create a basic Solidity contract.

In Solidity, all code lives inside a \`contract\`. Think of it like a container — everything your smart contract does goes between its curly braces.

## Task

Type the following code below the pragma line:

\`\`\`solidity
contract HelloSolidity {
}
\`\`\`

> \`contract\` is the keyword used to declare a smart contract. The curly braces \`{ }\` define where its code goes.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

// TODO: Declare a contract named HelloSolidity`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract HelloSolidity {
}`,
    hints: [
      "Use the contract keyword followed by a name and curly braces.",
      "The syntax pattern is: contract ContractName { }",
    ],
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

## What you'll learn
Solidity naming conventions for contracts.

Contract names use **PascalCase** — capitalize the first letter of each word, with no spaces or underscores.

Examples: \`MyToken\`, \`SimpleStorage\`, \`HelloWorld\`

## Task

Rename the contract from \`MyContract\` to \`MyStorage\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract MyContract {
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract MyStorage {
}`,
    hints: [
      "Change the name that comes right after the contract keyword.",
      "Only the contract name needs to change — nothing else.",
    ],
    testDescription: "Checks that the contract is named MyStorage.",
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

## What you'll learn
How to declare a state variable that stores a number.

Contracts can store data in **state variables**. Think of them like writing in a notebook — data persists even after the transaction ends.

\`uint\` is a type for storing positive integers (0, 1, 2, 3...).

## Task

Type the following code inside the contract:

\`\`\`solidity
uint public myNumber = 42;
\`\`\`

> Adding \`public\` automatically creates a getter function so the value can be read from outside.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract FirstVariable {
    // TODO: Declare a public uint variable named myNumber with value 42
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract FirstVariable {
    uint public myNumber = 42;
}`,
    hints: [
      "The pattern is: type public variableName = value;",
      "Use uint as the type and don't forget the semicolon at the end.",
    ],
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

## What you'll learn
How to store text using the \`string\` type.

In the previous problem, you stored a number with \`uint\`. Contracts can also store text using the \`string\` type. Text values are wrapped in double quotes (\`""\`).

## Task

Type the following code inside the contract:

\`\`\`solidity
string public greeting = "Hello Tokamak";
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract StringVariable {
    // TODO: Declare a public string variable named greeting with value "Hello Tokamak"
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract StringVariable {
    string public greeting = "Hello Tokamak";
}`,
    hints: [
      "Use the same pattern as before, but with string instead of uint.",
      "Text values must be wrapped in double quotes.",
    ],
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

## What you'll learn
How to declare multiple state variables in one contract.

In the previous problems, you declared \`uint\` and \`string\` in separate contracts. Now let's put both in a single contract. A contract can hold as many variables as you need.

## Task

1. Declare \`string public greeting\` with the value \`"Hello Tokamak"\`
2. Declare \`uint public version\` with the value \`1\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract StateVariables {
    // TODO: Declare a public string variable named greeting with value "Hello Tokamak"
    // TODO: Declare a public uint variable named version with value 1
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract StateVariables {
    string public greeting = "Hello Tokamak";
    uint public version = 1;
}`,
    hints: [
      "Use the same pattern from the previous problems, one line per variable.",
      "Each variable declaration ends with a semicolon.",
    ],
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

## What you'll learn
How to read and fix a type mismatch error.

The code below has a **type error**. A \`uint\` variable can only hold numbers, not text.

## Task

1. **First, compile it as-is** to see the error message
2. Fix the variable type so it can store the text \`"Alice"\`

> Think about which type you learned that stores text.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TypeErrorFix {
    // This code has an error. Try compiling first!
    uint public name = "Alice";
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TypeErrorFix {
    string public name = "Alice";
}`,
    hints: [
      "\"Alice\" is text, not a number. Which type stores text?",
      "You only need to change one word in the declaration.",
    ],
    testDescription: "Checks that name() returns 'Alice' after fixing the type.",
    expectedFunctions: ["name"],
    testCases: [
      { fn: "name", expected: "Alice", message: "name() should return 'Alice'" },
    ],
  },
  {
    id: "missing-semicolon-fix",
    title: "Fix a Missing Semicolon",
    category: "basics",
    order: 7,
    difficulty: "beginner",
    description: `# Fix a Missing Semicolon

## What you'll learn
How to spot and fix a missing semicolon error.

In Solidity, every statement must end with a semicolon (\`;\`). Forgetting one is one of the most common syntax errors — even experienced developers make this mistake!

## Task

1. **First, compile it as-is** to see the error message
2. Find the missing semicolon and add it

> The compiler error will point you to the line with the problem.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SemicolonFix {
    // This code has an error. Try compiling first!
    uint public count = 10
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SemicolonFix {
    uint public count = 10;
}`,
    hints: [
      "Look at the end of each statement — something is missing.",
      "Check the variable declaration line carefully.",
    ],
    testDescription: "Checks that count() returns 10 after fixing the syntax error.",
    expectedFunctions: ["count"],
    testCases: [
      { fn: "count", expected: "10", message: "count() should return 10" },
    ],
  },
  {
    id: "constructor-basics",
    title: "Constructor",
    category: "basics",
    order: 8,
    difficulty: "beginner",
    description: `# Constructor

## What you'll learn
How to use a constructor to set initial values at deployment.

The \`constructor\` is a special function that runs **only once** — when the contract is first deployed. It's like setting up initial configurations when you install an app.

\`msg.sender\` is a built-in value that holds the address of whoever deployed the contract.

## Task

Type the following code inside the constructor:

\`\`\`solidity
owner = msg.sender;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ConstructorBasics {
    address public owner;

    constructor() {
        // TODO: Set owner to msg.sender
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ConstructorBasics {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}`,
    hints: [
      "Assign a value using the = operator, just like initializing a variable.",
      "The left side is the variable name, the right side is msg.sender.",
    ],
    testDescription: "Checks that owner() returns the deployer's address.",
    expectedFunctions: ["owner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
    ],
  },
  {
    id: "constant-keyword",
    title: "Constant",
    category: "basics",
    order: 9,
    difficulty: "beginner",
    description: `# Constant

## What you'll learn
How to declare a variable that can never change.

A \`constant\` variable's value is fixed at compile time and **can never be modified**. By convention, constant names use \`UPPER_SNAKE_CASE\`.

## Task

Type the following code inside the contract:

\`\`\`solidity
uint256 public constant MAX_SUPPLY = 10000;
\`\`\`

> \`constant\` is placed between \`public\` and the variable name.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ConstantKeyword {
    // TODO: Declare a public constant uint256 named MAX_SUPPLY with value 10000
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ConstantKeyword {
    uint256 public constant MAX_SUPPLY = 10000;
}`,
    hints: [
      "The pattern is: type public constant NAME = value;",
      "constant goes between public and the variable name.",
    ],
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
    order: 10,
    difficulty: "beginner",
    description: `# Immutable

## What you'll learn
How to use \`immutable\` for values set once at deployment.

\`immutable\` is similar to \`constant\`, but its value **can be set in the constructor** instead of being hardcoded.

- \`constant\`: value must be known at compile time (e.g., \`= 10000\`)
- \`immutable\`: value is set once at deployment (e.g., from \`msg.sender\`)

## Task

1. Declare \`DEPLOYER\` as an \`address public immutable\` variable
2. Assign \`msg.sender\` to it inside the constructor`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ImmutableKeyword {
    // TODO: Declare address public immutable DEPLOYER

    constructor() {
        // TODO: Assign msg.sender to DEPLOYER
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract ImmutableKeyword {
    address public immutable DEPLOYER;

    constructor() {
        DEPLOYER = msg.sender;
    }
}`,
    hints: [
      "immutable goes in the same position as constant: type public immutable NAME;",
      "In the constructor, assign the value using = just like a regular variable.",
    ],
    testDescription: "Checks that DEPLOYER() returns the deployer's address.",
    expectedFunctions: ["DEPLOYER"],
    testCases: [
      { fn: "DEPLOYER", expected: "DEPLOYER", message: "DEPLOYER() should return the deployer's address" },
    ],
  },
  {
    id: "hello-console",
    title: "Hello Console",
    category: "basics",
    order: 11,
    difficulty: "beginner",
    description: `# Hello Console

## What you'll learn
How to use \`console.log\` for debugging output.

Every starter code already imports \`"hardhat/console.sol"\`. This gives you access to \`console.log()\`, which prints values to the console — just like \`console.log\` in JavaScript.

You can log strings and numbers:

\`\`\`solidity
console.log("Hello!");
console.log(123);
\`\`\`

Logged values appear in the **Console Output** section when you click **Run**.

## Task

Inside the constructor, add two \`console.log\` calls:

1. \`console.log("Hello Solidity!")\`
2. \`console.log(42)\`

> After writing the code, click **Run** to see your output in the Console Output section.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract HelloConsole {
    constructor() {
        // TODO: Log "Hello Solidity!" using console.log
        // TODO: Log the number 42 using console.log
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract HelloConsole {
    constructor() {
        console.log("Hello Solidity!");
        console.log(42);
    }
}`,
    hints: [
      "Use console.log(\"Hello Solidity!\") for text and console.log(42) for a number.",
      "Both calls go inside the constructor body, each ending with a semicolon.",
    ],
    testDescription: "Checks that the HelloConsole contract compiles and deploys successfully.",
    expectedFunctions: [],
    expectedContractName: "HelloConsole",
  },
  {
    id: "log-types",
    title: "Log Different Types",
    category: "basics",
    order: 12,
    difficulty: "beginner",
    description: `# Log Different Types

## What you'll learn
How to log different Solidity types and use labeled output.

\`console.log\` supports multiple types: \`string\`, \`uint256\`, \`bool\`, and \`address\`. You can combine a label with a value:

\`\`\`solidity
console.log("count:", count);    // labeled number
console.log("active:", active);  // labeled bool
console.log("owner:", addr);     // labeled address
\`\`\`

For \`bytes32\`, use \`console.logBytes32()\`:

\`\`\`solidity
console.logBytes32(myData);
\`\`\`

## Task

Inside the constructor, set each state variable and log it:

1. Set \`count\` to \`7\` and log it: \`console.log("count:", count)\`
2. Set \`active\` to \`true\` and log it: \`console.log("active:", active)\`
3. Set \`owner\` to \`msg.sender\` and log it: \`console.log("owner:", msg.sender)\`
4. Set \`data\` to \`0xabcdef0000000000000000000000000000000000000000000000000000000000\` and log it: \`console.logBytes32(data)\`

> Click **Run** to see all four values in the Console Output section.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract LogTypes {
    uint256 public count;
    bool public active;
    address public owner;
    bytes32 public data;

    constructor() {
        // TODO: Set count to 7 and log with console.log("count:", count)
        // TODO: Set active to true and log with console.log("active:", active)
        // TODO: Set owner to msg.sender and log with console.log("owner:", msg.sender)
        // TODO: Set data to 0xabcdef00...00 and log with console.logBytes32(data)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract LogTypes {
    uint256 public count;
    bool public active;
    address public owner;
    bytes32 public data;

    constructor() {
        count = 7;
        console.log("count:", count);
        active = true;
        console.log("active:", active);
        owner = msg.sender;
        console.log("owner:", msg.sender);
        data = 0xabcdef0000000000000000000000000000000000000000000000000000000000;
        console.logBytes32(data);
    }
}`,
    hints: [
      "Use console.log(\"label:\", variable) for string, uint, bool, and address types.",
      "For bytes32, use console.logBytes32(data) instead of console.log.",
    ],
    testDescription: "Checks that state variables are set correctly.",
    expectedFunctions: ["count", "active", "owner", "data"],
    expectedContractName: "LogTypes",
    testCases: [
      { fn: "count", expected: "7", message: "count() should return 7" },
      { fn: "active", expected: "true", message: "active() should return true" },
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
    ],
  },
];
