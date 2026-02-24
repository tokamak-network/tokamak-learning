import { describe, it, expect, beforeEach } from "vitest";

// challenge-runner.ts의 세션 로직을 직접 테스트하기 위해
// 동일한 방식으로 로컬 Map을 사용하는 간단한 구현을 테스트합니다.

describe("Session Management", () => {
  // challenge-runner.ts와 동일한 패턴
  const sessions = new Map<string, { client: unknown; deployedContracts: Record<string, string>; contractAbis: Record<string, string[]> }>();

  function createSession(client: unknown, deployedContracts: Record<string, string>, contractAbis: Record<string, string[]>): string {
    const sessionId = Math.random().toString(36).substring(2, 15);
    sessions.set(sessionId, { client, deployedContracts, contractAbis });
    return sessionId;
  }

  function getSession(sessionId: string) {
    return sessions.get(sessionId);
  }

  function sessionExists(sessionId: string): boolean {
    return sessions.has(sessionId);
  }

  beforeEach(() => {
    sessions.clear();
  });

  it("should create and retrieve a session", () => {
    const mockClient = { name: "test-client" };
    const deployedContracts = { TestContract: "0x1234567890abcdef" };
    const contractAbis = { TestContract: ["function test()"] };

    const sessionId = createSession(mockClient, deployedContracts, contractAbis);
    
    expect(sessionId).toBeDefined();
    expect(sessionExists(sessionId)).toBe(true);
    
    const session = getSession(sessionId);
    expect(session).toBeDefined();
    expect(session?.client).toBe(mockClient);
    expect(session?.deployedContracts).toEqual(deployedContracts);
  });

  it("should return undefined for non-existent session", () => {
    const session = getSession("non-existent-id");
    expect(session).toBeUndefined();
  });

  it("should simulate the API flow: PUT /api/vulnerability/run then POST /api/vulnerability/verify", async () => {
    // Step 1: PUT /api/vulnerability/run creates a session
    const mockClient = { name: "tevm-client" };
    const deployedContracts = { SimpleCounter: "0xabcd1234" };
    const contractAbis = { SimpleCounter: ["function count() view returns (uint256)"] };

    const sessionId = createSession(mockClient, deployedContracts, contractAbis);
    console.log("Created sessionId:", sessionId);
    console.log("sessions.size after create:", sessions.size);
    console.log("sessionExists(sessionId):", sessionExists(sessionId));

    // Step 2: POST /api/vulnerability/verify tries to get the session
    const retrievedSession = getSession(sessionId);
    console.log("Retrieved session:", retrievedSession ? "found" : "NOT FOUND");
    
    expect(retrievedSession).toBeDefined();
    expect(retrievedSession?.deployedContracts).toEqual(deployedContracts);
  });

  it("should handle multiple sessions", () => {
    const client1 = { id: 1 };
    const client2 = { id: 2 };

    const id1 = createSession(client1, {}, {});
    const id2 = createSession(client2, {}, {});

    expect(sessionExists(id1)).toBe(true);
    expect(sessionExists(id2)).toBe(true);
    expect(getSession(id1)?.client).toBe(client1);
    expect(getSession(id2)?.client).toBe(client2);
  });

  it("should detect the actual bug: Map reference sharing", () => {
    // 이 테스트는 현재 구현이 같은 Map을 공유하는지 확인합니다.
    // API 라우트 간에 Map이 공유되지 않는다면 이 테스트는 통과하지만
    // 실제 앱에서는 실패할 것입니다.
    
    const sessionId = createSession({ test: true }, { Contract: "0x1234" }, {});
    
    // 같은 모듈 컨텍스트에서는 항상 찾아야 함
    expect(getSession(sessionId)).toBeDefined();
    
    // 하지만 Next.js 개발 모드에서는 API 라우트가 다른 모듈 컨텍스트에서 실행될 수 있음
    // 이것이 실제 버그의 원인일 가능성이 높음
  });
});

describe("Module-level Map behavior simulation", () => {
  // 이 테스트는 문제를 시뮬레이션합니다.
  // 실제로는 같은 파일에서 import하면 같은 Map을 공유하지만,
  // Next.js의 HMR이나 서버리스 환경에서는 다를 수 있습니다.

  it("should demonstrate the expected behavior", () => {
    const map1 = new Map<string, string>();
    map1.set("key1", "value1");
    
    // 같은 참조
    const map2 = map1;
    expect(map2.get("key1")).toBe("value1");
    
    // 하지만 새로운 Map을 만들면?
    const map3 = new Map<string, string>();
    expect(map3.get("key1")).toBeUndefined(); // 당연히 undefined
  });
});