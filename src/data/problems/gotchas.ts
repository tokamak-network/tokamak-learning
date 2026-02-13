import type { Problem } from "../problems";

export const gotchas_problems: Problem[] = [
  {
    id: "no-float",
    title: "No Decimals!",
    category: "gotchas",
    order: 1,
    difficulty: "beginner",
    description: `# No Decimals!

Solidity has **no** floating point numbers (float/double). Integer division truncates the decimal part.

\`\`\`solidity
uint result = 5 / 2; // 2 (not 2.5!)
uint scaled = (5 * 1e18) / 2; // 2500000000000000000 (preserves precision)
\`\`\`

## Task
Complete both the regular division and scaled division functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NoFloat {
    function wrongDivide(uint a, uint b) public pure returns (uint) {
        // TODO: Simply return a / b (decimals will be truncated)
    }

    function scaledDivide(uint a, uint b) public pure returns (uint) {
        // TODO: Return (a * 1e18) / b to preserve precision
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NoFloat {
    function wrongDivide(uint a, uint b) public pure returns (uint) {
        return a / b;
    }

    function scaledDivide(uint a, uint b) public pure returns (uint) {
        return (a * 1e18) / b;
    }
}`,
    hints: ["Solidity integer division always rounds down.", "Multiplying by 1e18 before dividing preserves up to 18 decimal places of precision."],
    testDescription: "Checks that wrongDivide(5,2) returns 2 and scaledDivide(5,2) returns 2.5*1e18.",
    expectedFunctions: ["wrongDivide", "scaledDivide"],
    testCases: [
      { fn: "wrongDivide", args: ["5", "2"], expected: "2", message: "wrongDivide(5, 2) should return 2 (decimal truncated)" },
      { fn: "scaledDivide", args: ["5", "2"], expected: "2500000000000000000", message: "scaledDivide(5, 2) should return 2.5e18" },
    ],
  },
  {
    id: "default-values",
    title: "Default Values",
    category: "gotchas",
    order: 2,
    difficulty: "beginner",
    description: `# Default Values

Solidity variables are automatically assigned default values when declared. There is **no** null or undefined.
- \`uint\` → 0, \`bool\` → false, \`address\` → address(0), \`string\` → ""

\`\`\`solidity
uint x;     // 0
bool b;     // false
address a;  // 0x0000...0000
\`\`\`

## Task
Write a condition in isDefault that checks whether all variables are at their default values.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DefaultValues {
    uint public num;
    bool public flag;
    address public addr;
    string public text;

    function isDefault() public view returns (bool) {
        // TODO: Check that num == 0, flag == false, and addr == address(0), then return the result
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DefaultValues {
    uint public num;
    bool public flag;
    address public addr;
    string public text;

    function isDefault() public view returns (bool) {
        return num == 0 && !flag && addr == address(0);
    }
}`,
    hints: ["The default value of bool (false) can be checked with !flag.", "The default value of address is address(0)."],
    testDescription: "Checks that isDefault() returns true in the initial state.",
    expectedFunctions: ["num", "flag", "addr", "text", "isDefault"],
    testCases: [
      { fn: "num", expected: "0", message: "Initial num() should be 0" },
      { fn: "flag", expected: "false", message: "Initial flag() should be false" },
      { fn: "isDefault", expected: "true", message: "isDefault() should return true in the initial state" },
    ],
  },
  {
    id: "string-comparison",
    title: "String Comparison",
    category: "gotchas",
    order: 3,
    difficulty: "beginner",
    description: `# String Comparison

In Solidity, strings **cannot** be compared directly with \`==\`. You must compare their \`keccak256\` hashes.

\`\`\`solidity
// Wrong: "hello" == "hello" (compile error!)
// Correct:
keccak256(abi.encodePacked("hello")) == keccak256(abi.encodePacked("hello"))
\`\`\`

## Task
Complete the isEqual function that compares two strings using keccak256 hashes.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringComparison {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        // TODO: Compare a and b using keccak256 and abi.encodePacked
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringComparison {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}`,
    hints: ["keccak256() takes bytes and returns a bytes32 hash.", "Use abi.encodePacked(str) to convert a string to bytes."],
    testDescription: "Checks that isEqual returns true for identical strings and false for different ones.",
    expectedFunctions: ["isEqual"],
    testCases: [
      { fn: "isEqual", args: ["hello", "hello"], expected: "true", message: "isEqual('hello', 'hello') should return true" },
      { fn: "isEqual", args: ["hello", "world"], expected: "false", message: "isEqual('hello', 'world') should return false" },
    ],
  },
  {
    id: "string-concat",
    title: "String Concatenation",
    category: "gotchas",
    order: 4,
    difficulty: "beginner",
    description: `# String Concatenation

Since Solidity 0.8.12, you can concatenate strings with \`string.concat()\`.

\`\`\`solidity
string memory result = string.concat("Hello", " ", "World");
// result = "Hello World"
\`\`\`

## Task
Complete the concat function that joins two strings using string.concat.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringConcat {
    function concat(string memory a, string memory b) public pure returns (string memory) {
        // TODO: Use string.concat to join a and b, then return the result
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringConcat {
    function concat(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }
}`,
    hints: ["Use string.concat(a, b) format.", "You can also concatenate multiple strings at once: string.concat(a, b, c)"],
    testDescription: "Checks that the concat function correctly joins two strings.",
    expectedFunctions: ["concat"],
    testCases: [
      { fn: "concat", args: ["Hello", " World"], expected: "Hello World", message: "concat('Hello', ' World') should return 'Hello World'" },
      { fn: "concat", args: ["a", "b"], expected: "ab", message: "concat('a', 'b') should return 'ab'" },
    ],
  },
  {
    id: "address-vs-payable-diff",
    title: "address vs address payable",
    category: "gotchas",
    order: 5,
    difficulty: "beginner",
    description: `# address vs address payable

\`address\` cannot send ETH. Only \`address payable\` can use \`.transfer()\` and \`.send()\`.

\`\`\`solidity
address payable to = payable(0x123...);
to.transfer(1 ether); // send ETH
address payable converted = payable(someAddress);
\`\`\`

## Task
Complete the sendETH and makePayable functions.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayableDiff {
    receive() external payable {}

    function sendETH(address payable to, uint amount) public {
        // TODO: Send amount of ETH to the address using transfer
    }

    function makePayable(address addr) public pure returns (address payable) {
        // TODO: Convert addr to address payable and return it
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayableDiff {
    receive() external payable {}

    function sendETH(address payable to, uint amount) public {
        to.transfer(amount);
    }

    function makePayable(address addr) public pure returns (address payable) {
        return payable(addr);
    }
}`,
    hints: ["Call .transfer(amount) on an address payable variable to send ETH.", "Use payable(addr) to convert a regular address to address payable."],
    testDescription: "Checks that sendETH transfers ETH and makePayable correctly converts the address.",
    expectedFunctions: ["sendETH", "makePayable"],
    testCases: [
      { fn: "makePayable", args: ["0x1000000000000000000000000000000000000001"], message: "makePayable() should return successfully" },
    ],
  },
  {
    id: "ether-units",
    title: "Ether Units",
    category: "gotchas",
    order: 6,
    difficulty: "beginner",
    description: `# Ether Units

Solidity has built-in ether units:
- \`1 ether\` = 10^18 wei
- \`1 gwei\` = 10^9 wei
- \`1 wei\` = 1

\`\`\`solidity
uint oneEth = 1 ether;  // 1000000000000000000
uint oneG = 1 gwei;     // 1000000000
\`\`\`

## Task
Complete the three functions that return each unit.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherUnits {
    function oneEther() public pure returns (uint) {
        // TODO: Return 1 ether
    }

    function oneGwei() public pure returns (uint) {
        // TODO: Return 1 gwei
    }

    function tenWei() public pure returns (uint) {
        // TODO: Return 10 wei
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherUnits {
    function oneEther() public pure returns (uint) {
        return 1 ether;
    }

    function oneGwei() public pure returns (uint) {
        return 1 gwei;
    }

    function tenWei() public pure returns (uint) {
        return 10 wei;
    }
}`,
    hints: ["Appending ether, gwei, or wei after a number automatically converts it.", "1 ether = 1e18, 1 gwei = 1e9."],
    testDescription: "Checks that oneEther, oneGwei, and tenWei return the correct wei values.",
    expectedFunctions: ["oneEther", "oneGwei", "tenWei"],
    testCases: [
      { fn: "oneEther", expected: "1000000000000000000", message: "oneEther() should return 10^18" },
      { fn: "oneGwei", expected: "1000000000", message: "oneGwei() should return 10^9" },
      { fn: "tenWei", expected: "10", message: "tenWei() should return 10" },
    ],
  },
  {
    id: "time-units",
    title: "Time Units",
    category: "gotchas",
    order: 7,
    difficulty: "beginner",
    description: `# Time Units

Solidity has built-in time units:
- \`1 seconds\`, \`1 minutes\` (60), \`1 hours\` (3600), \`1 days\` (86400), \`1 weeks\` (604800)

\`\`\`solidity
uint oneDay = 1 days;   // 86400
uint deadline = block.timestamp + 7 days;
\`\`\`

## Task
Complete the three functions that use time units.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeUnits {
    function oneDay() public pure returns (uint) {
        // TODO: Return 1 days
    }

    function oneWeek() public pure returns (uint) {
        // TODO: Return 1 weeks
    }

    function futureTimestamp(uint daysFromNow) public view returns (uint) {
        // TODO: Return the timestamp daysFromNow days from the current timestamp
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeUnits {
    function oneDay() public pure returns (uint) {
        return 1 days;
    }

    function oneWeek() public pure returns (uint) {
        return 1 weeks;
    }

    function futureTimestamp(uint daysFromNow) public view returns (uint) {
        return block.timestamp + daysFromNow * 1 days;
    }
}`,
    hints: ["Appending days, weeks, etc. after a number automatically converts to seconds.", "Use block.timestamp + n * 1 days to calculate a future timestamp."],
    testDescription: "Checks that oneDay, oneWeek, and futureTimestamp return the correct time values.",
    expectedFunctions: ["oneDay", "oneWeek", "futureTimestamp"],
    testCases: [
      { fn: "oneDay", expected: "86400", message: "oneDay() should return 86400" },
      { fn: "oneWeek", expected: "604800", message: "oneWeek() should return 604800" },
      { fn: "futureTimestamp", args: ["1"], message: "futureTimestamp(1) should return successfully" },
    ],
  },
  {
    id: "type-casting-danger",
    title: "Downcasting Caution",
    category: "gotchas",
    order: 8,
    difficulty: "beginner",
    description: `# Downcasting Caution

When converting \`uint256\` to \`uint8\`, if the value exceeds 255, Solidity 0.8+ will revert. Use \`require\` to check for safe casting.

\`\`\`solidity
require(x <= type(uint8).max, "Overflow");
return uint8(x);
\`\`\`

## Task
Complete the safeCast function that checks for overflow with require before casting.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeCastingDanger {
    function safeCast(uint256 x) public pure returns (uint8) {
        // TODO: Use require to check that x is within uint8 max value
        // then convert to uint8 and return
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeCastingDanger {
    function safeCast(uint256 x) public pure returns (uint8) {
        require(x <= type(uint8).max, "Overflow");
        return uint8(x);
    }
}`,
    hints: ["type(uint8).max is the maximum value of uint8, which is 255.", "require(condition, errorMessage) reverts the transaction if the condition is false."],
    testDescription: "Checks that safeCast converts values <= 255 and reverts for values > 255.",
    expectedFunctions: ["safeCast"],
    testCases: [
      { fn: "safeCast", args: ["100"], expected: "100", message: "safeCast(100) should return 100" },
      { fn: "safeCast", args: ["255"], expected: "255", message: "safeCast(255) should return 255" },
      { fn: "safeCast", args: ["256"], expectRevert: true, message: "safeCast(256) should revert" },
    ],
  },
];
