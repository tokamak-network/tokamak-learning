/**
 * Validates problem data integrity.
 * Run with: npx tsx scripts/validate-data.ts
 */
import { problems, categories } from "../src/data/problems";

const errors: string[] = [];
const warnings: string[] = [];

// --- Problem validation ---

const seenIds = new Set<string>();
const validCategories = new Set(categories.map((c) => c.id));

for (const p of problems) {
  // Duplicate ID
  if (seenIds.has(p.id)) {
    errors.push(`Duplicate problem ID: "${p.id}"`);
  }
  seenIds.add(p.id);

  // Required fields
  if (!p.title) errors.push(`${p.id}: missing title`);
  if (!p.description) errors.push(`${p.id}: missing description`);
  if (!p.starterCode) errors.push(`${p.id}: missing starterCode`);
  if (!p.solution) errors.push(`${p.id}: missing solution`);
  if (!p.hints || p.hints.length === 0) warnings.push(`${p.id}: no hints`);
  if (!p.testDescription) warnings.push(`${p.id}: missing testDescription`);

  // Valid category
  if (!validCategories.has(p.category)) {
    errors.push(`${p.id}: invalid category "${p.category}"`);
  }

  // Must have some form of validation
  const hasTests = p.testCases && p.testCases.length > 0;
  const hasFunctions = p.expectedFunctions && p.expectedFunctions.length > 0;
  const hasContractName = !!p.expectedContractName;
  if (!hasTests && !hasFunctions && !hasContractName) {
    errors.push(`${p.id}: no testCases, expectedFunctions, or expectedContractName`);
  }
}

// --- Report ---

if (warnings.length > 0) {
  console.warn(`\n⚠  ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.warn(`   ${w}`));
}

if (errors.length > 0) {
  console.error(`\n✗  ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`   ${e}`));
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(`\n✓  All ${problems.length} problems validated.\n`);
