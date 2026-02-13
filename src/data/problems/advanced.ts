import type { Problem } from "../problems";

export const advanced_problems: Problem[] = [
  {
    id: "events",
    title: "Emit an Event",
    category: "advanced",
    order: 1,
    difficulty: "beginner",
    description: `# Emit an Event

## What you'll learn
How to declare and emit events to log contract activity.

Events are like logs — they record what happened in a transaction. Off-chain applications (like websites) can listen for events to react to contract activity.

## Task

1. Declare an event: \`event ValueChanged(uint oldValue, uint newValue);\`
2. Inside \`setValue()\`, emit the event after changing the value

> Use the \`emit\` keyword to fire an event: \`emit EventName(values);\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    // TODO: Declare event ValueChanged(uint oldValue, uint newValue)

    uint public value = 0;

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

    uint public value = 0;

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        emit ValueChanged(oldValue, newValue);
    }
}`,
    hints: [
      "Event declaration looks like a function signature: event Name(type param, ...);",
      "Emit with: emit EventName(arg1, arg2);",
    ],
    testDescription: "Checks that the event is declared and setValue() works correctly.",
    expectedEvents: ["ValueChanged"],
    expectedFunctions: ["value", "setValue"],
    testCases: [
      { fn: "value", expected: "0", message: "Initial value() should be 0" },
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

## What you'll learn
How to override a parent contract's function.

A child contract can inherit from a parent using the \`is\` keyword. The parent marks functions as \`virtual\` (can be overridden), and the child uses \`override\` to replace them.

\`\`\`
contract Parent {
    function greet() public pure virtual returns (string memory) {
        return "Hello";
    }
}
contract Child is Parent {
    function greet() public pure override returns (string memory) {
        return "Hi there!";
    }
}
\`\`\`

## Task

Inside the Dog contract, return \`"Woof!"\` from the \`speak()\` function.`,
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
      "Return a string literal with: return \"text\";",
    ],
    testDescription: "Checks that Dog overrides Animal's speak() function.",
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

1. **First, compile it as-is** to see the error message
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
      "Add the keyword between pure and returns in the function signature.",
    ],
    testDescription: "Checks that Child correctly overrides Base's getValue() function.",
    expectedFunctions: ["getValue"],
    testCases: [
      { fn: "getValue", expected: "42", message: "getValue() should return 42" },
    ],
  },
];
