import type { VulnerabilityChallenge, VulnerabilityCategoryInfo } from "@/types/vulnerability";
import { parityWalletChallenge } from "./access-control/parity-wallet";
import { tutorialUIBasics } from "./tutorial/01-ui-basics";
import { tutorialParameterCalls } from "./tutorial/02-parameter-calls";
import { tutorialInspectTools } from "./tutorial/03-inspect-tools";
import { tutorialWriteExploit } from "./tutorial/04-write-exploit";
import { tutorialMultiAttack } from "./tutorial/05-multi-attack";

export const vulnerabilityCategories: VulnerabilityCategoryInfo[] = [
  {
    id: "access-control",
    title: "Access Control",
    description: "Missing permission validation, proxy vulnerabilities, and owner privilege issues",
    order: 1,
  },
  {
    id: "reentrancy",
    title: "Reentrancy",
    description: "State manipulation through recursive external calls",
    order: 2,
  },
  {
    id: "overflow",
    title: "Integer Overflow",
    description: "Arithmetic overflow and underflow vulnerabilities",
    order: 3,
  },
  {
    id: "front-running",
    title: "Front Running",
    description: "Transaction ordering and MEV vulnerabilities",
    order: 4,
  },
  {
    id: "honeypot",
    title: "Honeypot",
    description: "Traps disguised as vulnerable contracts",
    order: 5,
  },
];

export const vulnerabilityChallenges: VulnerabilityChallenge[] = [
  // Tutorials - recommended to complete first
  tutorialUIBasics,
  tutorialParameterCalls,
  tutorialInspectTools,
  tutorialWriteExploit,
  tutorialMultiAttack,
  // Real challenges
  parityWalletChallenge,
];

export function getChallengeById(id: string): VulnerabilityChallenge | undefined {
  return vulnerabilityChallenges.find((c) => c.id === id);
}

export function getNextChallenge(currentId: string): VulnerabilityChallenge | undefined {
  const currentIndex = vulnerabilityChallenges.findIndex((c) => c.id === currentId);
  if (currentIndex === -1 || currentIndex === vulnerabilityChallenges.length - 1) {
    return undefined;
  }
  return vulnerabilityChallenges[currentIndex + 1];
}

export function getChallengeIndex(id: string): number {
  return vulnerabilityChallenges.findIndex((c) => c.id === id);
}

export function getTotalChallenges(): number {
  return vulnerabilityChallenges.length;
}

export function getChallengesByCategory(categoryId: string): VulnerabilityChallenge[] {
  return vulnerabilityChallenges
    .filter((c) => c.category === categoryId)
    .sort((a, b) => {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      return order[a.difficulty] - order[b.difficulty];
    });
}

export function getTutorialChallenges(): VulnerabilityChallenge[] {
  return vulnerabilityChallenges.filter((c) => c.id.startsWith("tutorial-"));
}

export function getNonTutorialChallenges(): VulnerabilityChallenge[] {
  return vulnerabilityChallenges.filter((c) => !c.id.startsWith("tutorial-"));
}

export { 
  parityWalletChallenge,
  tutorialUIBasics,
  tutorialParameterCalls,
  tutorialInspectTools,
  tutorialWriteExploit,
  tutorialMultiAttack,
};