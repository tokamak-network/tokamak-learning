# AGENTS.md — Toka Learn Problem Design Guide

## Important Rules

- **All text in this platform must be written in English.** This includes problem titles, descriptions, hints, test messages, UI labels, error messages, comments in starter/solution code, plan documents, and code comments. No Korean (or any non-English) text anywhere in the codebase.

## Platform Philosophy

This platform is a **"learn by doing" Solidity learning environment.**
Users learn by typing code themselves, seeing results, experiencing errors, and fixing them on their own.

Core principles:
- **One concept per problem** — teach only one thing at a time
- **Typing is learning** — copy-paste is not learning
- **Errors are teaching tools** — intentionally let users experience failures
- **Small wins drive motivation** — frequent small successes keep users engaged

---

## Problem Design Principles

### 1. One Problem = One Concept

Never teach more than one new concept in a single problem.

```
// Bad: teaching variable declaration + function writing + event emission in one problem
// Good: variable declaration → next problem: functions → then: events
```

### 2. Incremental Code Expansion

Build new concepts on top of code written in previous problems.
The user should feel: "Oh, I'm adding this on top of what I did before."

```
Problem 1: Create an empty contract shell
Problem 2: Add a state variable to the same contract
Problem 3: Add a function to the same contract
Problem 4: Read the state variable from the function
```

### 3. Intentional Error Experience

Design experiences where users **write incorrect code, see the compile error, and then fix it correctly.**

---

## Problem Granularity Strategy

Break a single "topic" into multiple small problems.
Below is an example of breaking "state variables" into 7 problems.

### Example: Breaking "State Variables" into 7 Problems

| Order | Problem | What the user does | What they learn |
|-------|---------|-------------------|-----------------|
| 1 | Create empty contract | Type `contract MyFirst { }` | contract keyword, curly brace structure |
| 2 | Rename contract | Change `MyFirst` → `Storage` | Contract naming rules (PascalCase) |
| 3 | Declare uint variable | Add `uint public myNumber;` | State variable declaration, public keyword |
| 4 | Assign initial value | Add `= 42` | Initial value assignment syntax |
| 5 | Add string variable | Add `string public greeting = "Hello";` | Variables of different types |
| 6 | Wrong type assignment (error) | Write `uint public name = "Hello";` → see compile error | Understanding type mismatch errors |
| 7 | Fix the error | Change type to string | Reading error messages and fixing them |

---

## 3 Problem Types

### Type A: Write (most basic)

User fills in blanks or TODOs.

```typescript
{
  starterCode: `
contract Storage {
    // TODO: Declare a public uint variable named value
}`,
  solution: `
contract Storage {
    uint public value;
}`
}
```

**Design rules:**
- TODO comments must specify exactly what to do
- User should write only 1–3 lines at a time
- Provide as much completed code as possible in starterCode

### Type B: Fix (error experience)

Give intentionally broken code; user sees the error then fixes it.

```typescript
{
  description: `
# Fix the Type Error

The code below has a type error.
**First, compile it as-is to see the error message.**
Then fix it with the correct type.
`,
  starterCode: `
contract TypeFix {
    // This code has an error. Try compiling first!
    uint public name = "Alice";
}`,
  solution: `
contract TypeFix {
    string public name = "Alice";
}`
}
```

**Design rules:**
- description MUST include **"First, compile it as-is"** instruction
- There should be only 1 error (multiple errors cause confusion)
- The error cause must directly relate to the concept just learned

### Type C: Extend (build on previous)

Add new functionality to a contract similar to the previous problem.

```typescript
{
  description: `
# Add a Function

In the previous problem, you declared a state variable.
Now let's create a function to change its value.
`,
  starterCode: `
contract Storage {
    uint public value = 42;

    // TODO: Write a setValue function that changes value to a new number
}`
}
```

**Design rules:**
- Previously completed code is already included in starterCode
- Only the new part is left as a TODO
- Use "In the previous problem, you..." to create continuity

---

## Writing Descriptions

### Structure

All descriptions follow this order:

```markdown
# Title (action-oriented)

## What you'll learn (1-line summary)

Brief explanation (2–3 sentences max, analogies or real-life examples encouraged)

## Task

1. Specific instruction (what to type)
2. Second instruction
3. Compile and check the result

> Note: Use blockquotes for additional explanations
```

### Writing Rules

1. **Use imperative mood**: "You will declare" (X) → "Declare" (O)
2. **Show code first, then explain**: Explain → Code (X) → Code → Explain (O)
3. **Explain technical terms only on first appearance**: `public` — a keyword that makes the value readable from outside
4. **Use analogies**: "State variables are the contract's storage. Like writing in a notebook — it persists even when you close it."
5. **Keep it short**: Each problem's description should be readable without scrolling

### Bad vs Good Description

```markdown
<!-- Bad -->
# State Variables

In Solidity, state variables are data permanently stored on the
blockchain. They are stored in the contract's storage slots and
can be modified through transactions. Using EVM's SSTORE and SLOAD
opcodes... (long and abstract)
```

```markdown
<!-- Good -->
# Store a Number

Let's store a number in a contract.

`uint` is a type for storing positive integers.

## Task

1. Type the following code inside the contract:

   ```solidity
   uint public myNumber = 42;
   ```

2. Click the compile button to see the result.

> Adding `public` makes this value readable from outside.
```

---

## Writing Hints

- Hints should **point the direction without giving the answer**
- Provide only 1–2 hints
- First hint: syntax pattern. Second hint: more specific.

```typescript
hints: [
  "Declare using the pattern: uint public variableName = value;",  // pattern
  "Use myNumber as the name and 42 as the value"                    // more specific
]
```

---

## Designing testCases

### Principles

1. **Verify from the most basic**: contract name → function exists → return value
2. **Test messages should be in English and tell the user what went wrong**
3. **Limit beginner problems to 2–3 tests**

### Verification Order

```typescript
// Step 1: Check contract name (if needed)
expectedContractName: "Storage",

// Step 2: Check required functions exist
expectedFunctions: ["getValue", "setValue"],

// Step 3: Test actual behavior
testCases: [
  // Simple first
  { fn: "getValue", expected: "42", message: "getValue() should return 42" },
  // State change test
  {
    fn: "getValue",
    expected: "100",
    message: "getValue() should return 100 after calling setValue(100)",
    setup: [{ fn: "setValue", args: ["100"] }]
  }
]
```

### Writing Test Messages

```
Bad: "Test failed"
Bad: "getValue test failed"

Good: "getValue() should return 42"
Good: "getValue() should return 100 after calling setValue(100)"
Good: "name should be a public string variable"
```

---

## Category Progression Flow

```
basics
  "Knows nothing about code" → "Can create a contract"
  ↓
integers
  Focus on number types
  ↓
basic-types
  bool, address, bytes, string, enum
  ↓
arithmetic
  +, -, *, /, %, **
  ↓
comparison
  Comparison operators, if/else, ternary
  ↓
variables
  Scope, visibility, view/pure, defaults
  ↓
gotchas
  Overflow, no decimals, delete behavior, etc.
  ↓
control-flow
  Loops, error handling, require/assert
  ↓
data-structures
  Arrays, mappings, structs, events
  ↓
advanced
  Inheritance, interfaces, modifiers, payable
  ↓
patterns
  ERC20, design pattern applications
```

The **first problem in each category must be beginner difficulty.**
Difficulty increases gradually within each category.

---

## Checklist for Adding New Problems

Before creating a problem, verify all of the following:

- [ ] **One problem = one concept?**
- [ ] Does it connect naturally to the previous problem?
- [ ] Does starterCode provide enough scaffolding? (user adds/modifies only 1–5 lines)
- [ ] Is the description readable without scrolling?
- [ ] Are the tasks clear and specific?
- [ ] Do hints point the direction without giving the answer?
- [ ] Are test messages in English and descriptive of what went wrong?
- [ ] Is there at least 1 error-experience (Type B) problem per category?
- [ ] Is the `order` value sequential within the category?
- [ ] Does difficulty increase gradually within the category?

---

## Error Experience Problem Design Guide

Error experience problems are this platform's **most important differentiator.**

### Design Steps

1. **Decide the error first**: What error should the user experience?
2. **Create minimal code that triggers it**: Only one thing wrong
3. **Include "First, compile as-is" in the description**
4. **Explain what the error message means**
5. **Give a hint toward the fix**

### Recommended Error Experiences by Category

| Category | Error to experience | Example |
|----------|-------------------|---------|
| basics | Missing semicolon | `uint public x = 1` (no semicolon) |
| basics | Missing pragma | Compile without pragma |
| integers | Type mismatch | `uint x = -1` |
| integers | Overflow | `uint8 x = 256` |
| basic-types | Assign number to string | `string x = 123` |
| arithmetic | Division by zero | `x / 0` |
| variables | Access state in pure function | Read `this.value` in a `pure` function |
| gotchas | Overflow without unchecked | Attempt overflow in 0.8+ |

---

## starterCode Writing Rules

1. **Always include SPDX and pragma** (don't make users type these every time)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
```

2. **Provide the contract declaration** in most cases (except first few problems)
3. **The TODO comment's position is the answer's position**
4. **Clearly separate completed code from TODOs**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint public count = 0;          // ← already completed

    // TODO: Write an increment function that increases count by 1
    // TODO: Write a decrement function that decreases count by 1
}
```

---

## Difficulty Guidelines

### beginner

- Code to add/modify: **1–3 lines**
- New concepts: **1**
- Test cases: **1–2**
- Hints: nearly answer-level
- Error experience: simple syntax errors

### intermediate

- Code to add/modify: **3–10 lines**
- New concepts: **1** (combining previous concepts is fine)
- Test cases: **2–4**
- Hints: directional guidance
- Error experience: logic errors, type errors

### advanced

- Code to add/modify: **5–20 lines**
- New concepts: **1** (must leverage previous concepts)
- Test cases: **3–5**
- Hints: concept-level explanation
- Error experience: security vulnerabilities, runtime errors

---

## Problem Connection Patterns

### Buildup Pattern (incrementally extend the same contract)

```
Problem 1: Counter contract — declare count variable
Problem 2: Counter contract — add increment function
Problem 3: Counter contract — add decrement function
Problem 4: Counter contract — add reset function
```

### Contrast Pattern (similar but different, placed consecutively)

```
Problem A: Using uint256
Problem B: Using int256 (negatives allowed!)
Problem C: Using uint8 (range limited!)
```

### Error-Fix Pattern (fail → succeed)

```
Problem X: Write intentionally wrong code → see the error
Problem Y: Fix the error to make it work correctly
```

---

## Never Do These

1. **Don't put multiple concepts in one problem**
2. **Don't write long descriptions** — if users get tired reading, learning stops
3. **Don't use technical jargon without explanation**
4. **Don't give an empty file as starterCode** — always provide scaffolding
5. **Don't create more than 5 tests** — 5 red lines is overwhelming for beginners
6. **Don't use syntax not taught in previous categories**
7. **Don't give vague instructions like "figure it out yourself"**
