export interface TestCase {
  fn: string;
  args?: string[];
  expected?: string;
  message: string;
  value?: string;
  setup?: { fn: string; args?: string[]; value?: string }[];
  expectRevert?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testDescription: string;
  expectedFunctions?: string[];
  expectedEvents?: string[];
  testCases?: TestCase[];
  constructorArgs?: string[];
  expectedContractName?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  order: number;
}

export const categories: Category[] = [
  { id: "basics", title: "기초", description: "Solidity의 기본 구조와 문법을 배웁니다", order: 1 },
  { id: "integers", title: "정수형", description: "uint와 int의 다양한 크기와 특성을 학습합니다", order: 2 },
  { id: "basic-types", title: "기본 타입", description: "bool, address, bytes, string, enum 타입을 배웁니다", order: 3 },
  { id: "arithmetic", title: "산술 연산", description: "Solidity의 산술 연산자를 하나씩 배웁니다", order: 4 },
  { id: "comparison", title: "비교와 논리", description: "비교, 논리 연산자와 조건문을 학습합니다", order: 5 },
  { id: "variables", title: "변수와 함수", description: "변수 종류, 가시성, 함수 기초를 배웁니다", order: 6 },
  { id: "gotchas", title: "Solidity 특이점", description: "다른 언어와 다른 Solidity만의 특징을 배웁니다", order: 7 },
  { id: "control-flow", title: "제어 흐름", description: "반복문과 에러 처리를 학습합니다", order: 8 },
  { id: "data-structures", title: "데이터 구조", description: "배열, 매핑, 구조체를 배웁니다", order: 9 },
  { id: "advanced", title: "고급", description: "상속, 인터페이스, 이벤트 등 고급 기능을 학습합니다", order: 10 },
  { id: "patterns", title: "디자인 패턴", description: "실전에서 사용되는 스마트 컨트랙트 패턴을 배웁니다", order: 11 },
];

export const problems: Problem[] = [
  // ==========================================
  // BASICS (기초) — 10 problems
  // ==========================================
  {
    id: "hello-solidity",
    title: "첫 번째 컨트랙트",
    category: "basics",
    order: 1,
    difficulty: "beginner",
    description: `# 첫 번째 컨트랙트 만들기

Solidity에서 모든 코드는 \`contract\` 안에 들어갑니다.
집을 짓기 전에 빈 방부터 만드는 것처럼, 빈 컨트랙트부터 시작합니다.

## 할 일

아래 코드를 입력하세요:

\`\`\`solidity
contract HelloSolidity {
}
\`\`\`

> \`contract\` — 스마트 컨트랙트를 선언하는 키워드입니다.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: HelloSolidity 컨트랙트를 선언하세요`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloSolidity {
}`,
    hints: ["contract 키워드 뒤에 이름을 쓰고 { }로 감싸세요.", "contract HelloSolidity { }"],
    testDescription: "HelloSolidity 컨트랙트가 정상적으로 컴파일되는지 확인합니다.",
    expectedFunctions: [],
    expectedContractName: "HelloSolidity",
  },
  {
    id: "contract-rename",
    title: "컨트랙트 이름 바꾸기",
    category: "basics",
    order: 2,
    difficulty: "beginner",
    description: `# 컨트랙트 이름 바꾸기

컨트랙트 이름은 **대문자로 시작**하는 것이 규칙입니다.
단어가 여러 개면 각 단어의 첫 글자를 대문자로 씁니다.

예: \`MyToken\`, \`SimpleStorage\`, \`HelloWorld\`

## 할 일

아래 컨트랙트의 이름 \`MyContract\`를 \`MyStorage\`로 바꾸세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyStorage {
}`,
    hints: ["contract 뒤의 이름 부분만 수정하면 됩니다.", "MyContract → MyStorage"],
    testDescription: "컨트랙트 이름이 MyStorage인지 확인합니다.",
    expectedFunctions: [],
    expectedContractName: "MyStorage",
  },
  {
    id: "first-variable",
    title: "숫자 저장하기",
    category: "basics",
    order: 3,
    difficulty: "beginner",
    description: `# 숫자 저장하기

컨트랙트 안에 데이터를 저장할 수 있습니다. 이것을 **상태 변수**라고 합니다.

\`uint\`는 양의 정수(0, 1, 2, 3...)를 저장하는 타입입니다.

## 할 일

컨트랙트 안에 아래 코드를 입력하세요:

\`\`\`solidity
uint public myNumber = 42;
\`\`\`

> \`public\`을 붙이면 이 값을 외부에서 읽을 수 있습니다.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstVariable {
    // TODO: uint public myNumber를 선언하고 42로 초기화하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstVariable {
    uint public myNumber = 42;
}`,
    hints: ["uint public 변수명 = 값; 형태로 선언합니다.", "uint public myNumber = 42;"],
    testDescription: "myNumber()가 42를 반환하는지 확인합니다.",
    expectedFunctions: ["myNumber"],
    testCases: [
      { fn: "myNumber", expected: "42", message: "myNumber()가 42를 반환해야 합니다" },
    ],
  },
  {
    id: "string-variable",
    title: "문자열 저장하기",
    category: "basics",
    order: 4,
    difficulty: "beginner",
    description: `# 문자열 저장하기

숫자뿐만 아니라 텍스트도 저장할 수 있습니다.

\`string\`은 문자열을 저장하는 타입입니다. 값은 큰따옴표(\`""\`)로 감쌉니다.

## 할 일

컨트랙트 안에 아래 코드를 입력하세요:

\`\`\`solidity
string public greeting = "Hello Tokamak";
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringVariable {
    // TODO: string public greeting을 선언하고 "Hello Tokamak"으로 초기화하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringVariable {
    string public greeting = "Hello Tokamak";
}`,
    hints: ["string public 변수명 = \"값\"; 형태로 선언합니다.", "string public greeting = \"Hello Tokamak\";"],
    testDescription: "greeting()이 'Hello Tokamak'을 반환하는지 확인합니다.",
    expectedFunctions: ["greeting"],
    testCases: [
      { fn: "greeting", expected: "Hello Tokamak", message: "greeting()이 'Hello Tokamak'을 반환해야 합니다" },
    ],
  },
  {
    id: "state-variables",
    title: "두 개의 상태 변수",
    category: "basics",
    order: 5,
    difficulty: "beginner",
    description: `# 두 개의 상태 변수

이전 문제에서 \`uint\`와 \`string\`을 각각 선언해봤습니다.
이번에는 하나의 컨트랙트에 두 변수를 함께 선언해봅시다.

## 할 일

1. \`string public greeting\`을 \`"Hello Tokamak"\`으로 선언하세요
2. \`uint public version\`을 \`1\`로 선언하세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StateVariables {
    // TODO: string public greeting 을 선언하고 "Hello Tokamak"으로 초기화하세요
    // TODO: uint public version 을 선언하고 1로 초기화하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StateVariables {
    string public greeting = "Hello Tokamak";
    uint public version = 1;
}`,
    hints: ["이전 문제에서 배운 것과 같은 방식으로 두 줄을 작성하면 됩니다.", "string public greeting = \"Hello Tokamak\";\nuint public version = 1;"],
    testDescription: "greeting()이 'Hello Tokamak'을, version()이 1을 반환하는지 확인합니다.",
    expectedFunctions: ["greeting", "version"],
    testCases: [
      { fn: "greeting", expected: "Hello Tokamak", message: "greeting()이 'Hello Tokamak'을 반환해야 합니다" },
      { fn: "version", expected: "1", message: "version()이 1을 반환해야 합니다" },
    ],
  },
  {
    id: "type-error-fix",
    title: "타입 에러 수정하기",
    category: "basics",
    order: 6,
    difficulty: "beginner",
    description: `# 타입 에러 수정하기

아래 코드에는 **타입 오류**가 있습니다.

## 할 일

1. **먼저 그대로 컴파일 버튼을 눌러보세요** — 에러 메시지를 확인합니다
2. 에러를 확인했으면, 올바른 타입으로 수정하세요

> 힌트: \`uint\`는 숫자만 저장할 수 있습니다. 문자열 \`"Alice"\`는 저장할 수 없어요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeErrorFix {
    // 이 코드는 에러가 있습니다. 먼저 컴파일해보세요!
    uint public name = "Alice";
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeErrorFix {
    string public name = "Alice";
}`,
    hints: ["\"Alice\"는 문자열입니다. 문자열을 저장하는 타입은 무엇이었나요?", "uint를 string으로 바꾸세요."],
    testDescription: "name()이 'Alice'를 반환하는지 확인합니다.",
    expectedFunctions: ["name"],
    testCases: [
      { fn: "name", expected: "Alice", message: "name()이 'Alice'를 반환해야 합니다" },
    ],
  },
  {
    id: "constructor-basics",
    title: "생성자 (Constructor)",
    category: "basics",
    order: 7,
    difficulty: "beginner",
    description: `# 생성자 (Constructor)

\`constructor\`는 컨트랙트가 배포될 때 **딱 한 번만** 실행되는 특별한 함수입니다.
앱을 처음 설치할 때 초기 설정을 하는 것과 비슷합니다.

\`msg.sender\`는 이 컨트랙트를 배포한 사람의 주소입니다.

## 할 일

생성자 안에 아래 코드를 입력하세요:

\`\`\`solidity
owner = msg.sender;
\`\`\``,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstructorBasics {
    address public owner;

    constructor() {
        // TODO: owner를 msg.sender로 설정하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstructorBasics {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}`,
    hints: ["msg.sender는 컨트랙트를 배포한 사람의 주소입니다.", "owner = msg.sender;"],
    testDescription: "배포자의 주소가 owner에 저장되는지 확인합니다.",
    expectedFunctions: ["owner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner()가 배포자 주소를 반환해야 합니다" },
    ],
  },
  {
    id: "constant-keyword",
    title: "상수 (Constant)",
    category: "basics",
    order: 8,
    difficulty: "beginner",
    description: `# 상수 (Constant)

\`constant\`로 선언한 변수는 **값을 절대 바꿀 수 없습니다.**
변하지 않는 설정값에 사용하며, 이름은 보통 \`대문자\`로 씁니다.

## 할 일

아래 코드를 입력하세요:

\`\`\`solidity
uint256 public constant MAX_SUPPLY = 10000;
\`\`\`

> \`constant\`는 \`public\`과 변수명 사이에 위치합니다.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstantKeyword {
    // TODO: uint256 public constant MAX_SUPPLY를 10000으로 선언하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConstantKeyword {
    uint256 public constant MAX_SUPPLY = 10000;
}`,
    hints: ["uint256 public constant 변수명 = 값; 형태입니다.", "uint256 public constant MAX_SUPPLY = 10000;"],
    testDescription: "MAX_SUPPLY()가 10000을 반환하는지 확인합니다.",
    expectedFunctions: ["MAX_SUPPLY"],
    testCases: [
      { fn: "MAX_SUPPLY", expected: "10000", message: "MAX_SUPPLY()가 10000을 반환해야 합니다" },
    ],
  },
  {
    id: "immutable-keyword",
    title: "불변 변수 (Immutable)",
    category: "basics",
    order: 9,
    difficulty: "beginner",
    description: `# 불변 변수 (Immutable)

\`immutable\`은 \`constant\`와 비슷하지만, **생성자에서 한 번 값을 정할 수 있습니다.**

- \`constant\`: 코드에 값을 직접 적어야 함 (예: \`= 10000\`)
- \`immutable\`: 배포할 때 값을 정할 수 있음 (예: \`msg.sender\`)

## 할 일

1. \`DEPLOYER\`를 \`immutable\`로 선언하세요
2. 생성자에서 \`msg.sender\`를 할당하세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ImmutableKeyword {
    // TODO: address public immutable DEPLOYER를 선언하세요

    constructor() {
        // TODO: DEPLOYER에 msg.sender를 할당하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ImmutableKeyword {
    address public immutable DEPLOYER;

    constructor() {
        DEPLOYER = msg.sender;
    }
}`,
    hints: ["immutable은 public과 변수명 사이에 위치합니다: address public immutable DEPLOYER;", "생성자 안에서 DEPLOYER = msg.sender;"],
    testDescription: "DEPLOYER()가 배포자 주소를 반환하는지 확인합니다.",
    expectedFunctions: ["DEPLOYER"],
    testCases: [
      { fn: "DEPLOYER", expected: "DEPLOYER", message: "DEPLOYER()가 배포자 주소를 반환해야 합니다" },
    ],
  },
  {
    id: "multiple-state-vars",
    title: "종합: 여러 상태 변수",
    category: "basics",
    order: 10,
    difficulty: "beginner",
    description: `# 종합: 여러 상태 변수

지금까지 배운 것을 조합해봅시다.
하나의 컨트랙트에 \`string\`, \`uint256\`, \`bool\` 세 가지 타입의 변수를 선언합니다.

## 할 일

1. \`string public name\`을 \`"Tokamak"\`으로 선언하세요
2. \`uint256 public level\`을 \`1\`로 선언하세요
3. \`bool public isActive\`를 \`true\`로 선언하세요

> \`bool\`은 \`true\` 또는 \`false\` 두 가지 값만 가지는 타입입니다.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultipleStateVars {
    // TODO: string public name 을 "Tokamak"으로 선언하세요
    // TODO: uint256 public level 을 1로 선언하세요
    // TODO: bool public isActive 를 true로 선언하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultipleStateVars {
    string public name = "Tokamak";
    uint256 public level = 1;
    bool public isActive = true;
}`,
    hints: ["모두 같은 패턴입니다: 타입 public 변수명 = 값;", "bool public isActive = true;"],
    testDescription: "name, level, isActive가 올바른 값을 반환하는지 확인합니다.",
    expectedFunctions: ["name", "level", "isActive"],
    testCases: [
      { fn: "name", expected: "Tokamak", message: "name()이 'Tokamak'을 반환해야 합니다" },
      { fn: "level", expected: "1", message: "level()이 1을 반환해야 합니다" },
      { fn: "isActive", expected: "true", message: "isActive()가 true를 반환해야 합니다" },
    ],
  },
  {
    id: "uint256-basics",
    title: "uint256 기본",
    category: "integers",
    order: 1,
    difficulty: "beginner",
    description: `# uint256 기본

\`uint256\`은 Solidity의 기본 부호 없는 정수 타입입니다. 0부터 2^256-1까지 저장할 수 있습니다.

\`\`\`solidity
uint256 public amount = 500;
\`\`\`

## 과제
\`totalSupply\`(값: 1000000)와 \`price\`(값: 100) 두 개의 uint256 public 변수를 선언하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint256Basics {
    // TODO: uint256 public totalSupply를 1000000으로 선언하세요
    // TODO: uint256 public price를 100으로 선언하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint256Basics {
    uint256 public totalSupply = 1000000;
    uint256 public price = 100;
}`,
    hints: ["uint256 public 변수명 = 값; 형태로 선언합니다.", "Solidity에서 숫자에 콤마를 넣지 않습니다."],
    testDescription: "totalSupply()가 1000000을, price()가 100을 반환하는지 확인합니다.",
    expectedFunctions: ["totalSupply", "price"],
    testCases: [
      { fn: "totalSupply", expected: "1000000", message: "totalSupply()가 1000000을 반환해야 합니다" },
      { fn: "price", expected: "100", message: "price()가 100을 반환해야 합니다" },
    ],
  },
  {
    id: "uint8-range",
    title: "uint8 범위 (0~255)",
    category: "integers",
    order: 2,
    difficulty: "beginner",
    description: `# uint8 범위 (0~255)

\`uint8\`은 0~255까지 저장할 수 있는 작은 정수 타입입니다. 토큰의 decimals 같은 작은 값에 사용됩니다.

\`\`\`solidity
uint8 public myVal = 42;
\`\`\`

## 과제
\`decimals\`(uint8, 값: 18)를 선언하고, \`setDecimals\` 함수로 값을 변경할 수 있게 하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint8Range {
    // TODO: uint8 public decimals를 18로 선언하세요

    // TODO: setDecimals(uint8 _decimals) public 함수를 작성하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Uint8Range {
    uint8 public decimals = 18;

    function setDecimals(uint8 _decimals) public {
        decimals = _decimals;
    }
}`,
    hints: ["함수 선언: function setDecimals(uint8 _decimals) public { ... }", "함수 내부에서 decimals = _decimals;로 값을 변경합니다."],
    testDescription: "decimals()가 18을 반환하고 setDecimals로 값을 변경할 수 있는지 확인합니다.",
    expectedFunctions: ["decimals", "setDecimals"],
    testCases: [
      { fn: "decimals", expected: "18", message: "초기 decimals()가 18을 반환해야 합니다" },
      { fn: "decimals", expected: "42", message: "setDecimals(42) 후 decimals()가 42를 반환해야 합니다", setup: [{ fn: "setDecimals", args: ["42"] }] },
    ],
  },
  {
    id: "uint-sizes",
    title: "uint 크기별 타입",
    category: "integers",
    order: 3,
    difficulty: "beginner",
    description: `# uint 크기별 타입

Solidity는 uint8, uint16, uint32, uint64, uint128, uint256 등 다양한 크기를 제공합니다. 대부분의 경우 가스 비용은 동일합니다.

\`\`\`solidity
uint16 public small = 100;
uint128 public medium = 50000;
\`\`\`

## 과제
\`a\`(uint16), \`b\`(uint32), \`c\`(uint64), \`d\`(uint128), \`e\`(uint256)를 각각 public으로 선언하고 원하는 값을 넣으세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UintSizes {
    // TODO: uint16 public a 선언
    // TODO: uint32 public b 선언
    // TODO: uint64 public c 선언
    // TODO: uint128 public d 선언
    // TODO: uint256 public e 선언
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UintSizes {
    uint16 public a = 100;
    uint32 public b = 1000;
    uint64 public c = 10000;
    uint128 public d = 100000;
    uint256 public e = 1000000;
}`,
    hints: ["각 타입별로 public 변수를 선언하고 초기값을 지정하세요.", "예: uint16 public a = 100;"],
    testDescription: "a, b, c, d, e 5개의 getter 함수가 존재하는지 확인합니다.",
    expectedFunctions: ["a", "b", "c", "d", "e"],
    testCases: [
      { fn: "a", message: "a()가 정상적으로 반환되어야 합니다" },
      { fn: "b", message: "b()가 정상적으로 반환되어야 합니다" },
      { fn: "c", message: "c()가 정상적으로 반환되어야 합니다" },
      { fn: "d", message: "d()가 정상적으로 반환되어야 합니다" },
      { fn: "e", message: "e()가 정상적으로 반환되어야 합니다" },
    ],
  },
  {
    id: "int256-basics",
    title: "int256 부호 있는 정수",
    category: "integers",
    order: 4,
    difficulty: "beginner",
    description: `# int256 부호 있는 정수

\`int256\`은 음수와 양수 모두 저장할 수 있습니다. 범위: -2^255 ~ 2^255-1.

\`\`\`solidity
int256 public balance = -100;
\`\`\`

## 과제
\`temperature\`(값: -10)와 \`altitude\`(값: 500) 두 개의 int256 public 변수를 선언하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Int256Basics {
    // TODO: int256 public temperature를 -10으로 선언하세요
    // TODO: int256 public altitude를 500으로 선언하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Int256Basics {
    int256 public temperature = -10;
    int256 public altitude = 500;
}`,
    hints: ["int256은 음수 값을 직접 할당할 수 있습니다.", "int256 public temperature = -10;"],
    testDescription: "temperature()가 -10을, altitude()가 500을 반환하는지 확인합니다.",
    expectedFunctions: ["temperature", "altitude"],
    testCases: [
      { fn: "temperature", expected: "-10", message: "temperature()가 -10을 반환해야 합니다" },
      { fn: "altitude", expected: "500", message: "altitude()가 500을 반환해야 합니다" },
    ],
  },
  {
    id: "int-negative",
    title: "음수 다루기",
    category: "integers",
    order: 5,
    difficulty: "beginner",
    description: `# 음수 다루기

음수 부호 연산자 \`-\`로 부호를 반전할 수 있고, 삼항 연산자로 절댓값을 구할 수 있습니다.

\`\`\`solidity
int256 y = -x;
int256 absVal = x >= 0 ? x : -x;
\`\`\`

## 과제
\`negate\` 함수(부호 반전)와 \`abs\` 함수(절댓값)를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntNegative {
    function negate(int256 x) public pure returns (int256) {
        // TODO: x의 부호를 반전하여 반환하세요
    }

    function abs(int256 x) public pure returns (int256) {
        // TODO: x의 절댓값을 삼항 연산자로 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntNegative {
    function negate(int256 x) public pure returns (int256) {
        return -x;
    }

    function abs(int256 x) public pure returns (int256) {
        return x >= 0 ? x : -x;
    }
}`,
    hints: ["부호 반전은 return -x;입니다.", "삼항 연산자: 조건 ? 참일때값 : 거짓일때값"],
    testDescription: "negate(5)가 -5를, abs(-3)이 3을 반환하는지 확인합니다.",
    expectedFunctions: ["negate", "abs"],
    testCases: [
      { fn: "negate", args: ["5"], expected: "-5", message: "negate(5)가 -5를 반환해야 합니다" },
      { fn: "negate", args: ["-3"], expected: "3", message: "negate(-3)이 3을 반환해야 합니다" },
      { fn: "abs", args: ["-3"], expected: "3", message: "abs(-3)이 3을 반환해야 합니다" },
      { fn: "abs", args: ["7"], expected: "7", message: "abs(7)이 7을 반환해야 합니다" },
    ],
  },
  {
    id: "type-min-max",
    title: "타입의 최솟값과 최댓값",
    category: "integers",
    order: 6,
    difficulty: "beginner",
    description: `# 타입의 최솟값과 최댓값

\`type(T).min\`과 \`type(T).max\`로 각 정수 타입의 범위를 조회할 수 있습니다.

\`\`\`solidity
uint8 maxVal = type(uint8).max; // 255
int8 minVal = type(int8).min;   // -128
\`\`\`

## 과제
\`getMaxUint8\`, \`getMinInt8\`, \`getMaxUint256\` 함수를 각각 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeMinMax {
    function getMaxUint8() public pure returns (uint8) {
        // TODO: type(uint8).max를 반환하세요
    }

    function getMinInt8() public pure returns (int8) {
        // TODO: type(int8).min을 반환하세요
    }

    function getMaxUint256() public pure returns (uint256) {
        // TODO: type(uint256).max를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeMinMax {
    function getMaxUint8() public pure returns (uint8) {
        return type(uint8).max;
    }

    function getMinInt8() public pure returns (int8) {
        return type(int8).min;
    }

    function getMaxUint256() public pure returns (uint256) {
        return type(uint256).max;
    }
}`,
    hints: ["type(uint8).max는 255를 반환합니다.", "return type(타입).max; 또는 return type(타입).min;"],
    testDescription: "getMaxUint8()이 255를, getMinInt8()이 -128을 반환하는지 확인합니다.",
    expectedFunctions: ["getMaxUint8", "getMinInt8", "getMaxUint256"],
    testCases: [
      { fn: "getMaxUint8", expected: "255", message: "getMaxUint8()이 255를 반환해야 합니다" },
      { fn: "getMinInt8", expected: "-128", message: "getMinInt8()이 -128을 반환해야 합니다" },
      { fn: "getMaxUint256", expected: "115792089237316195423570985008687907853269984665640564039457584007913129639935", message: "getMaxUint256()이 2^256-1을 반환해야 합니다" },
    ],
  },
  {
    id: "overflow-protection",
    title: "오버플로우 보호",
    category: "integers",
    order: 7,
    difficulty: "beginner",
    description: `# 오버플로우 보호

Solidity 0.8+에서는 정수 오버플로우 시 자동으로 트랜잭션이 revert됩니다. 예를 들어 uint8(255) + 1은 에러가 발생합니다.

\`\`\`solidity
function safeAdd(uint8 a, uint8 b) public pure returns (uint8) {
    return a + b; // 오버플로우 시 자동 revert
}
\`\`\`

## 과제
\`add\` 함수의 본문을 작성하세요. 단순히 a + b를 반환하면 됩니다.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OverflowProtection {
    function add(uint8 a, uint8 b) public pure returns (uint8) {
        // TODO: a + b를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OverflowProtection {
    function add(uint8 a, uint8 b) public pure returns (uint8) {
        return a + b;
    }
}`,
    hints: ["return a + b; 만 작성하면 됩니다.", "0.8 이상에서는 오버플로우 검사가 자동으로 수행됩니다."],
    testDescription: "add(1, 2)가 3을 반환하고, add(255, 1)이 revert되는지 확인합니다.",
    expectedFunctions: ["add"],
    testCases: [
      { fn: "add", args: ["1", "2"], expected: "3", message: "add(1, 2)가 3을 반환해야 합니다" },
      { fn: "add", args: ["100", "50"], expected: "150", message: "add(100, 50)이 150을 반환해야 합니다" },
      { fn: "add", args: ["255", "1"], expectRevert: true, message: "add(255, 1)이 오버플로우로 revert되어야 합니다" },
    ],
  },
  {
    id: "unchecked-block",
    title: "unchecked 블록",
    category: "integers",
    order: 8,
    difficulty: "beginner",
    description: `# unchecked 블록

\`unchecked { }\` 블록 안에서는 오버플로우 검사를 건너뛰어 가스를 절약합니다. 오버플로우가 발생하지 않는 것이 확실할 때만 사용하세요.

\`\`\`solidity
unchecked { counter++; }
\`\`\`

## 과제
\`increment\` 함수에서 \`counter\`를 \`unchecked\` 블록으로 1 증가시키세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UncheckedBlock {
    uint256 public counter;

    function increment() public {
        // TODO: unchecked 블록 안에서 counter를 1 증가시키세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UncheckedBlock {
    uint256 public counter;

    function increment() public {
        unchecked {
            counter++;
        }
    }
}`,
    hints: ["unchecked { counter++; } 형태로 작성합니다.", "unchecked 블록은 중괄호로 감싸야 합니다."],
    testDescription: "increment() 호출 후 counter가 1 증가하는지 확인합니다.",
    expectedFunctions: ["counter", "increment"],
    testCases: [
      { fn: "counter", expected: "0", message: "초기 counter()가 0이어야 합니다" },
      { fn: "counter", expected: "1", message: "increment() 후 counter()가 1이어야 합니다", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "bool-type",
    title: "bool 타입",
    category: "basic-types",
    order: 1,
    difficulty: "beginner",
    description: `# bool 타입

\`bool\`은 \`true\` 또는 \`false\` 값을 저장합니다. 조건 분기, 상태 플래그 등에 사용됩니다.

\`\`\`solidity
bool public isOpen = true;
bool public isClosed = false;
isOpen = !isOpen; // true → false
\`\`\`

## 과제
\`isActive\`를 \`true\`로, \`isPaused\`를 \`false\`로 선언하고, \`toggle()\` 함수에서 \`isActive\`를 반전시키세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    // TODO: bool public isActive를 true로 선언하세요
    // TODO: bool public isPaused를 false로 선언하세요

    function toggle() public {
        // TODO: isActive를 반전시키세요 (!연산자 사용)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BoolType {
    bool public isActive = true;
    bool public isPaused = false;

    function toggle() public {
        isActive = !isActive;
    }
}`,
    hints: ["bool 변수는 true 또는 false로 초기화합니다", "! 연산자는 bool 값을 반전시킵니다: !true → false"],
    testDescription: "isActive가 true, isPaused가 false로 초기화되고, toggle() 호출 시 isActive가 반전되는지 테스트합니다.",
    expectedFunctions: ["isActive", "isPaused", "toggle"],
    testCases: [
      { fn: "isActive", expected: "true", message: "초기 isActive()가 true여야 합니다" },
      { fn: "isPaused", expected: "false", message: "초기 isPaused()가 false여야 합니다" },
      { fn: "isActive", expected: "false", message: "toggle() 후 isActive()가 false여야 합니다", setup: [{ fn: "toggle" }] },
    ],
  },
  {
    id: "address-type",
    title: "address 타입",
    category: "basic-types",
    order: 2,
    difficulty: "beginner",
    description: `# address 타입

\`address\`는 20바이트 이더리움 주소를 저장합니다. \`msg.sender\`는 함수를 호출한 주소입니다.

\`\`\`solidity
address public owner;
constructor() {
    owner = msg.sender;
}
\`\`\`

## 과제
생성자에서 \`owner\`를 \`msg.sender\`로 설정하고, \`getOwner()\` view 함수를 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    address public owner;

    constructor() {
        // TODO: owner를 msg.sender로 설정하세요
    }

    // TODO: getOwner() public view 함수를 작성하세요 (owner를 반환)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressType {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}`,
    hints: ["생성자에서 owner = msg.sender;로 배포자 주소를 저장합니다", "view 함수는 상태를 읽기만 하고 변경하지 않습니다"],
    testDescription: "owner가 배포자 주소로 설정되고, getOwner()가 동일한 주소를 반환하는지 테스트합니다.",
    expectedFunctions: ["owner", "getOwner"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner()가 배포자 주소를 반환해야 합니다" },
      { fn: "getOwner", expected: "DEPLOYER", message: "getOwner()가 배포자 주소를 반환해야 합니다" },
    ],
  },
  {
    id: "address-payable",
    title: "address payable",
    category: "basic-types",
    order: 3,
    difficulty: "beginner",
    description: `# address payable

\`address payable\`은 ETH를 받을 수 있는 주소입니다. \`.transfer()\`와 \`.send()\`를 사용할 수 있습니다.

\`\`\`solidity
address payable public wallet = payable(msg.sender);
uint256 bal = address(this).balance;
\`\`\`

## 과제
생성자에서 \`recipient\`을 \`payable(msg.sender)\`로 설정하고, 컨트랙트 잔액을 반환하는 \`getBalance()\` 함수를 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayable {
    address payable public recipient;

    constructor() {
        // TODO: recipient을 payable(msg.sender)로 설정하세요
    }

    // TODO: getBalance() public view 함수를 작성하세요 (address(this).balance 반환)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayable {
    address payable public recipient;

    constructor() {
        recipient = payable(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}`,
    hints: ["payable()로 일반 address를 address payable로 변환합니다", "address(this).balance는 현재 컨트랙트의 ETH 잔액입니다"],
    testDescription: "recipient이 배포자의 payable 주소로 설정되고, getBalance()가 컨트랙트 잔액을 반환하는지 테스트합니다.",
    expectedFunctions: ["recipient", "getBalance"],
    testCases: [
      { fn: "recipient", expected: "DEPLOYER", message: "recipient()이 배포자 주소를 반환해야 합니다" },
      { fn: "getBalance", expected: "0", message: "초기 getBalance()가 0이어야 합니다" },
    ],
  },
  {
    id: "bytes1-type",
    title: "bytes1 고정 바이트",
    category: "basic-types",
    order: 4,
    difficulty: "beginner",
    description: `# bytes1 고정 바이트

\`bytes1\`은 정확히 1바이트(0x00~0xff)를 저장합니다. \`bytes2\`, \`bytes3\` ... \`bytes32\`까지 있습니다.

\`\`\`solidity
bytes1 public a = 0x41; // ASCII 'A'
bytes2 public b = 0xffff;
\`\`\`

## 과제
\`initial\`을 \`0x41\`로, \`flag\`를 \`0xffff\`로 선언하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes1Type {
    // TODO: bytes1 public initial을 0x41로 선언하세요
    // TODO: bytes2 public flag를 0xffff로 선언하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes1Type {
    bytes1 public initial = 0x41;
    bytes2 public flag = 0xffff;
}`,
    hints: ["bytes1은 1바이트, bytes2는 2바이트를 저장합니다", "0x41은 ASCII 문자 'A'에 해당합니다"],
    testDescription: "initial이 0x41, flag가 0xffff로 올바르게 초기화되는지 테스트합니다.",
    expectedFunctions: ["initial", "flag"],
    testCases: [
      { fn: "initial", expected: "0x41", message: "initial()이 0x41을 반환해야 합니다" },
      { fn: "flag", expected: "0xffff", message: "flag()가 0xffff를 반환해야 합니다" },
    ],
  },
  {
    id: "bytes32-type",
    title: "bytes32 고정 바이트",
    category: "basic-types",
    order: 5,
    difficulty: "beginner",
    description: `# bytes32 고정 바이트

\`bytes32\`는 해시값이나 식별자 저장에 주로 사용됩니다. 32바이트(256비트)를 저장합니다.

\`\`\`solidity
bytes32 public myHash;
myHash = keccak256("hello");
\`\`\`

## 과제
\`bytes32 public hash\`를 선언하고, \`setHash(bytes32 _hash)\` 함수를 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes32Type {
    // TODO: bytes32 public hash를 선언하세요

    // TODO: setHash(bytes32 _hash) public 함수를 작성하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bytes32Type {
    bytes32 public hash;

    function setHash(bytes32 _hash) public {
        hash = _hash;
    }
}`,
    hints: ["bytes32는 초기값 없이 선언하면 0x0...0으로 초기화됩니다", "함수 매개변수로 bytes32 _hash를 받아 상태 변수에 저장합니다"],
    testDescription: "hash가 선언되고, setHash()로 값을 설정할 수 있는지 테스트합니다.",
    expectedFunctions: ["hash", "setHash"],
    testCases: [
      { fn: "hash", expected: "0x0000000000000000000000000000000000000000000000000000000000000000", message: "초기 hash()가 0x0...0이어야 합니다" },
      { fn: "hash", expected: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", message: "setHash() 후 hash()가 설정한 값을 반환해야 합니다", setup: [{ fn: "setHash", args: ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"] }] },
    ],
  },
  {
    id: "bytes-dynamic",
    title: "bytes 동적 바이트",
    category: "basic-types",
    order: 6,
    difficulty: "beginner",
    description: `# bytes 동적 바이트

\`bytes\`는 가변 길이 바이트 배열입니다. \`byte[]\`보다 가스 효율적입니다.

\`\`\`solidity
bytes public data;
data = hex"cafebabe";
uint256 len = data.length;
\`\`\`

## 과제
\`data\` 변수, \`setData()\` 함수, 그리고 \`data.length\`를 반환하는 \`getLength()\` 함수를 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BytesDynamic {
    // TODO: bytes public data를 선언하세요

    // TODO: setData(bytes calldata _data) public 함수를 작성하세요

    // TODO: getLength() public view 함수를 작성하세요 (data.length 반환)
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BytesDynamic {
    bytes public data;

    function setData(bytes calldata _data) public {
        data = _data;
    }

    function getLength() public view returns (uint256) {
        return data.length;
    }
}`,
    hints: ["calldata는 외부 함수 매개변수에 사용하는 읽기 전용 데이터 위치입니다", "data.length로 바이트 배열의 길이를 구합니다"],
    testDescription: "data 설정 후 getLength()가 올바른 길이를 반환하는지 테스트합니다.",
    expectedFunctions: ["data", "setData", "getLength"],
    testCases: [
      { fn: "getLength", expected: "0", message: "초기 getLength()가 0이어야 합니다" },
      { fn: "getLength", expected: "4", message: "setData() 후 getLength()가 올바른 길이를 반환해야 합니다", setup: [{ fn: "setData", args: ["0xcafebabe"] }] },
    ],
  },
  {
    id: "string-type",
    title: "string 타입",
    category: "basic-types",
    order: 7,
    difficulty: "beginner",
    description: `# string 타입

\`string\`은 UTF-8 인코딩 텍스트입니다. 다른 언어와 달리 인덱싱이나 \`.length\`를 직접 사용할 수 없습니다.

\`\`\`solidity
string public name = "Solidity";
name = "New Value";
\`\`\`

## 과제
\`message\`를 \`"Hello"\`로 초기화하고, \`setMessage()\` 함수를 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringType {
    // TODO: string public message를 "Hello"로 선언하세요

    // TODO: setMessage(string calldata _msg) public 함수를 작성하세요
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringType {
    string public message = "Hello";

    function setMessage(string calldata _msg) public {
        message = _msg;
    }
}`,
    hints: ["string은 큰따옴표로 감싸서 초기화합니다", "calldata는 외부에서 전달된 데이터를 읽기 전용으로 참조합니다"],
    testDescription: "message가 'Hello'로 초기화되고, setMessage()로 변경 가능한지 테스트합니다.",
    expectedFunctions: ["message", "setMessage"],
    testCases: [
      { fn: "message", expected: "Hello", message: "초기 message()가 'Hello'여야 합니다" },
      { fn: "message", expected: "World", message: "setMessage('World') 후 message()가 'World'여야 합니다", setup: [{ fn: "setMessage", args: ["World"] }] },
    ],
  },
  {
    id: "enum-type",
    title: "열거형 (Enum)",
    category: "basic-types",
    order: 8,
    difficulty: "beginner",
    description: `# 열거형 (Enum)

\`enum\`은 고정된 선택지를 가진 커스텀 타입입니다. 내부적으로 \`uint\`로 저장됩니다.

\`\`\`solidity
enum Color { Red, Green, Blue }
Color public selected = Color.Red;
selected = Color.Blue;
\`\`\`

## 과제
enum 값들을 채우고, \`ship()\`과 \`deliver()\` 함수 본문을 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    // TODO: None, Pending, Shipped, Delivered, Cancelled 값을 채우세요
    enum OrderStatus { }

    OrderStatus public status;

    function ship() public {
        // TODO: status를 OrderStatus.Shipped로 설정하세요
    }

    function deliver() public {
        // TODO: status를 OrderStatus.Delivered로 설정하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EnumType {
    enum OrderStatus { None, Pending, Shipped, Delivered, Cancelled }

    OrderStatus public status;

    function ship() public {
        status = OrderStatus.Shipped;
    }

    function deliver() public {
        status = OrderStatus.Delivered;
    }
}`,
    hints: ["enum 값은 쉼표로 구분하여 나열합니다", "EnumName.Value 형태로 enum 값을 참조합니다"],
    testDescription: "enum이 올바르게 정의되고, ship()과 deliver()가 status를 변경하는지 테스트합니다.",
    expectedFunctions: ["status", "ship", "deliver"],
    testCases: [
      { fn: "status", expected: "0", message: "초기 status()가 0 (None)이어야 합니다" },
      { fn: "status", expected: "2", message: "ship() 후 status()가 2 (Shipped)여야 합니다", setup: [{ fn: "ship" }] },
      { fn: "status", expected: "3", message: "deliver() 후 status()가 3 (Delivered)여야 합니다", setup: [{ fn: "deliver" }] },
    ],
  },
  {
    id: "addition-op",
    title: "덧셈 (+)",
    category: "arithmetic",
    order: 1,
    difficulty: "beginner",
    description: `# 덧셈 (+)

\`+\` 연산자로 두 수를 더합니다. Solidity 0.8+에서는 오버플로우 시 자동으로 revert됩니다.

\`\`\`solidity
uint256 result = 10 + 20; // 30
\`\`\`

## 과제
\`add()\` 함수에서 두 수의 합을 반환하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Addition {
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: a + b를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Addition {
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}`,
    hints: ["return 키워드로 값을 반환합니다", "a + b는 두 uint256 값의 합을 계산합니다"],
    testDescription: "add(2, 3)이 5를 반환하는지 테스트합니다.",
    expectedFunctions: ["add"],
    testCases: [
      { fn: "add", args: ["2", "3"], expected: "5", message: "add(2, 3)이 5를 반환해야 합니다" },
      { fn: "add", args: ["0", "0"], expected: "0", message: "add(0, 0)이 0을 반환해야 합니다" },
    ],
  },
  {
    id: "subtraction-op",
    title: "뺄셈 (-)",
    category: "arithmetic",
    order: 2,
    difficulty: "beginner",
    description: `# 뺄셈 (-)

\`-\` 연산자로 빼기를 합니다. 0.8+에서 uint 언더플로우(예: 3 - 5) 시 자동으로 revert됩니다.

\`\`\`solidity
uint256 result = 10 - 3; // 7
// uint256 fail = 3 - 5; // revert!
\`\`\`

## 과제
\`subtract()\` 함수에서 \`a - b\`를 반환하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Subtraction {
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: a - b를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Subtraction {
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        return a - b;
    }
}`,
    hints: ["a - b에서 a가 b보다 작으면 트랜잭션이 revert됩니다", "uint256은 음수를 표현할 수 없으므로 뺄셈 순서에 주의하세요"],
    testDescription: "subtract(10, 3)이 7을 반환하는지 테스트합니다.",
    expectedFunctions: ["subtract"],
    testCases: [
      { fn: "subtract", args: ["10", "3"], expected: "7", message: "subtract(10, 3)이 7을 반환해야 합니다" },
      { fn: "subtract", args: ["100", "100"], expected: "0", message: "subtract(100, 100)이 0을 반환해야 합니다" },
    ],
  },
  {
    id: "multiplication-op",
    title: "곱셈 (*)",
    category: "arithmetic",
    order: 3,
    difficulty: "beginner",
    description: `# 곱셈 (*)

\`*\` 연산자로 곱셈을 합니다. 큰 수를 곱할 때 오버플로우에 주의하세요.

\`\`\`solidity
uint256 result = 7 * 8; // 56
\`\`\`

## 과제
\`multiply()\` 함수에서 \`a * b\`를 반환하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Multiplication {
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: a * b를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Multiplication {
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        return a * b;
    }
}`,
    hints: ["return a * b;로 곱셈 결과를 반환합니다", "uint256 최대값을 초과하면 오버플로우로 revert됩니다"],
    testDescription: "multiply(7, 8)이 56을 반환하는지 테스트합니다.",
    expectedFunctions: ["multiply"],
    testCases: [
      { fn: "multiply", args: ["7", "8"], expected: "56", message: "multiply(7, 8)이 56을 반환해야 합니다" },
      { fn: "multiply", args: ["0", "999"], expected: "0", message: "multiply(0, 999)가 0을 반환해야 합니다" },
    ],
  },
  {
    id: "division-op",
    title: "나눗셈 (/)",
    category: "arithmetic",
    order: 4,
    difficulty: "beginner",
    description: `# 나눗셈 (/)

\`/\` 연산자로 나눗셈을 합니다. 0으로 나누면 revert됩니다. 결과는 반올림 없이 버림됩니다.

\`\`\`solidity
uint256 result = 10 / 3; // 3 (not 3.33)
\`\`\`

## 과제
\`divide()\` 함수에서 \`a / b\`를 반환하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Division {
    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: a / b를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Division {
    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        return a / b;
    }
}`,
    hints: ["나눗셈 결과는 소수점 이하가 버려집니다 (truncation)", "b가 0이면 자동으로 revert됩니다"],
    testDescription: "divide(10, 3)이 3을 반환하는지 테스트합니다.",
    expectedFunctions: ["divide"],
    testCases: [
      { fn: "divide", args: ["10", "3"], expected: "3", message: "divide(10, 3)이 3을 반환해야 합니다 (버림)" },
      { fn: "divide", args: ["100", "10"], expected: "10", message: "divide(100, 10)이 10을 반환해야 합니다" },
    ],
  },
  {
    id: "modulo-op",
    title: "나머지 연산 (%)",
    category: "arithmetic",
    order: 5,
    difficulty: "beginner",
    description: `# 나머지 연산 (%)

\`%\` 연산자는 나머지를 반환합니다. 짝수/홀수 판별에 유용합니다: \`x % 2 == 0\`이면 짝수.

\`\`\`solidity
uint256 r = 10 % 3; // 1
bool even = (4 % 2 == 0); // true
\`\`\`

## 과제
\`mod()\` 함수와 짝수 판별 \`isEven()\` 함수를 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Modulo {
    function mod(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: a % b를 반환하세요
    }

    function isEven(uint256 x) public pure returns (bool) {
        // TODO: x가 짝수인지 반환하세요 (x % 2 == 0)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Modulo {
    function mod(uint256 a, uint256 b) public pure returns (uint256) {
        return a % b;
    }

    function isEven(uint256 x) public pure returns (bool) {
        return x % 2 == 0;
    }
}`,
    hints: ["% 연산자는 나눗셈의 나머지를 반환합니다", "짝수는 2로 나눈 나머지가 0인 수입니다"],
    testDescription: "mod(10, 3)이 1을, isEven(4)가 true를 반환하는지 테스트합니다.",
    expectedFunctions: ["mod", "isEven"],
    testCases: [
      { fn: "mod", args: ["10", "3"], expected: "1", message: "mod(10, 3)이 1을 반환해야 합니다" },
      { fn: "isEven", args: ["4"], expected: "true", message: "isEven(4)가 true를 반환해야 합니다" },
      { fn: "isEven", args: ["7"], expected: "false", message: "isEven(7)이 false를 반환해야 합니다" },
    ],
  },
  {
    id: "exponent-op",
    title: "거듭제곱 (**)",
    category: "arithmetic",
    order: 6,
    difficulty: "beginner",
    description: `# 거듭제곱 (**)

\`**\` 연산자로 거듭제곱을 계산합니다. 토큰 단위에서 \`10 ** 18\`을 자주 사용합니다.

\`\`\`solidity
uint256 result = 2 ** 10; // 1024
uint256 unit = 10 ** 18;  // 1 ether
\`\`\`

## 과제
\`power()\` 함수와 \`10 ** 18\`을 반환하는 \`tokenUnit()\` 함수를 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Exponent {
    function power(uint256 base, uint256 exp) public pure returns (uint256) {
        // TODO: base ** exp를 반환하세요
    }

    function tokenUnit() public pure returns (uint256) {
        // TODO: 10 ** 18을 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Exponent {
    function power(uint256 base, uint256 exp) public pure returns (uint256) {
        return base ** exp;
    }

    function tokenUnit() public pure returns (uint256) {
        return 10 ** 18;
    }
}`,
    hints: ["** 연산자는 왼쪽 값을 오른쪽 값만큼 거듭제곱합니다", "10 ** 18은 ERC-20 토큰의 기본 단위(1 토큰)입니다"],
    testDescription: "power(2, 10)이 1024를, tokenUnit()이 10^18을 반환하는지 테스트합니다.",
    expectedFunctions: ["power", "tokenUnit"],
    testCases: [
      { fn: "power", args: ["2", "10"], expected: "1024", message: "power(2, 10)이 1024를 반환해야 합니다" },
      { fn: "power", args: ["3", "3"], expected: "27", message: "power(3, 3)이 27을 반환해야 합니다" },
      { fn: "tokenUnit", expected: "1000000000000000000", message: "tokenUnit()이 10^18을 반환해야 합니다" },
    ],
  },
  {
    id: "compound-assign",
    title: "복합 대입 연산자",
    category: "arithmetic",
    order: 7,
    difficulty: "beginner",
    description: `# 복합 대입 연산자

\`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\`는 연산과 대입을 동시에 수행하는 축약 연산자입니다.

\`\`\`solidity
uint256 x = 10;
x += 5;  // x = x + 5 → 15
x -= 3;  // x = x - 3 → 12
x *= 2;  // x = x * 2 → 24
\`\`\`

## 과제
각 함수에서 복합 대입 연산자를 사용하여 \`value\`를 변경하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CompoundAssign {
    uint256 public value = 100;

    function addTo(uint256 x) public {
        // TODO: value에 x를 더하세요 (+=)
    }

    function subFrom(uint256 x) public {
        // TODO: value에서 x를 빼세요 (-=)
    }

    function mulBy(uint256 x) public {
        // TODO: value에 x를 곱하세요 (*=)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CompoundAssign {
    uint256 public value = 100;

    function addTo(uint256 x) public {
        value += x;
    }

    function subFrom(uint256 x) public {
        value -= x;
    }

    function mulBy(uint256 x) public {
        value *= x;
    }
}`,
    hints: ["value += x;는 value = value + x;와 동일합니다", "-=, *=도 같은 패턴입니다: value -= x; value *= x;"],
    testDescription: "addTo, subFrom, mulBy가 복합 대입 연산자로 value를 올바르게 변경하는지 테스트합니다.",
    expectedFunctions: ["value", "addTo", "subFrom", "mulBy"],
    testCases: [
      { fn: "value", expected: "100", message: "초기 value()가 100이어야 합니다" },
      { fn: "value", expected: "150", message: "addTo(50) 후 value()가 150이어야 합니다", setup: [{ fn: "addTo", args: ["50"] }] },
      { fn: "value", expected: "80", message: "subFrom(20) 후 value()가 80이어야 합니다", setup: [{ fn: "subFrom", args: ["20"] }] },
      { fn: "value", expected: "300", message: "mulBy(3) 후 value()가 300이어야 합니다", setup: [{ fn: "mulBy", args: ["3"] }] },
    ],
  },
  {
    id: "integer-division",
    title: "정수 나눗셈 주의점",
    category: "arithmetic",
    order: 8,
    difficulty: "beginner",
    description: `# 정수 나눗셈 주의점

Solidity에는 소수점이 없습니다. \`5/2 = 2\`이고, 연산 순서가 정밀도에 영향을 줍니다.

\`\`\`solidity
(a / b) * c  // 정밀도 손실 큼
(a * c) / b  // 곱셈을 먼저 하면 정밀도 향상
\`\`\`

## 과제
\`divideAndLose()\`로 버림 나눗셈을, \`betterPrecision()\`으로 곱셈 우선 방식을 구현하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerDivision {
    function divideAndLose(uint256 a, uint256 b) public pure returns (uint256) {
        // TODO: a / b를 반환하세요 (정밀도 손실 발생)
    }

    function betterPrecision(uint256 a, uint256 b, uint256 c) public pure returns (uint256) {
        // TODO: (a * c) / b를 반환하세요 (곱셈 먼저 → 정밀도 향상)
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegerDivision {
    function divideAndLose(uint256 a, uint256 b) public pure returns (uint256) {
        return a / b;
    }

    function betterPrecision(uint256 a, uint256 b, uint256 c) public pure returns (uint256) {
        return (a * c) / b;
    }
}`,
    hints: ["정수 나눗셈은 소수점 이하를 버립니다: 5 / 2 = 2", "곱셈을 먼저 수행하면 중간 값이 커져서 정밀도 손실이 줄어듭니다"],
    testDescription: "divideAndLose(5, 2)가 2를, betterPrecision(5, 2, 100)이 250을 반환하는지 테스트합니다.",
    expectedFunctions: ["divideAndLose", "betterPrecision"],
    testCases: [
      { fn: "divideAndLose", args: ["5", "2"], expected: "2", message: "divideAndLose(5, 2)가 2를 반환해야 합니다" },
      { fn: "betterPrecision", args: ["5", "2", "100"], expected: "250", message: "betterPrecision(5, 2, 100)이 250을 반환해야 합니다" },
    ],
  },
  {
    id: "comparison-ops",
    title: "비교 연산자",
    category: "comparison",
    order: 1,
    difficulty: "beginner",
    description: `# 비교 연산자

Solidity에서 두 값을 비교할 때 \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\` 연산자를 사용합니다. 결과는 항상 \`bool\` 타입입니다.

\`\`\`solidity
uint a = 10;
bool result = (a == 10); // true
bool bigger = (a > 5);   // true
\`\`\`

## 과제
세 함수의 본문을 비교 연산자를 사용하여 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ComparisonOps {
    function isEqual(uint a, uint b) public pure returns (bool) {
        // TODO: a와 b가 같으면 true를 반환하세요
    }

    function isGreater(uint a, uint b) public pure returns (bool) {
        // TODO: a가 b보다 크면 true를 반환하세요
    }

    function isLessOrEqual(uint a, uint b) public pure returns (bool) {
        // TODO: a가 b 이하이면 true를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ComparisonOps {
    function isEqual(uint a, uint b) public pure returns (bool) {
        return a == b;
    }

    function isGreater(uint a, uint b) public pure returns (bool) {
        return a > b;
    }

    function isLessOrEqual(uint a, uint b) public pure returns (bool) {
        return a <= b;
    }
}`,
    hints: ["비교 연산자는 두 값을 비교하고 bool을 반환합니다.", "==는 같음, >는 초과, <=는 이하를 의미합니다."],
    testDescription: "isEqual, isGreater, isLessOrEqual 함수가 올바른 bool 값을 반환하는지 확인합니다.",
    expectedFunctions: ["isEqual", "isGreater", "isLessOrEqual"],
    testCases: [
      { fn: "isEqual", args: ["10", "10"], expected: "true", message: "isEqual(10, 10)이 true를 반환해야 합니다" },
      { fn: "isEqual", args: ["10", "20"], expected: "false", message: "isEqual(10, 20)이 false를 반환해야 합니다" },
      { fn: "isGreater", args: ["10", "5"], expected: "true", message: "isGreater(10, 5)가 true를 반환해야 합니다" },
      { fn: "isGreater", args: ["5", "10"], expected: "false", message: "isGreater(5, 10)이 false를 반환해야 합니다" },
      { fn: "isLessOrEqual", args: ["5", "10"], expected: "true", message: "isLessOrEqual(5, 10)이 true를 반환해야 합니다" },
      { fn: "isLessOrEqual", args: ["10", "10"], expected: "true", message: "isLessOrEqual(10, 10)이 true를 반환해야 합니다" },
    ],
  },
  {
    id: "logical-ops",
    title: "논리 연산자",
    category: "comparison",
    order: 2,
    difficulty: "beginner",
    description: `# 논리 연산자

\`&&\`(AND), \`||\`(OR), \`!\`(NOT)로 bool 값을 조합할 수 있습니다.

\`\`\`solidity
bool result = true && false; // false
bool either = true || false; // true
bool negated = !true;        // false
\`\`\`

## 과제
세 함수의 본문을 논리 연산자를 사용하여 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogicalOps {
    function bothTrue(bool a, bool b) public pure returns (bool) {
        // TODO: a와 b 모두 true일 때 true를 반환하세요
    }

    function eitherTrue(bool a, bool b) public pure returns (bool) {
        // TODO: a 또는 b 중 하나라도 true이면 true를 반환하세요
    }

    function notValue(bool a) public pure returns (bool) {
        // TODO: a의 반대 값을 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogicalOps {
    function bothTrue(bool a, bool b) public pure returns (bool) {
        return a && b;
    }

    function eitherTrue(bool a, bool b) public pure returns (bool) {
        return a || b;
    }

    function notValue(bool a) public pure returns (bool) {
        return !a;
    }
}`,
    hints: ["&&는 둘 다 true일 때만 true입니다.", "||는 하나라도 true이면 true, !는 값을 반전시킵니다."],
    testDescription: "bothTrue, eitherTrue, notValue 함수가 논리 연산 결과를 올바르게 반환하는지 확인합니다.",
    expectedFunctions: ["bothTrue", "eitherTrue", "notValue"],
    testCases: [
      { fn: "bothTrue", args: ["true", "true"], expected: "true", message: "bothTrue(true, true)가 true를 반환해야 합니다" },
      { fn: "bothTrue", args: ["true", "false"], expected: "false", message: "bothTrue(true, false)가 false를 반환해야 합니다" },
      { fn: "eitherTrue", args: ["false", "true"], expected: "true", message: "eitherTrue(false, true)가 true를 반환해야 합니다" },
      { fn: "eitherTrue", args: ["false", "false"], expected: "false", message: "eitherTrue(false, false)가 false를 반환해야 합니다" },
      { fn: "notValue", args: ["true"], expected: "false", message: "notValue(true)가 false를 반환해야 합니다" },
    ],
  },
  {
    id: "ternary-op",
    title: "삼항 연산자",
    category: "comparison",
    order: 3,
    difficulty: "beginner",
    description: `# 삼항 연산자

\`조건 ? 참일때값 : 거짓일때값\` 형태로 간단한 조건 분기를 한 줄로 작성할 수 있습니다.

\`\`\`solidity
uint result = (a > b) ? a : b; // a가 크면 a, 아니면 b
\`\`\`

## 과제
삼항 연산자를 사용하여 max와 min 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TernaryOp {
    function max(uint a, uint b) public pure returns (uint) {
        // TODO: 삼항 연산자로 a와 b 중 큰 값을 반환하세요
    }

    function min(uint a, uint b) public pure returns (uint) {
        // TODO: 삼항 연산자로 a와 b 중 작은 값을 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TernaryOp {
    function max(uint a, uint b) public pure returns (uint) {
        return a >= b ? a : b;
    }

    function min(uint a, uint b) public pure returns (uint) {
        return a <= b ? a : b;
    }
}`,
    hints: ["삼항 연산자: 조건 ? 참일때 : 거짓일때", "max는 a >= b이면 a, min은 a <= b이면 a를 반환합니다."],
    testDescription: "max와 min 함수가 두 수 중 올바른 값을 반환하는지 확인합니다.",
    expectedFunctions: ["max", "min"],
    testCases: [
      { fn: "max", args: ["10", "20"], expected: "20", message: "max(10, 20)이 20을 반환해야 합니다" },
      { fn: "max", args: ["30", "5"], expected: "30", message: "max(30, 5)가 30을 반환해야 합니다" },
      { fn: "min", args: ["10", "20"], expected: "10", message: "min(10, 20)이 10을 반환해야 합니다" },
      { fn: "min", args: ["5", "5"], expected: "5", message: "min(5, 5)가 5를 반환해야 합니다" },
    ],
  },
  {
    id: "bitwise-ops",
    title: "비트 연산자",
    category: "comparison",
    order: 4,
    difficulty: "beginner",
    description: `# 비트 연산자

Solidity는 비트 단위 연산을 지원합니다: \`&\`(AND), \`|\`(OR), \`^\`(XOR), \`~\`(NOT), \`<<\`(왼쪽 시프트), \`>>\`(오른쪽 시프트).

\`\`\`solidity
uint8 a = 5;      // 00000101
uint8 b = 3;      // 00000011
uint8 c = a & b;  // 00000001 = 1
uint8 d = a << 1; // 00001010 = 10
\`\`\`

## 과제
비트 연산자를 사용하여 두 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BitwiseOps {
    function bitwiseAnd(uint8 a, uint8 b) public pure returns (uint8) {
        // TODO: a와 b의 비트 AND 결과를 반환하세요
    }

    function leftShift(uint8 a, uint8 bits) public pure returns (uint8) {
        // TODO: a를 bits만큼 왼쪽으로 시프트한 결과를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BitwiseOps {
    function bitwiseAnd(uint8 a, uint8 b) public pure returns (uint8) {
        return a & b;
    }

    function leftShift(uint8 a, uint8 bits) public pure returns (uint8) {
        return a << bits;
    }
}`,
    hints: ["&는 두 비트가 모두 1일 때만 1을 반환합니다.", "<<는 비트를 왼쪽으로 이동시키며, 빈자리는 0으로 채워집니다."],
    testDescription: "bitwiseAnd와 leftShift 함수가 비트 연산 결과를 올바르게 반환하는지 확인합니다.",
    expectedFunctions: ["bitwiseAnd", "leftShift"],
    testCases: [
      { fn: "bitwiseAnd", args: ["5", "3"], expected: "1", message: "bitwiseAnd(5, 3)이 1을 반환해야 합니다" },
      { fn: "leftShift", args: ["5", "1"], expected: "10", message: "leftShift(5, 1)이 10을 반환해야 합니다" },
      { fn: "leftShift", args: ["1", "3"], expected: "8", message: "leftShift(1, 3)이 8을 반환해야 합니다" },
    ],
  },
  {
    id: "if-else-basics",
    title: "조건문 (if/else)",
    category: "comparison",
    order: 5,
    difficulty: "beginner",
    description: `# 조건문 (if/else)

\`if\`, \`else if\`, \`else\`로 조건에 따라 다른 코드를 실행합니다.

\`\`\`solidity
if (x > 10) {
    return "big";
} else if (x > 5) {
    return "medium";
} else {
    return "small";
}
\`\`\`

## 과제
점수에 따라 등급을 반환하는 grade 함수를 완성하세요: 90이상 "A", 80이상 "B", 70이상 "C", 나머지 "F".`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IfElseBasics {
    function grade(uint score) public pure returns (string memory) {
        // TODO: if/else if/else를 사용하여 등급을 반환하세요
        // score >= 90 → "A", >= 80 → "B", >= 70 → "C", 나머지 → "F"
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IfElseBasics {
    function grade(uint score) public pure returns (string memory) {
        if (score >= 90) {
            return "A";
        } else if (score >= 80) {
            return "B";
        } else if (score >= 70) {
            return "C";
        } else {
            return "F";
        }
    }
}`,
    hints: ["가장 높은 점수 조건부터 검사하세요.", "각 분기에서 string을 return하면 됩니다."],
    testDescription: "grade 함수가 점수에 따라 올바른 등급 문자열을 반환하는지 확인합니다.",
    expectedFunctions: ["grade"],
    testCases: [
      { fn: "grade", args: ["95"], expected: "A", message: "grade(95)가 'A'를 반환해야 합니다" },
      { fn: "grade", args: ["85"], expected: "B", message: "grade(85)가 'B'를 반환해야 합니다" },
      { fn: "grade", args: ["75"], expected: "C", message: "grade(75)가 'C'를 반환해야 합니다" },
      { fn: "grade", args: ["50"], expected: "F", message: "grade(50)이 'F'를 반환해야 합니다" },
    ],
  },
  {
    id: "local-variables",
    title: "지역 변수",
    category: "variables",
    order: 1,
    difficulty: "beginner",
    description: `# 지역 변수

지역 변수는 함수 내부에서만 존재하며, 블록체인에 저장되지 않습니다. 함수 실행이 끝나면 사라집니다.

\`\`\`solidity
function example() public pure returns (uint) {
    uint temp = 10;    // 지역 변수
    uint result = temp * 2;
    return result;
}
\`\`\`

## 과제
지역 변수를 사용하여 calculate 함수를 완성하세요. 합과 곱을 더한 값을 반환합니다.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function calculate(uint a, uint b) public pure returns (uint) {
        // TODO: 지역 변수 sum(a+b)과 product(a*b)를 선언하고
        // sum + product를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LocalVariables {
    function calculate(uint a, uint b) public pure returns (uint) {
        uint sum = a + b;
        uint product = a * b;
        return sum + product;
    }
}`,
    hints: ["uint 키워드로 지역 변수를 선언할 수 있습니다.", "uint sum = a + b; 형태로 선언과 동시에 값을 할당하세요."],
    testDescription: "calculate 함수가 두 수의 합과 곱의 합을 올바르게 반환하는지 확인합니다.",
    expectedFunctions: ["calculate"],
    testCases: [
      { fn: "calculate", args: ["3", "4"], expected: "19", message: "calculate(3, 4)가 19를 반환해야 합니다 (3+4 + 3*4 = 19)" },
      { fn: "calculate", args: ["5", "2"], expected: "17", message: "calculate(5, 2)가 17을 반환해야 합니다 (5+2 + 5*2 = 17)" },
    ],
  },
  {
    id: "global-variables",
    title: "전역 변수",
    category: "variables",
    order: 2,
    difficulty: "beginner",
    description: `# 전역 변수

Solidity에는 어디서든 접근 가능한 전역 변수가 있습니다:
- \`msg.sender\`: 함수를 호출한 주소
- \`block.timestamp\`: 현재 블록의 타임스탬프
- \`block.number\`: 현재 블록 번호

\`\`\`solidity
address caller = msg.sender;
uint time = block.timestamp;
\`\`\`

## 과제
각 전역 변수를 반환하는 세 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GlobalVariables {
    function getSender() public view returns (address) {
        // TODO: 함수 호출자의 주소를 반환하세요
    }

    function getTimestamp() public view returns (uint) {
        // TODO: 현재 블록의 타임스탬프를 반환하세요
    }

    function getBlockNumber() public view returns (uint) {
        // TODO: 현재 블록 번호를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GlobalVariables {
    function getSender() public view returns (address) {
        return msg.sender;
    }

    function getTimestamp() public view returns (uint) {
        return block.timestamp;
    }

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }
}`,
    hints: ["msg.sender는 현재 함수를 호출한 지갑 주소입니다.", "block.timestamp와 block.number는 현재 블록 정보입니다."],
    testDescription: "getSender, getTimestamp, getBlockNumber 함수가 올바른 전역 변수 값을 반환하는지 확인합니다.",
    expectedFunctions: ["getSender", "getTimestamp", "getBlockNumber"],
    testCases: [
      { fn: "getSender", expected: "DEPLOYER", message: "getSender()가 호출자 주소를 반환해야 합니다" },
      { fn: "getTimestamp", message: "getTimestamp()가 정상적으로 반환되어야 합니다" },
      { fn: "getBlockNumber", message: "getBlockNumber()가 정상적으로 반환되어야 합니다" },
    ],
  },
  {
    id: "msg-value-payable",
    title: "msg.value와 payable",
    category: "variables",
    order: 3,
    difficulty: "beginner",
    description: `# msg.value와 payable

\`payable\` 함수는 ETH를 받을 수 있습니다. \`msg.value\`는 전송된 ETH(wei 단위)입니다.

\`\`\`solidity
function deposit() public payable {
    totalDeposited += msg.value;
}
uint bal = address(this).balance; // 컨트랙트 잔액
\`\`\`

## 과제
deposit 함수와 getBalance 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MsgValuePayable {
    uint public totalDeposited;

    function deposit() public payable {
        // TODO: totalDeposited에 msg.value를 더하세요
    }

    function getBalance() public view returns (uint) {
        // TODO: 이 컨트랙트의 ETH 잔액을 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MsgValuePayable {
    uint public totalDeposited;

    function deposit() public payable {
        totalDeposited += msg.value;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    hints: ["msg.value는 함수 호출 시 전송된 ETH의 양(wei)입니다.", "address(this).balance로 컨트랙트의 현재 ETH 잔액을 조회합니다."],
    testDescription: "deposit 호출 시 totalDeposited가 증가하고, getBalance가 컨트랙트 잔액을 반환하는지 확인합니다.",
    expectedFunctions: ["totalDeposited", "deposit", "getBalance"],
    testCases: [
      { fn: "totalDeposited", expected: "0", message: "초기 totalDeposited()가 0이어야 합니다" },
      { fn: "totalDeposited", expected: "1000", message: "deposit(1000 wei) 후 totalDeposited()가 1000이어야 합니다", setup: [{ fn: "deposit", value: "1000" }] },
      { fn: "getBalance", expected: "500", message: "deposit(500 wei) 후 getBalance()가 500이어야 합니다", setup: [{ fn: "deposit", value: "500" }] },
    ],
  },
  {
    id: "visibility-basics",
    title: "가시성 (Visibility)",
    category: "variables",
    order: 4,
    difficulty: "beginner",
    description: `# 가시성 (Visibility)

함수와 변수에 접근 범위를 지정합니다:
- \`public\`: 누구나 접근 가능
- \`private\`: 현재 컨트랙트만
- \`internal\`: 현재 + 상속 컨트랙트
- \`external\`: 외부에서만 호출 가능

\`\`\`solidity
uint private secret = 42;
function getSecret() public view returns (uint) { return secret; }
\`\`\`

## 과제
빈칸에 올바른 가시성 키워드를 넣어 코드를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    // TODO: private 키워드를 넣어 외부에서 직접 접근 불가하게 하세요
    uint secretNumber = 42;

    // TODO: public 키워드를 넣어 누구나 호출할 수 있게 하세요
    function getSecret() view returns (uint) {
        return secretNumber;
    }

    // TODO: internal 키워드를 넣어 상속 컨트랙트에서만 접근 가능하게 하세요
    function _helper() pure returns (uint) {
        return 1;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VisibilityBasics {
    uint private secretNumber = 42;

    function getSecret() public view returns (uint) {
        return secretNumber;
    }

    function _helper() internal pure returns (uint) {
        return 1;
    }
}`,
    hints: ["private 변수는 외부에서 직접 읽을 수 없습니다.", "public 함수는 누구나 호출할 수 있고, internal 함수는 컨트랙트 내부와 자식 컨트랙트에서만 호출 가능합니다."],
    testDescription: "getSecret 함수가 올바르게 secretNumber를 반환하는지 확인합니다.",
    expectedFunctions: ["getSecret"],
    testCases: [
      { fn: "getSecret", expected: "42", message: "getSecret()이 42를 반환해야 합니다" },
    ],
  },
  {
    id: "view-pure",
    title: "view와 pure",
    category: "variables",
    order: 5,
    difficulty: "beginner",
    description: `# view와 pure

- \`view\`: 상태를 읽지만 수정하지 않음
- \`pure\`: 상태를 읽지도 수정하지도 않음
- 둘 다 없으면: 상태를 수정할 수 있음

\`\`\`solidity
uint public counter;
function getCounter() public view returns (uint) { return counter; }
function add(uint a, uint b) public pure returns (uint) { return a + b; }
function increment() public { counter++; }
\`\`\`

## 과제
세 함수의 본문을 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewPure {
    uint public counter;

    function getCounter() public view returns (uint) {
        // TODO: counter 값을 반환하세요
    }

    function add(uint a, uint b) public pure returns (uint) {
        // TODO: a + b를 반환하세요
    }

    function increment() public {
        // TODO: counter를 1 증가시키세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ViewPure {
    uint public counter;

    function getCounter() public view returns (uint) {
        return counter;
    }

    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function increment() public {
        counter++;
    }
}`,
    hints: ["view 함수는 상태 변수를 읽을 수 있지만 수정할 수 없습니다.", "pure 함수는 상태 변수를 읽지도 수정하지도 않습니다. counter++로 값을 증가시킬 수 있습니다."],
    testDescription: "getCounter가 상태를 읽고, add가 순수 계산을 하고, increment가 상태를 수정하는지 확인합니다.",
    expectedFunctions: ["counter", "getCounter", "add", "increment"],
    testCases: [
      { fn: "getCounter", expected: "0", message: "초기 getCounter()가 0이어야 합니다" },
      { fn: "add", args: ["3", "7"], expected: "10", message: "add(3, 7)이 10을 반환해야 합니다" },
      { fn: "getCounter", expected: "1", message: "increment() 후 getCounter()가 1이어야 합니다", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "type-conversion",
    title: "타입 변환",
    category: "variables",
    order: 6,
    difficulty: "beginner",
    description: `# 타입 변환

Solidity에서는 명시적 타입 변환이 필요합니다.

\`\`\`solidity
uint256 big = 100;
uint8 small = uint8(big);        // 명시적 변환
uint256 back = uint256(small);   // 다시 변환
address payable p = payable(addr); // payable로 변환
\`\`\`

## 과제
타입 변환 함수 세 개를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeConversion {
    function toUint8(uint256 x) public pure returns (uint8) {
        // TODO: x를 uint8로 변환하여 반환하세요
    }

    function toUint256(uint8 x) public pure returns (uint256) {
        // TODO: x를 uint256으로 변환하여 반환하세요
    }

    function toPayable(address addr) public pure returns (address payable) {
        // TODO: addr을 address payable로 변환하여 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeConversion {
    function toUint8(uint256 x) public pure returns (uint8) {
        return uint8(x);
    }

    function toUint256(uint8 x) public pure returns (uint256) {
        return uint256(x);
    }

    function toPayable(address addr) public pure returns (address payable) {
        return payable(addr);
    }
}`,
    hints: ["uint8(x) 형태로 명시적 타입 변환을 합니다.", "address를 address payable로 변환할 때는 payable(addr)을 사용합니다."],
    testDescription: "toUint8, toUint256, toPayable 함수가 올바르게 타입을 변환하는지 확인합니다.",
    expectedFunctions: ["toUint8", "toUint256", "toPayable"],
    testCases: [
      { fn: "toUint8", args: ["200"], expected: "200", message: "toUint8(200)이 200을 반환해야 합니다" },
      { fn: "toUint256", args: ["100"], expected: "100", message: "toUint256(100)이 100을 반환해야 합니다" },
      { fn: "toPayable", args: ["0x1000000000000000000000000000000000000001"], message: "toPayable()이 정상적으로 반환되어야 합니다" },
    ],
  },
  {
    id: "delete-keyword",
    title: "delete 키워드",
    category: "variables",
    order: 7,
    difficulty: "beginner",
    description: `# delete 키워드

\`delete\`는 변수를 기본값으로 초기화합니다. uint는 0, bool은 false, address는 address(0)이 됩니다.

\`\`\`solidity
uint public value = 100;
function reset() public {
    delete value; // value = 0
}
\`\`\`

## 과제
reset 함수에서 delete를 사용하여 value와 flag를 초기화하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeleteKeyword {
    uint public value = 100;
    bool public flag = true;

    function reset() public {
        // TODO: delete를 사용하여 value와 flag를 기본값으로 초기화하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DeleteKeyword {
    uint public value = 100;
    bool public flag = true;

    function reset() public {
        delete value;
        delete flag;
    }
}`,
    hints: ["delete value; 형태로 변수를 기본값으로 되돌릴 수 있습니다.", "delete 후 uint는 0, bool은 false가 됩니다."],
    testDescription: "reset 호출 후 value가 0이고 flag가 false인지 확인합니다.",
    expectedFunctions: ["value", "flag", "reset"],
    testCases: [
      { fn: "value", expected: "100", message: "초기 value()가 100이어야 합니다" },
      { fn: "flag", expected: "true", message: "초기 flag()가 true여야 합니다" },
      { fn: "value", expected: "0", message: "reset() 후 value()가 0이어야 합니다", setup: [{ fn: "reset" }] },
      { fn: "flag", expected: "false", message: "reset() 후 flag()가 false여야 합니다", setup: [{ fn: "reset" }] },
    ],
  },
  {
    id: "no-float",
    title: "소수점이 없다!",
    category: "gotchas",
    order: 1,
    difficulty: "beginner",
    description: `# 소수점이 없다!

Solidity에는 소수점(float/double)이 **없습니다**. 정수 나눗셈은 소수점 이하를 버립니다.

\`\`\`solidity
uint result = 5 / 2; // 2 (2.5가 아님!)
uint scaled = (5 * 1e18) / 2; // 2500000000000000000 (정밀도 보존)
\`\`\`

## 과제
일반 나눗셈과 스케일링 나눗셈 함수를 각각 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NoFloat {
    function wrongDivide(uint a, uint b) public pure returns (uint) {
        // TODO: 단순히 a / b를 반환하세요 (소수점이 잘립니다)
    }

    function scaledDivide(uint a, uint b) public pure returns (uint) {
        // TODO: (a * 1e18) / b를 반환하여 정밀도를 보존하세요
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
    hints: ["Solidity 정수 나눗셈은 항상 내림됩니다.", "1e18을 곱한 후 나누면 소수점 18자리까지 정밀도를 유지할 수 있습니다."],
    testDescription: "wrongDivide(5,2)가 2를, scaledDivide(5,2)가 2.5*1e18을 반환하는지 확인합니다.",
    expectedFunctions: ["wrongDivide", "scaledDivide"],
    testCases: [
      { fn: "wrongDivide", args: ["5", "2"], expected: "2", message: "wrongDivide(5, 2)가 2를 반환해야 합니다 (소수점 버림)" },
      { fn: "scaledDivide", args: ["5", "2"], expected: "2500000000000000000", message: "scaledDivide(5, 2)가 2.5e18을 반환해야 합니다" },
    ],
  },
  {
    id: "default-values",
    title: "기본값",
    category: "gotchas",
    order: 2,
    difficulty: "beginner",
    description: `# 기본값

Solidity 변수는 선언 시 자동으로 기본값이 할당됩니다. null이나 undefined가 **없습니다**.
- \`uint\` → 0, \`bool\` → false, \`address\` → address(0), \`string\` → ""

\`\`\`solidity
uint x;     // 0
bool b;     // false
address a;  // 0x0000...0000
\`\`\`

## 과제
isDefault 함수에서 모든 변수가 기본값인지 확인하는 조건을 작성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DefaultValues {
    uint public num;
    bool public flag;
    address public addr;
    string public text;

    function isDefault() public view returns (bool) {
        // TODO: num == 0, flag == false, addr == address(0) 을 모두 확인하여 반환하세요
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
    hints: ["bool의 기본값 false는 !flag로 확인할 수 있습니다.", "address의 기본값은 address(0)입니다."],
    testDescription: "초기 상태에서 isDefault()가 true를 반환하는지 확인합니다.",
    expectedFunctions: ["num", "flag", "addr", "text", "isDefault"],
    testCases: [
      { fn: "num", expected: "0", message: "초기 num()이 0이어야 합니다" },
      { fn: "flag", expected: "false", message: "초기 flag()가 false여야 합니다" },
      { fn: "isDefault", expected: "true", message: "초기 상태에서 isDefault()가 true를 반환해야 합니다" },
    ],
  },
  {
    id: "string-comparison",
    title: "문자열 비교",
    category: "gotchas",
    order: 3,
    difficulty: "beginner",
    description: `# 문자열 비교

Solidity에서 문자열은 \`==\`로 직접 비교할 수 **없습니다**. \`keccak256\` 해시를 비교해야 합니다.

\`\`\`solidity
// 잘못된 방법: "hello" == "hello" (컴파일 에러!)
// 올바른 방법:
keccak256(abi.encodePacked("hello")) == keccak256(abi.encodePacked("hello"))
\`\`\`

## 과제
keccak256 해시를 사용하여 두 문자열을 비교하는 isEqual 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringComparison {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        // TODO: keccak256과 abi.encodePacked를 사용하여 a와 b를 비교하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringComparison {
    function isEqual(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}`,
    hints: ["keccak256()은 bytes를 받아 bytes32 해시를 반환합니다.", "abi.encodePacked(str)로 string을 bytes로 변환합니다."],
    testDescription: "isEqual이 동일한 문자열에 true, 다른 문자열에 false를 반환하는지 확인합니다.",
    expectedFunctions: ["isEqual"],
    testCases: [
      { fn: "isEqual", args: ["hello", "hello"], expected: "true", message: "isEqual('hello', 'hello')이 true를 반환해야 합니다" },
      { fn: "isEqual", args: ["hello", "world"], expected: "false", message: "isEqual('hello', 'world')가 false를 반환해야 합니다" },
    ],
  },
  {
    id: "string-concat",
    title: "문자열 연결",
    category: "gotchas",
    order: 4,
    difficulty: "beginner",
    description: `# 문자열 연결

Solidity 0.8.12부터 \`string.concat()\`으로 문자열을 연결할 수 있습니다.

\`\`\`solidity
string memory result = string.concat("Hello", " ", "World");
// result = "Hello World"
\`\`\`

## 과제
string.concat을 사용하여 두 문자열을 연결하는 concat 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringConcat {
    function concat(string memory a, string memory b) public pure returns (string memory) {
        // TODO: string.concat을 사용하여 a와 b를 연결하여 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StringConcat {
    function concat(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }
}`,
    hints: ["string.concat(a, b) 형태로 사용합니다.", "여러 문자열을 한 번에 연결할 수도 있습니다: string.concat(a, b, c)"],
    testDescription: "concat 함수가 두 문자열을 올바르게 연결하는지 확인합니다.",
    expectedFunctions: ["concat"],
    testCases: [
      { fn: "concat", args: ["Hello", " World"], expected: "Hello World", message: "concat('Hello', ' World')가 'Hello World'를 반환해야 합니다" },
      { fn: "concat", args: ["a", "b"], expected: "ab", message: "concat('a', 'b')가 'ab'를 반환해야 합니다" },
    ],
  },
  {
    id: "address-vs-payable-diff",
    title: "address와 address payable 차이",
    category: "gotchas",
    order: 5,
    difficulty: "beginner",
    description: `# address와 address payable 차이

\`address\`는 ETH를 보낼 수 없고, \`address payable\`만 \`.transfer()\`와 \`.send()\`를 사용할 수 있습니다.

\`\`\`solidity
address payable to = payable(0x123...);
to.transfer(1 ether); // ETH 전송
address payable converted = payable(someAddress);
\`\`\`

## 과제
sendETH와 makePayable 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AddressPayableDiff {
    receive() external payable {}

    function sendETH(address payable to, uint amount) public {
        // TODO: to에게 amount만큼의 ETH를 transfer로 보내세요
    }

    function makePayable(address addr) public pure returns (address payable) {
        // TODO: addr을 address payable로 변환하여 반환하세요
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
    hints: ["address payable 변수에서 .transfer(amount)를 호출하면 ETH가 전송됩니다.", "payable(addr)로 일반 address를 address payable로 변환합니다."],
    testDescription: "sendETH가 ETH를 전송하고, makePayable이 주소를 올바르게 변환하는지 확인합니다.",
    expectedFunctions: ["sendETH", "makePayable"],
    testCases: [
      { fn: "makePayable", args: ["0x1000000000000000000000000000000000000001"], message: "makePayable()이 정상적으로 반환되어야 합니다" },
    ],
  },
  {
    id: "ether-units",
    title: "이더 단위",
    category: "gotchas",
    order: 6,
    difficulty: "beginner",
    description: `# 이더 단위

Solidity에는 이더 단위가 내장되어 있습니다:
- \`1 ether\` = 10^18 wei
- \`1 gwei\` = 10^9 wei
- \`1 wei\` = 1

\`\`\`solidity
uint oneEth = 1 ether;  // 1000000000000000000
uint oneG = 1 gwei;     // 1000000000
\`\`\`

## 과제
각 단위를 반환하는 세 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherUnits {
    function oneEther() public pure returns (uint) {
        // TODO: 1 ether를 반환하세요
    }

    function oneGwei() public pure returns (uint) {
        // TODO: 1 gwei를 반환하세요
    }

    function tenWei() public pure returns (uint) {
        // TODO: 10 wei를 반환하세요
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
    hints: ["숫자 뒤에 ether, gwei, wei 키워드를 붙이면 자동으로 변환됩니다.", "1 ether = 1e18, 1 gwei = 1e9 입니다."],
    testDescription: "oneEther, oneGwei, tenWei 함수가 올바른 wei 값을 반환하는지 확인합니다.",
    expectedFunctions: ["oneEther", "oneGwei", "tenWei"],
    testCases: [
      { fn: "oneEther", expected: "1000000000000000000", message: "oneEther()가 10^18을 반환해야 합니다" },
      { fn: "oneGwei", expected: "1000000000", message: "oneGwei()가 10^9를 반환해야 합니다" },
      { fn: "tenWei", expected: "10", message: "tenWei()가 10을 반환해야 합니다" },
    ],
  },
  {
    id: "time-units",
    title: "시간 단위",
    category: "gotchas",
    order: 7,
    difficulty: "beginner",
    description: `# 시간 단위

Solidity에는 시간 단위가 내장되어 있습니다:
- \`1 seconds\`, \`1 minutes\` (60), \`1 hours\` (3600), \`1 days\` (86400), \`1 weeks\` (604800)

\`\`\`solidity
uint oneDay = 1 days;   // 86400
uint deadline = block.timestamp + 7 days;
\`\`\`

## 과제
시간 단위를 사용하는 세 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeUnits {
    function oneDay() public pure returns (uint) {
        // TODO: 1 days를 반환하세요
    }

    function oneWeek() public pure returns (uint) {
        // TODO: 1 weeks를 반환하세요
    }

    function futureTimestamp(uint daysFromNow) public view returns (uint) {
        // TODO: 현재 타임스탬프에서 daysFromNow일 후의 타임스탬프를 반환하세요
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
    hints: ["숫자 뒤에 days, weeks 등의 키워드를 붙이면 초 단위로 자동 변환됩니다.", "block.timestamp + n * 1 days로 미래 시점을 계산할 수 있습니다."],
    testDescription: "oneDay, oneWeek, futureTimestamp 함수가 올바른 시간 값을 반환하는지 확인합니다.",
    expectedFunctions: ["oneDay", "oneWeek", "futureTimestamp"],
    testCases: [
      { fn: "oneDay", expected: "86400", message: "oneDay()가 86400을 반환해야 합니다" },
      { fn: "oneWeek", expected: "604800", message: "oneWeek()가 604800을 반환해야 합니다" },
      { fn: "futureTimestamp", args: ["1"], message: "futureTimestamp(1)이 정상적으로 반환되어야 합니다" },
    ],
  },
  {
    id: "type-casting-danger",
    title: "다운캐스팅 주의",
    category: "gotchas",
    order: 8,
    difficulty: "beginner",
    description: `# 다운캐스팅 주의

\`uint256\`을 \`uint8\`로 변환할 때 값이 255를 초과하면 Solidity 0.8+에서는 revert됩니다. 안전한 캐스팅을 위해 \`require\`로 검사하세요.

\`\`\`solidity
require(x <= type(uint8).max, "Overflow");
return uint8(x);
\`\`\`

## 과제
require로 오버플로를 검사한 후 안전하게 캐스팅하는 safeCast 함수를 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TypeCastingDanger {
    function safeCast(uint256 x) public pure returns (uint8) {
        // TODO: x가 uint8 최대값 이하인지 require로 확인하고
        // uint8로 변환하여 반환하세요
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
    hints: ["type(uint8).max는 uint8의 최대값인 255입니다.", "require(조건, 에러메시지)로 조건이 false이면 트랜잭션을 되돌립니다."],
    testDescription: "safeCast가 255 이하 값은 변환하고, 초과 시 revert하는지 확인합니다.",
    expectedFunctions: ["safeCast"],
    testCases: [
      { fn: "safeCast", args: ["100"], expected: "100", message: "safeCast(100)이 100을 반환해야 합니다" },
      { fn: "safeCast", args: ["255"], expected: "255", message: "safeCast(255)가 255를 반환해야 합니다" },
      { fn: "safeCast", args: ["256"], expectRevert: true, message: "safeCast(256)이 revert되어야 합니다" },
    ],
  },
  {
    id: "function-modifier",
    title: "함수 수정자 (Modifier)",
    category: "control-flow",
    order: 1,
    difficulty: "intermediate",
    description: `# 함수 수정자 (Modifier)

함수 실행 전후에 조건을 검사하는 수정자를 배워봅시다.

## 배울 내용
- modifier 선언
- \_; (언더스코어) 의 의미
- 접근 제어 패턴

## 설명
\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _; // 원래 함수 코드가 여기서 실행됨
}

function restricted() public onlyOwner {
    // owner만 실행 가능
}
\`\`\`

\`_;\`는 수정자가 적용된 함수의 본문이 실행되는 위치를 나타냅니다.

## 과제
1. onlyOwner modifier의 TODO를 완성하세요
2. increment 함수에 onlyOwner modifier를 적용하세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionModifier {
    address public owner;
    uint public count = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        // TODO: msg.sender가 owner인지 require로 확인하세요
        // TODO: _; 를 추가하세요
    }

    function increment() public /* TODO: onlyOwner modifier 적용 */ {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionModifier {
    address public owner;
    uint public count = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function increment() public onlyOwner {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}`,
    hints: [
      "require(조건, \"에러 메시지\"); 형식으로 조건을 검사합니다",
      "modifier 본문 마지막에 _; 를 넣어야 원래 함수가 실행됩니다",
    ],
    testDescription: "modifier가 올바르게 적용되었는지 확인합니다.",
    expectedFunctions: ["owner", "count", "increment", "getCount"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner()가 배포자 주소를 반환해야 합니다" },
      { fn: "getCount", expected: "0", message: "초기 getCount()가 0이어야 합니다" },
      { fn: "getCount", expected: "1", message: "increment() 후 getCount()가 1이어야 합니다", setup: [{ fn: "increment" }] },
    ],
  },
  {
    id: "loops",
    title: "반복문 (Loops)",
    category: "control-flow",
    order: 2,
    difficulty: "beginner",
    description: `# 반복문 (Loops)

Solidity의 반복문을 배워봅시다.

## 배울 내용
- for, while 반복문
- 가스 비용과 반복문의 관계

## 설명
\`\`\`solidity
// for 반복문
uint total = 0;
for (uint i = 0; i < n; i++) {
    total += i;
}

// while 반복문
uint i = n;
while (i > 0) {
    result *= base;
    i--;
}
\`\`\`

⚠️ **주의**: 무한 루프는 가스를 모두 소비하여 트랜잭션이 실패합니다!

## 과제
1. sum: for 반복문으로 1부터 n까지의 합을 구하세요
2. power: while 반복문으로 base^exp를 계산하세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Loops {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        // TODO: for 반복문으로 1부터 n까지 total에 더하세요
        return total;
    }

    function power(uint base, uint exp) public pure returns (uint) {
        uint result = 1;
        uint i = exp;
        // TODO: while 반복문으로 result에 base를 i번 곱하세요
        return result;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Loops {
    function sum(uint n) public pure returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= n; i++) {
            total += i;
        }
        return total;
    }

    function power(uint base, uint exp) public pure returns (uint) {
        uint result = 1;
        uint i = exp;
        while (i > 0) {
            result *= base;
            i--;
        }
        return result;
    }
}`,
    hints: [
      "for (uint i = 1; i <= n; i++) { total += i; }",
      "while (i > 0) { result *= base; i--; }",
    ],
    testDescription: "반복문이 올바르게 동작하는지 확인합니다.",
    expectedFunctions: ["sum", "power"],
    testCases: [
      { fn: "sum", args: ["10"], expected: "55", message: "sum(10)이 55를 반환해야 합니다" },
      { fn: "sum", args: ["0"], expected: "0", message: "sum(0)이 0을 반환해야 합니다" },
      { fn: "power", args: ["2", "10"], expected: "1024", message: "power(2, 10)이 1024를 반환해야 합니다" },
      { fn: "power", args: ["3", "0"], expected: "1", message: "power(3, 0)이 1을 반환해야 합니다" },
    ],
  },
  {
    id: "error-handling",
    title: "에러 처리",
    category: "control-flow",
    order: 3,
    difficulty: "intermediate",
    description: `# 에러 처리

트랜잭션을 안전하게 되돌리는 방법을 배워봅시다.

## 배울 내용
- require, revert, assert
- 커스텀 에러 (custom error)

## 설명
\`\`\`solidity
// require: 입력 검증
require(amount > 0, "Amount must be > 0");

// revert + 커스텀 에러: 가스 절약
error Unauthorized(address caller);
if (msg.sender != owner) {
    revert Unauthorized(msg.sender);
}
\`\`\`

## 과제
1. 커스텀 에러를 선언하세요
2. deposit과 withdraw 함수의 TODO를 완성하세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// TODO: error Unauthorized(address caller); 커스텀 에러를 선언하세요

contract ErrorHandling {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        // TODO: msg.value > 0 인지 require로 확인하세요 (메시지: "Must send ETH")
    }

    function withdraw(uint amount) public {
        // TODO: msg.sender가 owner가 아니면 Unauthorized 커스텀 에러로 revert하세요
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error Unauthorized(address caller);

contract ErrorHandling {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Must send ETH");
    }

    function withdraw(uint amount) public {
        if (msg.sender != owner) {
            revert Unauthorized(msg.sender);
        }
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`,
    hints: [
      "커스텀 에러는 컨트랙트 밖 상단에 선언합니다: error Unauthorized(address caller);",
      "revert Unauthorized(msg.sender); 형식으로 커스텀 에러를 발생시킵니다",
    ],
    testDescription: "에러 처리가 올바르게 구현되었는지 확인합니다.",
    expectedFunctions: ["owner", "deposit", "withdraw", "getBalance"],
    testCases: [
      { fn: "owner", expected: "DEPLOYER", message: "owner()가 배포자 주소를 반환해야 합니다" },
      { fn: "deposit", value: "1000", message: "deposit()이 ETH를 받을 수 있어야 합니다" },
      { fn: "deposit", expectRevert: true, message: "deposit()에 0 wei를 보내면 revert되어야 합니다" },
      { fn: "getBalance", expected: "1000", message: "deposit(1000) 후 getBalance()가 1000이어야 합니다", setup: [{ fn: "deposit", value: "1000" }] },
    ],
  },
  {
    id: "arrays",
    title: "배열 (Arrays)",
    category: "data-structures",
    order: 1,
    difficulty: "beginner",
    description: `# 배열 (Arrays)

동적 배열과 고정 배열을 배워봅시다.

## 배울 내용
- 동적 배열 선언
- push, pop, length, 인덱스 접근

## 설명
\`\`\`solidity
uint[] public arr;
arr.push(123);     // 끝에 추가
arr.pop();         // 마지막 제거
arr.length;        // 길이
arr[0];            // 인덱스 접근
\`\`\`

## 과제
각 함수 본문의 TODO를 한 줄로 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayExample {
    uint[] public numbers;

    function addNumber(uint num) public {
        // TODO: numbers 배열에 num을 추가하세요
    }

    function removeLastNumber() public {
        // TODO: numbers 배열의 마지막 원소를 제거하세요
    }

    function getNumber(uint index) public view returns (uint) {
        // TODO: numbers[index]를 반환하세요
    }

    function getLength() public view returns (uint) {
        // TODO: numbers.length를 반환하세요
    }

    function getAllNumbers() public view returns (uint[] memory) {
        // TODO: numbers 배열 전체를 반환하세요
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
      "배열 전체를 반환할 때: return numbers;",
    ],
    testDescription: "배열 조작 함수가 올바르게 구현되었는지 확인합니다.",
    expectedFunctions: [
      "numbers",
      "addNumber",
      "removeLastNumber",
      "getNumber",
      "getLength",
      "getAllNumbers",
    ],
    testCases: [
      { fn: "getLength", expected: "0", message: "초기 getLength()가 0이어야 합니다" },
      { fn: "getLength", expected: "2", message: "addNumber 2번 호출 후 getLength()가 2여야 합니다", setup: [{ fn: "addNumber", args: ["10"] }, { fn: "addNumber", args: ["20"] }] },
      { fn: "getNumber", args: ["0"], expected: "10", message: "addNumber(10) 후 getNumber(0)이 10이어야 합니다", setup: [{ fn: "addNumber", args: ["10"] }] },
    ],
  },
  {
    id: "mapping",
    title: "매핑 (Mapping)",
    category: "data-structures",
    order: 2,
    difficulty: "beginner",
    description: `# 매핑 (Mapping)

키-값 쌍으로 데이터를 저장하는 매핑을 배워봅시다.

## 배울 내용
- mapping 선언과 사용
- 값 설정과 조회

## 설명
\`\`\`solidity
mapping(address => uint) public balances;

balances[addr] = 100;     // 값 설정
balances[addr];           // 값 조회
balances[addr] += 50;     // 값 증가
\`\`\`

**매핑 특징:** 존재하지 않는 키는 기본값(0)을 반환합니다.

## 과제
각 함수 본문의 TODO를 한 줄로 완성하세요.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MappingExample {
    mapping(address => uint) public balances;

    function setBalance(address addr, uint amount) public {
        // TODO: balances[addr]에 amount를 설정하세요
    }

    function getBalance(address addr) public view returns (uint) {
        // TODO: balances[addr]를 반환하세요
    }

    function addBalance(address addr, uint amount) public {
        // TODO: balances[addr]에 amount를 더하세요
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
      "설정: balances[addr] = amount;",
      "증가: balances[addr] += amount;",
    ],
    testDescription: "매핑 함수가 올바르게 구현되었는지 확인합니다.",
    expectedFunctions: ["balances", "setBalance", "getBalance", "addBalance"],
    testCases: [
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "0", message: "초기 getBalance()가 0이어야 합니다" },
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "100", message: "setBalance(100) 후 getBalance()가 100이어야 합니다", setup: [{ fn: "setBalance", args: ["0x1000000000000000000000000000000000000001", "100"] }] },
      { fn: "getBalance", args: ["0x1000000000000000000000000000000000000001"], expected: "150", message: "addBalance(50) 후 getBalance()가 150이어야 합니다", setup: [{ fn: "setBalance", args: ["0x1000000000000000000000000000000000000001", "100"] }, { fn: "addBalance", args: ["0x1000000000000000000000000000000000000001", "50"] }] },
    ],
  },
  {
    id: "struct",
    title: "구조체 (Struct)",
    category: "data-structures",
    order: 3,
    difficulty: "intermediate",
    description: `# 구조체 (Struct)

관련 데이터를 묶어서 사용자 정의 타입을 만드는 구조체를 배워봅시다.

## 배울 내용
- struct 선언
- struct 생성과 접근

## 설명
\`\`\`solidity
struct Todo {
    string text;
    bool completed;
}
Todo[] public todos;

// 생성
todos.push(Todo("Buy milk", false));

// 접근
todos[0].completed = true;
\`\`\`

## 과제
1. Student 구조체의 필드를 채우세요
2. 각 함수의 TODO를 완성하세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StructExample {
    struct Student {
        // TODO: name (string), score (uint), isEnrolled (bool) 필드를 추가하세요
    }

    Student[] public students;

    function addStudent(string calldata name, uint score) public {
        // TODO: Student(name, score, true)를 students에 push하세요
    }

    function getStudent(uint index) public view returns (string memory, uint, bool) {
        Student storage s = students[index];
        // TODO: s의 name, score, isEnrolled를 반환하세요
    }

    function updateScore(uint index, uint newScore) public {
        // TODO: students[index].score를 newScore로 변경하세요
    }

    function getStudentCount() public view returns (uint) {
        // TODO: students.length를 반환하세요
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
      "구조체 필드: string name; uint score; bool isEnrolled;",
      "여러 값 반환: return (s.name, s.score, s.isEnrolled);",
    ],
    testDescription: "구조체와 관련 함수가 올바르게 구현되었는지 확인합니다.",
    expectedFunctions: [
      "students",
      "addStudent",
      "getStudent",
      "updateScore",
      "getStudentCount",
    ],
    testCases: [
      { fn: "getStudentCount", expected: "0", message: "초기 getStudentCount()가 0이어야 합니다" },
      { fn: "getStudentCount", expected: "1", message: "addStudent 후 getStudentCount()가 1이어야 합니다", setup: [{ fn: "addStudent", args: ["Alice", "90"] }] },
    ],
  },
  {
    id: "events",
    title: "이벤트 (Events)",
    category: "advanced",
    order: 1,
    difficulty: "intermediate",
    description: `# 이벤트 (Events)

스마트 컨트랙트의 로그를 기록하는 이벤트를 배워봅시다.

## 배울 내용
- event 선언과 emit
- indexed 파라미터

## 설명
\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint amount);

function transfer(address to, uint amount) public {
    emit Transfer(msg.sender, to, amount);
}
\`\`\`

- \`indexed\`: 이벤트 필터링에 사용 (최대 3개)
- \`emit\` 키워드로 이벤트를 발생

## 과제
1. 두 개의 event를 선언하세요
2. 각 함수에서 emit으로 이벤트를 발생시키세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventExample {
    // TODO: event MessageSent(address indexed sender, string message, uint timestamp) 선언
    // TODO: event ValueChanged(uint indexed oldValue, uint indexed newValue) 선언

    uint public value = 0;

    function sendMessage(string calldata message) public {
        // TODO: MessageSent 이벤트를 emit하세요 (sender: msg.sender, timestamp: block.timestamp)
    }

    function setValue(uint newValue) public {
        uint oldValue = value;
        value = newValue;
        // TODO: ValueChanged 이벤트를 emit하세요
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
      "event 선언: event 이름(파라미터들);",
      "이벤트 발생: emit 이벤트이름(값들);",
    ],
    testDescription: "이벤트가 올바르게 선언되고 발생하는지 확인합니다.",
    expectedEvents: ["MessageSent", "ValueChanged"],
    expectedFunctions: ["value", "sendMessage", "setValue"],
    testCases: [
      { fn: "value", expected: "0", message: "초기 value()가 0이어야 합니다" },
      { fn: "sendMessage", args: ["hello"], message: "sendMessage()가 정상적으로 실행되어야 합니다" },
      { fn: "value", expected: "42", message: "setValue(42) 후 value()가 42여야 합니다", setup: [{ fn: "setValue", args: ["42"] }] },
    ],
  },
  {
    id: "inheritance",
    title: "상속 (Inheritance)",
    category: "advanced",
    order: 2,
    difficulty: "intermediate",
    description: `# 상속 (Inheritance)

컨트랙트 간의 코드 재사용을 위한 상속을 배워봅시다.

## 배울 내용
- is 키워드로 상속
- virtual과 override

## 설명
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

- \`virtual\`: 자식에서 오버라이드 가능
- \`override\`: 부모 함수를 재정의

## 과제
Shape 컨트랙트는 작성되어 있습니다. Rectangle 컨트랙트의 TODO를 완성하세요.`,
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
        // TODO: width와 height를 설정하세요
    }

    function getArea() public view override returns (uint) {
        // TODO: width * height를 반환하세요
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
      "생성자에서: width = _width; height = _height;",
      "getArea: return width * height;",
    ],
    testDescription: "상속과 오버라이드가 올바르게 구현되었는지 확인합니다.",
    expectedFunctions: ["getArea", "width", "height"],
    constructorArgs: ["3", "4"],
    testCases: [
      { fn: "width", expected: "3", message: "width()가 3을 반환해야 합니다" },
      { fn: "height", expected: "4", message: "height()가 4를 반환해야 합니다" },
      { fn: "getArea", expected: "12", message: "getArea()가 12를 반환해야 합니다 (3*4)" },
    ],
  },
  {
    id: "interface",
    title: "인터페이스 (Interface)",
    category: "advanced",
    order: 3,
    difficulty: "intermediate",
    description: `# 인터페이스 (Interface)

컨트랙트 간의 통신 규약인 인터페이스를 배워봅시다.

## 배울 내용
- interface 선언
- 인터페이스 구현

## 설명
\`\`\`solidity
interface IToken {
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract MyToken is IToken {
    // 인터페이스의 모든 함수를 구현해야 함
}
\`\`\`

**인터페이스 규칙:** 함수 선언만 가능, 상태 변수 불가, 모든 함수는 external

## 과제
ICounter 인터페이스가 주어져 있습니다. Counter 컨트랙트의 TODO를 완성하세요.`,
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
        // TODO: count를 1 증가시키세요
    }

    function decrement() external {
        // TODO: count가 0보다 큰지 require로 확인한 후, count를 1 감소시키세요
    }

    function getCount() external view returns (uint) {
        // TODO: count를 반환하세요
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
      "decrement: require(count > 0, ...) 후 count -= 1;",
    ],
    testDescription: "인터페이스가 올바르게 구현되었는지 확인합니다.",
    expectedFunctions: ["increment", "decrement", "getCount"],
    testCases: [
      { fn: "getCount", expected: "0", message: "초기 getCount()가 0이어야 합니다" },
      { fn: "getCount", expected: "1", message: "increment() 후 getCount()가 1이어야 합니다", setup: [{ fn: "increment" }] },
      { fn: "getCount", expected: "1", message: "increment() 2번, decrement() 1번 후 getCount()가 1이어야 합니다", setup: [{ fn: "increment" }, { fn: "increment" }, { fn: "decrement" }] },
      { fn: "decrement", expectRevert: true, message: "count가 0일 때 decrement()이 revert되어야 합니다" },
    ],
  },
  {
    id: "simple-storage",
    title: "심플 스토리지",
    category: "patterns",
    order: 1,
    difficulty: "beginner",
    description: `# 심플 스토리지 패턴

가장 기본적인 스마트 컨트랙트 패턴을 구현해봅시다.

## 배울 내용
- 값 저장과 조회 패턴
- 이벤트 로깅

## 과제
1. event를 선언하세요
2. set 함수에서 값 저장 + 이벤트 발생
3. get 함수에서 값 반환`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    // TODO: event DataStored(address indexed user, uint value) 선언

    uint public storedData;

    function set(uint value) public {
        // TODO: storedData에 value를 저장하세요
        // TODO: DataStored 이벤트를 emit하세요 (user: msg.sender)
    }

    function get() public view returns (uint) {
        // TODO: storedData를 반환하세요
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    event DataStored(address indexed user, uint value);

    uint public storedData;

    function set(uint value) public {
        storedData = value;
        emit DataStored(msg.sender, value);
    }

    function get() public view returns (uint) {
        return storedData;
    }
}`,
    hints: [
      "event DataStored(address indexed user, uint value);",
      "emit DataStored(msg.sender, value);",
    ],
    testDescription: "SimpleStorage 패턴이 올바르게 구현되었는지 확인합니다.",
    expectedFunctions: ["storedData", "set", "get"],
    expectedEvents: ["DataStored"],
    testCases: [
      { fn: "get", expected: "0", message: "초기 get()이 0이어야 합니다" },
      { fn: "get", expected: "42", message: "set(42) 후 get()이 42를 반환해야 합니다", setup: [{ fn: "set", args: ["42"] }] },
      { fn: "storedData", expected: "100", message: "set(100) 후 storedData()가 100이어야 합니다", setup: [{ fn: "set", args: ["100"] }] },
    ],
  },
  {
    id: "erc20-basic",
    title: "ERC-20 기초",
    category: "patterns",
    order: 2,
    difficulty: "advanced",
    description: `# ERC-20 토큰 기초

이더리움에서 가장 많이 사용되는 토큰 표준 ERC-20의 기초를 구현해봅시다.

## 배울 내용
- ERC-20 표준 이해
- 토큰 발행 (mint)
- 토큰 전송 (transfer)

## 설명
ERC-20은 대체 가능한 토큰(Fungible Token)의 표준입니다.
핵심 기능: totalSupply, balanceOf, transfer

## 과제
1. 생성자에서 토큰 초기 발행 로직을 작성하세요
2. transfer 함수의 전송 로직을 완성하세요`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10**18;
        // TODO: totalSupply를 initialSupply로 설정하세요
        // TODO: balanceOf[msg.sender]를 initialSupply로 설정하세요
        // TODO: Transfer 이벤트 emit (from: address(0), to: msg.sender, amount: initialSupply)
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        // TODO: 보내는 사람의 잔액에서 amount를 빼세요
        // TODO: 받는 사람의 잔액에 amount를 더하세요
        // TODO: Transfer 이벤트 emit (from: msg.sender)

        return true;
    }
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    string public name = "Toka Token";
    string public symbol = "TOKA";
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint amount);

    constructor() {
        uint initialSupply = 1000000 * 10**18;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);

        return true;
    }
}`,
    hints: [
      "생성자: totalSupply = initialSupply; balanceOf[msg.sender] = initialSupply;",
      "전송: balanceOf[msg.sender] -= amount; balanceOf[to] += amount;",
    ],
    testDescription: "ERC-20 기초 구현이 올바른지 확인합니다.",
    expectedFunctions: [
      "name",
      "symbol",
      "decimals",
      "totalSupply",
      "balanceOf",
      "transfer",
    ],
    expectedEvents: ["Transfer"],
    testCases: [
      { fn: "name", expected: "Toka Token", message: "name()이 'Toka Token'을 반환해야 합니다" },
      { fn: "symbol", expected: "TOKA", message: "symbol()이 'TOKA'를 반환해야 합니다" },
      { fn: "decimals", expected: "18", message: "decimals()가 18을 반환해야 합니다" },
      { fn: "totalSupply", expected: "1000000000000000000000000", message: "totalSupply()가 1000000 * 10^18이어야 합니다" },
      { fn: "balanceOf", args: ["DEPLOYER"], expected: "1000000000000000000000000", message: "배포자의 balanceOf가 전체 공급량이어야 합니다" },
    ],
  },];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblemsByCategory(categoryId: string): Problem[] {
  return problems
    .filter((p) => p.category === categoryId)
    .sort((a, b) => a.order - b.order);
}

export function getNextProblem(currentId: string): Problem | undefined {
  const current = getProblemById(currentId);
  if (!current) return undefined;

  const sameCategory = getProblemsByCategory(current.category);
  const idx = sameCategory.findIndex((p) => p.id === currentId);
  if (idx < sameCategory.length - 1) return sameCategory[idx + 1];

  const cat = categories.find((c) => c.id === current.category);
  if (!cat) return undefined;
  const nextCat = categories.find((c) => c.order === cat.order + 1);
  if (!nextCat) return undefined;
  const nextProblems = getProblemsByCategory(nextCat.id);
  return nextProblems[0];
}

export function getPrevProblem(currentId: string): Problem | undefined {
  const current = getProblemById(currentId);
  if (!current) return undefined;

  const sameCategory = getProblemsByCategory(current.category);
  const idx = sameCategory.findIndex((p) => p.id === currentId);
  if (idx > 0) return sameCategory[idx - 1];

  const cat = categories.find((c) => c.id === current.category);
  if (!cat) return undefined;
  const prevCat = categories.find((c) => c.order === cat.order - 1);
  if (!prevCat) return undefined;
  const prevProblems = getProblemsByCategory(prevCat.id);
  return prevProblems[prevProblems.length - 1];
}
