import type { Problem } from "../problems";

export const patterns_problems: Problem[] = [
  {
    id: "simple-storage",
    title: "Simple Storage Pattern",
    category: "patterns",
    order: 1,
    difficulty: "beginner",
    description: `# Simple Storage Pattern

## What you'll learn
How to implement the classic store-and-retrieve pattern with event logging.

This is the most common pattern in smart contracts: store a value, retrieve it, and log the change with an event. Almost every real contract uses this pattern in some form.

## Task

1. Inside \`set()\`, store the value and emit the event
2. Inside \`get()\`, return the stored data

> The event is already declared — you just need to emit it with \`emit DataStored(msg.sender, value);\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    event DataStored(address indexed user, uint value);

    uint public storedData;

    function set(uint value) public {
        // TODO: Store value in storedData
        // TODO: Emit the DataStored event (user: msg.sender, value: value)
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
      "Store the value with: storedData = value; then emit the event.",
      "The get function just needs to return the state variable.",
    ],
    testDescription: "Checks that the SimpleStorage pattern correctly stores, retrieves, and logs values.",
    expectedFunctions: ["storedData", "set", "get"],
    expectedEvents: ["DataStored"],
    testCases: [
      { fn: "get", expected: "0", message: "Initial get() should return 0" },
      { fn: "get", expected: "42", message: "get() should return 42 after set(42)", setup: [{ fn: "set", args: ["42"] }] },
      { fn: "storedData", expected: "100", message: "storedData() should be 100 after set(100)", setup: [{ fn: "set", args: ["100"] }] },
    ],
  },
  {
    id: "erc20-basic",
    title: "ERC-20 Token Basics",
    category: "patterns",
    order: 2,
    difficulty: "advanced",
    description: `# ERC-20 Token Basics

## What you'll learn
How to implement the core of an ERC-20 token — the most widely used token standard on Ethereum.

ERC-20 defines a standard interface for fungible tokens. The most important operations are minting (creating tokens) and transferring them between addresses.

## Task

1. In the constructor, mint the initial supply to the deployer (3 lines)
2. In \`transfer()\`, move tokens from sender to receiver (3 lines)

> Minting means setting \`totalSupply\` and giving all tokens to \`msg.sender\`. Transferring means subtracting from sender and adding to receiver.`,
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
        // TODO: Emit Transfer event (from: msg.sender, to: to, amount: amount)

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
      "In the constructor: set totalSupply, set balanceOf[msg.sender], then emit Transfer from address(0).",
      "In transfer: subtract from msg.sender, add to the receiver, then emit the event.",
    ],
    testDescription: "Checks that the basic ERC-20 token correctly mints and transfers tokens.",
    expectedFunctions: ["name", "symbol", "decimals", "totalSupply", "balanceOf", "transfer"],
    expectedEvents: ["Transfer"],
    testCases: [
      { fn: "name", expected: "Toka Token", message: "name() should return 'Toka Token'" },
      { fn: "symbol", expected: "TOKA", message: "symbol() should return 'TOKA'" },
      { fn: "decimals", expected: "18", message: "decimals() should return 18" },
      { fn: "totalSupply", expected: "1000000000000000000000000", message: "totalSupply() should be 1000000 * 10^18" },
      { fn: "balanceOf", args: ["DEPLOYER"], expected: "1000000000000000000000000", message: "Deployer should hold the entire initial supply" },
    ],
  },
];
