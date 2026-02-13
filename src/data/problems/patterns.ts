import type { Problem } from "../problems";

export const patterns_problems: Problem[] = [
  {
    id: "simple-storage",
    title: "Simple Storage",
    category: "patterns",
    order: 1,
    difficulty: "beginner",
    description: `# Simple Storage Pattern

Let's implement the most basic smart contract pattern.

## What you'll learn
- Store and retrieve pattern
- Event logging

## Task
1. Declare an event
2. Store value + emit event in the set function
3. Return value in the get function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    // TODO: Declare event DataStored(address indexed user, uint value)

    uint public storedData;

    function set(uint value) public {
        // TODO: Store value in storedData
        // TODO: Emit the DataStored event (user: msg.sender)
    }

    function get() public view returns (uint) {
        // TODO: Return storedData
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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
      "event DataStored(address indexed user, uint value);",
      "emit DataStored(msg.sender, value);",
    ],
    testDescription: "Checks that the SimpleStorage pattern is correctly implemented.",
    expectedFunctions: ["storedData", "set", "get"],
    expectedEvents: ["DataStored"],
    testCases: [
      { fn: "get", expected: "0", message: "Initial get() should be 0" },
      { fn: "get", expected: "42", message: "get() should return 42 after set(42)", setup: [{ fn: "set", args: ["42"] }] },
      { fn: "storedData", expected: "100", message: "storedData() should be 100 after set(100)", setup: [{ fn: "set", args: ["100"] }] },
    ],
  },
  {
    id: "erc20-basic",
    title: "ERC-20 Basics",
    category: "patterns",
    order: 2,
    difficulty: "advanced",
    description: `# ERC-20 Token Basics

Let's implement the basics of ERC-20, the most widely used token standard on Ethereum.

## What you'll learn
- Understanding the ERC-20 standard
- Minting tokens
- Transferring tokens

## Explanation
ERC-20 is the standard for fungible tokens.
Core functions: totalSupply, balanceOf, transfer

## Task
1. Write the initial token minting logic in the constructor
2. Complete the transfer logic in the transfer function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10**18;
        // TODO: Set totalSupply to initialSupply
        // TODO: Set balanceOf[msg.sender] to initialSupply
        // TODO: Emit Transfer event (from: address(0), to: msg.sender, amount: initialSupply)
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        // TODO: Subtract amount from sender's balance
        // TODO: Add amount to receiver's balance
        // TODO: Emit Transfer event (from: msg.sender)

        return true;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10**18;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
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
      "Constructor: totalSupply = initialSupply; balanceOf[msg.sender] = initialSupply;",
      "Transfer: balanceOf[msg.sender] -= amount; balanceOf[to] += amount;",
    ],
    testDescription: "Checks that the basic ERC-20 implementation is correct.",
    expectedFunctions: [
      "name",
      "symbol",
      "decimals",
      "totalSupply",
      "balanceOf",
      "transfer",
    ],
    expectedEvents: ["Transfer"],
    testCases: [
      { fn: "name", expected: "Toka Token", message: "name() should return 'Toka Token'" },
      { fn: "symbol", expected: "TOKA", message: "symbol() should return 'TOKA'" },
      { fn: "decimals", expected: "18", message: "decimals() should return 18" },
      { fn: "totalSupply", expected: "1000000000000000000000000", message: "totalSupply() should be 1000000 * 10^18" },
      { fn: "balanceOf", args: ["DEPLOYER"], expected: "1000000000000000000000000", message: "Deployer's balanceOf should equal total supply" },
    ],
  },
];
