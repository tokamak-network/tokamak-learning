# Vulnerabilities Workflow Refactor Plan

> **Status:** ✅ Completed

**Goal:** Refactor the vulnerability challenge workflow to separate contract deployment, interaction, and verification into distinct steps.

---

## 📋 Requirements Summary

### Current Workflow (Before)
```
페이지 로드 → 타겟 자동 배포 → 코드 작성 → Run Exploit → 실행+검증 동시 수행
```

### New Workflow (After)
```
페이지 로드 → 타겟 자동 배포 → 코드 작성 → Deploy → 익스플로잇 컨트랙트 배포 → Interact로 공격 수행 → Verify → 검증
```

---

## ✅ Implementation Completed

### Task 1: API Refactoring ✅
**Commit:** `feat(api): add deploy and verify actions to vulnerability API`

**Changes:**
- Added `deployUserContract()` function in `challenge-runner.ts`
- Added `verifyExploit()` function in `challenge-runner.ts`
- Refactored `/api/vulnerability/run` to support action-based requests:
  - `action: "deploy"` - Deploy user's exploit contract
  - `action: "verify"` - Verify exploit success
  - `action: "run"` - Legacy support (deploy + execute + verify)

### Task 2: VulnerabilityClient Update✅
**Commit:** `feat(ui): add Deploy and Verify buttons to vulnerability client`

**Changes:**
- Split `handleRun` into `handleDeploy` and `handleVerify`
- Added state: `isDeploying`, `isVerifying`
- Added `hasUserContract` check to track if user's contract is deployed
- Updated UI buttons:
  - **Deploy**: Deploys user's exploit contract (cloud upload icon)
  - **Verify**: Checks exploit success (check circle icon)
  - **Reset**: Resets session (refresh icon)
- Added status indicator showing "✓ Contract deployed" when user's contract is ready
- Updated deployed contracts list to distinguish target contracts from user's contracts

### Task 3: ResultPanel Update ✅
**No changes needed** - Already supports deployment logs and verification results

---

## 🎯 Workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Page loads | Target contracts automatically deployed |
| 2 | User writes code | Edit exploit contract in editor |
| 3 | Click **Deploy** | User's contract compiled & deployed to TEVM |
| 4 | Use **Interact** | Call functions on target & user contracts |
| 5 | Click **Verify** | Check if exploit succeeded |
| 6 | Click **Reset** | Start fresh session |

---

## 📝 API Reference

### POST /api/vulnerability/run

**Deploy:**
```json
{
  "action": "deploy",
  "challengeId": "reentrancy-1",
  "userCode": "contract Exploit {...}",
  "sessionId": "abc123"
}
```

**Verify:**
```json
{
  "action": "verify",
  "challengeId": "reentrancy-1",
  "sessionId": "abc123"
}
```

---

## 🔧 Files Modified

1. `src/lib/challenge-runner.ts` - Added `deployUserContract()` and `verifyExploit()`
2. `src/app/api/vulnerability/run/route.ts` - Refactored to action-based API
3. `src/app/vulnerabilities/[id]/VulnerabilityClient.tsx` - Updated UI and handlers