import type { VulnerabilityChallenge } from "@/types/vulnerability";

const COUNTER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A simple counter contract to learn the UI
// This contract has NO vulnerability - it's for learning!

contract SimpleCounter {
    uint256 public count;
    address public owner;
    string public message;

    constructor() {
        owner = msg.sender;
        count = 0;
        message = "Hello, Hacker!";
    }

    function increment() external {
        count += 1;
    }

    function decrement() external {
        require(count > 0, "Count cannot be negative");
        count -= 1;
    }

    function setMessage(string calldata _message) external {
        message = _message;
    }

    function getCount() external view returns (uint256) {
        return count;
    }

    function getOwner() external view returns (address) {
        return owner;
    }
}`;

export const tutorialUIBasics: VulnerabilityChallenge = {
  id: "tutorial-ui-basics",
  title: "Tutorial 1: UI Basics - Quick Calls",
  category: "access-control",
  difficulty: "beginner",

  incident: {
    name: "Tutorial Challenge",
    date: "N/A",
    references: [],
  },

  description: `# Tutorial 1: Learning the UI with Quick Calls

Welcome to the vulnerability testing environment! This tutorial will teach you the basics of the UI.

## What is Quick Calls?

**Quick Calls** shows functions that don't require any parameters. You can click them to instantly execute and see the result.

## Your Task

1. **Look at the "Quick Calls" section below**
   - You'll see buttons like \`count()\`, \`owner()\`, \`message()\`

2. **Click each button**
   - \`count()\` → Shows the current count (should be 0)
   - \`owner()\` → Shows who deployed the contract
   - \`message()\` → Shows the stored message

3. **Understand the result display**
   - Green box = Success
   - The returned value appears below

## Example

\`\`\`
Quick Calls: [count()] [owner()] [message()]

Click [count()] → Result: 0
Click [owner()] → Result: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
\`\`\`

## Goal

Click all three Quick Call buttons and observe the results. This is how you read contract state!`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This is your exploit contract
// You'll learn to write exploits in later tutorials
// For now, just use the Quick Calls below!

contract Exploit {
    constructor() {}
    
    // This function is called when you click "Run Exploit"
    // In this tutorial, there's nothing to attack - just learn the UI!
    function attack() external pure {
        // Great job! You learned how to use Quick Calls!
    }
}`,
  hint: "Just click the Quick Call buttons below to see how they work!",

  setup: {
    contracts: [
      {
        name: "SimpleCounter",
        source: COUNTER_SOURCE,
      },
    ],
    attackerBalance: "10",
  },

  exposedFunctions: [
    {
      name: "count",
      signature: "count()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "owner",
      signature: "owner()",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "message",
      signature: "message()",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
    },
  ],

  successCondition: {
    checkOwnership: {
      contract: "SimpleCounter",
    },
  },
};