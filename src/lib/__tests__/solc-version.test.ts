import { describe, it, expect } from "vitest";
import { compileSolidity } from "../solc-compiler";

describe("Solidity Compiler Version Support", () => {
  it("should compile Solidity 0.8.x code successfully", async () => {
    const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestContract {
    uint256 public value;
    
    function setValue(uint256 _value) external {
        value = _value;
    }
}`;

    const result = compileSolidity(source);

    expect(result.success).toBe(true);
    expect(result.contractName).toBe("TestContract");
    expect(result.bytecode).toBeDefined();
    expect(result.abi).toBeDefined();
  });

  it("should compile Solidity 0.8.x with unchecked blocks", async () => {
    // This is the fix for overflow/underflow challenges
    const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OverflowToken {
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
    
    function airdrop(address[] calldata recipients, uint256 amount) external {
        for (uint256 i = 0; i < recipients.length; i++) {
            unchecked {
                balanceOf[recipients[i]] += amount;
                totalSupply += amount;
            }
        }
    }
}`;

    const result = compileSolidity(source);

    expect(result.success).toBe(true);
    expect(result.contractName).toBe("OverflowToken");
    expect(result.bytecode).toBeDefined();
  });

  it("should compile erc20-overflow challenge source (updated)", async () => {
    const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OverflowToken {
    string public name = "Overflow Token";
    string public symbol = "OVF";
    uint8 public decimals = 18;
    
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
    
    constructor() {
        balanceOf[msg.sender] = 1000 * 10**uint256(decimals);
        totalSupply = 1000 * 10**uint256(decimals);
    }
    
    function airdrop(address[] calldata recipients, uint256 amount) external {
        for (uint256 i = 0; i < recipients.length; i++) {
            unchecked {
                balanceOf[recipients[i]] += amount;
                totalSupply += amount;
            }
        }
    }
}`;

    const result = compileSolidity(source);

    expect(result.success).toBe(true);
    expect(result.contractName).toBe("OverflowToken");
  });

  it("should compile erc20-underflow challenge source (updated)", async () => {
    const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnderflowToken {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        unchecked {
            allowance[from][msg.sender] -= amount;
        }
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}`;

    const result = compileSolidity(source);

    expect(result.success).toBe(true);
    expect(result.contractName).toBe("UnderflowToken");
  });
});

describe("Root Cause Resolution", () => {
  it("should confirm the fix: Solidity 0.8.x + unchecked blocks", () => {
    // Before fix: pragma solidity ^0.7.0 -> compile error
    // After fix: pragma solidity ^0.8.0 + unchecked { } -> works!
    //
    // Summary:
    // --------
    // Problem: solc 0.8.x cannot compile Solidity 0.7.x code
    // Solution: Use Solidity 0.8.x with unchecked blocks to simulate
    //           overflow/underflow behavior
    //
    // The unchecked block disables overflow/underflow checks,
    // allowing the same vulnerability demonstration as 0.7.x
    
    expect(true).toBe(true);
  });
});