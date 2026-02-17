export interface ConceptQuestionTemplate {
  id: string;
  category: string;
  topic: string;
  question: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
}

export const conceptQuestionTemplates: ConceptQuestionTemplate[] = [
  // Gas & Fees
  {
    id: "gas-fees-1",
    category: "basics",
    topic: "gas",
    question: "What is gas in Ethereum?",
    answer: "A unit that measures the computational work required to execute operations",
    distractors: ["A type of cryptocurrency", "A block reward for miners", "A transaction fee paid to exchanges"],
    explanation: "Gas measures the computational effort required to execute operations like smart contract calls.",
  },
  {
    id: "gas-fees-2",
    category: "basics",
    topic: "gas",
    question: "What happens to unused gas after a transaction executes?",
    answer: "It is refunded to the sender",
    distractors: ["It is burned permanently", "It goes to the block proposer", "It is added to the contract balance"],
    explanation: "Unused gas is refunded to the transaction sender. Only consumed gas is paid to validators.",
  },
  {
    id: "gas-fees-3",
    category: "basics",
    topic: "gas",
    question: "What is the purpose of gas limits in transactions?",
    answer: "To cap the maximum amount of gas that can be consumed",
    distractors: ["To guarantee transaction inclusion", "To set the transaction fee", "To make transactions faster"],
    explanation: "Gas limits protect users from running infinite loops that could drain their funds.",
  },
  {
    id: "gas-fees-4",
    category: "basics",
    topic: "gas",
    question: "What is EIP-1559 and when was it implemented?",
    answer: "A fee market change that introduced base fee and tip mechanisms (August 2021)",
    distractors: ["A new mining algorithm", "A storage pricing model", "An upgrade to increase block size"],
    explanation: "EIP-1559 introduced a base fee that gets burned and a tip for validators.",
  },
  // EVM Architecture
  {
    id: "evm-1",
    category: "basics",
    topic: "evm",
    question: "What does EVM stand for?",
    answer: "Ethereum Virtual Machine",
    distractors: ["Ethereum Value Model", "External Validation Mechanism", "Enhanced Virtual Memory"],
    explanation: "The EVM is a Turing-complete virtual machine that executes smart contracts on Ethereum.",
  },
  {
    id: "evm-2",
    category: "basics",
    topic: "evm",
    question: "What are the three storage locations in Solidity?",
    answer: "Storage, Memory, and Calldata",
    distractors: ["Stack, Heap, and Cache", "RAM, ROM, and Flash", "Local, Global, and Contract"],
    explanation: "Storage is persistent, memory is temporary, and calldata is immutable function input.",
  },
  {
    id: "evm-3",
    category: "basics",
    topic: "evm",
    question: "What is a smart contract in Ethereum?",
    answer: "A program that runs on the Ethereum blockchain with its own address",
    distractors: ["A legal agreement document", "A type of wallet", "A blockchain explorer"],
    explanation: "Smart contracts are self-executing programs stored on-chain that automatically enforce rules.",
  },
  // Transaction Lifecycle
  {
    id: "tx-1",
    category: "basics",
    topic: "transactions",
    question: "What is the difference betweenEOA and CA?",
    answer: "EOA has a private key, CA does not (controlled by code)",
    distractors: ["EOA can hold tokens, CA cannot", "CA is faster than EOA", "EOA can deploy contracts"],
    explanation: "EOA (Externally Owned Account) is controlled by a private key, CA (Contract Account) is controlled by code.",
  },
  {
    id: "tx-2",
    category: "basics",
    topic: "transactions",
    question: "What happens when a transaction runs out of gas?",
    answer: "All state changes are reverted, but gas is not refunded",
    distractors: ["The transaction succeeds with partial results", "Gas is fully refunded", "The contract is deleted"],
    explanation: "Failed transactions consume all provided gas as payment for the computational work done.",
  },
  {
    id: "tx-3",
    category: "basics",
    topic: "transactions",
    question: "What is a nonce in Ethereum transactions?",
    answer: "A counter that ensures each transaction from an address is unique",
    distractors: ["A cryptographic hash", "A signature algorithm", "A block identifier"],
    explanation: "Nonces prevent transaction replay and ensure transactions from the same sender are ordered.",
  },
  // Consensus
  {
    id: "consensus-1",
    category: "basics",
    topic: "consensus",
    question: "What consensus mechanism does Ethereum use (after The Merge)?",
    answer: "Proof of Stake (PoS)",
    distractors: ["Proof of Work (PoW)", "Proof of Authority", "Delegated Proof of Stake"],
    explanation: "Ethereum switched to PoS in September 2022, requiring validators to stake ETH.",
  },
  {
    id: "consensus-2",
    category: "basics",
    topic: "consensus",
    question: "What is a validator in Ethereum PoS?",
    answer: "A node that stakes ETH to propose and attest to blocks",
    distractors: ["A mining farm operator", "A type of smart contract", "A hardware wallet"],
    explanation: "Validators stake 32 ETH and earn rewards for proposing and attesting to valid blocks.",
  },
  // Account Types
  {
    id: "account-1",
    category: "basics",
    topic: "accounts",
    question: "What is the difference between msg.sender and tx.origin?",
    answer: "msg.sender is the immediate caller, tx.origin is the original EOA",
    distractors: ["They are the same thing", "msg.sender is for contracts only", "tx.origin is more secure"],
    explanation: "In nested calls, msg.sender changes per call, while tx.origin stays the original signer.",
  },
  {
    id: "account-2",
    category: "basics",
    topic: "accounts",
    question: "What is the address type in Solidity?",
    answer: "A 20-byte value representing an Ethereum account",
    distractors: ["A 32-byte hash value", "A public key", "A transaction hash"],
    explanation: "Addresses are 20 bytes (160 bits) and can represent EOA or contract accounts.",
  },
  // Block Structure
  {
    id: "block-1",
    category: "advanced",
    topic: "blocks",
    question: "What information is stored in an Ethereum block?",
    answer: "Transaction data, state root, and block header including timestamp and gas used",
    distractors: ["Only transaction hashes", "Only the state database", "Only validator signatures"],
    explanation: "Blocks contain transactions, state merkle root, and metadata like timestamp and gas limit.",
  },
  {
    id: "block-2",
    category: "advanced",
    topic: "blocks",
    question: "What is block.timestamp used for?",
    answer: "The Unix timestamp when the block was mined",
    distractors: ["The current time in the contract", "The transaction timestamp", "The block's sequence number"],
    explanation: "block.timestamp is set by the validator and can be manipulated within a small window.",
  },
  // DeFi Concepts
  {
    id: "defi-1",
    category: "patterns",
    topic: "defi",
    question: "What is an AMM (Automated Market Maker)?",
    answer: "A decentralized exchange protocol using liquidity pools and mathematical formulas",
    distractors: ["A centralized exchange", "A lending platform", "A stablecoin protocol"],
    explanation: "AMMs like Uniswap use x*y=k formulas to price tokens based on pool reserves.",
  },
  {
    id: "defi-2",
    category: "patterns",
    topic: "defi",
    question: "What is a flash loan?",
    answer: "A loan that must be borrowed and repaid within a single transaction",
    distractors: ["A loan with zero interest", "A long-term DeFi loan", "A type of collateralized loan"],
    explanation: "Flash loans enable borrowing without collateral as long as the debt is repaid in one tx.",
  },
  {
    id: "defi-3",
    category: "patterns",
    topic: "defi",
    question: "What is an oracle in blockchain?",
    answer: "A service that provides external data to smart contracts",
    distractors: ["A type of smart contract", "A blockchain explorer", "A mining pool"],
    explanation: "Oracles like Chainlink bridge off-chain data (prices, weather) to on-chain contracts.",
  },
  // Security Patterns
  {
    id: "security-1",
    category: "advanced",
    topic: "security",
    question: "What is reentrancy in smart contracts?",
    answer: "When a contract calls back into itself before finishing execution",
    distractors: ["When a transaction is reverted", "When a contract calls another contract", "When gas runs out"],
    explanation: "Reentrancy attacks exploit the fact that external calls can trigger callbacks before state updates.",
  },
  {
    id: "security-2",
    category: "advanced",
    topic: "security",
    question: "What is the Checks-Effects-Interactions pattern?",
    answer: "A security pattern: validate first, update state second, then interact with other contracts",
    distractors: ["A gas optimization technique", "A testing methodology", "A deployment strategy"],
    explanation: "This pattern prevents reentrancy by updating state before making external calls.",
  },
  {
    id: "security-3",
    category: "advanced",
    topic: "security",
    question: "What is front-running in DeFi?",
    answer: "When someone pays higher gas to get their transaction processed before others",
    distractors: ["When a contract fails", "When a transaction is reversed", "When a block is reorganized"],
    explanation: "Front-runners exploit knowledge of pending transactions to profit from price movements.",
  },
  // L2 Scaling
  {
    id: "l2-1",
    category: "advanced",
    topic: "scaling",
    question: "What is a Rollup?",
    answer: "An L2 solution that bundles transactions and submits to L1 with validity proof",
    distractors: ["A mining algorithm", "A type of smart contract", "A consensus mechanism"],
    explanation: "Rollups execute transactions off-chain and post compressed data and proofs to Ethereum.",
  },
  {
    id: "l2-2",
    category: "advanced",
    topic: "scaling",
    question: "What is the difference between Optimistic and ZK Rollups?",
    answer: "Optimistic uses fraud proofs, ZK uses cryptographic validity proofs",
    distractors: ["Optimistic is faster, ZK is slower", "ZK is centralized, Optimistic is decentralized", "No difference"],
    explanation: "Optimistic rollups assume validity and challenge with fraud proofs; ZK uses math for instant verification.",
  },
  // ERC Standards
  {
    id: "erc-1",
    category: "patterns",
    topic: "standards",
    question: "What is ERC-20?",
    answer: "A standard interface for fungible tokens",
    distractors: ["A token exchange protocol", "A wallet standard", "A chainlink standard"],
    explanation: "ERC-20 defines the API for tokens like transfer, balanceOf, and approval.",
  },
  {
    id: "erc-2",
    category: "patterns",
    topic: "standards",
    question: "What is ERC-721?",
    answer: "A standard interface for non-fungible tokens (NFTs)",
    distractors: ["A fungible token standard", "A governance standard", "A pricing oracle"],
    explanation: "ERC-721 enables unique tokens where each token has a distinct ID and metadata.",
  },
  {
    id: "erc-3",
    category: "patterns",
    topic: "standards",
    question: "What is the difference between ERC-20 transfer and transferFrom?",
    answer: "transfer is from caller to recipient, transferFrom is from sender to recipient (with allowance)",
    distractors: ["They are identical", "transferFrom requires less gas", "transfer is only for contracts"],
    explanation: "transferFrom enables delegated transfers using the approve/allowance mechanism.",
  },
  // Upgrades
  {
    id: "upgrade-1",
    category: "advanced",
    topic: "upgrades",
    question: "What is a proxy contract pattern?",
    answer: "A pattern where a proxy forwards calls to an implementation contract",
    distractors: ["A contract that cannot be upgraded", "A contract with multiple owners", "A backup contract"],
    explanation: "Proxy patterns enable upgradeable contracts by separating storage and logic.",
  },
  {
    id: "upgrade-2",
    category: "advanced",
    topic: "upgrades",
    question: "What is diamond pattern in upgradeable contracts?",
    answer: "A pattern allowing multiple implementation contracts (facets) with shared storage",
    distractors: ["A pattern for multi-sig wallets", "A DeFi protocol", "A gas optimization technique"],
    explanation: "Diamond pattern enables large contracts to be split into facets while sharing storage.",
  },
];

export function getConceptQuestionsByCategory(category: string): ConceptQuestionTemplate[] {
  return conceptQuestionTemplates.filter(q => q.category === category);
}

export function getRandomConceptQuestions(count: number): ConceptQuestionTemplate[] {
  const shuffled = [...conceptQuestionTemplates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getConceptQuestionExcluding(
  count: number,
  excludeIds: string[]
): ConceptQuestionTemplate[] {
  const available = conceptQuestionTemplates.filter(q => !excludeIds.includes(q.id));
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
