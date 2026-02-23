// src/data/vulnerabilities/index.ts

import type { VulnerabilityProblem, VulnerabilityCategoryInfo } from "@/types/vulnerability";
import { parityWalletHack } from "./access-control/parity-wallet";

export const vulnerabilityCategories: VulnerabilityCategoryInfo[] = [
  {
    id: "access-control",
    title: "Access Control",
    description: "권한 검증 누락, 프록시 취약점, Owner 권한 관련 취약점",
    order: 1,
  },
];

export const vulnerabilityProblems: VulnerabilityProblem[] = [
  parityWalletHack,
];

export function getVulnerabilityById(id: string): VulnerabilityProblem | undefined {
  return vulnerabilityProblems.find((p) => p.id === id);
}

export function getVulnerabilitiesByCategory(
  categoryId: string
): VulnerabilityProblem[] {
  return vulnerabilityProblems
    .filter((p) => p.category === categoryId)
    .sort((a, b) => {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      return order[a.difficulty] - order[b.difficulty];
    });
}
