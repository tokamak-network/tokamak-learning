import type { VulnerabilityChallenge, VulnerabilityCategoryInfo } from "@/types/vulnerability";
import { parityWalletChallenge } from "./access-control/parity-wallet";
import { erc20TransferAclChallenge } from "./access-control/erc20-transfer-acl";
import { unprotectedInitChallenge } from "./access-control/unprotected-init";
import { erc20OverflowChallenge } from "./arithmetic/erc20-overflow";
import { erc20UnderflowChallenge } from "./arithmetic/erc20-underflow";
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
    id: "arithmetic",
    title: "Arithmetic Issues",
    description: "Integer overflow, underflow, and precision errors",
    order: 2,
  },
  {
    id: "reentrancy",
    title: "Reentrancy",
    description: "State manipulation through recursive external calls",
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
  // Access Control challenges
  parityWalletChallenge,
  erc20TransferAclChallenge,
  unprotectedInitChallenge,
  // Arithmetic challenges
  erc20OverflowChallenge,
  erc20UnderflowChallenge,
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
  erc20TransferAclChallenge,
  unprotectedInitChallenge,
  erc20OverflowChallenge,
  erc20UnderflowChallenge,
  tutorialUIBasics,
  tutorialParameterCalls,
  tutorialInspectTools,
  tutorialWriteExploit,
  tutorialMultiAttack,
};