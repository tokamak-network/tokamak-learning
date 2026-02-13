export type CodeQuestion = {
  type: "code";
  id: string;
  code: string; // contains ___BLANK___ marker
  answer: string;
  distractors: [string, string, string];
  explanation: string;
};

export type ConceptQuestion = {
  type: "concept";
  id: string;
  question: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
};

export type ChallengeQuestion = CodeQuestion | ConceptQuestion;

export type ChallengeSet = {
  id: string;
  questions: ChallengeQuestion[];
};

export const challengeSets: ChallengeSet[] = [
  {
    id: "set-1",
    questions: [
      // Code questions (5)
      {
        type: "code",
        id: "s1-c1",
        code: `pragma solidity ^0.8.0;\n\ncontract Counter {\n    uint256 public count;\n\n    function increment() public {\n        count ___BLANK___ 1;\n    }\n}`,
        answer: "+=",
        distractors: ["=", "-=", "=="],
        explanation:
          "+= is the compound addition assignment operator. count += 1 is equivalent to count = count + 1.",
      },
      {
        type: "code",
        id: "s1-c2",
        code: `pragma solidity ^0.8.0;\n\ncontract Token {\n    mapping(address => uint256) public ___BLANK___;\n}`,
        answer: "balanceOf",
        distractors: ["balance", "amounts", "tokens"],
        explanation:
          "balanceOf is the standard naming convention from ERC-20 for storing token balances per address.",
      },
      {
        type: "code",
        id: "s1-c3",
        code: `function transfer(address to, uint256 amount) public {\n    require(balanceOf[msg.sender] >= amount, "Insufficient");\n    balanceOf[msg.sender] -= amount;\n    balanceOf[to] ___BLANK___ amount;\n}`,
        answer: "+=",
        distractors: ["-=", "=", "*="],
        explanation:
          "When transferring tokens, the recipient's balance must increase by the amount sent.",
      },
      {
        type: "code",
        id: "s1-c4",
        code: `contract Ownable {\n    address public owner;\n\n    constructor() {\n        owner = ___BLANK___;\n    }\n}`,
        answer: "msg.sender",
        distractors: ["tx.origin", "address(this)", "block.coinbase"],
        explanation:
          "msg.sender in the constructor refers to the account that deployed the contract, making them the owner.",
      },
      {
        type: "code",
        id: "s1-c5",
        code: `function withdraw() public {\n    require(msg.sender == owner, "Not owner");\n    payable(owner).___BLANK___(address(this).balance);\n}`,
        answer: "transfer",
        distractors: ["send", "call", "delegatecall"],
        explanation:
          "transfer() sends Ether and automatically reverts on failure. Note: modern Solidity often prefers call{value: ...}('') for flexibility, but transfer() matches this code pattern.",
      },
      // Concept questions (5)
      {
        type: "concept",
        id: "s1-q1",
        question: "What is 'gas' in Ethereum?",
        answer: "A unit measuring computational effort",
        distractors: [
          "A type of cryptocurrency",
          "A consensus algorithm",
          "A smart contract language",
        ],
        explanation:
          "Gas measures the computational work needed to execute operations on the EVM. Users pay gas fees to compensate validators.",
      },
      {
        type: "concept",
        id: "s1-q2",
        question:
          "Which keyword allows a Solidity function to read state but NOT modify it?",
        answer: "view",
        distractors: ["pure", "constant", "static"],
        explanation:
          "view functions can read state but cannot modify it. pure functions can neither read nor modify state.",
      },
      {
        type: "concept",
        id: "s1-q3",
        question: "What does ERC-20 define?",
        answer: "A standard interface for fungible tokens",
        distractors: [
          "A standard for NFTs",
          "A consensus mechanism",
          "A Layer 2 scaling solution",
        ],
        explanation:
          "ERC-20 defines a common interface (transfer, approve, balanceOf, etc.) so all fungible tokens work with the same wallets and exchanges.",
      },
      {
        type: "concept",
        id: "s1-q4",
        question: "What is the maximum value of a uint8 in Solidity?",
        answer: "255",
        distractors: ["256", "127", "1024"],
        explanation:
          "uint8 stores 8 bits, so its range is 0 to 2^8 - 1 = 255.",
      },
      {
        type: "concept",
        id: "s1-q5",
        question: "What happens when a require() statement fails?",
        answer: "The transaction reverts and unused gas is refunded",
        distractors: [
          "The function returns false",
          "The contract self-destructs",
          "Only the current function stops",
        ],
        explanation:
          "require() reverts the entire transaction, undoing all state changes, and refunds remaining gas to the caller.",
      },
    ],
  },
  {
    id: "set-2",
    questions: [
      {
        type: "code",
        id: "s2-c1",
        code: `pragma solidity ^0.8.0;\n\ncontract Vault {\n    mapping(address => uint256) public deposits;\n\n    function deposit() public ___BLANK___ {\n        deposits[msg.sender] += msg.value;\n    }\n}`,
        answer: "payable",
        distractors: ["external", "view", "virtual"],
        explanation:
          "The payable modifier allows a function to receive Ether. Without it, sending ETH to the function will revert.",
      },
      {
        type: "code",
        id: "s2-c2",
        code: `event Transfer(address indexed from, address indexed to, uint256 ___BLANK___);`,
        answer: "value",
        distractors: ["amount", "indexed", "data"],
        explanation:
          "In the ERC-20 Transfer event, the third parameter is conventionally named 'value' representing the token amount transferred.",
      },
      {
        type: "code",
        id: "s2-c3",
        code: `contract MyToken {\n    string public name;\n    string public symbol;\n    uint8 public ___BLANK___ = 18;\n}`,
        answer: "decimals",
        distractors: ["precision", "digits", "places"],
        explanation:
          "decimals defines how divisible a token is. 18 decimals (like ETH) means 1 token = 10^18 smallest units.",
      },
      {
        type: "code",
        id: "s2-c4",
        code: `modifier onlyOwner() {\n    require(msg.sender == owner, "Not owner");\n    ___BLANK___;\n}`,
        answer: "_",
        distractors: ["return", "revert", "continue"],
        explanation:
          "The underscore _ is a special placeholder in Solidity modifiers. It marks where the modified function's body will be inserted.",
      },
      {
        type: "code",
        id: "s2-c5",
        code: `function getBalance() public view returns (___BLANK___) {\n    return address(this).balance;\n}`,
        answer: "uint256",
        distractors: ["uint128", "int256", "address"],
        explanation:
          "address.balance returns a uint256 value representing the balance in wei.",
      },
      {
        type: "concept",
        id: "s2-q1",
        question:
          "What is the difference between 'memory' and 'storage' in Solidity?",
        answer: "storage is persistent on-chain, memory is temporary",
        distractors: [
          "memory is on-chain, storage is off-chain",
          "They are interchangeable",
          "storage is for integers, memory is for strings",
        ],
        explanation:
          "Storage variables persist between function calls and are saved on the blockchain. Memory variables exist only during function execution.",
      },
      {
        type: "concept",
        id: "s2-q2",
        question: "What is a reentrancy attack?",
        answer:
          "When an external call re-enters the calling contract before state updates",
        distractors: [
          "When a contract runs out of gas",
          "When two contracts have the same address",
          "When a private function is called externally",
        ],
        explanation:
          "Reentrancy occurs when a contract makes an external call before updating its state, allowing the called contract to call back and exploit the stale state.",
      },
      {
        type: "concept",
        id: "s2-q3",
        question: "What does msg.value represent?",
        answer: "The amount of Wei sent with the transaction",
        distractors: [
          "The gas price",
          "The block number",
          "The sender's total balance",
        ],
        explanation:
          "msg.value contains the amount of Wei (smallest ETH unit) sent along with the current function call.",
      },
      {
        type: "concept",
        id: "s2-q4",
        question: "How many Wei equal 1 Ether?",
        answer: "10^18",
        distractors: ["10^6", "10^9", "10^12"],
        explanation:
          "1 ETH = 10^18 Wei. This is similar to how 1 dollar = 100 cents, but with much more precision.",
      },
      {
        type: "concept",
        id: "s2-q5",
        question: "What is the purpose of the 'indexed' keyword in events?",
        answer: "It allows filtering/searching for events by that parameter",
        distractors: [
          "It makes the parameter immutable",
          "It reduces gas costs",
          "It encrypts the parameter",
        ],
        explanation:
          "Indexed parameters are stored in the event's topics, making them searchable via log filters. Up to 3 parameters can be indexed.",
      },
    ],
  },
  {
    id: "set-3",
    questions: [
      {
        type: "code",
        id: "s3-c1",
        code: `pragma solidity ^0.8.0;\n\ncontract Greeter {\n    string public greeting;\n\n    constructor(string ___BLANK___ _greeting) {\n        greeting = _greeting;\n    }\n}`,
        answer: "memory",
        distractors: ["storage", "calldata", "stack"],
        explanation:
          "String parameters in constructors and internal functions must use 'memory' as their data location.",
      },
      {
        type: "code",
        id: "s3-c2",
        code: `contract Lottery {\n    address[] public players;\n\n    function enter() public payable {\n        require(msg.value >= 0.01 ether);\n        players.___BLANK___(msg.sender);\n    }\n}`,
        answer: "push",
        distractors: ["add", "append", "insert"],
        explanation:
          "push() is the Solidity method to add an element to the end of a dynamic array.",
      },
      {
        type: "code",
        id: "s3-c3",
        code: `interface IERC20 {\n    function totalSupply() external view returns (uint256);\n    function balanceOf(address account) external view returns (uint256);\n    function ___BLANK___(address to, uint256 amount) external returns (bool);\n}`,
        answer: "transfer",
        distractors: ["send", "move", "transmit"],
        explanation:
          "transfer() is the standard ERC-20 function for sending tokens from the caller to another address.",
      },
      {
        type: "code",
        id: "s3-c4",
        code: `contract TimeLock {\n    uint256 public unlockTime;\n\n    constructor(uint256 _duration) {\n        unlockTime = block.___BLANK___ + _duration;\n    }\n}`,
        answer: "timestamp",
        distractors: ["number", "difficulty", "gaslimit"],
        explanation:
          "block.timestamp returns the current block's Unix timestamp in seconds, useful for time-based logic.",
      },
      {
        type: "code",
        id: "s3-c5",
        code: `enum Status { Pending, Active, ___BLANK___ }\n\nStatus public currentStatus = Status.Pending;`,
        answer: "Closed",
        distractors: ["Ended", "Done", "Stopped"],
        explanation:
          "Pending/Active/Closed is a widely used enum pattern for lifecycle states in smart contracts (e.g., OpenZeppelin Governor). Any valid identifier works, but this is the conventional choice.",
      },
      {
        type: "concept",
        id: "s3-q1",
        question:
          "What is the Checks-Effects-Interactions pattern used for?",
        answer: "Preventing reentrancy vulnerabilities",
        distractors: [
          "Optimizing gas usage",
          "Improving code readability",
          "Enabling upgradability",
        ],
        explanation:
          "This pattern orders operations as: 1) Check conditions, 2) Update state, 3) Make external calls — preventing reentrancy by updating state before any external interaction.",
      },
      {
        type: "concept",
        id: "s3-q2",
        question:
          "What is the difference between a contract's address and an EOA?",
        answer: "A contract has code, an EOA is controlled by a private key",
        distractors: [
          "EOAs can hold ETH, contracts cannot",
          "Contracts have higher gas limits",
          "There is no difference",
        ],
        explanation:
          "EOAs (Externally Owned Accounts) are controlled by private keys. Contract accounts contain code and are controlled by their programming logic.",
      },
      {
        type: "concept",
        id: "s3-q3",
        question: "What does 'immutable' mean for a state variable?",
        answer: "It can only be assigned once, in the constructor",
        distractors: [
          "It cannot be read by other contracts",
          "It is stored in memory, not storage",
          "It is automatically indexed",
        ],
        explanation:
          "Immutable variables are set once during construction and cannot be changed afterward. They are cheaper to read than regular storage variables.",
      },
      {
        type: "concept",
        id: "s3-q4",
        question: "What is a fallback function in Solidity?",
        answer:
          "A function that executes when no matching function is found or ETH is sent",
        distractors: [
          "A backup copy of the contract",
          "A function that runs when the contract runs out of gas",
          "An error handling mechanism like try/catch",
        ],
        explanation:
          "The fallback function (fallback() or receive()) is called when a contract receives ETH with no data, or when no function signature matches the call data.",
      },
      {
        type: "concept",
        id: "s3-q5",
        question:
          "What is the main advantage of using events in smart contracts?",
        answer: "Cheap off-chain data storage that dApps can listen to",
        distractors: [
          "They speed up transaction execution",
          "They enable cross-contract calls",
          "They reduce the contract's bytecode size",
        ],
        explanation:
          "Events emit logs stored in transaction receipts — much cheaper than storage. Frontend dApps use event listeners to react to on-chain changes in real time.",
      },
    ],
  },
];

export function getTodaysChallengeSet(): ChallengeSet {
  const today = new Date();
  const dayIndex =
    Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) %
    challengeSets.length;
  return challengeSets[dayIndex];
}
