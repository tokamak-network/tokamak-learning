import type { Problem } from "../problems";

export const data_structures_problems: Problem[] = [
  {
    id: "arrays",
    title: "Arrays",
    category: "data-structures",
    order: 1,
    difficulty: "beginner",
    description: `# Arrays

Learn about dynamic and fixed-size arrays.

## What you'll learn
- Declaring dynamic arrays
- push, pop, length, index access

## Explanation
\`\`\`solidity
uint[] public arr;
arr.push(123);     // add to end
arr.pop();         // remove last
arr.length;        // length
arr[0];            // index access
\`\`\`

## Task
Complete each function's TODO in a single line.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayExample {
    uint[] public numbers;

    function addNumber(uint num) public {
        // TODO: Add num to the numbers array
    }

    function removeLastNumber() public {
        // TODO: Remove the last element from the numbers array
    }

    function getNumber(uint index) public view returns (uint) {
        // TODO: Return numbers[index]
    }

    function getLength() public view returns (uint) {
        // TODO: Return numbers.length
    }

    function getAllNumbers() public view returns (uint[] memory) {
        // TODO: Return the entire numbers array
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayExample {
    uint[] public numbers;

    function addNumber(uint num) public {
        numbers.push(num);
    }

    function removeLastNumber() public {
        numbers.pop();
    }

    function getNumber(uint index) public view returns (uint) {
        return numbers[index];
    }

    function getLength() public view returns (uint) {
        return numbers.length;
    }

    function getAllNumbers() public view returns (uint[] memory) {
        return numbers;
    }
}`,
    hints: [
      "push: numbers.push(num); / pop: numbers.pop();",
      "To return the entire array: return numbers;",
    ],
    testDescription: "Checks that array manipulation functions are correctly implemented.",
    expectedFunctions: [
      "numbers",
      "addNumber",
      "removeLastNumber",
      "getNumber",
      "getLength",
      "getAllNumbers",
    ],
    testCases: [
      { fn: "getLength", expected: "0", message: "Initial getLength() should be 0" },
      { fn: "getLength", expected: "2", message: "getLength() should be 2 after calling addNumber twice", setup: [{ fn: "addNumber", args: ["10"] }, { fn: "addNumber", args: ["20"] }] },
      { fn: "getNumber", args: ["0"], expected: "10", message: "getNumber(0) should be 10 after addNumber(10)", setup: [{ fn: "addNumber", args: ["10"] }] },
    ],
  },
  {
    id: "mapping",
    title: "Mapping",
    category: "data-structures",
    order: 2,
    difficulty: "beginner",
    description: `# Mapping

Learn about mappings that store data as key-value pairs.

## What you'll learn
- Declaring and using mappings
- Setting and reading values

## Explanation
\`\`\`solidity
mapping(address => uint) public balances;

balances[addr] = 100;     // set value
balances[addr];           // read value
balances[addr] += 50;     // increase value
\`\`\`

**Mapping note:** Non-existent keys return the default value (0).

## Task
Complete each function's TODO in a single line.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MappingExample {
    mapping(address => uint) public balances;

    function setBalance(address addr, uint amount) public {
        // TODO: Set balances[addr] to amount
    }

    function getBalance(address addr) public view returns (uint) {
        // TODO: Return balances[addr]
    }

    function addBalance(address addr, uint amount) public {
        // TODO: Add amount to balances[addr]
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MappingExample {
    mapping(address => uint) public balances;

    function setBalance(address addr, uint amount) public {
        balances[addr] = amount;
    }

    function getBalance(address addr) public view returns (uint) {
        return balances[addr];
    }

    function addBalance(address addr, uint amount) public {
        balances[addr] += amount;
    }
}`,
    hints: [
      "Set: balances[addr] = amount;",
      "Add: balances[addr] += amount;",
    ],
    testDescription: "Checks that mapping functions are correctly implemented.",
    expectedFunctions: ["balances", "setBalance", "getBalance", "addBalance"],
    testCases: [
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "0", message: "Initial getBalance() should be 0" },
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "100", message: "getBalance() should be 100 after setBalance(100)", setup: [{ fn: "setBalance", args: ["0x1000000000000000000000000000000000000001", "100"] }] },
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "150", message: "getBalance() should be 150 after addBalance(50)", setup: [{ fn: "setBalance", args: ["0x1000000000000000000000000000000000000001", "100"] }, { fn: "addBalance", args: ["0x1000000000000000000000000000000000000001", "50"] }] },
    ],
  },
  {
    id: "struct",
    title: "Struct",
    category: "data-structures",
    order: 3,
    difficulty: "intermediate",
    description: `# Struct

Learn about structs that bundle related data into custom types.

## What you'll learn
- Declaring a struct
- Creating and accessing struct instances

## Explanation
\`\`\`solidity
struct Todo {
    string text;
    bool completed;
}
Todo[] public todos;

// create
todos.push(Todo("Buy milk", false));

// access
todos[0].completed = true;
\`\`\`

## Task
1. Fill in the Student struct fields
2. Complete each function's TODO`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StructExample {
    struct Student {
        // TODO: Add fields: name (string), score (uint), isEnrolled (bool)
    }

    Student[] public students;

    function addStudent(string calldata name, uint score) public {
        // TODO: Push Student(name, score, true) to students
    }

    function getStudent(uint index) public view returns (string memory, uint, bool) {
        Student storage s = students[index];
        // TODO: Return s.name, s.score, s.isEnrolled
    }

    function updateScore(uint index, uint newScore) public {
        // TODO: Set students[index].score to newScore
    }

    function getStudentCount() public view returns (uint) {
        // TODO: Return students.length
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StructExample {
    struct Student {
        string name;
        uint score;
        bool isEnrolled;
    }

    Student[] public students;

    function addStudent(string calldata name, uint score) public {
        students.push(Student(name, score, true));
    }

    function getStudent(uint index) public view returns (string memory, uint, bool) {
        Student storage s = students[index];
        return (s.name, s.score, s.isEnrolled);
    }

    function updateScore(uint index, uint newScore) public {
        students[index].score = newScore;
    }

    function getStudentCount() public view returns (uint) {
        return students.length;
    }
}`,
    hints: [
      "Struct fields: string name; uint score; bool isEnrolled;",
      "Return multiple values: return (s.name, s.score, s.isEnrolled);",
    ],
    testDescription: "Checks that the struct and related functions are correctly implemented.",
    expectedFunctions: [
      "students",
      "addStudent",
      "getStudent",
      "updateScore",
      "getStudentCount",
    ],
    testCases: [
      { fn: "getStudentCount", expected: "0", message: "Initial getStudentCount() should be 0" },
      { fn: "getStudentCount", expected: "1", message: "getStudentCount() should be 1 after addStudent", setup: [{ fn: "addStudent", args: ["Alice", "90"] }] },
    ],
  },
];
