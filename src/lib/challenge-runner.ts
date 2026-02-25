import { createMemoryClient } from "tevm";
import { mainnet } from "tevm/common";
import type { MemoryClient } from "tevm";
import { compileSolidity } from "./solc-compiler";
import { encodeDeployData, encodeFunctionData, parseEther, formatEther, decodeFunctionResult } from "viem";
import type { VulnerabilityChallenge, SuccessCondition, VerificationStep, VerificationResult, InteractionResult } from "@/types/vulnerability";

export const ATTACKER_ADDRESS = "0xdead000000000000000000000000000000000000" as const;

// Use globalThis to persist sessions across Next.js HMR and API route contexts
// This ensures the Map is shared between all API routes
interface SessionData {
  client: MemoryClient;
  deployedContracts: Record<string, string>;
  contractAbis: Record<string, string[]>;
}

// Extend globalThis type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __tokamak_sessions: Map<string, SessionData> | undefined;
}

// Get or create the global sessions Map
function getSessionsMap(): Map<string, SessionData> {
  if (!globalThis.__tokamak_sessions) {
    globalThis.__tokamak_sessions = new Map<string, SessionData>();
  }
  return globalThis.__tokamak_sessions;
}

export function getSession(sessionId: string): SessionData | undefined {
  const sessions = getSessionsMap();
  return sessions.get(sessionId);
}

export function createSession(client: MemoryClient, deployedContracts: Record<string, string>, contractAbis: Record<string, string[]>): string {
  const sessions = getSessionsMap();
  const sessionId = Math.random().toString(36).substring(2, 15);
  sessions.set(sessionId, { client, deployedContracts, contractAbis });
  return sessionId;
}

export function deleteSession(sessionId: string): boolean {
  const sessions = getSessionsMap();
  return sessions.delete(sessionId);
}

export function sessionExists(sessionId: string): boolean {
  const sessions = getSessionsMap();
  return sessions.has(sessionId);
}

/**
 * Recursively converts BigInt values to strings for JSON serialization.
 * This is necessary because JSON.stringify cannot handle BigInt.
 */
function serializeBigInt(data: unknown): unknown {
  if (typeof data === "bigint") {
    return data.toString();
  }
  if (Array.isArray(data)) {
    return data.map(serializeBigInt);
  }
  if (data !== null && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }
  return data;
}

export interface RunResult {
  success: boolean;
  logs: Array<{ type: "info" | "success" | "error"; message: string }>;
  validation?: {
    passed: boolean;
    message: string;
    details: string[];
  };
  error?: string;
}

export interface SetupResult {
  deployedContracts: Record<string, string>;
  contractAbis: Record<string, string[]>;
}

export async function createLocalEVM(): Promise<MemoryClient> {
  const client = createMemoryClient({
    common: mainnet,
    miningConfig: {
      type: "auto",
    },
  });

  await client.tevmReady();
  return client;
}

export async function setupChallenge(
  client: MemoryClient,
  challenge: VulnerabilityChallenge
): Promise<SetupResult> {
  const deployedContracts: Record<string, string> = {};
  const contractAbis: Record<string, string[]> = {};

  await client.tevmSetAccount({
    address: ATTACKER_ADDRESS,
    balance: parseEther(challenge.setup.attackerBalance || "10"),
    nonce: BigInt(0),
  });

  if (challenge.setup.accounts) {
    for (const account of challenge.setup.accounts) {
      await client.tevmSetAccount({
        address: account.address,
        balance: parseEther(account.balance || "100"),
        nonce: BigInt(0),
      });
    }
  }

  for (const contract of challenge.setup.contracts) {
    const { address, abi } = await deployChallengeContract(client, contract);
    deployedContracts[contract.name] = address;
    contractAbis[contract.name] = abi;
  }

  return { deployedContracts, contractAbis };
}

async function deployChallengeContract(
  client: MemoryClient,
  contract: { name: string; source: string; constructorArgs?: unknown[]; value?: string }
): Promise<{ address: `0x${string}`; abi: string[] }> {
  const compiled = compileSolidity(contract.source);
  if (!compiled.success || !compiled.bytecode) {
    throw new Error(`Failed to compile ${contract.name}: ${compiled.errors?.join(", ")}`);
  }

  let deployData = `0x${compiled.bytecode}` as `0x${string}`;
  if (contract.constructorArgs && contract.constructorArgs.length > 0 && compiled.abi) {
    deployData = encodeDeployData({
      abi: compiled.abi,
      bytecode: deployData,
      args: contract.constructorArgs,
    });
  }

  const value = contract.value ? parseEther(contract.value) : BigInt(0);

  const result = await client.tevmCall({
    from: ATTACKER_ADDRESS,
    data: deployData,
    value,
    gas: BigInt(10_000_000),
    addToBlockchain: true,
  });

  if (result.errors || !result.createdAddress) {
    throw new Error(`Failed to deploy ${contract.name}: ${result.errors?.[0]?.message}`);
  }

  const abiStrings = compiled.abi
    ? (compiled.abi as Array<{ type: string; name?: string; inputs?: Array<{ type: string }>; outputs?: Array<{ type: string }>; stateMutability?: string }>)
        .filter((item) => item.type === "function")
        .map((fn) => {
          const inputs = fn.inputs?.map((i) => i.type).join(",") || "";
          const outputs = fn.outputs?.map((o) => o.type).join(",") || "";
          const mutability = fn.stateMutability || "";
          return `function ${fn.name}(${inputs}) ${mutability} returns (${outputs})`.replace(" returns ()", "");
        })
    : [];

  return { address: result.createdAddress, abi: abiStrings };
}

export async function runExploit(
  client: MemoryClient,
  challenge: VulnerabilityChallenge,
  userCode: string,
  deployedContracts?: Record<string, string>
): Promise<RunResult> {
  const logs: RunResult["logs"] = [];

  try {
    logs.push({ type: "info", message: "Compiling exploit contract..." });
    const compiled = compileSolidity(userCode);

    if (!compiled.success || !compiled.bytecode) {
      logs.push({ type: "error", message: `Compilation failed: ${compiled.errors?.[0]}` });
      return { success: false, logs, error: "Compilation failed" };
    }

    logs.push({ type: "success", message: `Compiled: ${compiled.contractName}` });

    logs.push({ type: "info", message: "Deploying exploit contract..." });

    const deployResult = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      data: `0x${compiled.bytecode}` as `0x${string}`,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });

    if (deployResult.errors || !deployResult.createdAddress) {
      logs.push({ type: "error", message: `Deployment failed: ${deployResult.errors?.[0]?.message}` });
      return { success: false, logs, error: "Deployment failed" };
    }

    const exploitAddress = deployResult.createdAddress;
    logs.push({ type: "success", message: `Deployed at: ${exploitAddress}` });

    logs.push({ type: "info", message: "Executing attack()..." });

    if (!compiled.abi) {
      logs.push({ type: "error", message: "No ABI available" });
      return { success: false, logs, error: "No ABI" };
    }

    const attackData = encodeFunctionData({
      abi: compiled.abi,
      functionName: "attack",
    });

    const attackResult = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      to: exploitAddress,
      data: attackData,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });

    if (attackResult.errors) {
      logs.push({ type: "error", message: `Attack failed: ${attackResult.errors[0].message}` });
      return { success: false, logs, error: "Attack execution failed" };
    }

    logs.push({ type: "success", message: "Attack executed successfully" });

    logs.push({ type: "info", message: "Validating exploit..." });
    const validation = await validateSuccess(client, challenge.successCondition, deployedContracts, exploitAddress);

    if (validation.passed) {
      logs.push({ type: "success", message: validation.message });
    } else {
      logs.push({ type: "error", message: validation.message });
    }

    validation.details.forEach(detail => {
      logs.push({ type: validation.passed ? "success" : "info", message: detail });
    });

    return {
      success: validation.passed,
      logs,
      validation,
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logs.push({ type: "error", message });
    return { success: false, logs, error: message };
  }
}

async function validateSuccess(
  client: MemoryClient,
  condition: SuccessCondition,
  deployedContracts?: Record<string, string>,
  exploitAddress?: `0x${string}`
): Promise<{ passed: boolean; message: string; details: string[] }> {
  const details: string[] = [];

  if (condition.checkStorage) {
    const { address, slot, expectedValue, contains } = condition.checkStorage;
    const resolvedAddress = resolveAddress(address as `0x${string}`, deployedContracts);
    const value = await client.getStorageAt({ address: resolvedAddress, slot });

    if (expectedValue !== undefined) {
      const match = value?.toLowerCase() === expectedValue.toLowerCase();
      details.push(`Storage check: ${match ? "PASSED" : "FAILED"}`);
      if (!match) {
        details.push(`  Expected: ${expectedValue}`);
        details.push(`  Actual: ${value}`);
        return { passed: false, message: "Storage check failed", details };
      }
    } else if (contains !== undefined) {
      const match = value?.toLowerCase().includes(contains.toLowerCase());
      details.push(`Storage contains check: ${match ? "PASSED" : "FAILED"}`);
      if (!match) {
        return { passed: false, message: "Storage value not found", details };
      }
    }
  }

  if (condition.checkBalance) {
    const { address, minBalance, maxBalance } = condition.checkBalance;
    const resolvedAddress = resolveAddress(address as `0x${string}`, deployedContracts);
    const balance = await client.getBalance({ address: resolvedAddress });

    if (minBalance !== undefined) {
      const min = parseEther(minBalance);
      if (balance < min) {
        details.push(`Balance check: FAILED (below minimum)`);
        return { passed: false, message: "Balance too low", details };
      }
    }

    if (maxBalance !== undefined) {
      const max = parseEther(maxBalance);
      if (balance > max) {
        details.push(`Balance check: FAILED (above maximum)`);
        return { passed: false, message: "Balance too high", details };
      }
    }

    details.push(`Balance check: PASSED`);
  }

  if (condition.checkOwnership) {
    const { contract, ownerSlot, expectedOwner } = condition.checkOwnership;
    const resolvedContract = resolveAddress(contract as `0x${string}`, deployedContracts);
    const slot = ownerSlot || "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
    // Default to the exploit contract address if no expected owner specified
    const expected = expectedOwner || exploitAddress || ATTACKER_ADDRESS;

    const value = await client.getStorageAt({ address: resolvedContract, slot });

    // Check if owner array contains the expected owner
    // For the WalletLibrary, owners are in a dynamic array at slot 0
    // The first element is at keccak256(0) + 0
    const isOwner = await checkOwnerInArray(client, resolvedContract, expected);

    if (!isOwner) {
      details.push(`Ownership check: FAILED`);
      details.push(`  Expected owner: ${expected}`);
      details.push(`  Storage value at slot 0: ${value}`);
      return { passed: false, message: "Ownership check failed", details };
    }

    details.push(`Ownership check: PASSED`);
  }

  if (condition.checkDrained) {
    const { contract, maxRemaining } = condition.checkDrained;
    const resolvedContract = resolveAddress(contract as `0x${string}`, deployedContracts);
    const max = maxRemaining ? parseEther(maxRemaining) : BigInt(0);
    const balance = await client.getBalance({ address: resolvedContract });

    if (balance > max) {
      details.push(`Drain check: FAILED (${balance} wei remaining)`);
      return { passed: false, message: "Contract not fully drained", details };
    }

    details.push(`Drain check: PASSED`);
  }

  return { passed: true, message: "Exploit successful!", details };
}

function resolveAddress(address: `0x${string}`, deployedContracts?: Record<string, string>): `0x${string}` {
  // If we have deployed contracts, check if this address is a contract name
  if (deployedContracts) {
    // Check by name
    if (deployedContracts[address]) {
      return deployedContracts[address] as `0x${string}`;
    }
    // Check if any deployed contract's configured address matches
    for (const [_name, deployedAddr] of Object.entries(deployedContracts)) {
      if (address.toLowerCase() === deployedAddr.toLowerCase()) {
        return deployedAddr as `0x${string}`;
      }
    }
  }
  return address;
}

async function checkOwnerInArray(
  client: MemoryClient,
  contractAddress: `0x${string}`,
  expectedOwner: `0x${string}`
): Promise<boolean> {
  const lengthHex = await client.getStorageAt({
    address: contractAddress,
    slot: "0x0000000000000000000000000000000000000000000000000000000000000000"
  });

  if (!lengthHex) return false;

  let length = Number(BigInt(lengthHex));
  if (length > 1000) {
    length = Math.min(length, 10);
  }

  const baseSlotHex = "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563";
  const baseSlot = BigInt(baseSlotHex);

  for (let i = 0; i < length; i++) {
    const elementSlot = "0x" + (baseSlot + BigInt(i)).toString(16).padStart(64, '0') as `0x${string}`;

    const value = await client.getStorageAt({
      address: contractAddress,
      slot: elementSlot
    });

    if (value && value !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      const addressFromSlot = "0x" + value.slice(-40) as `0x${string}`;
      if (addressFromSlot.toLowerCase() === expectedOwner.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

export async function executeContractCall(
  client: MemoryClient,
  target: string,
  functionName: string,
  args: unknown[],
  abi: unknown[],
  value: string,
  deployedContracts: Record<string, string>
): Promise<InteractionResult> {
  try {
    const targetAddress = resolveAddress(target as `0x${string}`, deployedContracts);

    const callData = encodeFunctionData({
      abi,
      functionName,
      args: args as readonly unknown[],
    });

    const valueWei = value ? parseEther(value) : BigInt(0);

    const result = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      to: targetAddress,
      data: callData,
      value: valueWei,
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });

    if (result.errors) {
      return {
        success: false,
        error: result.errors[0].message,
        reverted: true,
      };
    }

    let returnValue: unknown = result.rawData;
    if (abi && result.rawData && result.rawData !== "0x") {
      try {
        returnValue = decodeFunctionResult({
          abi,
          functionName,
          data: result.rawData as `0x${string}`,
        });
      } catch {
        returnValue = result.rawData;
      }
    }

    return {
      success: true,
      data: serializeBigInt(returnValue),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function readStorage(
  client: MemoryClient,
  target: string,
  slot: string,
  deployedContracts: Record<string, string>
): Promise<InteractionResult> {
  try {
    const targetAddress = resolveAddress(target as `0x${string}`, deployedContracts);
    const value = await client.getStorageAt({
      address: targetAddress,
      slot: slot as `0x${string}`,
    });

    return {
      success: true,
      data: value,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function readBalance(
  client: MemoryClient,
  target: string,
  deployedContracts: Record<string, string>
): Promise<InteractionResult> {
  try {
    const targetAddress = resolveAddress(target as `0x${string}`, deployedContracts);
    const balance = await client.getBalance({ address: targetAddress });

    return {
      success: true,
      data: {
        wei: balance.toString(),
        eth: formatEther(balance),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function readCode(
  client: MemoryClient,
  target: string,
  deployedContracts: Record<string, string>
): Promise<InteractionResult> {
  try {
    const targetAddress = resolveAddress(target as `0x${string}`, deployedContracts);
    const code = await client.getCode({ address: targetAddress });

    const codeValue = code || "0x";

    return {
      success: true,
      data: {
        code: codeValue,
        isContract: codeValue !== "0x",
        size: codeValue !== "0x" ? (codeValue.length - 2) / 2 : 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getAccountInfo(
  client: MemoryClient,
  target: string,
  deployedContracts: Record<string, string>
): Promise<InteractionResult> {
  try {
    const targetAddress = resolveAddress(target as `0x${string}`, deployedContracts);
    const account = await client.tevmGetAccount({ address: targetAddress });

    return {
      success: true,
      data: {
        address: targetAddress,
        balance: account.balance ? formatEther(account.balance) : "0",
        nonce: account.nonce?.toString() || "0",
        codeHash: account.codeHash,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function executeVerificationSteps(
  client: MemoryClient,
  steps: VerificationStep[],
  deployedContracts: Record<string, string>
): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];

  for (const step of steps) {
    const result = await executeVerificationStep(client, step, deployedContracts);
    results.push(result);
  }

  return results;
}

async function executeVerificationStep(
  client: MemoryClient,
  step: VerificationStep,
  deployedContracts: Record<string, string>
): Promise<VerificationResult> {
  switch (step.type) {
    case "call": {
      if (!step.call) {
        return { step, passed: false, message: "Missing call configuration" };
      }

      const result = await executeContractCall(
        client,
        step.call.target,
        step.call.functionName,
        step.call.args || [],
        [],
        step.call.value || "0",
        deployedContracts
      );

      if (!result.success) {
        const passed = step.call.expectRevert ?? false;
        return {
          step,
          passed,
          message: passed
            ? "Transaction reverted as expected"
            : `Transaction failed: ${result.error}`,
          data: result,
        };
      }

      return {
        step,
        passed: true,
        message: "Transaction executed successfully",
        data: result,
      };
    }

    case "check_storage": {
      if (!step.storage) {
        return { step, passed: false, message: "Missing storage configuration" };
      }

      const result = await readStorage(
        client,
        step.storage.target,
        step.storage.slot,
        deployedContracts
      );

      if (!result.success) {
        return { step, passed: false, message: `Storage read failed: ${result.error}` };
      }

      const value = result.data as string;
      const expected = step.storage.expectedValue;

      if (expected !== undefined) {
        const passed = value.toLowerCase() === expected.toLowerCase();
        return {
          step,
          passed,
          message: passed
            ? `Storage slot ${step.storage.slot}: ${value}`
            : `Storage mismatch. Expected: ${expected}, Got: ${value}`,
          data: { slot: step.storage.slot, value, expected },
        };
      }

      return {
        step,
        passed: true,
        message: `Storage slot ${step.storage.slot}: ${value}`,
        data: { slot: step.storage.slot, value },
      };
    }

    case "check_balance": {
      if (!step.balance) {
        return { step, passed: false, message: "Missing balance configuration" };
      }

      const result = await readBalance(client, step.balance.target, deployedContracts);

      if (!result.success) {
        return { step, passed: false, message: `Balance read failed: ${result.error}` };
      }

      const { wei, eth } = result.data as { wei: string; eth: string };
      const balanceWei = BigInt(wei);

      if (step.balance.expected !== undefined) {
        const expectedWei = parseEther(step.balance.expected);
        const passed = balanceWei === expectedWei;
        return {
          step,
          passed,
          message: passed
            ? `Balance matches: ${eth} ETH`
            : `Balance mismatch. Expected: ${step.balance.expected} ETH, Got: ${eth} ETH`,
          data: { eth, wei, expected: step.balance.expected },
        };
      }

      let passed = true;
      if (step.balance.min !== undefined) {
        const minWei = parseEther(step.balance.min);
        passed = balanceWei >= minWei;
      }
      if (passed && step.balance.max !== undefined) {
        const maxWei = parseEther(step.balance.max);
        passed = balanceWei <= maxWei;
      }

      return {
        step,
        passed,
        message: `Balance: ${eth} ETH (${passed ? "within range" : "out of range"})`,
        data: { eth, wei, min: step.balance.min, max: step.balance.max },
      };
    }

    case "check_code": {
      if (!step.code) {
        return { step, passed: false, message: "Missing code configuration" };
      }

      const result = await readCode(client, step.code.target, deployedContracts);

      if (!result.success) {
        return { step, passed: false, message: `Code read failed: ${result.error}` };
      }

      const { isContract, size } = result.data as { code: string; isContract: boolean; size: number };
      const shouldExist = step.code.shouldExist ?? true;
      const passed = isContract === shouldExist;

      return {
        step,
        passed,
        message: passed
          ? `Contract ${isContract ? "exists" : "does not exist"} (size: ${size} bytes)`
          : `Contract ${isContract ? "exists" : "does not exist"}, expected ${shouldExist ? "contract" : "no contract"}`,
        data: { isContract, size, shouldExist },
      };
    }

    default:
      return { step, passed: false, message: `Unknown verification type` };
  }
}