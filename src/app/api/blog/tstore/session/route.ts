import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMemoryClient = any;

// Global session storage
declare global {
  // eslint-disable-next-line no-var
  var __blog_sessions: Map<string, {
    client: AnyMemoryClient;
    deployedContracts: Record<string, string>;
  }> | undefined;
}

function getSessionsMap() {
  if (!globalThis.__blog_sessions) {
    globalThis.__blog_sessions = new Map();
  }
  return globalThis.__blog_sessions;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, action, address, slot } = await req.json();

    // Get session
    const sessions = getSessionsMap();
    const session = sessions.get(sessionId);

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Session not found.",
      }, { status: 404 });
    }

    const { client } = session;

    if (action === "getStorage") {
      const value = await client.getStorageAt({
        address: address as `0x${string}`,
        slot: slot as `0x${string}`,
      });

      return NextResponse.json({
        success: true,
        value: value || "0x" + "0".repeat(64),
      });
    }

    return NextResponse.json({
      success: false,
      error: `Unknown action: ${action}`,
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}