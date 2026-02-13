import type { Problem } from "../problems";

export const control_flow_problems: Problem[] = [
  {
    id: "function-modifier",
    title: "Function Modifier",
    category: "control-flow",
    order: 1,
    difficulty: "intermediate",
    description: `# Function Modifier

Learn about modifiers that check conditions before/after function execution.

## What you'll learn
- Declaring a modifier
- The meaning of \`_;\` (underscore)
- Access control patterns

## Explanation
\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _; // the original function body executes here
}

function restricted() public onlyOwner {
    // only owner can execute
}
\`\`\`

\`_;\` marks where the modified function's body is executed.

## Task
1. Complete the onlyOwner modifier's TODO
2. Apply the onlyOwner modifier to the increment function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionModifier {
    address public owner;
    uint public count = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        // TODO: Use require to check that msg.sender is the owner
        // TODO: Add _;
    }

    function increment() public /* TODO: apply onlyOwner modifier */ {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionModifier {
    address public owner;
    uint public count = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function increment() public onlyOwner {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}`,
    hints: [
      "Use require(condition, \"error message\"); to check conditions",
      "Add _; at the end of the modifier body so the original function executes",
    ],
    testDescription: "Checks that the modifier is correctly applied.",
    expectedFunctions: ["owner", "count", "increment", "getCount"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
      { fn: "getCount", expected: "0", message: "Initial getCount() should be 0" },
      { fn: "getCount", expected: "1", message: "getCount() should be 1 after increment()", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "loops",
    title: "Loops",
    category: "control-flow",
    order: 2,
    difficulty: "beginner",
    description: `# Loops

Learn about loops in Solidity.

## What you'll learn
- for and while loops
- The relationship between gas cost and loops

## Explanation
\`\`\`solidity
// for loop
uint total = 0;
for (uint i = 0; i < n; i++) {
    total += i;
}

// while loop
uint i = n;
while (i > 0) {
    result *= base;
    i--;
}
\`\`\`

⚠️ **Warning**: Infinite loops consume all gas and cause the transaction to fail!

## Task
1. sum: Use a for loop to calculate the sum from 1 to n
2. power: Use a while loop to calculate base^exp`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Loops {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        // TODO: Use a for loop to add 1 through n to total
        return total;
    }

    function power(uint base, uint exp) public pure returns (uint) {
        uint result = 1;
        uint i = exp;
        // TODO: Use a while loop to multiply result by base, i times
        return result;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Loops {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= n; i++) {
            total += i;
        }
        return total;
    }

    function power(uint base, uint exp) public pure returns (uint) {
        uint result = 1;
        uint i = exp;
        while (i > 0) {
            result *= base;
            i--;
        }
        return result;
    }
}`,
    hints: [
      "for (uint i = 1; i <= n; i++) { total += i; }",
      "while (i > 0) { result *= base; i--; }",
    ],
    testDescription: "Checks that the loops work correctly.",
    expectedFunctions: ["sum", "power"],
    testCases: [
      { fn: "sum", args: ["10"], expected: "55", message: "sum(10) should return 55" },
      { fn: "sum", args: ["0"], expected: "0", message: "sum(0) should return 0" },
      { fn: "power", args: ["2", "10"], expected: "1024", message: "power(2, 10) should return 1024" },
      { fn: "power", args: ["3", "0"], expected: "1", message: "power(3, 0) should return 1" },
    ],
  },
  {
    id: "error-handling",
    title: "Error Handling",
    category: "control-flow",
    order: 3,
    difficulty: "intermediate",
    description: `# Error Handling

Learn how to safely revert transactions.

## What you'll learn
- require, revert, assert
- Custom errors

## Explanation
\`\`\`solidity
// require: input validation
require(amount > 0, "Amount must be > 0");

// revert + custom error: saves gas
error Unauthorized(address caller);
if (msg.sender != owner) {
    revert Unauthorized(msg.sender);
}
\`\`\`

## Task
1. Declare a custom error
2. Complete the TODOs in deposit and withdraw functions`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: Declare a custom error: error Unauthorized(address caller);

contract ErrorHandling {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        // TODO: Use require to check msg.value > 0 (message: "Must send ETH")
    }

    function withdraw(uint amount) public {
        // TODO: If msg.sender is not owner, revert with the Unauthorized custom error
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error Unauthorized(address caller);

contract ErrorHandling {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Must send ETH");
    }

    function withdraw(uint amount) public {
        if (msg.sender != owner) {
            revert Unauthorized(msg.sender);
        }
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    hints: [
      "Declare custom errors at the top, outside the contract: error Unauthorized(address caller);",
      "Use revert Unauthorized(msg.sender); to trigger a custom error",
    ],
    testDescription: "Checks that error handling is correctly implemented.",
    expectedFunctions: ["owner", "deposit", "withdraw", "getBalance"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
      { fn: "deposit", value: "1000", message: "deposit() should accept ETH" },
      { fn: "deposit", expectRevert: true, message: "deposit() should revert when sending 0 wei" },
      { fn: "getBalance", expected: "1000", message: "getBalance() should be 1000 after deposit(1000)", setup: [{ fn: "deposit", value: "1000" }] },
    ],
  },
];
