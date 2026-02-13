# PLAN.md - 개선 필요 사항 체크리스트

## 1. 버그 / 기능 오류

- [x] **Run / Test 버튼 동작 중복** — 중복 Test 버튼 제거, "Run Tests" 단일 버튼으로 통합
- [x] **카테고리 카드 링크 동일** — `/language/solidity#카테고리id`로 수정, 섹션에 id 속성 추가
- [x] **Footer 연도 하드코딩** — `new Date().getFullYear()`로 동적 처리

## 2. 미사용 / 중복 코드

- [x] **`src/lib/compiler.ts` 미사용** — 파일 삭제
- [x] **`TestResult` 인터페이스 중복 정의** — `evm-runner.ts`에서 export, `route.ts`와 `ProblemClient.tsx`에서 import로 통일

## 3. UX / 반응형

- [x] **문제 풀이 페이지 모바일 미지원** — 모바일용 Description/Editor 탭 전환 추가, `lg:` breakpoint 기반 반응형 레이아웃
- [x] **Solution 코드에 구문 강조 없음** — `highlightSolidity()` 함수로 키워드/타입/리터럴 하이라이팅 적용

## 4. 보안 / 성능

- [x] **Solution이 클라이언트 번들에 포함** — `/api/solution` API 분리, 서버 컴포넌트에서 solution/hints 제거 후 클라이언트에서 요청 시 fetch
- [x] **컴파일 API 속도 제한 없음** — IP 기반 인메모리 rate limiter 추가 (10 req/60s)

## 5. 코드 품질

- [x] **problems.ts 3680줄 단일 파일** — 카테고리별 11개 파일로 분리, index 파일에서 합산
