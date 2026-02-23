// src/app/vulnerabilities/[id]/page.tsx

import { notFound } from "next/navigation";
import { getVulnerabilityById, vulnerabilityProblems } from "@/data/vulnerabilities";
import { VulnerabilityClient } from "./VulnerabilityClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return vulnerabilityProblems.map((problem) => ({
    id: problem.id,
  }));
}

export default async function VulnerabilityPage({ params }: PageProps) {
  const { id } = await params;
  const problem = getVulnerabilityById(id);

  if (!problem) {
    notFound();
  }

  return <VulnerabilityClient problem={problem} />;
}
