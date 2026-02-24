import type { VulnerabilityChallenge } from "@/types/vulnerability";

const VAULT_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A vault contract to learn parameter calls
// Each user has a balance stored in a mapping

contract SimpleVault {
    mapping(address => uint256) public balances;
    address[] public users;
    uint256 public totalUsers;

    constructor() {
        // Pre-populate with some users
        users.push(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266); // Default deployer
        users.push(0x70997970C51812dc3A010C7d01b50e0d17dc79C8); // Test user 1
        users.push(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC); // Test user 2
        totalUsers = 3;

        balances[users[0]] = 100;
        balances[users[1]] = 200;
        balances[users[2]] = 300;
    }

    function deposit() external payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function getUser(uint256 index) external view returns (address) {
        require(index < users.length, "Index out of bounds");
        return users[index];
    }

    function getAllUsers() external view returns (address[] memory) {
        return users;
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

In the previous tutorial, you used Quick Calls for functions without parameters. Now let's learn **Parameter Calls**!

## What are Parameter Calls?

Some functions require input values (parameters). For example:
- \`balances(address)\` needs an address to look up
- \`getUser(uint256)\` needs an index number

## The Parameter Calls Section

Below the Quick Calls, you'll see a "Parameter Calls" section showing:
\`\`\`
balances(address) → uint256
getUser(uint256) → address
\`\`\`

## How to Use

1. **Click on a parameter function**
   - The function name is auto-filled in the "Function Name" field

2. **Enter arguments in JSON array format**
   - Single argument: \`["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]\`
   - Multiple arguments: \`["arg1", "arg2", 123]\`

3. **Click Execute**

## Your Tasks

1. **Check balance of user 0**
   - Click \`getUser(uint256)\` in Parameter Calls
   - Enter arguments: \`["0"]\`
   - Click Execute → This returns an address
   - Copy that address

2. **Check that user's balance**
   - Click \`balances(address)\` in Parameter Calls
   - Enter arguments: \`["<copied_address>"]\`
   - Click Execute → Should show 100

3. **Try \`getUserBalance(address)\` shortcut**
   - This combines the above two steps
   - Use the same address

## Argument Format Reference

| Type | Example |
|------|---------|
| address | \`["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]\` |
| uint256 | \`["0"]\` or \`["123"]\` |
| string | \`["Hello World"]\` |
| Multiple | \`["address", 123]\` |`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exploit {
    constructor() {}
    
    // This tutorial focuses on Parameter Calls - no attack needed
    function attack() external pure {
        // Great job! Now you know how to use Parameter Calls!
    }
}`,

  hint: "Click a parameter function, then enter arguments as a JSON array like [\"value\"]",

  setup: {
    contracts: [
      {
        name: "SimpleVault",
        source: VAULT_SOURCE,
      },
    ],
    attackerBalance: "10",
  },

  exposedFunctions: [
    {
      name: "totalUsers",
      signature: "totalUsers()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "getAllUsers",
      signature: "getAllUsers()",
      inputs: [],
      outputs: [{ name: "", type: "address[]" }],
      stateMutability: "view",
    },
    {
      name: "balances",
      signature: "balances(address)",
      inputs: [{ name: "user", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "users",
      signature: "users(uint256)",
      inputs: [{ name: "index", type: "uint256" }],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "getUser",
      signature: "getUser(uint256)",
      inputs: [{ name: "index", type: "uint256" }],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "getUserBalance",
      signature: "getUserBalance(address)",
      inputs: [{ name: "user", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
  ],

  successCondition: {
    checkOwnership: {
      contract: "SimpleVault",
    },
  },
};