import { basics_problems } from "./problems/basics";
import { integers_problems } from "./problems/integers";
import { basic_types_problems } from "./problems/basic-types";
import { arithmetic_problems } from "./problems/arithmetic";
import { comparison_problems } from "./problems/comparison";
import { variables_problems } from "./problems/variables";
import { gotchas_problems } from "./problems/gotchas";
import { control_flow_problems } from "./problems/control-flow";
import { data_structures_problems } from "./problems/data-structures";
import { advanced_problems } from "./problems/advanced";
import { patterns_problems } from "./problems/patterns";

export interface TestCase {
  fn: string;
  args?: string[];
  expected?: string;
  message: string;
  value?: string;
  setup?: { fn: string; args?: string[]; value?: string }[];
  expectRevert?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testDescription: string;
  expectedFunctions?: string[];
  expectedEvents?: string[];
  testCases?: TestCase[];
  constructorArgs?: string[];
  expectedContractName?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  order: number;
}

export const categories: Category[] = [
  { id: "basics", title: "Basics", description: "Learn the basic structure and syntax of Solidity", order: 1 },
  { id: "integers", title: "Integers", description: "Learn about various sizes and properties of uint and int", order: 2 },
  { id: "basic-types", title: "Basic Types", description: "Learn bool, address, bytes, string, and enum types", order: 3 },
  { id: "arithmetic", title: "Arithmetic", description: "Learn Solidity arithmetic operators one by one", order: 4 },
  { id: "comparison", title: "Comparison & Logic", description: "Learn comparison, logical operators, and conditionals", order: 5 },
  { id: "variables", title: "Variables & Functions", description: "Learn variable types, visibility, and function basics", order: 6 },
  { id: "gotchas", title: "Solidity Gotchas", description: "Learn unique characteristics of Solidity that differ from other languages", order: 7 },
  { id: "control-flow", title: "Control Flow", description: "Learn loops and error handling", order: 8 },
  { id: "data-structures", title: "Data Structures", description: "Learn arrays, mappings, and structs", order: 9 },
  { id: "advanced", title: "Advanced", description: "Learn inheritance, interfaces, events, and other advanced features", order: 10 },
  { id: "patterns", title: "Design Patterns", description: "Learn smart contract patterns used in production", order: 11 },
];

export const problems: Problem[] = [
  ...basics_problems,
  ...integers_problems,
  ...basic_types_problems,
  ...arithmetic_problems,
  ...comparison_problems,
  ...variables_problems,
  ...gotchas_problems,
  ...control_flow_problems,
  ...data_structures_problems,
  ...advanced_problems,
  ...patterns_problems,
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblemsByCategory(categoryId: string): Problem[] {
  return problems
    .filter((p) => p.category === categoryId)
    .sort((a, b) => a.order - b.order);
}

export function getNextProblem(currentId: string): Problem | undefined {
  const current = getProblemById(currentId);
  if (!current) return undefined;

  const sameCategory = getProblemsByCategory(current.category);
  const idx = sameCategory.findIndex((p) => p.id === currentId);
  if (idx < sameCategory.length - 1) return sameCategory[idx + 1];

  const cat = categories.find((c) => c.id === current.category);
  if (!cat) return undefined;
  const nextCat = categories.find((c) => c.order === cat.order + 1);
  if (!nextCat) return undefined;
  const nextProblems = getProblemsByCategory(nextCat.id);
  return nextProblems[0];
}

export function getPrevProblem(currentId: string): Problem | undefined {
  const current = getProblemById(currentId);
  if (!current) return undefined;

  const sameCategory = getProblemsByCategory(current.category);
  const idx = sameCategory.findIndex((p) => p.id === currentId);
  if (idx > 0) return sameCategory[idx - 1];

  const cat = categories.find((c) => c.id === current.category);
  if (!cat) return undefined;
  const prevCat = categories.find((c) => c.order === cat.order - 1);
  if (!prevCat) return undefined;
  const prevProblems = getProblemsByCategory(prevCat.id);
  return prevProblems[prevProblems.length - 1];
}
