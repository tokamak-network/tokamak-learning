import type { Problem } from "../problems";

export const advanced_problems: Problem[] = [
  {
    id: "events",
    title: "Emit an Event",
    category: "advanced",
    order: 1,
    difficulty: "intermediate",
    description: `# Emit an Event

## What you'll learn
How to declare and emit events to log contract activity.

Events are like logs — they record what happened in a transaction. Off-chain applications (like websites) can listen for events to react to contract changes.

\`\`\`solidity
event Transfer(address from, address to, uint amount);
emit Transfer(msg.sender, recipient, 100);
\`\`\`

## Task

1. Declare an event: \`event ValueChanged(uint oldValue, uint newValue);\`
2. Inside \`setValue\`, emit the event with \`oldValue\` and \`newValue\`

> Use the \`emit\` keyword to fire an event: \`emit EventName(values);\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    // TODO: Declare event ValueChanged(uint oldValue, uint newValue)

    uint public value;

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        // TODO: Emit the ValueChanged event with oldValue and newValue
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    event ValueChanged(uint oldValue, uint newValue);

    uint public value;

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        emit ValueChanged(oldValue, newValue);
    }
}`,
    hints: [
      "Event declaration: event Name(type param1, type param2);",
      "Emit with: emit ValueChanged(oldValue, newValue);",
    ],
    testDescription: "Checks that the event is declared and setValue() updates the value correctly.",
    expectedEvents: ["ValueChanged"],
    expectedFunctions: ["value", "setValue"],
    testCases: [
      { fn: "value", expected: "0", message: "Initial value() should be 0" },
      { fn: "value", expected: "42", message: "value() should be 42 after setValue(42)", setup: [{ fn: "setValue", args: ["42"] }] },
    ],
  },
  {
    id: "inheritance-basics",
    title: "Inheritance Basics",
    category: "advanced",
    order: 2,
    difficulty: "intermediate",
    description: `# Inheritance Basics

## What you'll learn
How a child contract can inherit and override a parent's function.

Use \`is\` to inherit from a parent contract. The parent marks functions as \`virtual\` (can be overridden), and the child uses \`override\` to replace them:

\`\`\`solidity
contract Parent {
    function greet() public pure virtual returns (string memory) {
        return "Hello";
    }
}
contract Child is Parent {
    function greet() public pure override returns (string memory) {
        return "Hi!";
    }
}
\`\`\`

## Task

1. In the \`Dog\` contract, return \`"Woof!"\` from the \`speak()\` function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Animal {
    function speak() public pure virtual returns (string memory) {
        return "...";
    }
}

contract Dog is Animal {
    function speak() public pure override returns (string memory) {
        // TODO: Return "Woof!"
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Animal {
    function speak() public pure virtual returns (string memory) {
        return "...";
    }
}

contract Dog is Animal {
    function speak() public pure override returns (string memory) {
        return "Woof!";
    }
}`,
    hints: [
      "The function signature with override is already provided — just fill in the body.",
      "Return a string literal: return \"Woof!\";",
    ],
    testDescription: "Checks that Dog overrides Animal's speak() to return 'Woof!'.",
    expectedFunctions: ["speak"],
    testCases: [
      { fn: "speak", expected: "Woof!", message: "speak() should return 'Woof!'" },
    ],
  },
  {
    id: "missing-override-fix",
    title: "Fix: Missing override",
    category: "advanced",
    order: 3,
    difficulty: "intermediate",
    description: `# Fix: Missing override

## What you'll learn
That the \`override\` keyword is required when redefining a parent's function.

When a child contract redefines a \`virtual\` function from its parent, it **must** use the \`override\` keyword. Forgetting it causes a compile error.

## Task

1. **First, compile the code as-is** to see the error message
2. Add the missing keyword to fix the compile error

> The compiler tells you exactly which keyword is missing and where.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Base {
    function getValue() public pure virtual returns (uint) {
        return 0;
    }
}

// This code has an error. Try compiling first!
contract Child is Base {
    function getValue() public pure returns (uint) {
        return 42;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Base {
    function getValue() public pure virtual returns (uint) {
        return 0;
    }
}

contract Child is Base {
    function getValue() public pure override returns (uint) {
        return 42;
    }
}`,
    hints: [
      "When redefining a virtual function, the child must mark it with a special keyword.",
      "Add the keyword between 'pure' and 'returns' in the function signature.",
    ],
    testDescription: "Checks that Child correctly overrides Base's getValue() to return 42.",
    expectedFunctions: ["getValue"],
    testCases: [
      { fn: "getValue", expected: "42", message: "getValue() should return 42" },
    ],
  },
  {
    id: "super-keyword",
    title: "Calling the Parent",
    category: "advanced",
    order: 4,
    difficulty: "intermediate",
    description: `# Calling the Parent

## What you'll learn
How to call the parent contract's function using \`super\`.

Sometimes you want to extend a parent's behavior instead of replacing it entirely. Use \`super.functionName()\` to call the parent's version:

\`\`\`solidity
function doSomething() public override {
    super.doSomething();  // run parent's code first
    // then add your own logic
}
\`\`\`

## Task

1. In \`DoubleCounter.increment()\`, call the parent's increment using \`super\`
2. Then increment \`count\` by 1 more

> After calling increment(), count should be 2 (1 from parent + 1 from child).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint public count;

    function increment() public virtual {
        count += 1;
    }
}

contract DoubleCounter is Counter {
    function increment() public override {
        // TODO: Call parent's increment using super
        // TODO: Then increment count by 1 more
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint public count;

    function increment() public virtual {
        count += 1;
    }
}

contract DoubleCounter is Counter {
    function increment() public override {
        super.increment();
        count += 1;
    }
}`,
    hints: [
      "Call the parent function: super.increment();",
      "Then add your own logic: count += 1;",
    ],
    testDescription: "Checks that DoubleCounter.increment() increases count by 2.",
    expectedFunctions: ["count", "increment"],
    testCases: [
      { fn: "count", expected: "0", message: "Initial count() should be 0" },
      { fn: "count", expected: "2", message: "After increment(), count() should be 2 (1 from parent + 1 from child)", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "function-modifier",
    title: "Function Modifiers",
    category: "advanced",
    order: 5,
    difficulty: "intermediate",
    description: `# Function Modifiers

## What you'll learn
How to create reusable access checks with modifiers.

A \`modifier\` is a reusable piece of code that runs before (or after) a function. The most common pattern is \`onlyOwner\`:

\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;  // this is where the function body runs
}
\`\`\`

## Task

1. Complete the \`onlyOwner\` modifier: check that \`msg.sender == owner\`, then add \`_;\`

> The \`_;\` placeholder tells Solidity where to insert the function's body.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        // TODO: require that msg.sender == owner with message "Not owner"
        // TODO: Add _; to continue execution
    }

    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}`,
    hints: [
      "require(condition, message) reverts if the condition is false.",
      "The _; must come after the require check.",
    ],
    testDescription: "Checks that onlyOwner modifier restricts access to the contract owner.",
    expectedFunctions: ["owner", "changeOwner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner() should return the deployer's address" },
    ],
  },
  {
    id: "implement-interface",
    title: "Implement an Interface",
    category: "advanced",
    order: 6,
    difficulty: "advanced",
    description: `# Implement an Interface

## What you'll learn
How to define and implement an interface — a contract's "promise."

An \`interface\` declares function signatures without implementations. Any contract that implements it **must** provide all the functions:

\`\`\`solidity
interface ICounter {
    function count() external view returns (uint);
    function increment() external;
}
\`\`\`

## Task

1. In the \`Greeter\` contract, return \`greeting\` from the \`greet()\` function

> The contract uses \`is IGreeter\` to promise it will implement all interface functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGreeter {
    function greet() external view returns (string memory);
}

contract Greeter is IGreeter {
    string public greeting = "Hello, Tokamak!";

    function greet() external view returns (string memory) {
        // TODO: Return greeting
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGreeter {
    function greet() external view returns (string memory);
}

contract Greeter is IGreeter {
    string public greeting = "Hello, Tokamak!";

    function greet() external view returns (string memory) {
        return greeting;
    }
}`,
    hints: [
      "The function signature is already provided — just return the state variable.",
      "return greeting;",
    ],
    testDescription: "Checks that Greeter implements the IGreeter interface correctly.",
    expectedFunctions: ["greeting", "greet"],
    testCases: [
      { fn: "greet", expected: "Hello, Tokamak!", message: "greet() should return 'Hello, Tokamak!'" },
    ],
  },
  {
    id: "receive-ether",
    title: "Receive Ether",
    category: "advanced",
    order: 7,
    difficulty: "advanced",
    description: `# Receive Ether

## What you'll learn
How to make a contract accept ETH transfers.

By default, contracts **cannot receive ETH**. To accept ETH, add a \`receive()\` function:

\`\`\`solidity
receive() external payable {}
\`\`\`

The contract's balance can be checked with \`address(this).balance\`.

## Task

1. Add a \`receive()\` function so the contract can accept ETH
2. In \`getBalance\`, return \`address(this).balance\`

> \`receive()\` is called automatically when someone sends ETH to the contract address.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Vault {
    // TODO: Add a receive() external payable function

    function getBalance() public view returns (uint) {
        // TODO: Return address(this).balance
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Vault {
    receive() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    hints: [
      "The receive function: receive() external payable {}",
      "Contract balance: return address(this).balance;",
    ],
    testDescription: "Checks that the contract can receive ETH and getBalance returns the correct amount.",
    expectedFunctions: ["getBalance"],
    testCases: [
      { fn: "getBalance", expected: "0", message: "getBalance() should return 0 when no ETH has been sent" },
    ],
  },
  {
    id: "payable-function",
    title: "Payable Functions",
    category: "advanced",
    order: 8,
    difficulty: "advanced",
    description: `# Payable Functions

## What you'll learn
How to create functions that accept ETH with the \`payable\` keyword.

A function marked \`payable\` can receive ETH. The amount sent is available via \`msg.value\`:

\`\`\`solidity
function deposit() public payable {
    // msg.value contains the amount of ETH sent
}
\`\`\`

## Task

1. In \`deposit\`, add \`msg.value\` to \`balances[msg.sender]\`

> This pattern is the foundation of token deposits, tip jars, and crowdfunding contracts.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TipJar {
    mapping(address => uint) public balances;

    function deposit() public payable {
        // TODO: Add msg.value to balances[msg.sender]
    }

    function getMyBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TipJar {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function getMyBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}`,
    hints: [
      "msg.value contains the ETH amount sent with the transaction.",
      "Add to the sender's balance: balances[msg.sender] += msg.value;",
    ],
    testDescription: "Checks that deposit() correctly tracks ETH deposits per address.",
    expectedFunctions: ["balances", "deposit", "getMyBalance"],
    testCases: [
      { fn: "getMyBalance", expected: "0", message: "getMyBalance() should return 0 before any deposits" },
    ],
  },
];
