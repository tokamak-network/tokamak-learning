import type { Problem } from "../problems";

export const patterns_problems: Problem[] = [
  {
    id: "simple-storage-pattern",
    title: "Simple Storage Pattern",
    category: "patterns",
    order: 1,
    difficulty: "intermediate",
    description: `# Simple Storage Pattern

## What you'll learn
The most fundamental smart contract pattern: store, retrieve, and log.

Almost every real contract follows this pattern: store a value in state, provide a function to retrieve it, and emit an event when the value changes.

## Task

1. In \`set\`, store the value in \`storedData\` and emit the \`DataStored\` event
2. In \`get\`, return \`storedData\`

> This pattern is the building block for more complex contracts.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SimpleStorage {
    event DataStored(address indexed user, uint value);

    uint public storedData;

    function set(uint value) public {
        // TODO: Store value in storedData
        // TODO: Emit DataStored event with msg.sender and value
    }

    function get() public view returns (uint) {
        // TODO: Return storedData
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SimpleStorage {
    event DataStored(address indexed user, uint value);

    uint public storedData;

    function set(uint value) public {
        storedData = value;
        emit DataStored(msg.sender, value);
    }

    function get() public view returns (uint) {
        return storedData;
    }
}`,
    hints: [
      "Store: storedData = value; then emit the event.",
      "The get function just returns the state variable.",
    ],
    testDescription: "Checks that SimpleStorage correctly stores, retrieves, and logs values.",
    expectedFunctions: ["storedData", "set", "get"],
    expectedEvents: ["DataStored"],
    testCases: [
      { fn: "get", expected: "0", message: "Initial get() should return 0" },
      { fn: "get", expected: "42", message: "get() should return 42 after set(42)", setup: [{ fn: "set", args: ["42"] }] },
    ],
  },
  {
    id: "ownership-pattern",
    title: "Ownership Pattern",
    category: "patterns",
    order: 2,
    difficulty: "intermediate",
    description: `# Ownership Pattern

## What you'll learn
How to implement transferable ownership — the most common access control pattern.

Most contracts have an owner who can perform special actions. The ownership pattern includes:
1. Setting the initial owner in the constructor
2. A modifier to restrict access
3. A function to transfer ownership

## Task

1. In \`transferOwnership\`, set \`owner\` to the new address and emit the event

> The \`onlyOwner\` modifier is already applied — only the current owner can transfer ownership.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        // TODO: Emit OwnershipTransferred with the old and new owner
        // TODO: Set owner to newOwner
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}`,
    hints: [
      "Emit the event before changing owner, so you can pass the old owner.",
      "emit OwnershipTransferred(owner, newOwner); then owner = newOwner;",
    ],
    testDescription: "Checks that ownership can be transferred and the event is emitted.",
    expectedFunctions: ["owner", "transferOwnership"],
    expectedEvents: ["OwnershipTransferred"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
    ],
  },
  {
    id: "fix-missing-event",
    title: "Fix: Missing Event Declaration",
    category: "patterns",
    order: 3,
    difficulty: "intermediate",
    description: `# Fix: Missing Event Declaration

## What you'll learn
That events must be declared before they can be emitted.

The code below tries to emit a \`Transfer\` event, but the event was never declared in the contract. This causes a compile error.

## Task

1. **First, compile the code as-is** to see the error message
2. Add the missing event declaration at the top of the contract

> Event declarations follow the pattern: \`event Name(type param1, type param2);\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TokenLedger {
    // This code has an error. Try compiling first!
    // TODO: Declare the missing Transfer event

    mapping(address => uint) public balances;

    function record(address to, uint amount) public {
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TokenLedger {
    event Transfer(address from, address to, uint amount);

    mapping(address => uint) public balances;

    function record(address to, uint amount) public {
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
}`,
    hints: [
      "The emit line tells you the event signature: Transfer(address, address, uint).",
      "Add: event Transfer(address from, address to, uint amount);",
    ],
    testDescription: "Checks that the Transfer event is declared and record() works correctly.",
    expectedEvents: ["Transfer"],
    expectedFunctions: ["balances", "record"],
    testCases: [
      { fn: "balances", args: ["0x1000000000000000000000000000000000000001"], expected: "100", message: "balances should be 100 after record(100)", setup: [{ fn: "record", args: ["0x1000000000000000000000000000000000000001", "100"] }] },
    ],
  },
  {
    id: "withdrawal-pattern",
    title: "Withdrawal Pattern",
    category: "patterns",
    order: 4,
    difficulty: "advanced",
    description: `# Withdrawal Pattern

## What you'll learn
The "pull over push" pattern — the safest way to handle ETH transfers.

Instead of sending ETH to users directly (push), let users withdraw their own ETH (pull). This prevents reentrancy attacks and failed transfers from blocking your contract.

\`\`\`solidity
// Users call withdraw() to pull their own funds
function withdraw() public {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;           // update state FIRST
    payable(msg.sender).transfer(amount); // then send ETH
}
\`\`\`

## Task

1. In \`withdraw\`, set the sender's balance to 0, then transfer the ETH

> Always update state before making external calls — this is the "checks-effects-interactions" pattern.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract WithdrawalPattern {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        // TODO: Set balances[msg.sender] to 0 (update state FIRST!)
        // TODO: Transfer the amount to msg.sender using payable(msg.sender).transfer(amount)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract WithdrawalPattern {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}`,
    hints: [
      "Update state first: balances[msg.sender] = 0;",
      "Then send ETH: payable(msg.sender).transfer(amount);",
    ],
    testDescription: "Checks that deposit stores ETH and withdraw sends it back safely.",
    expectedFunctions: ["balances", "deposit", "withdraw"],
    testCases: [
      { fn: "balances", args: ["DEPLOYER"], expected: "0", message: "Initial balance should be 0" },
    ],
  },
  {
    id: "simple-token-mint",
    title: "Simple Token: Mint",
    category: "patterns",
    order: 5,
    difficulty: "advanced",
    description: `# Simple Token: Mint

## What you'll learn
How to create a basic token by minting an initial supply.

The simplest token pattern: set a total supply in the constructor and give all tokens to the deployer. This is the foundation of every ERC-20 token.

## Task

1. In the constructor, set \`totalSupply\` to \`initialSupply\`
2. Set \`balanceOf[msg.sender]\` to \`initialSupply\`
3. Emit the \`Transfer\` event from \`address(0)\` to \`msg.sender\`

> Minting tokens from \`address(0)\` is the standard convention — it means "newly created tokens."`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10 ** 18;
        // TODO: Set totalSupply to initialSupply
        // TODO: Set balanceOf[msg.sender] to initialSupply
        // TODO: Emit Transfer from address(0) to msg.sender for initialSupply
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10 ** 18;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }
}`,
    hints: [
      "Set values: totalSupply = initialSupply; balanceOf[msg.sender] = initialSupply;",
      "Mint event: emit Transfer(address(0), msg.sender, initialSupply);",
    ],
    testDescription: "Checks that the token mints the initial supply to the deployer.",
    expectedFunctions: ["name", "symbol", "decimals", "totalSupply", "balanceOf"],
    expectedEvents: ["Transfer"],
    testCases: [
      { fn: "name", expected: "Toka Token", message: "name() should return 'Toka Token'" },
      { fn: "symbol", expected: "TOKA", message: "symbol() should return 'TOKA'" },
      { fn: "totalSupply", expected: "1000000000000000000000000", message: "totalSupply() should be 1000000 * 10^18" },
      { fn: "balanceOf", args: ["DEPLOYER"], expected: "1000000000000000000000000", message: "Deployer should hold the entire initial supply" },
    ],
  },
  {
    id: "token-transfer",
    title: "Simple Token: Transfer",
    category: "patterns",
    order: 6,
    difficulty: "advanced",
    description: `# Simple Token: Transfer

## What you'll learn
How to implement token transfers — moving tokens between addresses.

The transfer function is the core of any token. It subtracts from the sender and adds to the receiver, with safety checks:

\`\`\`solidity
require(balanceOf[msg.sender] >= amount, "Insufficient balance");
balanceOf[msg.sender] -= amount;
balanceOf[to] += amount;
\`\`\`

## Task

1. In \`transfer\`, subtract \`amount\` from the sender's balance
2. Add \`amount\` to the receiver's balance
3. Emit the \`Transfer\` event

> The \`require\` checks are already provided — you just need the balance updates and event.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TransferableToken {
    string public name = "Toka Token";
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        totalSupply = 1000000 * 10 ** 18;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        // TODO: Subtract amount from sender's balance
        // TODO: Add amount to receiver's balance
        // TODO: Emit Transfer event from msg.sender to 'to' for amount

        return true;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract TransferableToken {
    string public name = "Toka Token";
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        totalSupply = 1000000 * 10 ** 18;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);

        return true;
    }
}`,
    hints: [
      "Subtract: balanceOf[msg.sender] -= amount; Add: balanceOf[to] += amount;",
      "Then emit: emit Transfer(msg.sender, to, amount);",
    ],
    testDescription: "Checks that transfer moves tokens between addresses correctly.",
    expectedFunctions: ["name", "totalSupply", "balanceOf", "transfer"],
    expectedEvents: ["Transfer"],
    testCases: [
      { fn: "balanceOf", args: ["DEPLOYER"], expected: "1000000000000000000000000", message: "Deployer should hold the initial supply" },
    ],
  },
];
