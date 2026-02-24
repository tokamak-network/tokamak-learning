// src/lib/contract-deployer.ts

import { encodeDeployData } from "viem";

export interface DeployResult {
  success: boolean;
  address?: `0x${string}`;
  txHash?: `0x${string}`;
  gasUsed?: bigint;
  error?: string;
}

export interface DeployOptions {
  from?: `0x${string}`;
  value?: bigint;
  gas?: bigint;
  constructorArgs?: readonly unknown[];
}

export const DEFAULT_DEPLOYER = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as const;

export async function deployContract(
  client: { tevmCall: (params: {
    from?: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
    gas?: bigint;
    addToBlockchain?: boolean;
  }) => Promise<{
    errors?: { message: string }[];
    createdAddress?: `0x${string}`;
    txHash?: `0x${string}`;
    executionGasUsed?: bigint;
  }> },
  bytecode: string,
  abi: unknown[],
  options?: DeployOptions
): Promise<DeployResult> {
  try {
    const deployerAddress = options?.from || DEFAULT_DEPLOYER;

    let deployData = bytecode.startsWith("0x") ? bytecode : `0x${bytecode}`;

    if (options?.constructorArgs && options.constructorArgs.length > 0) {
      const encoded = encodeDeployData({
        abi,
        bytecode: deployData as `0x${string}`,
        args: options.constructorArgs,
      });
      deployData = encoded;
    }

    const result = await client.tevmCall({
      from: deployerAddress,
      data: deployData as `0x${string}`,
      value: options?.value ?? BigInt(0),
      gas: options?.gas ?? BigInt(10000000),
      addToBlockchain: true,
    });

    if (result.errors && result.errors.length > 0) {
      return {
        success: false,
        error: result.errors.map((e) => e.message).join("; "),
      };
    }

    if (!result.createdAddress) {
      return {
        success: false,
        error: "Contract deployment failed - no address created",
      };
    }

    return {
      success: true,
      address: result.createdAddress,
      txHash: result.txHash,
      gasUsed: result.executionGasUsed,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown deployment error",
    };
  }
}

export async function fundAddress(
  client: {
    tevmDeal: (params: { account: `0x${string}`; amount: bigint }) => Promise<unknown>;
    tevmSetAccount: (params: {
      address: `0x${string}`;
      balance?: bigint;
      nonce?: bigint;
    }) => Promise<unknown>;
    getBalance: (args: { address: `0x${string}` }) => Promise<bigint>;
  },
  account: `0x${string}`,
  amount: bigint
): Promise<void> {
  try {
    // First try tevmDeal (works for recent blocks)
    await client.tevmDeal({
      account,
      amount,
    });
  } catch {
    // Fallback to tevmSetAccount for old blocks where eth_getProof fails
    // Get current balance and add the new amount
    let currentBalance = BigInt(0);
    try {
      currentBalance = await client.getBalance({ address: account });
    } catch {
      // Account doesn't exist yet, start from 0
      currentBalance = BigInt(0);
    }

    await client.tevmSetAccount({
      address: account,
      balance: currentBalance + amount,
      nonce: BigInt(0),
    });
  }
}