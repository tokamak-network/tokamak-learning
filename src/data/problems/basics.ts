import type { Problem } from "../problems";

export const basics_problems: Problem[] = [
  {
    id: "hello-solidity",
    title: "Your First Contract",
    category: "basics",
    order: 1,
    difficulty: "beginner",
    description: `# Your First Contract

In Solidity, all code lives inside a \`contract\`.
Just like building a house starts with an empty room, let's start with an empty contract.

## Task

Type the following code:

\`\`\`solidity
contract HelloSolidity {
}
\`\`\`

> \`contract\` — the keyword used to declare a smart contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: Declare a HelloSolidity contract`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloSolidity {
}`,
    hints: ["Write the name after the contract keyword and wrap it with { }.", "contract HelloSolidity { }"],
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

Contract names should **start with an uppercase letter**.
If there are multiple words, capitalize the first letter of each word.

Examples: \`MyToken\`, \`SimpleStorage\`, \`HelloWorld\`

## Task

Rename the contract from \`MyContract\` to \`MyStorage\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyStorage {
}`,
    hints: ["Just change the name after the contract keyword.", "MyContract → MyStorage"],
    testDescription: "Checks that the contract name is MyStorage.",
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

You can store data inside a contract. These are called **state variables**.

\`uint\` is a type that stores unsigned integers (0, 1, 2, 3...).

## Task

Type the following code inside the contract:

\`\`\`solidity
uint public myNumber = 42;
\`\`\`

> Adding \`public\` makes this value readable from outside the contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstVariable {
    // TODO: Declare uint public myNumber and initialize it to 42
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstVariable {
    uint public myNumber = 42;
}`,
    hints: ["Declare it as: uint public variableName = value;", "uint public myNumber = 42;"],
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

You can store not only numbers but also text.

\`string\` is a type that stores text. Values are wrapped in double quotes (\`""\`).

## Task

Type the following code inside the contract:

\`\`\`solidity
string public greeting = "Hello Tokamak";
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringVariable {
    // TODO: Declare string public greeting and initialize it to "Hello Tokamak"
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringVariable {
    string public greeting = "Hello Tokamak";
}`,
    hints: ["Declare it as: string public variableName = \"value\";", "string public greeting = \"Hello Tokamak\";"],
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

In the previous problems, you declared \`uint\` and \`string\` separately.
Now let's declare both variables together in a single contract.

## Task

1. Declare \`string public greeting\` with the value \`"Hello Tokamak"\`
2. Declare \`uint public version\` with the value \`1\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StateVariables {
    // TODO: Declare string public greeting and initialize it to "Hello Tokamak"
    // TODO: Declare uint public version and initialize it to 1
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StateVariables {
    string public greeting = "Hello Tokamak";
    uint public version = 1;
}`,
    hints: ["Write two lines using the same pattern you learned before.", "string public greeting = \"Hello Tokamak\";\nuint public version = 1;"],
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

The code below has a **type error**.

## Task

1. **First, try compiling it as-is** — check the error message
2. Once you see the error, fix it with the correct type

> Hint: \`uint\` can only store numbers. It cannot store the string \`"Alice"\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeErrorFix {
    // This code has an error. Try compiling it first!
    uint public name = "Alice";
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeErrorFix {
    string public name = "Alice";
}`,
    hints: ["\"Alice\" is a string. What type stores strings?", "Change uint to string."],
    testDescription: "Checks that name() returns 'Alice'.",
    expectedFunctions: ["name"],
    testCases: [
      { fn: "name", expected: "Alice", message: "name() should return 'Alice'" },
    ],
  },
  {
    id: "constructor-basics",
    title: "Constructor",
    category: "basics",
    order: 7,
    difficulty: "beginner",
    description: `# Constructor

The \`constructor\` is a special function that runs **only once** when the contract is deployed.
It's like setting up initial configurations when you first install an app.

\`msg.sender\` is the address of the person who deployed this contract.

## Task

Type the following code inside the constructor:

\`\`\`solidity
owner = msg.sender;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstructorBasics {
    address public owner;

    constructor() {
        // TODO: Set owner to msg.sender
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstructorBasics {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}`,
    hints: ["msg.sender is the address of the person who deployed the contract.", "owner = msg.sender;"],
    testDescription: "Checks that the deployer's address is stored in owner.",
    expectedFunctions: ["owner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
    ],
  },
  {
    id: "constant-keyword",
    title: "Constant",
    category: "basics",
    order: 8,
    difficulty: "beginner",
    description: `# Constant

A variable declared with \`constant\` **can never be changed**.
It's used for fixed configuration values, and by convention the name is written in \`UPPERCASE\`.

## Task

Type the following code:

\`\`\`solidity
uint256 public constant MAX_SUPPLY = 10000;
\`\`\`

> \`constant\` is placed between \`public\` and the variable name.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstantKeyword {
    // TODO: Declare uint256 public constant MAX_SUPPLY with value 10000
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstantKeyword {
    uint256 public constant MAX_SUPPLY = 10000;
}`,
    hints: ["The pattern is: uint256 public constant NAME = value;", "uint256 public constant MAX_SUPPLY = 10000;"],
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
    order: 9,
    difficulty: "beginner",
    description: `# Immutable

\`immutable\` is similar to \`constant\`, but **its value can be set once in the constructor**.

- \`constant\`: value must be hardcoded (e.g., \`= 10000\`)
- \`immutable\`: value can be set at deployment (e.g., \`msg.sender\`)

## Task

1. Declare \`DEPLOYER\` as \`immutable\`
2. Assign \`msg.sender\` to it in the constructor`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ImmutableKeyword {
    // TODO: Declare address public immutable DEPLOYER

    constructor() {
        // TODO: Assign msg.sender to DEPLOYER
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ImmutableKeyword {
    address public immutable DEPLOYER;

    constructor() {
        DEPLOYER = msg.sender;
    }
}`,
    hints: ["immutable goes between public and the variable name: address public immutable DEPLOYER;", "Inside the constructor: DEPLOYER = msg.sender;"],
    testDescription: "Checks that DEPLOYER() returns the deployer's address.",
    expectedFunctions: ["DEPLOYER"],
    testCases: [
      { fn: "DEPLOYER", expected: "DEPLOYER", message: "DEPLOYER() should return the deployer's address" },
    ],
  },
  {
    id: "multiple-state-vars",
    title: "Putting It Together: Multiple State Variables",
    category: "basics",
    order: 10,
    difficulty: "beginner",
    description: `# Putting It Together: Multiple State Variables

Let's combine what you've learned so far.
Declare three variables of types \`string\`, \`uint256\`, and \`bool\` in a single contract.

## Task

1. Declare \`string public name\` with the value \`"Tokamak"\`
2. Declare \`uint256 public level\` with the value \`1\`
3. Declare \`bool public isActive\` with the value \`true\`

> \`bool\` is a type that can only hold \`true\` or \`false\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultipleStateVars {
    // TODO: Declare string public name with value "Tokamak"
    // TODO: Declare uint256 public level with value 1
    // TODO: Declare bool public isActive with value true
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultipleStateVars {
    string public name = "Tokamak";
    uint256 public level = 1;
    bool public isActive = true;
}`,
    hints: ["They all follow the same pattern: type public name = value;", "bool public isActive = true;"],
    testDescription: "Checks that name, level, and isActive return the correct values.",
    expectedFunctions: ["name", "level", "isActive"],
    testCases: [
      { fn: "name", expected: "Tokamak", message: "name() should return 'Tokamak'" },
      { fn: "level", expected: "1", message: "level() should return 1" },
      { fn: "isActive", expected: "true", message: "isActive() should return true" },
    ],
  },
];
