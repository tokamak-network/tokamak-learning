import type { Problem } from "../problems";

export const variables_problems: Problem[] = [
  {
    id: "local-variables",
    title: "Local Variables",
    category: "variables",
    order: 1,
    difficulty: "beginner",
    description: `# Local Variables

Local variables only exist inside a function and are not stored on the blockchain. They disappear when the function finishes.

\`\`\`solidity
function example() public pure returns (uint) {
    uint temp = 10;    // local variable
    uint result = temp * 2;
    return result;
}
\`\`\`

## Task
Complete the calculate function using local variables. Return the sum plus the product.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function calculate(uint a, uint b) public pure returns (uint) {
        // TODO: Declare local variables sum (a+b) and product (a*b)
        // and return sum + product
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function calculate(uint a, uint b) public pure returns (uint) {
        uint sum = a + b;
        uint product = a * b;
        return sum + product;
    }
}`,
    hints: ["You can declare local variables using the uint keyword.", "Declare and assign at the same time: uint sum = a + b;"],
    testDescription: "Checks that the calculate function correctly returns the sum of two numbers' addition and multiplication.",
    expectedFunctions: ["calculate"],
    testCases: [
      { fn: "calculate", args: ["3", "4"], expected: "19", message: "calculate(3, 4) should return 19 (3+4 + 3*4 = 19)" },
      { fn: "calculate", args: ["5", "2"], expected: "17", message: "calculate(5, 2) should return 17 (5+2 + 5*2 = 17)" },
    ],
  },
  {
    id: "global-variables",
    title: "Global Variables",
    category: "variables",
    order: 2,
    difficulty: "beginner",
    description: `# Global Variables

Solidity has global variables accessible from anywhere:
- \`msg.sender\`: the address that called the function
- \`block.timestamp\`: the current block's timestamp
- \`block.number\`: the current block number

\`\`\`solidity
address caller = msg.sender;
uint time = block.timestamp;
\`\`\`

## Task
Complete the three functions that return each global variable.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GlobalVariables {
    function getSender() public view returns (address) {
        // TODO: Return the caller's address
    }

    function getTimestamp() public view returns (uint) {
        // TODO: Return the current block's timestamp
    }

    function getBlockNumber() public view returns (uint) {
        // TODO: Return the current block number
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

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }
}`,
    hints: ["msg.sender is the wallet address that called the current function.", "block.timestamp and block.number contain current block information."],
    testDescription: "Checks that getSender, getTimestamp, and getBlockNumber return the correct global variable values.",
    expectedFunctions: ["getSender", "getTimestamp", "getBlockNumber"],
    testCases: [
      { fn: "getSender", expected: "DEPLOYER", message: "getSender() should return the caller's address" },
      { fn: "getTimestamp", message: "getTimestamp() should return successfully" },
      { fn: "getBlockNumber", message: "getBlockNumber() should return successfully" },
    ],
  },
  {
    id: "msg-value-payable",
    title: "msg.value and payable",
    category: "variables",
    order: 3,
    difficulty: "beginner",
    description: `# msg.value and payable

A \`payable\` function can receive ETH. \`msg.value\` is the amount of ETH sent (in wei).

\`\`\`solidity
function deposit() public payable {
    totalDeposited += msg.value;
}
uint bal = address(this).balance; // contract balance
\`\`\`

## Task
Complete the deposit and getBalance functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MsgValuePayable {
    uint public totalDeposited;

    function deposit() public payable {
        // TODO: Add msg.value to totalDeposited
    }

    function getBalance() public view returns (uint) {
        // TODO: Return this contract's ETH balance
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MsgValuePayable {
    uint public totalDeposited;

    function deposit() public payable {
        totalDeposited += msg.value;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    hints: ["msg.value is the amount of ETH (in wei) sent with the function call.", "Use address(this).balance to check the contract's current ETH balance."],
    testDescription: "Checks that totalDeposited increases on deposit and getBalance returns the contract balance.",
    expectedFunctions: ["totalDeposited", "deposit", "getBalance"],
    testCases: [
      { fn: "totalDeposited", expected: "0", message: "Initial totalDeposited() should be 0" },
      { fn: "totalDeposited", expected: "1000", message: "totalDeposited() should be 1000 after deposit(1000 wei)", setup: [{ fn: "deposit", value: "1000" }] },
      { fn: "getBalance", expected: "500", message: "getBalance() should be 500 after deposit(500 wei)", setup: [{ fn: "deposit", value: "500" }] },
    ],
  },
  {
    id: "visibility-basics",
    title: "Visibility",
    category: "variables",
    order: 4,
    difficulty: "beginner",
    description: `# Visibility

Specify access levels for functions and variables:
- \`public\`: accessible by anyone
- \`private\`: only the current contract
- \`internal\`: current + inherited contracts
- \`external\`: callable only from outside

\`\`\`solidity
uint private secret = 42;
function getSecret() public view returns (uint) { return secret; }
\`\`\`

## Task
Fill in the correct visibility keywords to complete the code.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    // TODO: Add the private keyword to prevent direct external access
    uint secretNumber = 42;

    // TODO: Add the public keyword so anyone can call this
    function getSecret() view returns (uint) {
        return secretNumber;
    }

    // TODO: Add the internal keyword so only inherited contracts can access this
    function _helper() pure returns (uint) {
        return 1;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    uint private secretNumber = 42;

    function getSecret() public view returns (uint) {
        return secretNumber;
    }

    function _helper() internal pure returns (uint) {
        return 1;
    }
}`,
    hints: ["Private variables cannot be read directly from outside.", "Public functions can be called by anyone, and internal functions can only be called within the contract and its child contracts."],
    testDescription: "Checks that getSecret correctly returns secretNumber.",
    expectedFunctions: ["getSecret"],
    testCases: [
      { fn: "getSecret", expected: "42", message: "getSecret() should return 42" },
    ],
  },
  {
    id: "view-pure",
    title: "view and pure",
    category: "variables",
    order: 5,
    difficulty: "beginner",
    description: `# view and pure

- \`view\`: reads state but does not modify it
- \`pure\`: neither reads nor modifies state
- Neither: can modify state

\`\`\`solidity
uint public counter;
function getCounter() public view returns (uint) { return counter; }
function add(uint a, uint b) public pure returns (uint) { return a + b; }
function increment() public { counter++; }
\`\`\`

## Task
Complete the body of each of the three functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewPure {
    uint public counter;

    function getCounter() public view returns (uint) {
        // TODO: Return the counter value
    }

    function add(uint a, uint b) public pure returns (uint) {
        // TODO: Return a + b
    }

    function increment() public {
        // TODO: Increment counter by 1
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewPure {
    uint public counter;

    function getCounter() public view returns (uint) {
        return counter;
    }

    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function increment() public {
        counter++;
    }
}`,
    hints: ["A view function can read state variables but cannot modify them.", "A pure function neither reads nor modifies state variables. You can increment a value with counter++."],
    testDescription: "Checks that getCounter reads state, add does a pure calculation, and increment modifies state.",
    expectedFunctions: ["counter", "getCounter", "add", "increment"],
    testCases: [
      { fn: "getCounter", expected: "0", message: "Initial getCounter() should be 0" },
      { fn: "add", args: ["3", "7"], expected: "10", message: "add(3, 7) should return 10" },
      { fn: "getCounter", expected: "1", message: "getCounter() should be 1 after increment()", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "type-conversion",
    title: "Type Conversion",
    category: "variables",
    order: 6,
    difficulty: "beginner",
    description: `# Type Conversion

Solidity requires explicit type conversions.

\`\`\`solidity
uint256 big = 100;
uint8 small = uint8(big);        // explicit conversion
uint256 back = uint256(small);   // convert back
address payable p = payable(addr); // convert to payable
\`\`\`

## Task
Complete the three type conversion functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeConversion {
    function toUint8(uint256 x) public pure returns (uint8) {
        // TODO: Convert x to uint8 and return it
    }

    function toUint256(uint8 x) public pure returns (uint256) {
        // TODO: Convert x to uint256 and return it
    }

    function toPayable(address addr) public pure returns (address payable) {
        // TODO: Convert addr to address payable and return it
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeConversion {
    function toUint8(uint256 x) public pure returns (uint8) {
        return uint8(x);
    }

    function toUint256(uint8 x) public pure returns (uint256) {
        return uint256(x);
    }

    function toPayable(address addr) public pure returns (address payable) {
        return payable(addr);
    }
}`,
    hints: ["Use uint8(x) for explicit type conversion.", "Use payable(addr) to convert address to address payable."],
    testDescription: "Checks that toUint8, toUint256, and toPayable correctly convert types.",
    expectedFunctions: ["toUint8", "toUint256", "toPayable"],
    testCases: [
      { fn: "toUint8", args: ["200"], expected: "200", message: "toUint8(200) should return 200" },
      { fn: "toUint256", args: ["100"], expected: "100", message: "toUint256(100) should return 100" },
      { fn: "toPayable", args: ["0x1000000000000000000000000000000000000001"], message: "toPayable() should return successfully" },
    ],
  },
  {
    id: "delete-keyword",
    title: "delete Keyword",
    category: "variables",
    order: 7,
    difficulty: "beginner",
    description: `# delete Keyword

\`delete\` resets a variable to its default value. uint becomes 0, bool becomes false, address becomes address(0).

\`\`\`solidity
uint public value = 100;
function reset() public {
    delete value; // value = 0
}
\`\`\`

## Task
Use delete in the reset function to reset value and flag to their defaults.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeleteKeyword {
    uint public value = 100;
    bool public flag = true;

    function reset() public {
        // TODO: Use delete to reset value and flag to their default values
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
    hints: ["Use delete value; to reset a variable to its default.", "After delete, uint becomes 0 and bool becomes false."],
    testDescription: "Checks that value is 0 and flag is false after calling reset.",
    expectedFunctions: ["value", "flag", "reset"],
    testCases: [
      { fn: "value", expected: "100", message: "Initial value() should be 100" },
      { fn: "flag", expected: "true", message: "Initial flag() should be true" },
      { fn: "value", expected: "0", message: "value() should be 0 after reset()", setup: [{ fn: "reset" }] },
      { fn: "flag", expected: "false", message: "flag() should be false after reset()", setup: [{ fn: "reset" }] },
    ],
  },
];
