import type { Problem } from "../problems";

export const advanced_problems: Problem[] = [
  {
    id: "events",
    title: "Events",
    category: "advanced",
    order: 1,
    difficulty: "intermediate",
    description: `# Events

Learn about events that log smart contract activity.

## What you'll learn
- Declaring and emitting events
- Indexed parameters

## Explanation
\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint amount);

function transfer(address to, uint amount) public {
    emit Transfer(msg.sender, to, amount);
}
\`\`\`

- \`indexed\`: used for event filtering (max 3)
- Use the \`emit\` keyword to fire events

## Task
1. Declare two events
2. Emit the events in each function`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    // TODO: Declare event MessageSent(address indexed sender, string message, uint timestamp)
    // TODO: Declare event ValueChanged(uint indexed oldValue, uint indexed newValue)

    uint public value = 0;

    function sendMessage(string calldata message) public {
        // TODO: Emit the MessageSent event (sender: msg.sender, timestamp: block.timestamp)
    }

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        // TODO: Emit the ValueChanged event
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    event MessageSent(address indexed sender, string message, uint timestamp);
    event ValueChanged(uint indexed oldValue, uint indexed newValue);

    uint public value = 0;

    function sendMessage(string calldata message) public {
        emit MessageSent(msg.sender, message, block.timestamp);
    }

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        emit ValueChanged(oldValue, newValue);
    }
}`,
    hints: [
      "Event declaration: event Name(parameters);",
      "Emit event: emit EventName(values);",
    ],
    testDescription: "Checks that events are correctly declared and emitted.",
    expectedEvents: ["MessageSent", "ValueChanged"],
    expectedFunctions: ["value", "sendMessage", "setValue"],
    testCases: [
      { fn: "value", expected: "0", message: "Initial value() should be 0" },
      { fn: "sendMessage", args: ["hello"], message: "sendMessage() should execute successfully" },
      { fn: "value", expected: "42", message: "value() should be 42 after setValue(42)", setup: [{ fn: "setValue", args: ["42"] }] },
    ],
  },
  {
    id: "inheritance",
    title: "Inheritance",
    category: "advanced",
    order: 2,
    difficulty: "intermediate",
    description: `# Inheritance

Learn about inheritance for code reuse between contracts.

## What you'll learn
- Inheriting with the \`is\` keyword
- virtual and override

## Explanation
\`\`\`solidity
contract Animal {
    function speak() public pure virtual returns (string memory) {
        return "...";
    }
}

contract Dog is Animal {
    function speak() public pure override returns (string memory) {
        return "Woof!";
    }
}
\`\`\`

- \`virtual\`: can be overridden by child contracts
- \`override\`: redefines a parent function

## Task
The Shape contract is already written. Complete the TODO in the Rectangle contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Shape {
    function getArea() public pure virtual returns (uint) {
        return 0;
    }
}

contract Rectangle is Shape {
    uint public width;
    uint public height;

    constructor(uint _width, uint _height) {
        // TODO: Set width and height
    }

    function getArea() public view override returns (uint) {
        // TODO: Return width * height
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Shape {
    function getArea() public pure virtual returns (uint) {
        return 0;
    }
}

contract Rectangle is Shape {
    uint public width;
    uint public height;

    constructor(uint _width, uint _height) {
        width = _width;
        height = _height;
    }

    function getArea() public view override returns (uint) {
        return width * height;
    }
}`,
    hints: [
      "In the constructor: width = _width; height = _height;",
      "getArea: return width * height;",
    ],
    testDescription: "Checks that inheritance and override are correctly implemented.",
    expectedFunctions: ["getArea", "width", "height"],
    constructorArgs: ["3", "4"],
    testCases: [
      { fn: "width", expected: "3", message: "width() should return 3" },
      { fn: "height", expected: "4", message: "height() should return 4" },
      { fn: "getArea", expected: "12", message: "getArea() should return 12 (3*4)" },
    ],
  },
  {
    id: "interface",
    title: "Interface",
    category: "advanced",
    order: 3,
    difficulty: "intermediate",
    description: `# Interface

Learn about interfaces — communication contracts between contracts.

## What you'll learn
- Declaring an interface
- Implementing an interface

## Explanation
\`\`\`solidity
interface IToken {
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract MyToken is IToken {
    // must implement all interface functions
}
\`\`\`

**Interface rules:** Only function declarations, no state variables, all functions must be external

## Task
The ICounter interface is provided. Complete the TODO in the Counter contract.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICounter {
    function increment() external;
    function decrement() external;
    function getCount() external view returns (uint);
}

contract Counter is ICounter {
    uint private count = 0;

    function increment() external {
        // TODO: Increment count by 1
    }

    function decrement() external {
        // TODO: Use require to check count > 0, then decrement count by 1
    }

    function getCount() external view returns (uint) {
        // TODO: Return count
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICounter {
    function increment() external;
    function decrement() external;
    function getCount() external view returns (uint);
}

contract Counter is ICounter {
    uint private count = 0;

    function increment() external {
        count += 1;
    }

    function decrement() external {
        require(count > 0, "Count is zero");
        count -= 1;
    }

    function getCount() external view returns (uint) {
        return count;
    }
}`,
    hints: [
      "increment: count += 1;",
      "decrement: require(count > 0, ...) then count -= 1;",
    ],
    testDescription: "Checks that the interface is correctly implemented.",
    expectedFunctions: ["increment", "decrement", "getCount"],
    testCases: [
      { fn: "getCount", expected: "0", message: "Initial getCount() should be 0" },
      { fn: "getCount", expected: "1", message: "getCount() should be 1 after increment()", setup: [{ fn: "increment" }] },
      { fn: "getCount", expected: "1", message: "getCount() should be 1 after 2x increment() and 1x decrement()", setup: [{ fn: "increment" }, { fn: "increment" }, { fn: "decrement" }] },
      { fn: "decrement", expectRevert: true, message: "decrement() should revert when count is 0" },
    ],
  },
];
