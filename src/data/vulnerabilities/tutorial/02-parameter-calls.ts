import type { VulnerabilityChallenge } from "@/types/vulnerability";

const STORAGE_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A simple storage contract to learn parameter calls
// Practice calling functions with different parameter types!

contract SimpleStorage {
    // Public variables - each has a getter function
    uint256 public favoriteNumber;
    string public favoriteColor;
    address public owner;
    
    // A simple counter
    uint256 public count;
    
    // Storage data
    mapping(address => uint256) public scores;
    address[] public players;

    constructor() {
        owner = msg.sender;
        favoriteNumber = 42;
        favoriteColor = "blue";
        count = 0;
        
        // Pre-set some scores for practice
        players.push(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        players.push(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
        players.push(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
        
        scores[players[0]] = 100;
        scores[players[1]] = 250;
        scores[players[2]] = 500;
    }

    function increment() external {
        count += 1;
    }
    
    function setFavoriteNumber(uint256 _number) external {
        favoriteNumber = _number;
    }
    
    function setFavoriteColor(string calldata _color) external {
        favoriteColor = _color;
    }
    
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }
    
    function getPlayerScore(address player) external view returns (uint256) {
        return scores[player];
    }
}`;

export const tutorialParameterCalls: VulnerabilityChallenge = {
  id: "tutorial-parameter-calls",
  title: "Tutorial 2: Parameter Calls",
  category: "access-control",
  difficulty: "beginner",

  incident: {
    name: "Tutorial Challenge",
    date: "N/A",
    references: [],
  },

  description: `# Tutorial 2: Calling Functions with Parameters

In the previous tutorial, you used **Quick Calls** for functions without parameters. Now let's learn to call functions that **require arguments**!

## Understanding Function Signatures

Look at the **Parameter Calls** section below. You'll see functions with their parameter types:

| Function | Parameter Type | What it does |
|----------|---------------|--------------|
| \`scores(address)\` | address | Get a player's score |
| \`players(uint256)\` | uint256 | Get a player address by index |
| \`setFavoriteNumber(uint256)\` | uint256 | Set the favorite number |

## How to Call with Parameters

1. **Click the function button** (e.g., \`players(uint256)\`)
2. **Enter arguments** in the "Arguments" field as a JSON array
3. **Click Execute**

## Argument Format

You MUST provide arguments as a **JSON array**:

| Parameter Type | Correct Format | Wrong Format |
|---------------|----------------|--------------|
| address | \`["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]\` | \`0xf39Fd6...\` |
| uint256 | \`["0"]\` or \`["123"]\` | \`0\` or \`123\` |
| string | \`["hello"]\` | \`hello\` |

## Practice Tasks

### Task 1: Read player scores
Call \`scores(address)\` with these addresses to see their scores:
- \`["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]\` → Score: 100
- \`["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"]\` → Score: 250
- \`["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"]\` → Score: 500

### Task 2: Get player addresses
Call \`players(uint256)\` with index \`["0"]\` to get the first player's address.

### Task 3: Set a value (optional)
Try calling \`setFavoriteNumber(uint256)\` with \`["100"]\` to change the favorite number.

## Tips

- Always use double quotes around string values in JSON
- Addresses must be quoted: \`["0x..."]\` not \`[0x...]\`
- Numbers in JSON can be unquoted: \`[100]\` or \`["100"]\` both work for uint256`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This tutorial teaches Parameter Calls
// Use the UI to call contract functions!
// No need to write exploit code here.

contract Exploit {
    constructor() {}
    
    function attack() external pure {
        // Great job! You learned how to use Parameter Calls!
    }
}`,

  hint: "Arguments must be a JSON array like [\"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\"]",

  setup: {
    contracts: [
      {
        name: "SimpleStorage",
        source: STORAGE_SOURCE,
      },
    ],
    attackerBalance: "10",
  },

  exposedFunctions: [
    // Quick Calls (no parameters)
    {
      name: "favoriteNumber",
      signature: "favoriteNumber()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "favoriteColor",
      signature: "favoriteColor()",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
    },
    {
      name: "count",
      signature: "count()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "getPlayerCount",
      signature: "getPlayerCount()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    // Parameter Calls (with parameters)
    {
      name: "scores",
      signature: "scores(address)",
      inputs: [{ name: "player", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "players",
      signature: "players(uint256)",
      inputs: [{ name: "index", type: "uint256" }],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "getPlayerScore",
      signature: "getPlayerScore(address)",
      inputs: [{ name: "player", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "setFavoriteNumber",
      signature: "setFavoriteNumber(uint256)",
      inputs: [{ name: "_number", type: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ],

  successCondition: {
    // For this tutorial, we just check that the contract is deployed
    // The goal is to learn Parameter Calls, not to exploit anything
    checkStorage: {
      address: "SimpleStorage",
      slot: "0x0000000000000000000000000000000000000000000000000000000000000000",
      // Slot 0 = favoriteNumber, initial value is 42 (0x2a)
      // We use "contains" instead of "expectedValue" so any value passes
      contains: "0x",
    },
  },
};