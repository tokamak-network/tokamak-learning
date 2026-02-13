import type { Problem } from "../problems";

export const basic_types_problems: Problem[] = [
  {
    id: "bool-type",
    title: "Declare a Bool",
    category: "basic-types",
    order: 1,
    difficulty: "beginner",
    description: `# Declare a Bool

## What you'll learn
How to use the \`bool\` type for true/false values.

\`bool\` stores either \`true\` or \`false\`. It's useful for flags, switches, and conditions — like an on/off button.

## Task

Type the following code inside the contract:

\`\`\`solidity
bool public isActive = true;
\`\`\`

> Bool values are written in lowercase: \`true\` or \`false\` (no quotes).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    // TODO: Declare bool public isActive with value true
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    bool public isActive = true;
}`,
    hints: [
      "The pattern is the same as uint/string: type public name = value;",
      "Bool values don't use quotes — just true or false.",
    ],
    testDescription: "Checks that isActive() returns true.",
    expectedFunctions: ["isActive"],
    testCases: [
      { fn: "isActive", expected: "true", message: "isActive() should return true" },
    ],
  },
  {
    id: "bool-toggle",
    title: "Toggle a Bool",
    category: "basic-types",
    order: 2,
    difficulty: "beginner",
    description: `# Toggle a Bool

## What you'll learn
How to flip a bool value using the \`!\` (NOT) operator.

The \`!\` operator flips a bool: \`!true\` becomes \`false\`, and \`!false\` becomes \`true\`.

## Task

Inside the \`toggle()\` function, flip the value of \`isActive\`:

\`\`\`solidity
isActive = !isActive;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolToggle {
    bool public isActive = true;

    function toggle() public {
        // TODO: Flip isActive using the ! operator
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolToggle {
    bool public isActive = true;

    function toggle() public {
        isActive = !isActive;
    }
}`,
    hints: [
      "The ! operator flips a bool: !true becomes false.",
      "Assign the flipped value back to the same variable.",
    ],
    testDescription: "Checks that toggle() flips isActive from true to false.",
    expectedFunctions: ["isActive", "toggle"],
    testCases: [
      { fn: "isActive", expected: "true", message: "Initial isActive() should be true" },
      { fn: "isActive", expected: "false", message: "After toggle(), isActive() should be false", setup: [{ fn: "toggle" }] },
    ],
  },
  {
    id: "address-type",
    title: "The address Type",
    category: "basic-types",
    order: 3,
    difficulty: "beginner",
    description: `# The address Type

## What you'll learn
How to use the \`address\` type to store Ethereum addresses.

An \`address\` is a 20-byte value that represents an Ethereum account. Every wallet and every contract has one.

## Task

1. Declare \`address public owner\`
2. In the constructor, set \`owner\` to \`msg.sender\`

> You used \`msg.sender\` in the basics. Here the focus is on \`address\` as a data type.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    // TODO: Declare address public owner

    constructor() {
        // TODO: Set owner to msg.sender
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}`,
    hints: [
      "Declare address variables with: address public variableName;",
      "In the constructor, assign using = just like you did in the basics.",
    ],
    testDescription: "Checks that owner() returns the deployer's address.",
    expectedFunctions: ["owner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
    ],
  },
  {
    id: "fixed-bytes",
    title: "Fixed-Size Bytes",
    category: "basic-types",
    order: 4,
    difficulty: "beginner",
    description: `# Fixed-Size Bytes

## What you'll learn
How to use \`bytes1\`, \`bytes2\`, and other fixed-size byte types.

Solidity has fixed-size byte types from \`bytes1\` to \`bytes32\`. They store raw binary data of a specific size. Values are written in hexadecimal (starting with \`0x\`).

## Task

1. Declare \`bytes1 public initial\` with value \`0x41\` (the letter "A" in ASCII)
2. Declare \`bytes2 public flag\` with value \`0xffff\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FixedBytes {
    // TODO: Declare bytes1 public initial with value 0x41
    // TODO: Declare bytes2 public flag with value 0xffff
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FixedBytes {
    bytes1 public initial = 0x41;
    bytes2 public flag = 0xffff;
}`,
    hints: [
      "The pattern is: bytesN public name = 0xHEX;",
      "bytes1 stores 1 byte, bytes2 stores 2 bytes.",
    ],
    testDescription: "Checks that initial() returns 0x41 and flag() returns 0xffff.",
    expectedFunctions: ["initial", "flag"],
    testCases: [
      { fn: "initial", expected: "0x41", message: "initial() should return 0x41" },
      { fn: "flag", expected: "0xffff", message: "flag() should return 0xffff" },
    ],
  },
  {
    id: "number-to-string-fix",
    title: "Fix: Number Assigned to String",
    category: "basic-types",
    order: 5,
    difficulty: "beginner",
    description: `# Fix: Number Assigned to String

## What you'll learn
That you cannot assign a number directly to a \`string\` variable.

A \`string\` variable can only hold text in double quotes. Assigning a bare number like \`100\` causes a type error.

## Task

1. **First, compile it as-is** to see the error message
2. Fix the code so it compiles correctly

> Think about what type is appropriate for the number \`100\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NumberStringFix {
    // This code has an error. Try compiling first!
    string public score = 100;
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NumberStringFix {
    uint256 public score = 100;
}`,
    hints: [
      "100 is a number, not text. Which type stores numbers?",
      "You only need to change the type keyword.",
    ],
    testDescription: "Checks that score() returns 100 after fixing the type.",
    expectedFunctions: ["score"],
    testCases: [
      { fn: "score", expected: "100", message: "score() should return 100" },
    ],
  },
  {
    id: "string-update",
    title: "Update a String",
    category: "basic-types",
    order: 6,
    difficulty: "beginner",
    description: `# Update a String

## What you'll learn
How to change a string state variable through a function.

In the basics, you declared a string with an initial value. Now let's write a function that changes it. String parameters need the \`memory\` keyword to tell Solidity where to temporarily store the data.

## Task

Inside the \`setMessage()\` function, update \`message\` to the new value:

\`\`\`solidity
message = _newMessage;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringUpdate {
    string public message = "Hello";

    function setMessage(string memory _newMessage) public {
        // TODO: Set message to _newMessage
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringUpdate {
    string public message = "Hello";

    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }
}`,
    hints: [
      "Assign the parameter to the state variable using =.",
      "The function parameter _newMessage holds the new text.",
    ],
    testDescription: "Checks that message starts as 'Hello' and changes after calling setMessage().",
    expectedFunctions: ["message", "setMessage"],
    testCases: [
      { fn: "message", expected: "Hello", message: "Initial message() should return 'Hello'" },
      { fn: "message", expected: "World", message: "After setMessage('World'), message() should return 'World'", setup: [{ fn: "setMessage", args: ["World"] }] },
    ],
  },
  {
    id: "dynamic-bytes",
    title: "Dynamic Bytes",
    category: "basic-types",
    order: 7,
    difficulty: "intermediate",
    description: `# Dynamic Bytes

## What you'll learn
How to use \`bytes\` for variable-length binary data.

Unlike \`bytes1\`\u2013\`bytes32\` (fixed size), \`bytes\` is a dynamic-length byte array. It can grow or shrink and has a \`.length\` property.

## Task

1. Declare \`bytes public data\`
2. Inside \`getLength()\`, return the length of \`data\`

> \`data.length\` returns the number of bytes stored.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DynamicBytes {
    // TODO: Declare bytes public data

    function setData(bytes memory _data) public {
        data = _data;
    }

    function getLength() public view returns (uint256) {
        // TODO: Return data.length
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DynamicBytes {
    bytes public data;

    function setData(bytes memory _data) public {
        data = _data;
    }

    function getLength() public view returns (uint256) {
        return data.length;
    }
}`,
    hints: [
      "Declare with just: bytes public data; (no initial value needed).",
      "Use .length to get the size of a bytes array.",
    ],
    testDescription: "Checks that data is declared and getLength() returns the correct byte count.",
    expectedFunctions: ["data", "setData", "getLength"],
    testCases: [
      { fn: "getLength", expected: "0", message: "Initial getLength() should return 0" },
      { fn: "getLength", expected: "4", message: "After setData(0xcafebabe), getLength() should return 4", setup: [{ fn: "setData", args: ["0xcafebabe"] }] },
    ],
  },
  {
    id: "enum-type",
    title: "Enum",
    category: "basic-types",
    order: 8,
    difficulty: "intermediate",
    description: `# Enum

## What you'll learn
How to define and use an \`enum\` for a fixed set of choices.

An \`enum\` creates a custom type with named values. Internally, each value is stored as a number starting from 0.

\`\`\`
enum Color { Red, Green, Blue }
// Red = 0, Green = 1, Blue = 2
\`\`\`

## Task

1. Fill in the enum values: \`None, Pending, Shipped, Delivered\`
2. Inside \`ship()\`, set status to \`OrderStatus.Shipped\`

> Access enum values with: \`EnumName.Value\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    // TODO: Fill in the values: None, Pending, Shipped, Delivered
    enum OrderStatus { }

    OrderStatus public status;

    function ship() public {
        // TODO: Set status to OrderStatus.Shipped
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    enum OrderStatus { None, Pending, Shipped, Delivered }

    OrderStatus public status;

    function ship() public {
        status = OrderStatus.Shipped;
    }
}`,
    hints: [
      "List enum values separated by commas inside the braces.",
      "Set an enum variable using: variable = EnumName.Value;",
    ],
    testDescription: "Checks that the enum is defined and ship() changes status to Shipped (2).",
    expectedFunctions: ["status", "ship"],
    testCases: [
      { fn: "status", expected: "0", message: "Initial status() should be 0 (None)" },
      { fn: "status", expected: "2", message: "After ship(), status() should be 2 (Shipped)", setup: [{ fn: "ship" }] },
    ],
  },
];
