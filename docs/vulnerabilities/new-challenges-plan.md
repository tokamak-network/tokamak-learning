# 새로운 취약점 챌린지 추가 계획

## 상태: ✅ 완료

---

## 개요

4가지 새로운 취약점 챌린지 추가:
1. ✅ ERC20 transfer 메소드 ACL 누락
2. ✅ ERC20 정수 오버플로우
3. ✅ ERC20 정수 언더플로우
4. ✅ 보호되지 않은 초기화 메서드

---

## 버그 수정 (2024-01-XX)

### 문제
- `/vulnerabilities/erc20-overflow` 페이지 접속 시 컴파일 에러 발생
- 에러: "Source file requires different compiler version (current compiler is 0.8.34) - pragma solidity ^0.7.0"

### 원인 분석
- solc 패키지 버전: 0.8.34
- Solidity 0.8.x 컴파일러는 0.7.x 코드를 컴파일할 수 없음
- erc20-overflow, erc20-underflow 챌린지가 `pragma solidity ^0.7.0` 사용

### 해결 방법
- **선택**: Solidity 0.8.x + `unchecked` 블록 사용
- `unchecked` 블록으로 오버플로우/언더플로우 동작 시뮬레이션
- Solidity 0.8.x에서도 0.7.x와 동일한 취약점 재현 가능

### 수정 내용

**erc20-overflow.ts:**
```solidity
// 변경 전
pragma solidity ^0.7.0;
balanceOf[recipients[i]] += amount;  // 자동 오버플로우

// 변경 후
pragma solidity ^0.8.0;
unchecked {
    balanceOf[recipients[i]] += amount;  // unchecked로 오버플로우 허용
}
```

**erc20-underflow.ts:**
```solidity
// 변경 전
pragma solidity ^0.7.0;
allowance[from][msg.sender] -= amount;  // 자동 언더플로우

// 변경 후
pragma solidity ^0.8.0;
unchecked {
    allowance[from][msg.sender] -= amount;  // unchecked로 언더플로우 허용
}
```

### 테스트 결과
```
✓ should compile Solidity 0.8.x code successfully
✓ should compile Solidity 0.8.x with unchecked blocks
✓ should compile erc20-overflow challenge source (updated)
✓ should compile erc20-underflow challenge source (updated)
✓ should confirm the fix: Solidity 0.8.x + unchecked blocks
```

---

## 완료된 작업

### 1. ✅ 타입 업데이트
- `VulnerabilityCategory` 타입에서 `"overflow"` → `"arithmetic"`으로 변경
- `vulnerabilityCategories` 배열 업데이트: "Arithmetic Issues" 카테고리 추가

### 2. ✅ ERC20 Transfer ACL 누락 (beginner, access-control)
- 파일: `src/data/vulnerabilities/access-control/erc20-transfer-acl.ts`
- 취약점: `transfer(from, to, amount)` 함수에 ACL이 없어 누구나 타인의 토큰 전송 가능
- 성공 조건: 500 토큰 이상 탈취

### 3. ✅ 정수 오버플로우 (intermediate, arithmetic)
- 파일: `src/data/vulnerabilities/arithmetic/erc20-overflow.ts`
- Solidity 0.7.x 사용, `airdrop` 함수에서 오버플로우 발생
- 성공 조건: 1,000,000 토큰 이상 획득

### 4. ✅ 정수 언더플로우 (intermediate, arithmetic)
- 파일: `src/data/vulnerabilities/arithmetic/erc20-underflow.ts`
- Solidity 0.7.x, `transferFrom`에서 allowance 언더플로우
- 성공 조건: 500,000 토큰 이상 탈취

### 5. ✅ 보호되지 않은 초기화 (beginner, access-control)
- 파일: `src/data/vulnerabilities/access-control/unprotected-init.ts`
- `initialize` 함수에 보호 없음, 누구나 owner 탈취 가능
- 성공 조건: 컨트랙트의 owner가 됨

### 6. ✅ 인덱스 파일 업데이트
- 새 챌린지 4개 import 및 export 추가
- `vulnerabilityChallenges` 배열에 추가

---

## 파일 구조

```
src/data/vulnerabilities/
├── access-control/
│   ├── parity-wallet.ts
│   ├── erc20-transfer-acl.ts      ✅ 추가
│   └── unprotected-init.ts        ✅ 추가
├── arithmetic/                     ✅ 새 카테고리
│   ├── erc20-overflow.ts          ✅ 추가
│   └── erc20-underflow.ts         ✅ 추가
└── tutorial/
    └── ...
```

---

## 난이도 분류

| 챌린지 | 난이도 | 카테고리 | 상태 |
|--------|--------|----------|------|
| ERC20 Transfer ACL | beginner | access-control | ✅ |
| 정수 오버플로우 | intermediate | arithmetic | ✅ |
| 정수 언더플로우 | intermediate | arithmetic | ✅ |
| 보호되지 않은 초기화 | beginner | access-control | ✅ |

---

## 빌드 결과

```
✓ All 89 problems validated.
✓ Compiled successfully in 8.5s
✓ Generating static pages (113/113)
```