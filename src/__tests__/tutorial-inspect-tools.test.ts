import { describe, it, expect, beforeAll } from "vitest";
import { createLocalEVM, setupChallenge, ATTACKER_ADDRESS } from "@/lib/challenge-runner";
import { tutorialInspectTools } from "@/data/vulnerabilities/tutorial/03-inspect-tools";
import { compileSolidity } from "@/lib/solc-compiler";
import { parseEther } from "viem";
import type { MemoryClient } from "tevm";

describe("Tutorial Inspect Tools Challenge", () => {
  let client: MemoryClient;

  beforeAll(async () => {
    client = await createLocalEVM();
  });

  it("should compile SimpleBank contract", async () => {
    const contract = tutorialInspectTools.setup.contracts[0];
    const compiled = compileSolidity(contract.source);

    expect(compiled.success).toBe(true);
    expect(compiled.bytecode).toBeDefined();
    expect(compiled.contractName).toBe("SimpleBank");
  });

  it("should deploy contract with payable constructor and value", async () => {
    await client.tevmSetAccount({
      address: ATTACKER_ADDRESS,
      balance: parseEther("100"),
      nonce: BigInt(0),
    });

    const contract = tutorialInspectTools.setup.contracts[0];
    const compiled = compileSolidity(contract.source);

    const result = await client.tevmCall({
      from: ATTACKER_ADDRESS,
      data: `0x${compiled.bytecode}` as `0x${string}`,
      value: parseEther("10"),
      gas: BigInt(10_000_000),
      addToBlockchain: true,
    });

    expect(result.errors).toBeUndefined();
    expect(result.createdAddress).toBeDefined();
  });

  it("should setup the entire challenge using setupChallenge", async () => {
    const freshClient = await createLocalEVM();
    const setupResult = await setupChallenge(freshClient, tutorialInspectTools);

    expect(Object.keys(setupResult.deployedContracts)).toContain("SimpleBank");
    expect(Object.keys(setupResult.contractAbis)).toContain("SimpleBank");
  });

  it("should have correct balance in deployed SimpleBank", async () => {
    const freshClient = await createLocalEVM();
    const setupResult = await setupChallenge(freshClient, tutorialInspectTools);

    const bankAddress = setupResult.deployedContracts["SimpleBank"] as `0x${string}`;
    const balance = await freshClient.getBalance({ address: bankAddress });

    // SimpleBank was deployed with 10 ETH value
    expect(balance).toBe(parseEther("10"));
  });
});