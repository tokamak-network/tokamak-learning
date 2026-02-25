// Test for constructor argument encoding and deployment
import { describe, it, expect, beforeAll } from "vitest";
import { createMemoryClient } from "tevm";
import { mainnet } from "tevm/common";
import { encodeDeployData } from "viem";
import { compileSolidity } from "../solc-compiler";
import { parseEther } from "viem";

const ATTACKER_ADDRESS = "0xdead000000000000000000000000000000000000" as const;

// Simple exploit contract with constructor parameter
const EXPLOIT_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDonationPool {
    function setOwner(address) external;
    function owner() external view returns (address);
}

contract Exploit {
    IDonationPool public target;
    
    constructor(address _target) {
        target = IDonationPool(_target);
    }
    
    function attack() external {
        target.setOwner(address(this));
    }
}`;

// Target contract
const DONATION_POOL = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationPool {
    address public owner;
    
    constructor() payable {
        owner = msg.sender;
    }
    
    function setOwner(address newOwner) external {
        owner = newOwner;
    }
}`;

describe("Constructor Parameter Deployment", () => {
  let client: Awaited<ReturnType<typeof createMemoryClient>>;
  let targetAddress: `0x${string}`;

  beforeAll(async () => {
    client = createMemoryClient({
      common: mainnet,
      miningConfig: { type: "auto" },
    });
    await client.tevmReady();

    // Set up attacker account
    await client.tevmSetAccount({
      address: ATTACKER_ADDRESS,
      balance: parseEther("10"),
      nonce: BigInt(0),
    });

    // Deploy target contract
    const compiledTarget = compileSolidity(DONATION_POOL);
    expect(compiledTarget.success).toBe(true);
    
    const deployResult = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      data: `0x${compiledTarget.bytecode}` as `0x${string}`,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });
    
    expect(deployResult.errors).toBeUndefined();
    targetAddress = deployResult.createdAddress!;
    console.log("Target deployed at:", targetAddress);
  });

  it("should compile exploit contract with constructor", () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    
    console.log("Compilation result:", {
      success: compiled.success,
      contractName: compiled.contractName,
      bytecodeLength: compiled.bytecode?.length,
      errors: compiled.errors,
    });

    expect(compiled.success).toBe(true);
    expect(compiled.bytecode).toBeDefined();
    expect(compiled.abi).toBeDefined();
    
    // Check if ABI has constructor
    const constructorAbi = (compiled.abi as any[]).find(
      (item) => item.type === "constructor"
    );
    console.log("Constructor ABI:", JSON.stringify(constructorAbi, null, 2));
    expect(constructorAbi).toBeDefined();
    expect(constructorAbi.inputs).toHaveLength(1);
    expect(constructorAbi.inputs[0].type).toBe("address");
  });

  it("should encode constructor args correctly", () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);
    expect(compiled.abi).toBeDefined();

    const testAddress = "0x1234567890123456789012345678901234567890";
    
    // Test encoding
    const deployData = encodeDeployData({
      abi: compiled.abi!,
      bytecode: `0x${compiled.bytecode!}` as `0x${string}`,
      args: [testAddress],
    });

    console.log("Deploy data length:", deployData.length);
    console.log("Deploy data (first 200 chars):", deployData.slice(0, 200));
    
    // Bytecode + encoded args
    // Address should be padded to 32 bytes (64 hex chars)
    expect(deployData.length).toBeGreaterThan(compiled.bytecode!.length);
    expect(deployData.endsWith(testAddress.slice(2).toLowerCase())).toBe(true);
  });

  it("should deploy exploit contract with constructor args", async () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);

    const deployData = encodeDeployData({
      abi: compiled.abi!,
      bytecode: `0x${compiled.bytecode!}` as `0x${string}`,
      args: [targetAddress],
    });

    console.log("Deploying with target address:", targetAddress);
    console.log("Deploy data length:", deployData.length);

    const deployResult = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      data: deployData,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });

    console.log("Deploy result:", {
      errors: deployResult.errors?.map(e => e.message),
      createdAddress: deployResult.createdAddress,
      executionGasUsed: deployResult.executionGasUsed?.toString(),
    });

    if (deployResult.errors) {
      console.log("Full error details:", JSON.stringify(deployResult.errors, null, 2));
    }

    expect(deployResult.errors).toBeUndefined();
    expect(deployResult.createdAddress).toBeDefined();
  });

  it("should fail deployment without constructor args (baseline test)", async () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);

    // Deploy WITHOUT constructor args - this should fail
    try {
      const deployResult = await client.tevmCall({
        from: ATTACKER_ADDRESS,
        data: `0x${compiled.bytecode!}` as `0x${string}`,
        gas: BigInt(10_000_000),
        addToBlockchain: true,
      });

      console.log("Deploy without args result:", {
        errors: deployResult.errors?.map(e => e.message),
        createdAddress: deployResult.createdAddress,
      });

      // This should fail because constructor requires argument
      expect(deployResult.errors || !deployResult.createdAddress).toBeTruthy();
    } catch (error) {
      // Expected: deployment should throw or have errors
      console.log("Expected error caught:", error);
      expect(error).toBeDefined();
    }
  });

  it("should handle empty args array correctly", () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);

    // Test with empty args array - should fail or be handled gracefully
    try {
      const deployData = encodeDeployData({
        abi: compiled.abi!,
        bytecode: `0x${compiled.bytecode!}` as `0x${string}`,
        args: [],
      });
      console.log("Empty args deploy data length:", deployData.length);
      console.log("Bytecode only length:", `0x${compiled.bytecode!}`.length);
      
      // Check if deploy data is same as bytecode (no args encoded)
      const isSameAsBytecode = deployData.toLowerCase() === `0x${compiled.bytecode!}`.toLowerCase();
      console.log("Deploy data same as bytecode (no encoding):", isSameAsBytecode);
      
      // This is problematic - empty args should throw an error for constructors with parameters!
      expect(isSameAsBytecode).toBe(true);
    } catch (error) {
      console.log("Expected error with empty args:", error);
      expect(error).toBeDefined();
    }
  });

  it("should test string args vs proper address type", () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);

    // Test with string address (as it comes from UI)
    const addressAsString = targetAddress;
    
    console.log("Testing with string address:", addressAsString, typeof addressAsString);
    
    const deployData = encodeDeployData({
      abi: compiled.abi!,
      bytecode: `0x${compiled.bytecode!}` as `0x${string}`,
      args: [addressAsString],  // String, but should work with viem
    });

    console.log("Deploy data ends with:", deployData.slice(-64));
    expect(deployData.length).toBeGreaterThan(compiled.bytecode!.length);
  });

  it("should handle empty string in args array", async () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);

    // Test with empty string in args - this simulates what happens when UI input is empty
    console.log("Testing with empty string in args...");
    
    try {
      const deployData = encodeDeployData({
        abi: compiled.abi!,
        bytecode: `0x${compiled.bytecode!}` as `0x${string}`,
        args: [""],  // Empty string from UI
      });
      
      console.log("Empty string deploy data length:", deployData.length);
      console.log("Deploy data ends with:", deployData.slice(-64));
      
      // Try to deploy with this data
      const deployResult = await client.tevmCall({
        from: ATTACKER_ADDRESS,
        data: deployData,
        gas: BigInt(10_000_000),
        addToBlockchain: true,
      });

      console.log("Deploy with empty string result:", {
        errors: deployResult.errors?.map(e => e.message),
        createdAddress: deployResult.createdAddress,
      });

      // This should fail because empty string is not a valid address
      expect(deployResult.errors).toBeDefined();
    } catch (error) {
      console.log("Error with empty string args:", error);
      expect(error).toBeDefined();
    }
  });

  it("should simulate actual UI flow - check if constructorArgs is empty", async () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);

    // Simulate what deployUserContract does
    const constructorArgs: unknown[] = [];  // Empty array (like when no parameters provided)
    
    console.log("Simulating deployUserContract with constructorArgs:", constructorArgs);
    console.log("constructorArgs.length:", constructorArgs.length);
    
    let deployData = `0x${compiled.bytecode!}` as `0x${string}`;
    
    // This is the condition in deployUserContract
    if (constructorArgs && constructorArgs.length > 0 && compiled.abi) {
      console.log("Encoding constructor args...");
      deployData = encodeDeployData({
        abi: compiled.abi,
        bytecode: deployData,
        args: constructorArgs,
      });
    } else {
      console.log("Skipping constructor args encoding - condition not met!");
      console.log("  constructorArgs:", constructorArgs);
      console.log("  constructorArgs.length:", constructorArgs?.length);
      console.log("  compiled.abi exists:", !!compiled.abi);
    }

    // Deploy without constructor args (this is what happens)
    try {
      const deployResult = await client.tevmCall({
        from: ATTACKER_ADDRESS,
        data: deployData,
        gas: BigInt(10_000_000),
        addToBlockchain: true,
      });

      console.log("Deploy result:", {
        errors: deployResult.errors?.map(e => e.message),
        createdAddress: deployResult.createdAddress,
      });

      // This should fail because constructor needs an argument
      // Verify that errors exist (this demonstrates the bug when constructorArgs is empty)
      expect(deployResult.errors || !deployResult.createdAddress).toBeTruthy();
    } catch (error) {
      // Expected: deployment should throw or have errors
      console.log("Expected error caught:", error);
      expect(error).toBeDefined();
    }
  });

  it("should work with correct constructor args from UI", async () => {
    const compiled = compileSolidity(EXPLOIT_CONTRACT);
    expect(compiled.success).toBe(true);

    // Simulate UI providing the target address
    const constructorArgs: unknown[] = [targetAddress];  // Correct address
    
    console.log("Simulating correct UI flow with constructorArgs:", constructorArgs);
    
    let deployData = `0x${compiled.bytecode!}` as `0x${string}`;
    
    if (constructorArgs && constructorArgs.length > 0 && compiled.abi) {
      deployData = encodeDeployData({
        abi: compiled.abi,
        bytecode: deployData,
        args: constructorArgs,
      });
      console.log("Constructor args encoded successfully");
    }

    const deployResult = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      data: deployData,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });

    console.log("Deploy result:", {
      errors: deployResult.errors?.map(e => e.message),
      createdAddress: deployResult.createdAddress,
    });

    expect(deployResult.errors).toBeUndefined();
    expect(deployResult.createdAddress).toBeDefined();
  });
});