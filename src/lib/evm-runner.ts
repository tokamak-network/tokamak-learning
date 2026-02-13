import { createVM } from "@ethereumjs/vm";
import { Common, Hardfork, Mainnet } from "@ethereumjs/common";
import {
  createAddressFromString,
  createAccount,
  hexToBytes,
} from "@ethereumjs/util";
import { ethers } from "ethers";
import type { TestCase } from "@/data/problems";

export interface TestResult {
  passed: boolean;
  message: string;
}

const DEPLOYER = "0x1000000000000000000000000000000000000001";

export async function runTests(
  bytecode: string,
  abi: ethers.InterfaceAbi,
  testCases: TestCase[],
  constructorArgs?: string[]
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  let vm;
  let iface: ethers.Interface;
  let contractAddr;
  const deployerAddr = createAddressFromString(DEPLOYER);

  try {
    // Create VM
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Osaka });
    vm = await createVM({ common });

    // Fund deployer
    await vm.stateManager.putAccount(
      deployerAddr,
      createAccount({ balance: BigInt(10) * BigInt(10) ** BigInt(18) })
    );

    // Build deploy data
    iface = new ethers.Interface(abi);
    let deployHex = "0x" + bytecode;
    if (constructorArgs && constructorArgs.length > 0) {
      const encodedArgs = iface.encodeDeploy(constructorArgs);
      deployHex += encodedArgs.slice(2);
    }

    // Deploy
    const deployResult = await vm.evm.runCall({
      caller: deployerAddr,
      data: hexToBytes(deployHex as `0x${string}`),
      gasLimit: BigInt(5_000_000),
      value: BigInt(0),
    });

    if (deployResult.execResult.exceptionError || !deployResult.createdAddress) {
      results.push({
        passed: false,
        message: `Contract deployment failed: ${deployResult.execResult.exceptionError?.error || "Address creation failed"}`,
      });
      return results;
    }

    contractAddr = deployResult.createdAddress;
  } catch (err) {
    results.push({
      passed: false,
      message: `Test setup failed: ${err instanceof Error ? err.message : String(err)}`,
    });
    return results;
  }

  // Run each test case
  for (const tc of testCases) {
    try {
      // Run setup calls if any
      if (tc.setup) {
        for (const s of tc.setup) {
          const setupData = iface.encodeFunctionData(s.fn, resolveArgs(s.args));
          await vm.evm.runCall({
            caller: deployerAddr,
            to: contractAddr,
            data: hexToBytes(setupData as `0x${string}`),
            gasLimit: BigInt(1_000_000),
            value: s.value ? BigInt(s.value) : BigInt(0),
          });
        }
      }

      // Encode and execute the test call
      const calldata = iface.encodeFunctionData(tc.fn, resolveArgs(tc.args));
      const callResult = await vm.evm.runCall({
        caller: deployerAddr,
        to: contractAddr,
        data: hexToBytes(calldata as `0x${string}`),
        gasLimit: BigInt(1_000_000),
        value: tc.value ? BigInt(tc.value) : BigInt(0),
      });

      const reverted = !!callResult.execResult.exceptionError;

      if (tc.expectRevert) {
        results.push({
          passed: reverted,
          message: reverted
            ? tc.message
            : `${tc.message} - Expected revert but succeeded`,
        });
        continue;
      }

      if (reverted) {
        results.push({
          passed: false,
          message: `${tc.message} - Reverted during execution`,
        });
        continue;
      }

      // No expected value = just check it didn't revert
      if (tc.expected === undefined) {
        results.push({ passed: true, message: tc.message });
        continue;
      }

      // Decode and compare
      const decoded = iface.decodeFunctionResult(
        tc.fn,
        callResult.execResult.returnValue
      );
      const actual = formatResult(decoded[0]);
      const expected = tc.expected;

      const passed = compareValues(actual, expected);
      results.push({
        passed,
        message: passed
          ? tc.message
          : `${tc.message} - Expected: ${expected}, Actual: ${actual}`,
      });
    } catch (err) {
      results.push({
        passed: false,
        message: `${tc.message} - Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  return results;
}

function resolveArgs(args?: string[]): string[] {
  if (!args) return [];
  return args.map((a) => (a === "DEPLOYER" ? DEPLOYER : a));
}

function formatResult(value: unknown): string {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "boolean") return value.toString();
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return JSON.stringify(value.map(formatResult));
  return String(value);
}

function compareValues(actual: string, expected: string): boolean {
  // Direct match
  if (actual === expected) return true;
  // Case-insensitive for addresses
  if (actual.toLowerCase() === expected.toLowerCase()) return true;
  // Handle DEPLOYER placeholder
  if (expected === "DEPLOYER" && actual.toLowerCase() === DEPLOYER.toLowerCase())
    return true;
  return false;
}
