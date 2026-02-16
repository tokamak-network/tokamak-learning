#!/usr/bin/env bash
#
# Daily challenge generation + Claude CLI quality review
#
# Usage:
#   ./scripts/review-daily.sh
#   npm run review-daily
#
# Output:
#   reviews/daily-review-YYYY-MM-DD-HHMMSS.md   (Claude CLI review)
#   reviews/daily-questions-YYYY-MM-DD-HHMMSS.json (generated questions for reference)
#
set -euo pipefail

cd "$(dirname "$0")/.."

TMPDIR_REVIEW=$(mktemp -d)
trap 'rm -rf "$TMPDIR_REVIEW"' EXIT

TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
mkdir -p reviews

# --- 1. Generate daily questions ---
echo "==> Step 1/3: Generating daily challenges..."
RAW_OUTPUT=$(npm run generate-daily 2>&1) || {
  echo "Error: generate-daily failed"
  echo "$RAW_OUTPUT"
  exit 1
}

# Extract the JSON block after "=== Full JSON ==="
echo "$RAW_OUTPUT" | sed -n '/^=== Full JSON ===/,$ p' | tail -n +2 > "$TMPDIR_REVIEW/questions.json"

if [ ! -s "$TMPDIR_REVIEW/questions.json" ]; then
  echo "Error: No JSON found in generate-daily output"
  exit 1
fi

# Save generated questions for reference
QUESTIONS_FILE="reviews/daily-questions-${TIMESTAMP}.json"
cp "$TMPDIR_REVIEW/questions.json" "$QUESTIONS_FILE"
echo "==> Questions saved to: ${QUESTIONS_FILE}"

# --- 2. Build the review prompt ---
echo "==> Step 2/3: Building review prompt..."

cat > "$TMPDIR_REVIEW/prompt.txt" << 'PROMPT_EOF'
You are a strict Solidity & Ethereum quiz quality reviewer. You must catch ALL defective questions.

Below is a JSON containing 10 generated quiz questions. Review EVERY question and produce a markdown report.

## Your review checklist (check ALL of these for EVERY question):

### CRITICAL (P0) — these make the question unusable

For code questions, you MUST perform substitution testing:
1. Take the `code` field and replace `___BLANK___` with the `answer` → Does it compile as valid Solidity ^0.8.0 AND behave correctly? If NO → P0.
2. Replace `___BLANK___` with each distractor → Does it compile AND behave correctly? If YES for any distractor → P0.

Specific P0 patterns to watch for:
- **Answer doesn't compile**: The code with the answer substituted has a bug (e.g., `pure` function reading state, wrong return type).
- **Distractor also valid**: Another option also produces correct, compilable code (e.g., `uint16` works just as well as `uint8` for value 18).
- **Blank at name position**: If the blank is at a function name or variable name, ANY valid identifier works → always P0.
- **Integer type interchangeability**: A larger integer type (uint16, uint32, uint256) can always hold values that fit in a smaller type. Unless there is an overflow constraint, multiple types are valid.
- **Early-return equivalence**: When every branch ends with `return`/`revert`, `if` and `else if` are functionally identical.
- **Visibility equivalence**: `public` and `external` often both work for externally-called functions with no internal calls.
- **Data location equivalence**: For read-only parameters, both `memory` and `calldata` compile and work.

For concept questions:
- Is the answer factually correct and unambiguous?
- Could any distractor ALSO be arguably correct?
- Does the question have a `code` field? (concept questions should NOT have a `code` field → P2)

### HIGH (P1) — factual errors
- Is the explanation accurate?
- For code questions: is the surrounding code syntactically valid Solidity?

### MEDIUM (P2) — quality issues
- Is the question clear and unambiguous?
- Are distractors plausible but clearly wrong?
- Is the explanation educational?

## Output format (strict markdown):

# Daily Challenge Quality Review — [date]

## Summary
- Total questions: X
- P0 (Critical): X issues
- P1 (High): X issues
- P2 (Medium): X issues
- Pass: X questions with no issues

## Critical Issues (P0)
(List each P0 issue with question ID, the specific problem, and a concrete fix.
If none, write "None found.")

## High Issues (P1)
(Same format. If none, write "None found.")

## Medium Issues (P2)
(Same format. If none, write "None found.")

## Per-Question Review

### [question-id] — [PASS/FAIL] — [one-line summary]
- Type: code/concept
- Category: X
- Substitution test (code only): answer compiles? [YES/NO], distractor1 compiles? [YES/NO], distractor2? [YES/NO], distractor3? [YES/NO]
- Issues: [list or "None"]
- Suggested fix: [if applicable]

(Repeat for ALL 10 questions)

## Improvement Recommendations
(3-5 actionable suggestions for the generation prompt or validation logic, based on issues found)

IMPORTANT: Be extremely strict. Mentally compile EVERY code question with EVERY option. Report ALL issues you find — false negatives are worse than false positives.
PROMPT_EOF

# Append the JSON data to the prompt
printf '\nHere is the generated quiz JSON to review:\n\n' >> "$TMPDIR_REVIEW/prompt.txt"
cat "$TMPDIR_REVIEW/questions.json" >> "$TMPDIR_REVIEW/prompt.txt"

# --- 3. Send to Claude CLI for review ---
echo "==> Step 3/3: Claude CLI reviewing questions..."

REVIEW_FILE="reviews/daily-review-${TIMESTAMP}.md"

FULL_PROMPT=$(cat "$TMPDIR_REVIEW/prompt.txt")
env -u CLAUDECODE claude -p "$FULL_PROMPT" --output-format text > "$REVIEW_FILE"

echo ""
echo "========================================"
echo "  Review complete!"
echo "========================================"
echo "  Questions: ${QUESTIONS_FILE}"
echo "  Review:    ${REVIEW_FILE}"
echo "========================================"
echo ""
echo "--- Review Summary ---"
sed -n '/^## Summary/,/^## [^S]/p' "$REVIEW_FILE" | head -20
