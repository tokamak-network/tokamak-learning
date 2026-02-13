import { NextRequest, NextResponse } from "next/server";
import { getProblemById } from "@/data/problems";

// Stricter rate limit for solutions: max 5 requests per 60s per IP
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

function getClientIP(req: NextRequest): string {
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const problem = getProblemById(id);
  if (!problem) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    solution: problem.solution,
    hints: problem.hints,
  });
}
