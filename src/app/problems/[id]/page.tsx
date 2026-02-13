import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProblemById, problems } from "@/data/problems";
import ProblemClient from "./ProblemClient";

export function generateStaticParams() {
  return problems.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) return { title: "Problem Not Found" };

  return {
    title: `${problem.title} - Solidity Challenge`,
    description: `${problem.difficulty} level Solidity exercise: ${problem.title}. Learn by writing real smart contract code.`,
  };
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
