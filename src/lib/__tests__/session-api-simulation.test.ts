import { describe, it, expect, beforeAll, afterAll } from "vitest";

/**
 * 이 테스트는 API 라우트 시뮬레이션을 통해 세션 공유 문제를 재현합니다.
 * 
 * 시나리오:
 * 1. PUT /api/vulnerability/run → 세션 생성
 * 2. POST /api/vulnerability/verify → 세션 사용
 * 
 * 두 호출 사이에 모듈이 리로드되면 세션이 손실됩니다.
 */

import { createMemoryClient } from "tevm";
import type { MemoryClient } from "tevm";
import {
  createSession,
  getSession,
  deleteSession,
  sessionExists,
} from "../challenge-runner";

describe("Session API Simulation", () => {
  let testClient: MemoryClient;
  let createdSessionIds: string[] = [];

  beforeAll(async () => {
    testClient = await createMemoryClient();
  });

  afterAll(() => {
    createdSessionIds.forEach((id) => {
      try {
        deleteSession(id);
      } catch {
        // ignore
      }
    });
  });

  it("should simulate full API flow: PUT run → POST verify", async () => {
    console.log("\n=== Simulating PUT /api/vulnerability/run ===");

    // Simulate PUT /api/vulnerability/run
    const challengeId = "test-challenge";
    const deployedContracts = {
      SimpleCounter: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    };
    const contractAbis = {
      SimpleCounter: ["function count() view returns (uint256)"],
    };

    const sessionId = createSession(testClient, deployedContracts, contractAbis);
    createdSessionIds.push(sessionId);

    console.log(`Created sessionId: ${sessionId}`);
    console.log(`Session exists: ${sessionExists(sessionId)}`);

    // Return response like the API would
    const putResponse = {
      success: true,
      sessionId,
      deployedContracts,
      contractAbis,
      message: "Challenge environment ready",
    };

    expect(putResponse.sessionId).toBe(sessionId);

    // Small delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 10));

    console.log("\n=== Simulating POST /api/vulnerability/verify ===");

    // Simulate POST /api/vulnerability/verify
    const verifySessionId = putResponse.sessionId;
    console.log(`Verifying with sessionId: ${verifySessionId}`);
    console.log(`Session exists before getSession: ${sessionExists(verifySessionId)}`);

    const session = getSession(verifySessionId);
    console.log(`getSession result: ${session ? "FOUND" : "NOT FOUND"}`);

    if (!session) {
      // This would result in 404 error
      console.log("ERROR: Session not found - would return 404");
      throw new Error("Session not found");
    }

    // Verify the session has the expected data
    expect(session).toBeDefined();
    expect(session.deployedContracts).toEqual(deployedContracts);
    expect(session.contractAbis).toEqual(contractAbis);
  });

  it("should handle multiple sequential API calls with same session", async () => {
    const deployedContracts = { Token: "0xABCDEF" };
    const sessionId = createSession(testClient, deployedContracts, {});
    createdSessionIds.push(sessionId);

    // Simulate multiple verify calls
    for (let i = 0; i < 3; i++) {
      console.log(`\nCall ${i + 1}: Checking session ${sessionId}`);
      const session = getSession(sessionId);
      expect(session).toBeDefined();
      console.log(`Session found: YES`);
    }
  });

  it("should demonstrate what happens when sessionId is wrong", async () => {
    const deployedContracts = { Token: "0xABCDEF" };
    const sessionId = createSession(testClient, deployedContracts, {});
    createdSessionIds.push(sessionId);

    // Try with wrong sessionId
    const wrongSessionId = "wrong-session-id-12345";
    console.log(`\nTrying to get session with wrong ID: ${wrongSessionId}`);
    const session = getSession(wrongSessionId);
    
    expect(session).toBeUndefined();
    console.log("Session found: NO (expected)");
  });

  it("should measure session Map identity across imports", async () => {
    // This test verifies that multiple imports share the same Map
    // In Node.js/Vitest, this should always pass
    // In Next.js dev mode with separate workers, this might fail

    const sessionId = createSession(testClient, { Test: "0x1234" }, {});
    createdSessionIds.push(sessionId);

    // Import the module again to see if we get the same Map
    const { getSession: getSession2, sessionExists: sessionExists2 } = await import(
      "../challenge-runner"
    );

    // Check if the session is accessible through the re-imported functions
    const exists = sessionExists2(sessionId);
    const sessionFromReimport = getSession2(sessionId);

    console.log(`\nSession exists after reimport: ${exists}`);
    console.log(`Session found after reimport: ${sessionFromReimport ? "YES" : "NO"}`);

    // In the same process, this should work
    expect(exists).toBe(true);
    expect(sessionFromReimport).toBeDefined();
  });
});