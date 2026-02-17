# AGENTS.md — Problem Definitions

**Generated:** 2026-02-17

---

## OVERVIEW

Solidity learning problem dataset. Each category file exports a `Problem[]` array. All problems are merged in `../problems.ts`.

---

## STRUCTURE

```
problems/
├── basics.ts        # Contract creation, variables, constructors
├── integers.ts      # uint8-256, int8-256, overflow
├── basic-types.ts   # bool, address, bytes, string, enum
├── arithmetic.ts    # +, -, *, /, %, **
├── comparison.ts    # Comparison operators, if/else, ternary
├── variables.ts     # Scope, visibility, view/pure
├── gotchas.ts       # Overflow, decimals, delete behavior
├── control-flow.ts  # Loops, require/assert/revert
├── data-structures.ts  # Arrays, mappings, structs
├── advanced.ts      # Inheritance, interfaces, modifiers
└── patterns.ts      # ERC20, design patterns
```

---

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add problem to category | `{category}.ts` → push to `{category}_problems` array |
| Problem interface | `../problems.ts` → `Problem` interface |
| Category list | `../problems.ts` → `categories` array |
| Problem helper functions | `../problems.ts` → `getProblemById`, `getNextProblem`, etc. |

---

## CONVENTIONS

### File Naming

- File: `{category-id}.ts` (kebab-case, matches `category` field in Problem)
- Export: `{category_id}_problems` (snake_case)

### Problem ID

- Format: `{category}-{concept}` (kebab-case)
- Example: `basics-first-variable`, `integers-uint8-overflow`

### Problem Order

- `order` starts at 1 within each category
- Must be sequential (no gaps)
- First problem in each category must be `difficulty: "beginner"`

### starterCode

- ALWAYS include SPDX and pragma
- ALWAYS include `import "hardhat/console.sol"`
- TODO comments on their own lines
- Scaffolding complete — user writes 1-5 lines

---

## ANTI-PATTERNS

- **NEVER** Korean text in problems (titles, descriptions, hints, test messages)
- **NEVER** multiple concepts in one problem
- **NEVER** empty starterCode — always provide scaffolding
- **NEVER** more than 5 test cases per problem
- **NEVER** skip `hardhat/console.sol` import

---

## TESTING

After adding/modifying problems:

```bash
npm run validate    # Validate schema
npm run test        # Run EVM tests
```