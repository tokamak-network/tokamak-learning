import { NextRequest, NextResponse } from "next/server";
import { getProblemById } from "@/data/problems";

export async function GET(req: NextRequest) {
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
