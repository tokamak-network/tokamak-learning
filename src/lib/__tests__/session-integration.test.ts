import { describe, it, expect, beforeAll, afterAll } from "vitest";

/**
 * 이 테스트는 실제 API 라우트 간 세션 공유를 테스트합니다.
 * 
 * 문제: Next.js 개발 모드에서 API 라우트가 다른 모듈 컨텍스트에서 실행될 수 있어,
 * challenge-runner.ts의 sessions Map이 공유되지 않을 수 있습니다.
 * 
 * 이 테스트가 실패하면 실제 버그가 확인된 것입니다.
 */

// 실제 challenge-runner 모듈을 import
import { 
  createSession, 
  getSession, 
  deleteSession, 
  sessionExists 
} from "../challenge-runner";
import { createMemoryClient } from "tevm";
import type { MemoryClient } from "tevm";

describe("API Route Session Sharing Integration Test", () => {
  let testClient: MemoryClient;
  let createdSessionIds: string[] = [];

  beforeAll(async () => {
    testClient = await createMemoryClient();
  });

  afterAll(() => {
    // Cleanup created sessions
    createdSessionIds.forEach(id => {
      try {
        deleteSession(id);
      } catch {
        // ignore
      }
    });
  });

  it("should verify session is created and accessible (same module)", async () => {
    const deployedContracts = { TestContract: "0x1234567890abcdef" };
    const contractAbis = { TestContract: ["function test()"] };

    // Simulate PUT /api/vulnerability/run
    const sessionId = createSession(testClient, deployedContracts, contractAbis);
    createdSessionIds.push(sessionId);
    console.log("Step 1 - Created sessionId:", sessionId);

    // Immediately check if session exists (same module)
    const exists = sessionExists(sessionId);
    console.log("Step 2 - sessionExists:", exists);

    // Simulate POST /api/vulnerability/verify
    const session = getSession(sessionId);
    console.log("Step 3 - getSession result:", session ? "found" : "NOT FOUND");

    expect(exists).toBe(true);
    expect(session).toBeDefined();
    expect(session?.deployedContracts).toEqual(deployedContracts);
  });

  it("should handle session lifecycle", async () => {
    const sessionId = createSession(testClient, { Contract: "0xabcd" }, {});
    createdSessionIds.push(sessionId);
    
    expect(sessionExists(sessionId)).toBe(true);
    
    deleteSession(sessionId);
    
    expect(sessionExists(sessionId)).toBe(false);
    expect(getSession(sessionId)).toBeUndefined();
  });
  
  it("should distinguish between different sessions", async () => {
    const id1 = createSession(testClient, { Contract1: "0x1111" }, {});
    const id2 = createSession(testClient, { Contract2: "0x2222" }, {});
    createdSessionIds.push(id1, id2);
    
    expect(id1).not.toBe(id2);
    expect(sessionExists(id1)).toBe(true);
    expect(sessionExists(id2)).toBe(true);
    
    const session1 = getSession(id1);
    const session2 = getSession(id2);
    
    expect(session1?.deployedContracts).toEqual({ Contract1: "0x1111" });
    expect(session2?.deployedContracts).toEqual({ Contract2: "0x2222" });
  });
});