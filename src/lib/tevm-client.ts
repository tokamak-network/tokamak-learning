import { createMemoryClient, http } from "tevm";
import { mainnet } from "tevm/common";
import type { Common } from "tevm/common";

export interface ForkConfig {
  rpcUrl: string;
  chainId: number;
  blockNumber: bigint;
}

// TEVM MemoryClient type - it combines viem client with TEVM actions
export type TevmClient = Awaited<ReturnType<typeof createForkedClient>>;

/**
 * Creates a TEVM memory client that forks from a specific block on a network.
 * This allows replaying historical transactions and testing against real blockchain state.
 */
export async function createForkedClient(config: ForkConfig) {
  const common = getChainById(config.chainId);

  const client = createMemoryClient({
    common,
    fork: {
      transport: http(config.rpcUrl)({}),
      blockTag: config.blockNumber,
    },
    // Auto-mine after each transaction for easier testing
    miningConfig: {
      type: "auto",
    },
  });

  // Wait for the fork to be ready
  await client.tevmReady();

  return client;
}

/**
 * Gets the TEVM Common configuration for a given chain ID.
 * Falls back to mainnet if the chain is not explicitly supported.
 */
function getChainById(chainId: number): Common {
  // For now, we only support mainnet (chainId 1)
  // Additional chains can be added as needed
  switch (chainId) {
    case 1:
      return mainnet;
    default:
      // Default to mainnet for unsupported chains
      // TEVM will attempt to configure based on the fork
      return mainnet;
  }
}

/**
 * Standard attacker address used for exploit testing.
 * This address can be impersonated to simulate attacks.
 */
export const ATTACKER_ADDRESS = "0xdead000000000000000000000000000000000000";
