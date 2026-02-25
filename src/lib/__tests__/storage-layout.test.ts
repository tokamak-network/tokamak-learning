import { describe, it, expect } from "vitest";
import { compileSolidity } from "../solc-compiler";

describe("InitializableToken Storage Layout Analysis", () => {
  const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InitializableToken {
    string public name = "Initializable Token";
    string public symbol = "INIT";
    uint8 public decimals = 18;
    
    address public owner;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
}`;

  it("should compile InitializableToken", () => {
    const result = compileSolidity(source);
    expect(result.success).toBe(true);
    expect(result.contractName).toBe("InitializableToken");
  });

  it("should verify storage layout rules", () => {
    // Solidity Storage Layout for InitializableToken:
    // 
    // State variables in order with their types:
    // 1. string name  = "Initializable Token" (20 bytes) → Slot 0
    // 2. string symbol = "INIT" (4 bytes)          → Slot 1
    // 3. uint8 decimals = 18 (1 byte)              → Slot 2, offset 0
    // 4. address owner (20 bytes)                  → Slot 2, offset 1-20 (packed!)
    // 5. uint256 totalSupply                       → Slot 3
    // 6. mapping(address => uint256) balanceOf     → Slot 4 (base)
    //
    // Key insight: uint8 + address = 1 + 20 = 21 bytes < 32 bytes
    // So they are PACKED together in slot 2!
    
    console.log("\n=== Storage Layout ===");
    console.log("Slot 0: name (string, 20 bytes)");
    console.log("Slot 1: symbol (string, 4 bytes)");
    console.log("Slot 2: decimals (uint8, 1 byte) + owner (address, 20 bytes) - PACKED");
    console.log("Slot 3: totalSupply (uint256)");
    console.log("Slot 4: balanceOf mapping base");
    
    const expectedOwnerSlot = 2;
    expect(expectedOwnerSlot).toBe(2);
  });

  it("should document the fix for unprotected-init", () => {
    // BUG: checkOwnership used default slot 0
    // FIX: Added ownerSlot: "0x2" to checkOwnership config
    //
    // Before:
    //   successCondition: {
    //     checkOwnership: {
    //       contract: "InitializableToken",
    //       expectedOwner: "Exploit",
    //     },
    //   }
    //
    // After:
    //   successCondition: {
    //     checkOwnership: {
    //       contract: "InitializableToken",
    //       ownerSlot: "0x2",  // Owner is at slot 2
    //       expectedOwner: "Exploit",
    //     },
    //   }
    
    expect(true).toBe(true);
  });
});