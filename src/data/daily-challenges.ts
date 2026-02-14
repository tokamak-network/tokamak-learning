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
  {
    id: "set-4",
    questions: [
      {
        type: "code",
        id: "s4-c1",
        code: `pragma solidity ^0.8.0;\n\ncontract Loop {\n    function sum(uint256 n) public pure returns (uint256) {\n        uint256 total;\n        for (uint256 i = 1; i ___BLANK___ n; i++) {\n            total += i;\n        }\n        return total;\n    }\n}`,
        answer: "<=",
        distractors: ["<", ">=", "!="],
        explanation:
          "To include n in the sum (1 + 2 + ... + n), the condition must be i <= n. Using < would exclude n itself.",
      },
      {
        type: "code",
        id: "s4-c2",
        code: `function gradeScore(uint256 score) public pure returns (string memory) {\n    if (score >= 90) {\n        return "A";\n    } ___BLANK___ (score >= 80) {\n        return "B";\n    }\n    return "C";\n}`,
        answer: "else if",
        distractors: ["elif", "elseif", "else while"],
        explanation:
          "Solidity uses 'else if' for chaining multiple conditions, following the same syntax as C/JavaScript.",
      },
      {
        type: "code",
        id: "s4-c3",
        code: `error InsufficientBalance(uint256 requested, uint256 available);\n\nfunction withdraw(uint256 amount) public {\n    if (amount > balance)\n        ___BLANK___ InsufficientBalance(amount, balance);\n    balance -= amount;\n}`,
        answer: "revert",
        distractors: ["throw", "emit", "return"],
        explanation:
          "revert is used to trigger a custom error. Custom errors are gas-efficient because they encode only the selector and parameters, unlike string-based require messages.",
      },
      {
        type: "code",
        id: "s4-c4",
        code: `contract Voting {\n    mapping(address => bool) public hasVoted;\n\n    function vote() public {\n        require(!hasVoted[msg.sender], "Already voted");\n        hasVoted[msg.sender] = ___BLANK___;\n    }\n}`,
        answer: "true",
        distractors: ["false", "1", "msg.sender"],
        explanation:
          "After voting, we set hasVoted[msg.sender] to true so the require check prevents double voting.",
      },
      {
        type: "code",
        id: "s4-c5",
        code: `contract ArrayOps {\n    uint256[] public numbers;\n\n    function removeLast() public {\n        require(numbers.length > 0, "Empty");\n        numbers.___BLANK___();\n    }\n}`,
        answer: "pop",
        distractors: ["remove", "delete", "shift"],
        explanation:
          "pop() removes the last element from a dynamic array and decreases its length by one.",
      },
      {
        type: "concept",
        id: "s4-q1",
        question: "What happens if a for loop runs too many iterations in Solidity?",
        answer: "The transaction runs out of gas and reverts",
        distractors: [
          "The loop automatically stops at 1000 iterations",
          "The contract is destroyed",
          "The remaining iterations run in the next block",
        ],
        explanation:
          "Every iteration costs gas. If the loop exceeds the block gas limit, the transaction reverts. This is why unbounded loops are dangerous in smart contracts.",
      },
      {
        type: "concept",
        id: "s4-q2",
        question: "What is the difference between 'require' and 'assert' in Solidity?",
        answer: "require is for input validation, assert is for internal invariants",
        distractors: [
          "They are interchangeable",
          "assert is cheaper on gas",
          "require can only check msg.sender",
        ],
        explanation:
          "require() validates inputs and conditions that depend on external factors. assert() checks for conditions that should never be false — bugs in your own code.",
      },
      {
        type: "concept",
        id: "s4-q3",
        question: "Why are custom errors preferred over require with string messages?",
        answer: "Custom errors use less gas because they avoid storing strings",
        distractors: [
          "Custom errors are more readable",
          "String messages are deprecated",
          "Custom errors run faster on the EVM",
        ],
        explanation:
          "Custom errors encode only a 4-byte selector plus parameters, while string messages store the full string in the contract bytecode and transaction data.",
      },
      {
        type: "concept",
        id: "s4-q4",
        question: "What does the 'unchecked' block do in Solidity 0.8+?",
        answer: "Disables overflow/underflow checks for arithmetic operations",
        distractors: [
          "Skips access control checks",
          "Allows writing to any storage slot",
          "Bypasses the require statement",
        ],
        explanation:
          "Solidity 0.8+ has built-in overflow checks. The unchecked block disables them for gas savings when you know overflow cannot occur.",
      },
      {
        type: "concept",
        id: "s4-q5",
        question: "What is the default value of a bool in Solidity?",
        answer: "false",
        distractors: ["true", "0", "null"],
        explanation:
          "All variables in Solidity are initialized to their zero-value. For bool, it's false. For uint, it's 0. For address, it's address(0).",
      },
    ],
  },
  {
    id: "set-5",
    questions: [
      {
        type: "code",
        id: "s5-c1",
        code: `contract Animal {\n    function speak() public pure ___BLANK___ returns (string memory) {\n        return "...";\n    }\n}\n\ncontract Dog is Animal {\n    function speak() public pure override returns (string memory) {\n        return "Woof";\n    }\n}`,
        answer: "virtual",
        distractors: ["abstract", "external", "payable"],
        explanation:
          "The virtual keyword allows a function to be overridden by derived contracts. Without it, the override in Dog would cause a compilation error.",
      },
      {
        type: "code",
        id: "s5-c2",
        code: `contract ERC20 {\n    mapping(address => mapping(address => uint256)) public allowance;\n\n    function approve(address spender, uint256 amount) public returns (bool) {\n        allowance[___BLANK___][spender] = amount;\n        return true;\n    }\n}`,
        answer: "msg.sender",
        distractors: ["tx.origin", "address(this)", "spender"],
        explanation:
          "In ERC-20 approve(), the caller (msg.sender) authorizes a spender to transfer tokens on their behalf.",
      },
      {
        type: "code",
        id: "s5-c3",
        code: `contract Base {\n    uint256 public value;\n\n    constructor(uint256 _value) {\n        value = _value;\n    }\n}\n\ncontract Child is ___BLANK___(42) {\n}`,
        answer: "Base",
        distractors: ["Contract", "Parent", "Super"],
        explanation:
          "When inheriting, the parent constructor can be called with arguments using the syntax: contract Child is Base(42). This passes 42 to Base's constructor.",
      },
      {
        type: "code",
        id: "s5-c4",
        code: `contract Staking {\n    mapping(address => uint256) public stakedAt;\n\n    function stake() public payable {\n        require(msg.value > 0);\n        stakedAt[msg.sender] = block.timestamp;\n    }\n\n    function unstake() public {\n        require(block.timestamp >= stakedAt[msg.sender] + 1 ___BLANK___, "Locked");\n    }\n}`,
        answer: "days",
        distractors: ["hours", "minutes", "blocks"],
        explanation:
          "Solidity provides time literal suffixes: seconds, minutes, hours, days, weeks. '1 days' equals 86400 seconds.",
      },
      {
        type: "code",
        id: "s5-c5",
        code: `library SafeMath {\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\n        return a + b;\n    }\n}\n\ncontract Calculator {\n    ___BLANK___ SafeMath for uint256;\n\n    function sum(uint256 a, uint256 b) public pure returns (uint256) {\n        return a.add(b);\n    }\n}`,
        answer: "using",
        distractors: ["import", "with", "apply"],
        explanation:
          "'using A for B' attaches library A's functions to type B, allowing you to call them as methods (b.add(c) instead of SafeMath.add(b, c)).",
      },
      {
        type: "concept",
        id: "s5-q1",
        question: "What is the 'diamond problem' in Solidity inheritance?",
        answer:
          "When a contract inherits from two contracts that share a common base",
        distractors: [
          "When a contract has too many functions",
          "When a constructor takes too many parameters",
          "When a contract exceeds 24KB in size",
        ],
        explanation:
          "Solidity resolves the diamond problem using C3 linearization. When listing parents, the order matters — list from most base-like to most derived.",
      },
      {
        type: "concept",
        id: "s5-q2",
        question:
          "What is the difference between 'external' and 'public' functions?",
        answer:
          "external can only be called from outside, public can be called both internally and externally",
        distractors: [
          "external costs more gas",
          "public functions cannot accept parameters",
          "They are the same",
        ],
        explanation:
          "external functions can only be called via transactions or other contracts. public functions can also be called internally within the same contract.",
      },
      {
        type: "concept",
        id: "s5-q3",
        question: "What does the 'abstract' keyword do on a contract?",
        answer: "Marks a contract that has unimplemented functions and cannot be deployed",
        distractors: [
          "Makes the contract upgradeable",
          "Hides the contract's bytecode",
          "Makes all functions virtual",
        ],
        explanation:
          "An abstract contract has at least one function without implementation. It serves as a base for other contracts and cannot be deployed directly.",
      },
      {
        type: "concept",
        id: "s5-q4",
        question: "What does 'calldata' mean as a data location?",
        answer: "Read-only data location for external function parameters",
        distractors: [
          "Data stored permanently on-chain",
          "Data sent to another contract",
          "Temporary data that persists between calls",
        ],
        explanation:
          "calldata is a non-modifiable, temporary area where function arguments for external calls are stored. It's cheaper than memory because it avoids copying.",
      },
      {
        type: "concept",
        id: "s5-q5",
        question: "What is a library in Solidity?",
        answer: "A contract without state that provides reusable functions",
        distractors: [
          "A package manager like npm",
          "A collection of ERC standards",
          "A way to store large data on-chain",
        ],
        explanation:
          "Libraries are stateless contracts whose code is reused by other contracts. They can be deployed once and linked, or their functions can be embedded via 'using for'.",
      },
    ],
  },
  {
    id: "set-6",
    questions: [
      {
        type: "code",
        id: "s6-c1",
        code: `contract HashExample {\n    function hash(string memory input) public pure returns (bytes32) {\n        return ___BLANK___(abi.encodePacked(input));\n    }\n}`,
        answer: "keccak256",
        distractors: ["sha256", "sha3", "md5"],
        explanation:
          "keccak256 is the primary hash function in Solidity and is used throughout Ethereum for hashing, signature verification, and address generation.",
      },
      {
        type: "code",
        id: "s6-c2",
        code: `contract MultiSig {\n    address[] public owners;\n    uint256 public required;\n\n    struct Transaction {\n        address to;\n        uint256 value;\n        bool ___BLANK___;\n    }\n}`,
        answer: "executed",
        distractors: ["confirmed", "pending", "valid"],
        explanation:
          "In a multi-sig wallet, 'executed' tracks whether a transaction has been carried out after reaching the required number of confirmations.",
      },
      {
        type: "code",
        id: "s6-c3",
        code: `contract Registry {\n    mapping(bytes32 => address) public records;\n\n    function register(string memory name) public {\n        bytes32 key = keccak256(___BLANK___(name));\n        require(records[key] == address(0), "Taken");\n        records[key] = msg.sender;\n    }\n}`,
        answer: "abi.encodePacked",
        distractors: ["abi.encode", "bytes", "keccak256"],
        explanation:
          "abi.encodePacked() converts values into tightly packed bytes before hashing. It's commonly used with keccak256 for creating compact hashes.",
      },
      {
        type: "code",
        id: "s6-c4",
        code: `contract Proxy {\n    address public implementation;\n\n    fallback() external payable {\n        (bool success, ) = implementation.___BLANK___(msg.data);\n        require(success);\n    }\n}`,
        answer: "delegatecall",
        distractors: ["call", "staticcall", "transfer"],
        explanation:
          "delegatecall executes code from another contract in the context of the calling contract, preserving msg.sender and storage. This is the foundation of the proxy pattern.",
      },
      {
        type: "code",
        id: "s6-c5",
        code: `contract Token {\n    mapping(address => uint256) balances;\n\n    function transfer(address to, uint256 amount) public {\n        require(balances[msg.sender] >= amount);\n        balances[msg.sender] -= amount;\n        balances[to] += amount;\n        ___BLANK___ Transfer(msg.sender, to, amount);\n    }\n\n    event Transfer(address indexed from, address indexed to, uint256 value);\n}`,
        answer: "emit",
        distractors: ["fire", "log", "trigger"],
        explanation:
          "The 'emit' keyword is used to fire an event in Solidity. Events are logged in the transaction receipt and can be listened to by off-chain applications.",
      },
      {
        type: "concept",
        id: "s6-q1",
        question: "What is delegatecall used for?",
        answer:
          "Running another contract's code in the caller's storage context",
        distractors: [
          "Sending ETH to another contract",
          "Reading state from another contract",
          "Creating a new contract",
        ],
        explanation:
          "delegatecall executes the target's code but uses the calling contract's storage and msg.sender. This enables the proxy/upgradeable pattern.",
      },
      {
        type: "concept",
        id: "s6-q2",
        question:
          "Why is the order of state variables important in proxy contracts?",
        answer:
          "Storage slots must align between proxy and implementation to avoid data corruption",
        distractors: [
          "Variables must be in alphabetical order",
          "It affects gas costs",
          "The EVM requires a specific order",
        ],
        explanation:
          "Since delegatecall uses the proxy's storage with the implementation's code, both contracts must have matching storage layouts or data will be read/written to wrong slots.",
      },
      {
        type: "concept",
        id: "s6-q3",
        question: "What is the maximum contract size allowed on Ethereum?",
        answer: "24,576 bytes (24 KB)",
        distractors: ["1 MB", "256 KB", "16 KB"],
        explanation:
          "EIP-170 introduced a 24,576 byte limit for deployed contract bytecode to prevent DOS attacks via extremely large contracts.",
      },
      {
        type: "concept",
        id: "s6-q4",
        question: "What does abi.encode do?",
        answer: "Encodes values into ABI-standard bytes with padding",
        distractors: [
          "Compiles Solidity to bytecode",
          "Encrypts data for privacy",
          "Converts integers to strings",
        ],
        explanation:
          "abi.encode() converts values into 32-byte padded ABI-encoded bytes. Unlike abi.encodePacked(), it follows the full ABI specification with padding.",
      },
      {
        type: "concept",
        id: "s6-q5",
        question: "What is a 'selector' in Solidity?",
        answer: "The first 4 bytes of the keccak256 hash of a function signature",
        distractors: [
          "The return type of a function",
          "The address where a function is stored",
          "A CSS-like query for contract state",
        ],
        explanation:
          "Function selectors are the first 4 bytes of keccak256('functionName(paramType1,paramType2)'). They identify which function to call in transaction data.",
      },
    ],
  },
  {
    id: "set-7",
    questions: [
      {
        type: "code",
        id: "s7-c1",
        code: `contract Auction {\n    uint256 public highestBid;\n    address public highestBidder;\n\n    function bid() public payable {\n        require(msg.value > highestBid, "Bid too low");\n        highestBid = msg.value;\n        highestBidder = ___BLANK___;\n    }\n}`,
        answer: "msg.sender",
        distractors: ["tx.origin", "address(this)", "block.coinbase"],
        explanation:
          "msg.sender is the address that called the function. In an auction, the new highest bidder is always the current caller.",
      },
      {
        type: "code",
        id: "s7-c2",
        code: `contract Access {\n    mapping(address => bool) public admins;\n\n    modifier onlyAdmin() {\n        require(admins[msg.sender], "Not admin");\n        ___BLANK___;\n    }\n\n    function restricted() public onlyAdmin {\n        // admin-only logic\n    }\n}`,
        answer: "_",
        distractors: ["return", "continue", "stop"],
        explanation:
          "The underscore _ in a modifier marks where the function body gets inserted. Code before _ runs first, code after _ runs last.",
      },
      {
        type: "code",
        id: "s7-c3",
        code: `contract Escrow {\n    enum State { Created, Funded, Released }\n    State public state;\n\n    function fund() public payable {\n        require(state == State.Created);\n        state = State.___BLANK___;\n    }\n}`,
        answer: "Funded",
        distractors: ["Released", "Created", "Active"],
        explanation:
          "After funding, the escrow transitions from Created to Funded. Enums provide type-safe state machines in Solidity.",
      },
      {
        type: "code",
        id: "s7-c4",
        code: `contract Wallet {\n    function getBalance() public view returns (uint256) {\n        return ___BLANK___(this).balance;\n    }\n}`,
        answer: "address",
        distractors: ["payable", "uint256", "contract"],
        explanation:
          "address(this) converts the contract reference to an address type, which has the .balance property to check the contract's ETH balance.",
      },
      {
        type: "code",
        id: "s7-c5",
        code: `contract Whitelist {\n    mapping(address => bool) public isWhitelisted;\n    address public owner;\n\n    function addToWhitelist(address[] ___BLANK___ users) external {\n        require(msg.sender == owner);\n        for (uint i = 0; i < users.length; i++) {\n            isWhitelisted[users[i]] = true;\n        }\n    }\n}`,
        answer: "calldata",
        distractors: ["memory", "storage", "stack"],
        explanation:
          "calldata is the cheapest data location for external function parameters. It's read-only and avoids copying, saving gas compared to memory.",
      },
      {
        type: "concept",
        id: "s7-q1",
        question: "What is a flash loan?",
        answer:
          "A loan that must be borrowed and repaid within one transaction",
        distractors: [
          "A loan with very low interest rates",
          "A loan that lasts exactly one block",
          "A type of staking reward",
        ],
        explanation:
          "Flash loans are uncollateralized loans where the borrow and repay happen atomically in a single transaction. If not repaid, the entire transaction reverts.",
      },
      {
        type: "concept",
        id: "s7-q2",
        question:
          "What is the 'pull over push' pattern for sending ETH?",
        answer:
          "Let users withdraw funds instead of sending to them directly",
        distractors: [
          "Use push notifications for transactions",
          "Always use transfer() instead of call()",
          "Batch all payments into one transaction",
        ],
        explanation:
          "Instead of pushing ETH to users (which can fail), let them pull/withdraw. This prevents DoS attacks where a malicious recipient rejects incoming transfers.",
      },
      {
        type: "concept",
        id: "s7-q3",
        question:
          "What is 'slippage' in the context of decentralized exchanges?",
        answer:
          "The difference between expected and actual trade price",
        distractors: [
          "The gas fee for a swap transaction",
          "The delay between submitting and confirming a trade",
          "The fee charged by the DEX protocol",
        ],
        explanation:
          "Slippage occurs when the price moves between submitting and executing a trade. Users set slippage tolerance to reject trades that deviate too much.",
      },
      {
        type: "concept",
        id: "s7-q4",
        question: "What is an oracle in blockchain?",
        answer:
          "A service that provides external real-world data to smart contracts",
        distractors: [
          "A type of consensus algorithm",
          "A special admin account",
          "A database for storing NFT metadata",
        ],
        explanation:
          "Oracles bridge the gap between on-chain and off-chain data. They feed external data (prices, weather, sports scores) into smart contracts that cannot access the internet directly.",
      },
      {
        type: "concept",
        id: "s7-q5",
        question:
          "Why should you avoid using tx.origin for authentication?",
        answer:
          "It can be exploited through phishing — an attacker's contract relays the original sender",
        distractors: [
          "tx.origin is deprecated",
          "tx.origin always returns address(0)",
          "tx.origin costs more gas than msg.sender",
        ],
        explanation:
          "tx.origin returns the original EOA that initiated the transaction. If user A calls malicious contract B, which calls your contract C, tx.origin will be A — bypassing authentication.",
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
