import type { VulnerabilityChallenge } from "@/types/vulnerability";

const BANK_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A bank contract to learn inspection tools
// Learn to inspect balance, storage, and code

contract SimpleBank {
    address public owner;
    uint256 public totalDeposits;
    mapping(address => uint256) public balances;
    
    // Storage layout for educational purposes:
    // Slot 0: owner
    // Slot 1: totalDeposits
    // Slot 2: balances mapping start

    constructor() payable {
        owner = msg.sender;
        totalDeposits = msg.value;
    }

    function deposit() external payable {
        require(msg.value >= 1 ether, "Minimum 1 ETH");
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient");
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}`;

export const tutorialInspectTools: VulnerabilityChallenge = {
  id: "tutorial-inspect-tools",
  title: "Tutorial 3: Inspect Tools",
  category: "access-control",
  difficulty: "beginner",

  incident: {
    name: "Tutorial Challenge",
    date: "N/A",
    references: [],
  },

  description: `# Tutorial 3: Inspecting Contract State

Beyond calling functions, you can directly inspect contract state using the **Inspect** tab!

## The Inspect Tab

Click the "Inspect" tab (next to "Call") to see these tools:

| Button | What it does |
|--------|--------------|
| **Balance** | Check ETH balance of the contract |
| **Storage** | Read raw storage at any slot |
| **Code** | Get the compiled bytecode |
| **Account Info** | Get account details |

## Your Tasks

### Task 1: Check Contract Balance

1. Switch to "Inspect" tab
2. Click "Balance"
3. Result shows the ETH held by the contract
4. The SimpleBank starts with 10 ETH from setup

### Task 2: Read Storage Slots

Solidity stores variables in 32-byte slots:

| Slot | Variable |
|------|----------|
| 0 | owner (address) |
| 1 | totalDeposits (uint256) |
| 2+ | balances mapping |

To read:
1. Click "Storage"
2. Enter a slot like: \`0x0000000000000000000000000000000000000000000000000000000000000000\`
3. Result shows the 32-byte value

### Task 3: Check Bytecode

1. Click "Code"
2. You'll see the compiled bytecode (hex string)
3. This is what actually runs on the EVM

### Task 4: Account Info

1. Click "Account Info"
2. Shows: nonce, balance, code hash, etc.

## Why This Matters

In real exploits, you often need to:
- Check if a contract has ETH to steal
- Find storage slot of sensitive data
- Verify contract code matches expected

## Pro Tip

Storage slots are always 32 bytes (64 hex chars). Padded with zeros for smaller types:
\`\`\`
owner (address) at slot 0:
0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266
                        ↑ 20 bytes, padded left with 12 bytes of zeros
\`\`\``,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exploit {
    constructor() {}
    
    // This tutorial focuses on Inspect tools - no attack needed
    function attack() external pure {
        // Great job! Now you know how to inspect contracts!
    }
}`,

  hint: "Switch to the Inspect tab and try each button!",

  setup: {
    contracts: [
      {
        name: "SimpleBank",
        source: BANK_SOURCE,
        value: "10", // Contract starts with 10 ETH
      },
    ],
    attackerBalance: "10",
  },

  exposedFunctions: [
    {
      name: "owner",
      signature: "owner()",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "totalDeposits",
      signature: "totalDeposits()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "getBalance",
      signature: "getBalance()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
  ],

  successCondition: {
    checkBalance: {
      address: "SimpleBank",
      minBalance: "1",
    },
  },
};