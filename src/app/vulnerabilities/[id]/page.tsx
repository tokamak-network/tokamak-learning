import { notFound } from "next/navigation";
import { getChallengeById, vulnerabilityChallenges } from "@/data/vulnerabilities";
import { VulnerabilityClient } from "./VulnerabilityClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return vulnerabilityChallenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default async function VulnerabilityPage({ params }: PageProps) {
  const { id } = await params;
  const challenge = getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return <VulnerabilityClient challenge={challenge} />;
}