import type { Problem } from "../problems";

export const basic_types_problems: Problem[] = [
  {
    id: "bool-type",
    title: "bool Type",
    category: "basic-types",
    order: 1,
    difficulty: "beginner",
    description: `# bool Type

\`bool\` stores \`true\` or \`false\` values. It's used for conditionals, flags, and more.

\`\`\`solidity
bool public isOpen = true;
bool public isClosed = false;
isOpen = !isOpen; // true → false
\`\`\`

## Task
Declare \`isActive\` as \`true\`, \`isPaused\` as \`false\`, and write a \`toggle()\` function that flips \`isActive\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    // TODO: Declare bool public isActive with value true
    // TODO: Declare bool public isPaused with value false

    function toggle() public {
        // TODO: Flip isActive (use the ! operator)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    bool public isActive = true;
    bool public isPaused = false;

    function toggle() public {
        isActive = !isActive;
    }
}`,
    hints: ["bool variables are initialized with true or false", "The ! operator flips a bool value: !true → false"],
    testDescription: "Tests that isActive is true, isPaused is false, and toggle() flips isActive.",
    expectedFunctions: ["isActive", "isPaused", "toggle"],
    testCases: [
      { fn: "isActive", expected: "true", message: "Initial isActive() should be true" },
      { fn: "isPaused", expected: "false", message: "Initial isPaused() should be false" },
      { fn: "isActive", expected: "false", message: "After toggle(), isActive() should be false", setup: [{ fn: "toggle" }] },
    ],
  },
  {
    id: "address-type",
    title: "address Type",
    category: "basic-types",
    order: 2,
    difficulty: "beginner",
    description: `# address Type

\`address\` stores a 20-byte Ethereum address. \`msg.sender\` is the address that called the function.

\`\`\`solidity
address public owner;
constructor() {
    owner = msg.sender;
}
\`\`\`

## Task
Set \`owner\` to \`msg.sender\` in the constructor, and write a \`getOwner()\` view function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    address public owner;

    constructor() {
        // TODO: Set owner to msg.sender
    }

    // TODO: Write a getOwner() public view function (returns owner)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}`,
    hints: ["In the constructor: owner = msg.sender; stores the deployer's address", "A view function reads state but does not modify it"],
    testDescription: "Tests that owner is set to the deployer's address and getOwner() returns the same.",
    expectedFunctions: ["owner", "getOwner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
      { fn: "getOwner", expected: "DEPLOYER", message: "getOwner() should return the deployer's address" },
    ],
  },
  {
    id: "address-payable",
    title: "address payable",
    category: "basic-types",
    order: 3,
    difficulty: "beginner",
    description: `# address payable

\`address payable\` is an address that can receive ETH. It supports \`.transfer()\` and \`.send()\`.

\`\`\`solidity
address payable public wallet = payable(msg.sender);
uint256 bal = address(this).balance;
\`\`\`

## Task
Set \`recipient\` to \`payable(msg.sender)\` in the constructor, and write a \`getBalance()\` function that returns the contract's balance.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayable {
    address payable public recipient;

    constructor() {
        // TODO: Set recipient to payable(msg.sender)
    }

    // TODO: Write a getBalance() public view function (returns address(this).balance)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayable {
    address payable public recipient;

    constructor() {
        recipient = payable(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}`,
    hints: ["payable() converts a regular address to address payable", "address(this).balance is the contract's current ETH balance"],
    testDescription: "Tests that recipient is set to the deployer's payable address and getBalance() returns the contract balance.",
    expectedFunctions: ["recipient", "getBalance"],
    testCases: [
      { fn: "recipient", expected: "DEPLOYER", message: "recipient() should return the deployer's address" },
      { fn: "getBalance", expected: "0", message: "Initial getBalance() should be 0" },
    ],
  },
  {
    id: "bytes1-type",
    title: "bytes1 Fixed Bytes",
    category: "basic-types",
    order: 4,
    difficulty: "beginner",
    description: `# bytes1 Fixed Bytes

\`bytes1\` stores exactly 1 byte (0x00~0xff). There are also \`bytes2\`, \`bytes3\` ... up to \`bytes32\`.

\`\`\`solidity
bytes1 public a = 0x41; // ASCII 'A'
bytes2 public b = 0xffff;
\`\`\`

## Task
Declare \`initial\` as \`0x41\` and \`flag\` as \`0xffff\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes1Type {
    // TODO: Declare bytes1 public initial with value 0x41
    // TODO: Declare bytes2 public flag with value 0xffff
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes1Type {
    bytes1 public initial = 0x41;
    bytes2 public flag = 0xffff;
}`,
    hints: ["bytes1 stores 1 byte, bytes2 stores 2 bytes", "0x41 corresponds to ASCII character 'A'"],
    testDescription: "Tests that initial is 0x41 and flag is 0xffff.",
    expectedFunctions: ["initial", "flag"],
    testCases: [
      { fn: "initial", expected: "0x41", message: "initial() should return 0x41" },
      { fn: "flag", expected: "0xffff", message: "flag() should return 0xffff" },
    ],
  },
  {
    id: "bytes32-type",
    title: "bytes32 Fixed Bytes",
    category: "basic-types",
    order: 5,
    difficulty: "beginner",
    description: `# bytes32 Fixed Bytes

\`bytes32\` is commonly used for storing hashes and identifiers. It stores 32 bytes (256 bits).

\`\`\`solidity
bytes32 public myHash;
myHash = keccak256("hello");
\`\`\`

## Task
Declare \`bytes32 public hash\` and write a \`setHash(bytes32 _hash)\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes32Type {
    // TODO: Declare bytes32 public hash

    // TODO: Write a setHash(bytes32 _hash) public function
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes32Type {
    bytes32 public hash;

    function setHash(bytes32 _hash) public {
        hash = _hash;
    }
}`,
    hints: ["bytes32 declared without an initial value defaults to 0x0...0", "The function receives bytes32 _hash as a parameter and stores it in the state variable"],
    testDescription: "Tests that hash is declared and setHash() can set its value.",
    expectedFunctions: ["hash", "setHash"],
    testCases: [
      { fn: "hash", expected: "0x0000000000000000000000000000000000000000000000000000000000000000", message: "Initial hash() should be 0x0...0" },
      { fn: "hash", expected: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", message: "After setHash(), hash() should return the set value", setup: [{ fn: "setHash", args: ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"] }] },
    ],
  },
  {
    id: "bytes-dynamic",
    title: "bytes Dynamic Bytes",
    category: "basic-types",
    order: 6,
    difficulty: "beginner",
    description: `# bytes Dynamic Bytes

\`bytes\` is a dynamic-length byte array. It is more gas-efficient than \`byte[]\`.

\`\`\`solidity
bytes public data;
data = hex"cafebabe";
uint256 len = data.length;
\`\`\`

## Task
Write the \`data\` variable, a \`setData()\` function, and a \`getLength()\` function that returns \`data.length\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BytesDynamic {
    // TODO: Declare bytes public data

    // TODO: Write a setData(bytes calldata _data) public function

    // TODO: Write a getLength() public view function (returns data.length)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BytesDynamic {
    bytes public data;

    function setData(bytes calldata _data) public {
        data = _data;
    }

    function getLength() public view returns (uint256) {
        return data.length;
    }
}`,
    hints: ["calldata is a read-only data location for external function parameters", "data.length gives the length of the byte array"],
    testDescription: "Tests that getLength() returns the correct length after setting data.",
    expectedFunctions: ["data", "setData", "getLength"],
    testCases: [
      { fn: "getLength", expected: "0", message: "Initial getLength() should be 0" },
      { fn: "getLength", expected: "4", message: "After setData(), getLength() should return the correct length", setup: [{ fn: "setData", args: ["0xcafebabe"] }] },
    ],
  },
  {
    id: "string-type",
    title: "string Type",
    category: "basic-types",
    order: 7,
    difficulty: "beginner",
    description: `# string Type

\`string\` is UTF-8 encoded text. Unlike other languages, you cannot directly use indexing or \`.length\`.

\`\`\`solidity
string public name = "Solidity";
name = "New Value";
\`\`\`

## Task
Initialize \`message\` to \`"Hello"\` and write a \`setMessage()\` function.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringType {
    // TODO: Declare string public message with value "Hello"

    // TODO: Write a setMessage(string calldata _msg) public function
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringType {
    string public message = "Hello";

    function setMessage(string calldata _msg) public {
        message = _msg;
    }
}`,
    hints: ["Strings are initialized with double quotes", "calldata is a read-only reference to externally passed data"],
    testDescription: "Tests that message is initialized to 'Hello' and can be changed via setMessage().",
    expectedFunctions: ["message", "setMessage"],
    testCases: [
      { fn: "message", expected: "Hello", message: "Initial message() should be 'Hello'" },
      { fn: "message", expected: "World", message: "After setMessage('World'), message() should be 'World'", setup: [{ fn: "setMessage", args: ["World"] }] },
    ],
  },
  {
    id: "enum-type",
    title: "Enum",
    category: "basic-types",
    order: 8,
    difficulty: "beginner",
    description: `# Enum

\`enum\` is a custom type with a fixed set of choices. Internally it's stored as a \`uint\`.

\`\`\`solidity
enum Color { Red, Green, Blue }
Color public selected = Color.Red;
selected = Color.Blue;
\`\`\`

## Task
Fill in the enum values, and write the bodies of \`ship()\` and \`deliver()\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    // TODO: Fill in the values: None, Pending, Shipped, Delivered, Cancelled
    enum OrderStatus { }

    OrderStatus public status;

    function ship() public {
        // TODO: Set status to OrderStatus.Shipped
    }

    function deliver() public {
        // TODO: Set status to OrderStatus.Delivered
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    enum OrderStatus { None, Pending, Shipped, Delivered, Cancelled }

    OrderStatus public status;

    function ship() public {
        status = OrderStatus.Shipped;
    }

    function deliver() public {
        status = OrderStatus.Delivered;
    }
}`,
    hints: ["Enum values are listed separated by commas", "Reference an enum value as: EnumName.Value"],
    testDescription: "Tests that the enum is correctly defined and ship()/deliver() change the status.",
    expectedFunctions: ["status", "ship", "deliver"],
    testCases: [
      { fn: "status", expected: "0", message: "Initial status() should be 0 (None)" },
      { fn: "status", expected: "2", message: "After ship(), status() should be 2 (Shipped)", setup: [{ fn: "ship" }] },
      { fn: "status", expected: "3", message: "After deliver(), status() should be 3 (Delivered)", setup: [{ fn: "deliver" }] },
    ],
  },
];
