# Daily Challenge Quality Review (2026-02-16)

## Overview

프롬프트 개선(BANNED QUESTION TYPES, SELF-VERIFICATION 규칙 추가) 후 4회 생성-리뷰 사이클 결과.

## 6회 실행 비교

| Run | 프롬프트 버전 | Code P0 | Concept P0 | Rejected | Valid |
|-----|-------------|---------|------------|----------|-------|
| Run 1 | DANGEROUS BLANK POSITIONS 초기 | 2 | 0 | 0 | 10 |
| Run 2 | + equivalent mechanisms | 2 | 0 | 0 | 10 |
| Run 3 | + integer/name/early-return 규칙 | 3 | 1 | 0 | 10 |
| Run 4 | BANNED QUESTION TYPES (블랙리스트) | 2 | 0 | 0 | 10 |
| Run 5 | + validateQuestion pattern rejection | 0* | 0 | 1 | 9 |
| Run 6 | + comparison/compound rejection | **0** | 0 | 2 | 8 |

*Run 5에서 gen-c3(>vs>=)는 통과했으나, Run 6에서 비교연산자 ban 추가로 해결

## 반복 P0 패턴 (프롬프트로 해결 불가)

| Pattern | 발생 횟수 | 설명 |
|---------|----------|------|
| Integer type interchangeability | 3/4 runs | uint16 자리에 uint32/uint64도 유효 |
| State mutability | 2/4 runs | pure 자리에 view/payable/external도 컴파일 |
| Equivalent mechanisms | 1/4 runs | super≡Base, receive≡fallback |
| Early-return if≡else if | 1/4 runs | return 분기에서 if와 else if 동등 |

## 프롬프트 개선으로 해결된 문제

| Pattern | 개선 전 | 개선 후 |
|---------|--------|--------|
| Concept distractor subset | gen-q1 "block proposer"⊂"validators" | Run 4에서 해결됨 |
| Concept distractor partially true | gen-q2 "no collateral" also true | Run 4에서 해결됨 |
| Function name blank | gen-c5 어떤 이름이든 동작 | Run 3, 4에서 미발생 |
| Code with wrong mutability | gen-c5 pure+state read | Run 3, 4에서 미발생 |

## 결론 및 개선 방안

### 프롬프트만으로는 한계

LLM이 "Integer type sizes → BANNED" 규칙을 읽고도 `uint16` 문제를 계속 생성.
"State mutability → BANNED" 규칙도 마찬가지로 `pure` vs `view` 문제가 반복.

**원인**: LLM의 self-verification이 "멘탈 컴파일"에 의존 — uint32에 65535를 넣으면 정상인지 실제로 확인하지 않고 "이건 banned 패턴이 아니다"라고 판단.

### 필요한 다음 단계: 코드 레벨 검증

생성 후 코드로 자동 검증하는 파이프라인 추가:

1. **Pattern-based rejection** (즉시 구현 가능):
   - 정답이 uint8/uint16/uint32/uint64/uint128/uint256 중 하나면 → reject
   - 정답이 pure/view/payable면 → reject
   - 정답이 public/external/internal/private면 → reject
   - blank가 함수/변수 이름 위치면 → reject

2. **solc compilation check** (중기):
   - answer 대입 → 컴파일 성공 검증
   - 각 distractor 대입 → 컴파일 실패 검증

### 현재 상태 (pattern-based rejection 구현 후)

- **Concept 문제**: 프롬프트 개선으로 P0 0건 안정화
- **Code 문제**: `validateQuestion`의 pattern-based rejection으로 P0 0건 달성
  - Integer type, visibility, mutability, data location, comparison operator, function name blank 자동 reject
  - Reject된 문제는 valid 카운트에서 제외 → 10개 미만이 될 수 있음
- **자동화 스크립트**: `npm run review-daily`로 생성+리뷰+저장 one-shot 실행 가능
- **다음 단계**: 10개 미달 시 재생성 retry 로직, solc 컴파일 검증

---

## 파일 목록

- `reviews/daily-questions-*.json` — 생성된 문제 원본
- `reviews/daily-review-*.md` — Claude CLI 리뷰 리포트
- `scripts/review-daily.sh` — 자동화 스크립트
- `src/app/api/daily/generate/daily-generate.ts` — 생성 프롬프트 (BANNED QUESTION TYPES + SELF-VERIFICATION)
