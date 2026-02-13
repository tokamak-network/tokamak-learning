import type { Problem } from "../problems";

export const data_structures_problems: Problem[] = [
  {
    id: "dynamic-array",
    title: "Declare a Dynamic Array",
    category: "data-structures",
    order: 1,
    difficulty: "beginner",
    description: `# Declare a Dynamic Array

## What you'll learn
How to create a growable list of values using a dynamic array.

A dynamic array can grow and shrink. Declare it with \`[]\` (no size) and add elements with \`.push()\`:

\`\`\`solidity
uint[] public numbers;
numbers.push(42);  // adds 42 to the end
numbers.push(99);  // adds 99 to the end
\`\`\`

## Task

1. In \`addNumber\`, use \`push\` to add \`num\` to the \`numbers\` array

> Unlike fixed-size arrays, dynamic arrays can grow as needed.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DynamicArray {
    uint[] public numbers;

    function addNumber(uint num) public {
        // TODO: Add num to the numbers array using push
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DynamicArray {
    uint[] public numbers;

    function addNumber(uint num) public {
        numbers.push(num);
    }
}`,
    hints: [
      "Use .push() to add an element: arrayName.push(value);",
      "numbers.push(num);",
    ],
    testDescription: "Checks that addNumber successfully adds elements to the array.",
    expectedFunctions: ["numbers", "addNumber"],
    testCases: [
      { fn: "numbers", args: ["0"], expected: "10", message: "numbers(0) should return 10 after addNumber(10)", setup: [{ fn: "addNumber", args: ["10"] }] },
      { fn: "numbers", args: ["1"], expected: "20", message: "numbers(1) should return 20 after adding two elements", setup: [{ fn: "addNumber", args: ["10"] }, { fn: "addNumber", args: ["20"] }] },
    ],
  },
  {
    id: "array-length-index",
    title: "Array Length and Index Access",
    category: "data-structures",
    order: 2,
    difficulty: "beginner",
    description: `# Array Length and Index Access

## What you'll learn
How to check the size of an array and read specific elements.

Arrays have a \`.length\` property and support index access with \`[]\`:

\`\`\`solidity
uint len = numbers.length;  // number of elements
uint first = numbers[0];    // first element (index starts at 0)
\`\`\`

## Task

1. In \`getLength\`, return \`numbers.length\`
2. In \`getNumber\`, return the element at \`index\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayAccess {
    uint[] public numbers;

    function addNumber(uint num) public {
        numbers.push(num);
    }

    function getLength() public view returns (uint) {
        // TODO: Return the length of the numbers array
    }

    function getNumber(uint index) public view returns (uint) {
        // TODO: Return numbers[index]
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayAccess {
    uint[] public numbers;

    function addNumber(uint num) public {
        numbers.push(num);
    }

    function getLength() public view returns (uint) {
        return numbers.length;
    }

    function getNumber(uint index) public view returns (uint) {
        return numbers[index];
    }
}`,
    hints: [
      "Array length: return numbers.length;",
      "Index access: return numbers[index];",
    ],
    testDescription: "Checks that getLength and getNumber work correctly.",
    expectedFunctions: ["numbers", "addNumber", "getLength", "getNumber"],
    testCases: [
      { fn: "getLength", expected: "0", message: "getLength() should return 0 for an empty array" },
      { fn: "getLength", expected: "2", message: "getLength() should return 2 after adding two elements", setup: [{ fn: "addNumber", args: ["10"] }, { fn: "addNumber", args: ["20"] }] },
      { fn: "getNumber", args: ["0"], expected: "10", message: "getNumber(0) should return 10", setup: [{ fn: "addNumber", args: ["10"] }] },
    ],
  },
  {
    id: "fix-push-fixed-array",
    title: "Fix: Push to Fixed Array",
    category: "data-structures",
    order: 3,
    difficulty: "beginner",
    description: `# Fix: Push to Fixed Array

## What you'll learn
The difference between dynamic arrays and fixed-size arrays.

Fixed-size arrays (e.g., \`uint[3]\`) have a set size and **cannot use \`.push()\`**. Only dynamic arrays (\`uint[]\`) support push.

## Task

1. **First, compile the code as-is** to see the error message
2. Fix the error by changing the fixed-size array to a dynamic array

> \`uint[3]\` = fixed size of 3, \`uint[]\` = dynamic (growable).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FixedArrayError {
    // This code has an error. Try compiling first!
    uint[3] public scores;

    function addScore(uint score) public {
        scores.push(score);
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FixedArrayError {
    uint[] public scores;

    function addScore(uint score) public {
        scores.push(score);
    }
}`,
    hints: [
      "Fixed-size arrays (uint[3]) don't have a push method.",
      "Remove the size to make it dynamic: uint[] public scores;",
    ],
    testDescription: "Checks that addScore works after fixing the array type.",
    expectedFunctions: ["scores", "addScore"],
    testCases: [
      { fn: "scores", args: ["0"], expected: "100", message: "scores(0) should return 100 after addScore(100)", setup: [{ fn: "addScore", args: ["100"] }] },
    ],
  },
  {
    id: "first-mapping",
    title: "Your First Mapping",
    category: "data-structures",
    order: 4,
    difficulty: "intermediate",
    description: `# Your First Mapping

## What you'll learn
How to store key-value pairs using mappings.

A \`mapping\` is like a dictionary — it maps keys to values. The most common pattern maps addresses to numbers (e.g., balances):

\`\`\`solidity
mapping(address => uint) public balances;
balances[addr] = 100;  // set
balances[addr];        // get (returns 100)
\`\`\`

## Task

1. In \`setBalance\`, set \`balances[addr]\` to \`amount\`
2. In \`getBalance\`, return \`balances[addr]\`

> Non-existent keys return the default value (0 for uint), never an error.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstMapping {
    mapping(address => uint) public balances;

    function setBalance(address addr, uint amount) public {
        // TODO: Set balances[addr] to amount
    }

    function getBalance(address addr) public view returns (uint) {
        // TODO: Return balances[addr]
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstMapping {
    mapping(address => uint) public balances;

    function setBalance(address addr, uint amount) public {
        balances[addr] = amount;
    }

    function getBalance(address addr) public view returns (uint) {
        return balances[addr];
    }
}`,
    hints: [
      "Set a value: balances[addr] = amount;",
      "Read a value: return balances[addr];",
    ],
    testDescription: "Checks that setBalance stores and getBalance retrieves the correct value.",
    expectedFunctions: ["balances", "setBalance", "getBalance"],
    testCases: [
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "0", message: "getBalance() should return 0 for a new address (default value)" },
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "100", message: "getBalance() should return 100 after setBalance(100)", setup: [{ fn: "setBalance", args: ["0x1000000000000000000000000000000000000001", "100"] }] },
    ],
  },
  {
    id: "define-struct",
    title: "Define a Struct",
    category: "data-structures",
    order: 5,
    difficulty: "intermediate",
    description: `# Define a Struct

## What you'll learn
How to create custom data types by grouping related values.

A \`struct\` bundles multiple fields into a single type, like a form with named fields:

\`\`\`solidity
struct Person {
    string name;
    uint age;
}
\`\`\`

## Task

1. Add two fields to the \`Token\` struct: \`name\` (string) and \`totalSupply\` (uint)
2. In \`getInfo\`, return \`token.name\` and \`token.totalSupply\`

> Structs help organize related data — instead of separate variables, group them together.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DefineStruct {
    struct Token {
        // TODO: Add field: string name
        // TODO: Add field: uint totalSupply
    }

    Token public token = Token("Tokamak", 1000000);

    function getInfo() public view returns (string memory, uint) {
        // TODO: Return token.name and token.totalSupply
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DefineStruct {
    struct Token {
        string name;
        uint totalSupply;
    }

    Token public token = Token("Tokamak", 1000000);

    function getInfo() public view returns (string memory, uint) {
        return (token.name, token.totalSupply);
    }
}`,
    hints: [
      "Struct fields are declared like variables: string name; uint totalSupply;",
      "Return multiple values with parentheses: return (token.name, token.totalSupply);",
    ],
    testDescription: "Checks that the Token struct has the correct fields and getInfo returns the values.",
    expectedFunctions: ["token", "getInfo"],
    testCases: [
      { fn: "getInfo", message: "getInfo() should return the token name and total supply" },
    ],
  },
  {
    id: "struct-array",
    title: "Array of Structs",
    category: "data-structures",
    order: 6,
    difficulty: "intermediate",
    description: `# Array of Structs

## What you'll learn
How to store multiple structs in an array.

You can combine structs with arrays to create collections of structured data:

\`\`\`solidity
struct Todo { string text; bool done; }
Todo[] public todos;
todos.push(Todo("Buy milk", false));
\`\`\`

## Task

1. In \`addStudent\`, push a new \`Student\` with the given name and score to the array
2. In \`getCount\`, return the length of the \`students\` array`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StructArray {
    struct Student {
        string name;
        uint score;
    }

    Student[] public students;

    function addStudent(string calldata name, uint score) public {
        // TODO: Push a new Student(name, score) to the students array
    }

    function getCount() public view returns (uint) {
        // TODO: Return students.length
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StructArray {
    struct Student {
        string name;
        uint score;
    }

    Student[] public students;

    function addStudent(string calldata name, uint score) public {
        students.push(Student(name, score));
    }

    function getCount() public view returns (uint) {
        return students.length;
    }
}`,
    hints: [
      "Create a struct instance: Student(name, score)",
      "Push it: students.push(Student(name, score));",
    ],
    testDescription: "Checks that addStudent adds structs and getCount returns the correct length.",
    expectedFunctions: ["students", "addStudent", "getCount"],
    testCases: [
      { fn: "getCount", expected: "0", message: "getCount() should return 0 for an empty array" },
      { fn: "getCount", expected: "1", message: "getCount() should return 1 after addStudent", setup: [{ fn: "addStudent", args: ["Alice", "90"] }] },
      { fn: "getCount", expected: "2", message: "getCount() should return 2 after adding two students", setup: [{ fn: "addStudent", args: ["Alice", "90"] }, { fn: "addStudent", args: ["Bob", "85"] }] },
    ],
  },
  {
    id: "nested-mapping",
    title: "Nested Mapping",
    category: "data-structures",
    order: 7,
    difficulty: "intermediate",
    description: `# Nested Mapping

## What you'll learn
How to create a mapping inside a mapping for two-dimensional lookups.

A nested mapping maps one key to another mapping. Common use: tracking allowances (who approved whom to spend how much):

\`\`\`solidity
mapping(address => mapping(address => uint)) public allowance;
allowance[owner][spender] = 100;
\`\`\`

## Task

1. In \`setAllowance\`, set \`allowance[owner][spender]\` to \`amount\`
2. In \`getAllowance\`, return \`allowance[owner][spender]\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NestedMapping {
    mapping(address => mapping(address => uint)) public allowance;

    function setAllowance(address owner, address spender, uint amount) public {
        // TODO: Set allowance[owner][spender] to amount
    }

    function getAllowance(address owner, address spender) public view returns (uint) {
        // TODO: Return allowance[owner][spender]
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NestedMapping {
    mapping(address => mapping(address => uint)) public allowance;

    function setAllowance(address owner, address spender, uint amount) public {
        allowance[owner][spender] = amount;
    }

    function getAllowance(address owner, address spender) public view returns (uint) {
        return allowance[owner][spender];
    }
}`,
    hints: [
      "Access nested mapping with two keys: allowance[owner][spender]",
      "Set: allowance[owner][spender] = amount;",
    ],
    testDescription: "Checks that nested mapping set and get work correctly.",
    expectedFunctions: ["allowance", "setAllowance", "getAllowance"],
    testCases: [
      { fn: "getAllowance", args: ["0x1000000000000000000000000000000000000001", "0x1000000000000000000000000000000000000002"], expected: "0", message: "getAllowance() should return 0 by default" },
      {
        fn: "getAllowance",
        args: ["0x1000000000000000000000000000000000000001", "0x1000000000000000000000000000000000000002"],
        expected: "500",
        message: "getAllowance() should return 500 after setAllowance",
        setup: [{ fn: "setAllowance", args: ["0x1000000000000000000000000000000000000001", "0x1000000000000000000000000000000000000002", "500"] }],
      },
    ],
  },
];
