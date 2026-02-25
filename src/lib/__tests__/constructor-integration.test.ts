// Integration test for constructor parameter flow
import { describe, it, expect, beforeAll } from "vitest";
import { createMemoryClient } from "tevm";
import { mainnet } from "tevm/common";
import { parseEther } from "viem";

// Simulate the full flow from UI -> API -> deployment

const ATTACKER_ADDRESS = "0xdead000000000000000000000000000000000000" as const;

// Simulate the config from challenge
const CONSTRUCTOR_CONFIG = {
  params: [
    {
      name: "_target",
      type: "address",
      description: "The DonationPool contract address to attack",
    }
  ],
  autoFillOptions: {
    useDeployedContract: "DonationPool",
  }
};

// User's exploit contract
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

// Simulate the ConstructorParams component logic
function simulateConstructorParamsComponent(
  config: typeof CONSTRUCTOR_CONFIG,
  deployedContracts: Record<string, string>,
  initialValues: unknown[]
): { values: unknown[]; autoFilled: boolean } {
  const targetContractAddress = deployedContracts[config.autoFillOptions.useDeployedContract] || null;
  
  console.log("  targetContractAddress:", targetContractAddress);
  console.log("  initialValues:", initialValues);
  
  if (
    config.autoFillOptions?.useDeployedContract &&
    targetContractAddress &&
    config.params.length > 0
  ) {
    // Check if we need to auto-fill
    const needsAutoFill =
      initialValues.length === 0 ||
      (initialValues.length > 0 &&
       initialValues.some((v, index) => {
         const param = config.params[index];
         return (
           param &&
           param.type === "address" &&
           param.name === "_target" &&
           (!v || v === "")
         );
       }));

    console.log("  needsAutoFill:", needsAutoFill);
    
    if (needsAutoFill) {
      const newValues = config.params.map((param, index) => {
        if (
          param.type === "address" &&
          param.name === "_target" &&
          targetContractAddress
        ) {
          return targetContractAddress;
        }
        return initialValues[index] || "";
      });

      return { values: newValues, autoFilled: true };
    }
  }

  return { values: initialValues, autoFilled: false };
}

// Simulate the API handler
async function simulateDeployAPI(
  userCode: string,
  constructorArgs: unknown[] | undefined,
  deployedContracts: Record<string, string>
): Promise<{ success: boolean; error?: string; logs: string[] }> {
  const logs: string[] = [];
  
  // Import the actual functions
  const { compileSolidity } = await import("../solc-compiler");
  const { encodeDeployData } = await import("viem");
  
  logs.push("Compiling exploit contract...");
  const compiled = compileSolidity(userCode);
  
  if (!compiled.success || !compiled.bytecode) {
    logs.push(`Compilation failed: ${compiled.errors?.[0]}`);
    return { success: false, error: "Compilation failed", logs };
  }
  
  logs.push(`Compiled: ${compiled.contractName}`);
  logs.push(`Deploying exploit contract...`);
  
  // Check constructor args
  logs.push(`constructorArgs received: ${JSON.stringify(constructorArgs)}`);
  logs.push(`constructorArgs type: ${typeof constructorArgs}`);
  logs.push(`constructorArgs is array: ${Array.isArray(constructorArgs)}`);
  logs.push(`constructorArgs length: ${constructorArgs?.length}`);
  
  // Prepare deploy data
  let deployData = `0x${compiled.bytecode}` as `0x${string}`;
  
  if (constructorArgs && constructorArgs.length > 0 && compiled.abi) {
    try {
      logs.push(`Encoding constructor args: ${JSON.stringify(constructorArgs)}`);
      deployData = encodeDeployData({
        abi: compiled.abi,
        bytecode: deployData,
        args: constructorArgs,
      });
      logs.push(`Constructor args encoded successfully`);
    } catch (encodeError) {
      logs.push(`Failed to encode constructor args: ${encodeError}`);
      return { success: false, error: "Failed to encode constructor args", logs };
    }
  } else {
    logs.push(`SKIPPING constructor args encoding!`);
    logs.push(`  - constructorArgs exists: ${!!constructorArgs}`);
    logs.push(`  - constructorArgs.length > 0: ${constructorArgs && constructorArgs.length > 0}`);
    logs.push(`  - compiled.abi exists: ${!!compiled.abi}`);
  }
  
  // Create EVM and deploy
  const client = createMemoryClient({
    common: mainnet,
    miningConfig: { type: "auto" },
  });
  await client.tevmReady();
  
  await client.tevmSetAccount({
    address: ATTACKER_ADDRESS,
    balance: parseEther("10"),
  });
  
  const deployResult = await client.tevmCall({
    from: ATTACKER_ADDRESS,
    data: deployData,
    gas: BigInt(10_000_000),
    addToBlockchain: true,
  });
  
  if (deployResult.errors || !deployResult.createdAddress) {
    logs.push(`Deployment failed: ${deployResult.errors?.[0]?.message}`);
    return { success: false, error: "Deployment failed", logs };
  }
  
  logs.push(`Deployed at: ${deployResult.createdAddress}`);
  return { success: true, logs };
}

describe("Constructor Parameter Integration Tests", () => {
  let targetAddress: string;
  
  beforeAll(async () => {
    // Deploy the target contract first
    const { compileSolidity } = await import("../solc-compiler");
    const client = createMemoryClient({
      common: mainnet,
      miningConfig: { type: "auto" },
    });
    await client.tevmReady();
    
    await client.tevmSetAccount({
      address: ATTACKER_ADDRESS,
      balance: parseEther("10"),
    });
    
    const compiled = compileSolidity(DONATION_POOL);
    const result = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      data: `0x${compiled.bytecode!}` as `0x${string}`,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });
    
    targetAddress = result.createdAddress!;
    console.log("Target DonationPool deployed at:", targetAddress);
  });

  describe("Scenario 1: Initial page load (no deployed contracts yet)", () => {
    it("should handle empty deployedContracts", () => {
      console.log("\n=== Scenario 1: Initial page load ===");
      
      const deployedContracts: Record<string, string> = {};
      const initialValues: unknown[] = [];
      
      const result = simulateConstructorParamsComponent(
        CONSTRUCTOR_CONFIG,
        deployedContracts,
        initialValues
      );
      
      console.log("  Result:", result);
      
      // Should not auto-fill because target contract not deployed yet
      expect(result.autoFilled).toBe(false);
      expect(result.values).toEqual([]);
    });
  });

  describe("Scenario 2: After challenge initialization (deployedContracts populated)", () => {
    it("should auto-fill when deployedContracts becomes available", () => {
      console.log("\n=== Scenario 2: After challenge initialization ===");
      
      const deployedContracts = { DonationPool: targetAddress };
      const initialValues: unknown[] = [];
      
      const result = simulateConstructorParamsComponent(
        CONSTRUCTOR_CONFIG,
        deployedContracts,
        initialValues
      );
      
      console.log("  Result:", result);
      
      // Should auto-fill with target address
      expect(result.autoFilled).toBe(true);
      expect(result.values).toEqual([targetAddress]);
    });
  });

  describe("Scenario 3: User clicks Deploy after auto-fill", () => {
    it("should successfully deploy with auto-filled constructor args", async () => {
      console.log("\n=== Scenario 3: Deploy with auto-filled args ===");
      
      // Simulate UI state after auto-fill
      const deployedContracts = { DonationPool: targetAddress };
      const initialValues: unknown[] = [];
      const { values } = simulateConstructorParamsComponent(
        CONSTRUCTOR_CONFIG,
        deployedContracts,
        initialValues
      );
      
      console.log("  Auto-filled values:", values);
      
      // Simulate API call with these values
      const result = await simulateDeployAPI(
        EXPLOIT_CONTRACT,
        values,
        deployedContracts
      );
      
      console.log("  API logs:", result.logs);
      
      expect(result.success).toBe(true);
    });
  });

  describe("Scenario 4: User clicks Deploy BEFORE challenge is fully initialized", () => {
    it("should fail gracefully when constructorArgs is empty", async () => {
      console.log("\n=== Scenario 4: Deploy before initialization ===");
      
      const deployedContracts: Record<string, string> = {};
      const initialValues: unknown[] = [];
      const { values } = simulateConstructorParamsComponent(
        CONSTRUCTOR_CONFIG,
        deployedContracts,
        initialValues
      );
      
      console.log("  Values before deploy:", values);
      
      // Simulate API call with empty values
      try {
        const result = await simulateDeployAPI(
          EXPLOIT_CONTRACT,
          values.length > 0 ? values : undefined,
          deployedContracts
        );
        
        console.log("  API logs:", result.logs);
        
        // Should fail because constructor needs argument
        expect(result.success).toBe(false);
      } catch (error) {
        // Expected to throw when constructor args missing
        console.log("  Expected error:", error);
        expect(error).toBeDefined();
      }
    });
  });

  describe("Scenario 5: Check what happens with empty string in array", () => {
    it("should fail when constructorArgs is ['']", async () => {
      console.log("\n=== Scenario 5: Empty string in constructorArgs ===");
      
      const deployedContracts = { DonationPool: targetAddress };
      
      // Simulate what happens if auto-fill didn't work properly
      const constructorArgs = [""];
      
      console.log("  constructorArgs:", constructorArgs);
      
      const result = await simulateDeployAPI(
        EXPLOIT_CONTRACT,
        constructorArgs,
        deployedContracts
      );
      
      console.log("  API logs:", result.logs);
      
      // Should fail because empty string is not a valid address
      expect(result.success).toBe(false);
      expect(result.logs.some(l => l.includes("InvalidAddressError") || l.includes("invalid"))).toBe(true);
    });
  });

  describe("Scenario 6: Verify the actual challenge flow", () => {
    it("should simulate the complete VulnerabilityClient flow", async () => {
      console.log("\n=== Scenario 6: Complete VulnerabilityClient flow ===");
      
      // Step 1: Initial state (page loads)
      let deployedContracts: Record<string, string> = {};
      let constructorArgs: unknown[] = [];
      
      console.log("Step 1 - Initial state:");
      console.log("  deployedContracts:", deployedContracts);
      console.log("  constructorArgs:", constructorArgs);
      
      // Step 2: Challenge initialization completes
      deployedContracts = { DonationPool: targetAddress };
      console.log("\nStep 2 - After challenge init:");
      console.log("  deployedContracts:", deployedContracts);
      
      // Step 3: ConstructorParams component updates constructorArgs
      const result = simulateConstructorParamsComponent(
        CONSTRUCTOR_CONFIG,
        deployedContracts,
        constructorArgs
      );
      constructorArgs = result.values;
      
      console.log("  constructorArgs after update:", constructorArgs);
      console.log("  autoFilled:", result.autoFilled);
      
      // Step 4: User clicks Deploy
      console.log("\nStep 4 - User clicks Deploy:");
      const deployResult = await simulateDeployAPI(
        EXPLOIT_CONTRACT,
        constructorArgs,
        deployedContracts
      );
      
      console.log("  Deploy success:", deployResult.success);
      console.log("  Deploy logs:", deployResult.logs);
      
      expect(constructorArgs).toEqual([targetAddress]);
      expect(deployResult.success).toBe(true);
    });
  });
});