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

  return <ProblemClient problem={problem} />;
}
