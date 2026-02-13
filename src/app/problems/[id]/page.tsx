import { notFound } from "next/navigation";
import { getProblemById, problems } from "@/data/problems";
import ProblemClient from "./ProblemClient";

export function generateStaticParams() {
  return problems.map((p) => ({ id: p.id }));
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) notFound();

  // Strip solution/hints from client payload
  const { solution, hints, ...clientProblem } = problem;
  void solution;
  void hints;

  return <ProblemClient problem={clientProblem} />;
}
