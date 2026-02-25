# Solidity Basic Vulnerabilities - Research Document

## Overview
This document provides comprehensive information about fundamental vulnerabilities in Solidity smart contracts. Each vulnerability includes description, vulnerable code examples, attack vectors, mitigation strategies, and real-world incidents.

---

## 1. Reentrancy

### Description
Reentrancy occurs when a contract calls an external contract before completing its own state updates. The external contract can recursively call back into the original contract, exploiting the incomplete state.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        // VULNERABLE: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0;
    }
}
```

### Attack Contract
```solidity
contract Attacker {
    VulnerableBank public bank;

    constructor(address _bank) {
        bank = VulnerableBank(_bank);
    }

    receive() external payable {
        if (address(bank).balance >= 1 ether) {
            bank.withdraw();
        }
    }

    function attack() external payable {
        bank.deposit{value: 1 ether}();
        bank.withdraw();
    }
}
```

### Mitigation: Checks-Effects-Interactions Pattern
```solidity
function withdraw() external {
    uint256 amount = balances[msg.sender];
    require(amount > 0, "No balance");

    // CHECKS complete, now EFFECTS
    balances[msg.sender] = 0;

    // INTERACTIONS last
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

### Mitigation: ReentrancyGuard (OpenZeppelin)
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function withdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### Real-World Incident
- **The DAO (2016)**: $60 million stolen due to reentrancy vulnerability
- **Easter Hack (2023)**: $7.5 million lost on BEAR token

---

## 2. Integer Overflow/Underflow

### Description
Before Solidity 0.8.0, arithmetic operations could overflow/underflow silently. While Solidity 0.8+ includes built-in overflow checks, understanding this is crucial for older contracts and unchecked blocks.

### Vulnerable Code (Pre-0.8.0)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract VulnerableToken {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) public {
        // VULNERABLE: No overflow check
        balances[msg.sender] -= amount;  // Underflow possible
        balances[to] += amount;           // Overflow possible
    }
}
```

### Attack Scenario
```solidity
// Attacker with 0 tokens can underflow
// balances[attacker] = 0
// balances[attacker] -= 1  =>  becomes 2^256 - 1 (huge number!)
```

### Mitigation: SafeMath (Pre-0.8.0)
```solidity
import "@openzeppelin/contracts/math/SafeMath.sol";

contract SafeToken {
    using SafeMath for uint256;
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) public {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[to] = balances[to].add(amount);
    }
}
```

### Modern Solidity (0.8.0+)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ModernToken {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) public {
        // Automatically reverts on underflow
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    // Unchecked block for gas optimization when safety is guaranteed
    function incrementUnbounded(uint256 x) public pure returns (uint256) {
        unchecked {
            return x + 1; // No overflow check - cheaper
        }
    }
}
```

### Real-World Incident
- **BEC Token (2018)**: $900 million theoretical loss due to overflow vulnerability

---

## 3. Access Control Vulnerabilities

### Description
Improper access control allows unauthorized users to execute restricted functions, often due to missing or misconfigured modifiers.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableAccess {
    address public owner;
    uint256 public secretValue;

    constructor() {
        owner = msg.sender;
    }

    // VULNERABLE: No access control!
    function setSecretValue(uint256 _value) public {
        secretValue = _value;
    }

    // VULNERABLE: Incorrect check
    function changeOwner(address _newOwner) public {
        if (tx.origin == owner) {
            owner = _newOwner;
        }
    }

    // VULNERABLE: Default visibility is public!
    function destroy() public {
        selfdestruct(payable(msg.sender));
    }
}
```

### Secure Implementation
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureAccess is Ownable {
    uint256 private secretValue;

    event SecretValueChanged(uint256 newValue);

    // Only owner can call
    function setSecretValue(uint256 _value) external onlyOwner {
        secretValue = _value;
        emit SecretValueChanged(_value);
    }

    // Proper ownership transfer
    function safeOwnerChange(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        _transferOwnership(_newOwner);
    }

    // Role-based access control
    mapping(bytes32 => mapping(address => bool)) public roles;

    function grantRole(bytes32 role, address account) external onlyOwner {
        roles[role][account] = true;
    }

    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender], "Unauthorized");
        _;
    }
}
```

### Real-World Incidents
- **Parity Wallet (2017)**: $30 million stolen, uninitialized wallet library
- **Parity Wallet (2017)**: $150 million frozen due to unprotected init function

---

## 4. Front-Running (Transaction Ordering Dependence)

### Description
Attackers observe pending transactions in the mempool and submit their own transactions with higher gas prices to execute first, exploiting price movements or opportunities.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableDEX {
    uint256 public rate = 100; // 1 token = 100 wei

    // VULNERABLE: Rate can be front-run
    function updateRate(uint256 _newRate) public {
        rate = _newRate;
    }

    function buyToken() public payable {
        uint256 tokens = msg.value * rate;
        // transfer tokens...
    }
}

// Attack scenario:
// 1. Attacker sees pending updateRate(200) transaction
// 2. Attacker quickly calls buyToken() before rate update
// 3. Attacker gets tokens at old (cheaper) rate
```

### Mitigation Strategies
```solidity
// Commit-Reveal Scheme
contract CommitReveal {
    struct Commit {
        bytes32 commitment;
        uint256 revealBlock;
        bool revealed;
    }

    mapping(address => Commit) public commits;

    // Phase 1: Commit hashed value
    function commit(bytes32 _hash) external {
        commits[msg.sender] = Commit({
            commitment: _hash,
            revealBlock: block.number + 10,
            revealed: false
        });
    }

    // Phase 2: Reveal actual value
    function reveal(uint256 _value, bytes32 _salt) external {
        Commit storage c = commits[msg.sender];
        require(block.number >= c.revealBlock, "Too early");
        require(!c.revealed, "Already revealed");
        require(keccak256(abi.encodePacked(_value, _salt)) == c.commitment, "Invalid reveal");

        c.revealed = true;
        // Process the revealed value
    }
}

// Minimum Time Lock
contract TimedUpdate {
    uint256 public rate;
    uint256 public pendingRate;
    uint256 public timeLockEnd;
    uint256 public constant TIME_LOCK_DURATION = 1 days;

    function proposeUpdate(uint256 _newRate) external {
        pendingRate = _newRate;
        timeLockEnd = block.timestamp + TIME_LOCK_DURATION;
    }

    function executeUpdate() external {
        require(block.timestamp >= timeLockEnd, "Time lock active");
        rate = pendingRate;
    }
}
```

### Real-World Incidents
- **Uniswap V1**: Multiple front-running attacks on DEX trades
- **ERC-20 Token Launches**: Bots front-running token purchases

---

## 5. Denial of Service (DoS)

### Description
Attackers can prevent contracts from functioning by exploiting logic to consume all gas, block execution paths, or corrupt state.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableAuction {
    address public highestBidder;
    uint256 public highestBid;
    address[] public previousBidders;

    function bid() public payable {
        require(msg.value > highestBid, "Bid too low");

        // VULNERABLE: Unbounded loop
        for (uint256 i = 0; i < previousBidders.length; i++) {
            (bool success, ) = previousBidders[i].call{value: highestBid}("");
            require(success, "Refund failed"); // DoS vector!
        }

        previousBidders.push(highestBidder);
        highestBidder = msg.sender;
        highestBid = msg.value;
    }
}
```

### Mitigation
```solidity
contract SecureAuction {
    address public highestBidder;
    uint256 public highestBid;
    mapping(address => uint256) public refunds;

    event NewHighestBid(address indexed bidder, uint256 amount);
    event RefundAvailable(address indexed bidder, uint256 amount);

    function bid() public payable {
        require(msg.value > highestBid, "Bid too low");

        // Store refund for later withdrawal
        refunds[highestBidder] += highestBid;
        emit RefundAvailable(highestBidder, highestBid);

        highestBidder = msg.sender;
        highestBid = msg.value;
        emit NewHighestBid(msg.sender, msg.value);
    }

    // Pull pattern - users withdraw their own refunds
    function withdrawRefund() public {
        uint256 amount = refunds[msg.sender];
        require(amount > 0, "No refund");

        refunds[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### DoS Patterns to Avoid
1. **Unbounded Loops**: Operations that grow linearly with users
2. **Unexpected Revert**: Callers intentionally reverting required calls
3. **Block Stuffing**: Filling blocks to delay time-sensitive operations

---

## 6. Timestamp Manipulation

### Description
Using `block.timestamp` for critical logic is vulnerable because miners can manipulate timestamps within certain bounds (typically ~15 seconds).

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableLottery {
    address public winner;
    uint256 public endTime;

    constructor() {
        endTime = block.timestamp + 1 hours;
    }

    // VULNERABLE: Miner can manipulate timestamp
    function determineWinner() public {
        require(block.timestamp >= endTime, "Not ended");

        if (block.timestamp % 100 == 0) {
            winner = msg.sender; // Miners can target this!
        }
    }
}

// Using timestamp for randomness
contract VulnerableRandom {
    function random() public view returns (uint256) {
        // VULNERABLE: Predictable and manipulatable
        return uint256(keccak256(abi.encodePacked(block.timestamp)));
    }
}
```

### Mitigation
```solidity
contract SecureRandom {
    // Use blockhash for recent randomness (still not perfect)
    function randomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            blockhash(block.number - 1),
            block.difficulty,
            block.timestamp
        )));
    }

    // Better: Use Chainlink VRF for true randomness
    // Or commit-reveal schemes for fairness
}

// For time-sensitive operations
contract SecureTimelock {
    uint256 public constant GRACE_PERIOD = 15 seconds;

    function isExpired(uint256 _endTime) public view returns (bool) {
        // Account for timestamp manipulation margin
        return block.timestamp > _endTime + GRACE_PERIOD;
    }
}
```

---

## 7. tx.origin Authentication

### Description
Using `tx.origin` for authentication allows phishing attacks where malicious contracts trick users into calling vulnerable contracts.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // VULNERABLE: Uses tx.origin
    function transfer(address payable _to, uint256 _amount) public {
        require(tx.origin == owner, "Not authorized");
        _to.transfer(_amount);
    }
}
```

### Attack Scenario
```solidity
contract PhishingAttack {
    VulnerableWallet public wallet;

    constructor(address _wallet) {
        wallet = VulnerableWallet(_wallet);
    }

    // Attacker tricks owner into calling this
    function attack() public {
        wallet.transfer(payable(msg.sender), address(wallet).balance);
    }
}

// Flow:
// 1. Attacker deploys PhishingAttack pointing to VulnerableWallet
// 2. Attacker tricks wallet owner to call attack()
// 3. tx.origin still equals owner, funds stolen!
```

### Mitigation
```solidity
contract SecureWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // SECURE: Uses msg.sender
    function transfer(address payable _to, uint256 _amount) public {
        require(msg.sender == owner, "Not authorized");
        _to.transfer(_amount);
    }
}
```

### When tx.origin IS Appropriate
- Only for emitting events to trace original sender
- Never for authorization!

---

## 8. Unchecked Return Values

### Description
Low-level calls like `call()`, `send()`, and `delegatecall()` return a boolean but don't revert on failure. Unchecked return values can lead to silent failures.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerablePayments {
    mapping(address => uint256) public balances;

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;

        // Vulnerable: Return value unchecked
        payable(msg.sender).call{value: amount}("");

        // Also vulnerable:
        // payable(msg.sender).send(amount);

        // What if the call fails?
        // Balance is already set to 0, funds lost!
    }
}
```

### Mitigation
```solidity
contract SecurePayments {
    mapping(address => uint256) public balances;

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        balances[msg.sender] = 0;

        // Check return value
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        // Or use transfer (reverts automatically, but has gas limit)
        // payable(msg.sender).transfer(amount);
    }

    // For external contract calls
    function callExternal(address target, bytes memory data) public {
        (bool success, bytes memory returnData) = target.call(data);
        require(success, "Call failed");

        // Optionally decode return data
        if (returnData.length > 0) {
            // Process return data
        }
    }
}
```

### Call Methods Comparison
| Method | Reverts on Failure? | Gas Forwarding |
|--------|---------------------|----------------|
| `transfer()` | Yes | Fixed 2300 gas |
| `send()` | No | Fixed 2300 gas |
| `call()` | No | All gas (adjustable) |

**Recommendation**: Use `call()` with return value check for maximum compatibility.

---

## 9. Default Visibility

### Description
Functions without explicit visibility modifiers default to `public`, potentially exposing sensitive functions.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableVisibility {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Missing visibility - defaults to public!
    function setOwner(address _newOwner) {
        owner = _newOwner;
    }

    // State variable with missing visibility - defaults to internal
    // But functions accessing it might not be secure
    uint256 sensitiveData;

    function updateData(uint256 _data) {
        // Defaults to public!
        sensitiveData = _data;
    }
}
```

### Mitigation
```solidity
contract SecureVisibility {
    address public owner;
    uint256 private sensitiveData;

    constructor() {
        owner = msg.sender;
    }

    // Explicit visibility
    function setOwner(address _newOwner) external {
        require(msg.sender == owner, "Unauthorized");
        owner = _newOwner;
    }

    // Explicitly private for internal logic
    function _internalLogic() private view returns (bool) {
        return sensitiveData > 0;
    }

    // Internal for derived contracts
    function _internalHelper() internal pure returns (uint256) {
        return 42;
    }
}
```

### Visibility Levels (Most to Least Restrictive)
1. `private` - Only this contract
2. `internal` - This contract and derived contracts
3. `external` - Only external calls
4. `public` - Anywhere

---

## 10. Improper Storage Management

### Description
Misunderstanding Solidity's storage layout can lead to unintended overwrites, especially when dealing with structs, arrays, and delegatecall.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Storage collision in proxy patterns
contract Proxy {
    address public implementation;
    address public admin;

    function setImplementation(address _impl) external {
        implementation = _impl; // But what if implementation overwrites admin?
    }

    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}

// If implementation has:
contract MaliciousImplementation {
    address public owner; // Same storage slot as Proxy.implementation!

    function pwn() external {
        owner = msg.sender;
    }
}
```

### Storage Layout Rules
```solidity
contract StorageLayout {
    // Slot 0
    uint256 a;        // 32 bytes

    // Slot 1 (packed)
    uint128 b;        // 16 bytes
    uint128 c;        // 16 bytes (fits in same slot)

    // Slot 2
    address d;        // 20 bytes
    bool e;           // 1 byte (packed with d)

    // Slot 3 (arrays use keccak256 for mapping)
    mapping(address => uint256) balances; // Slot 3

    // Dynamic array - length at slot 4, data at keccak256(4) + index
    uint256[] arr;    // Slot 4
}

// Example of storage collision vulnerability
contract BadProxy {
    uint256 public firstVar;   // Slot 0

    function upgrade(address newLogic) external {
        firstVar = uint256(uint160(newLogic)); // Collision!
    }
}

// Secure pattern
contract SafeProxy {
    // Reserved storage slots to prevent collision
    bytes32 private constant IMPLEMENTATION_SLOT = bytes32(uint256(keccak256('implementation')) - 1);
    bytes32 private constant ADMIN_SLOT = bytes32(uint256(keccak256('admin')) - 1);

    function setImplementation(address newImpl) external {
        bytes32 slot = IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, newImpl)
        }
    }
}
```

---

## 11. Signature Replay Attacks

### Description
Using signatures for authorization without proper nonce or chain ID checks allows attackers to replay the same signature multiple times or across chains.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableMetaTx {
    mapping(address => uint256) public balances;

    // VULNERABLE: No nonce, can be replayed
    function transferWithSig(
        address to,
        uint256 amount,
        bytes memory signature
    ) public {
        bytes32 hash = keccak256(abi.encodePacked(to, amount));
        address signer = recoverSigner(hash, signature);

        require(signer != address(0), "Invalid signature");
        balances[signer] -= amount;
        balances[to] += amount;
    }

    function recoverSigner(bytes32 hash, bytes memory sig) public pure returns (address) {
        bytes32 ethSignedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        (bytes32 r, bytes32 s, uint8 v) = splitSig(sig);
        return ecrecover(ethSignedHash, v, r, s);
    }

    function splitSig(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
```

### Mitigation
```solidity
contract SecureMetaTx {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public nonces;

    // EIP-712 typed structured data hashing
    bytes32 public constant DOMAIN_SEPARATOR = keccak256(abi.encode(
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak256("SecureMetaTx"),
        keccak256("1"),
        block.chainid,
        address(this)
    ));

    bytes32 public constant TRANSFER_TYPEHASH = keccak256("Transfer(address to,uint256 amount,uint256 nonce)");

    function transferWithSig(
        address to,
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) public {
        require(nonce == nonces[msg.sender], "Invalid nonce");

        bytes32 structHash = keccak256(abi.encode(
            TRANSFER_TYPEHASH,
            to,
            amount,
            nonce
        ));

        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            structHash
        ));

        address signer = recoverSigner(digest, signature);
        require(signer != address(0), "Invalid signature");

        nonces[signer]++;
        balances[signer] -= amount;
        balances[to] += amount;
    }

    function recoverSigner(bytes32 hash, bytes memory sig) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSig(sig);
        return ecrecover(hash, v, r, s);
    }

    function splitSig(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
```

---

## 12. Oracle Manipulation

### Description
Contracts relying on on-chain data for off-chain values (like prices) can be manipulated by flash loans that temporarily alter the data.

### Vulnerable Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapPair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

contract VulnerableLending {
    IUniswapPair public pair;

    // VULNERABLE: Spot price can be manipulated
    function getPrice() public view returns (uint256) {
        (uint112 reserve0, uint112 reserve1,) = pair.getReserves();
        return uint256(reserve1) / uint256(reserve0);
    }

    function borrow(uint256 amount) public {
        uint256 price = getPrice();
        uint256 collateral = balances[msg.sender];
        require(collateral * price >= amount, "Insufficient collateral");
        // Lend tokens...
    }
}
```

### Mitigation: TWAP Oracle
```solidity
contract SecureOracle {
    IUniswapPair public pair;
    uint256 public constant TWAP_PERIOD = 30 minutes;

    struct Observation {
        uint256 timestamp;
        uint256 price0Cumulative;
        uint256 price1Cumulative;
    }

    mapping(uint256 => Observation) public observations;

    function getTWAP() public view returns (uint256) {
        uint256 now = block.timestamp;
        Observation memory start = observations[now - TWAP_PERIOD];
        Observation memory end = observations[now];

        uint256 timeElapsed = end.timestamp - start.timestamp;
        uint256 priceCumulative = end.price0Cumulative - start.price0Cumulative;

        return priceCumulative / timeElapsed;
    }
}

// Or use Chainlink Price Feed
interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract ChainlinkPriceOracle {
    AggregatorV3Interface internal priceFeed;

    constructor(address _feed) {
        priceFeed = AggregatorV3Interface(_feed);
    }

    function getLatestPrice() public view returns (int256) {
        (
            ,
            int256 price,
            ,
            uint256 updatedAt,
        ) = priceFeed.latestRoundData();

        require(updatedAt >= block.timestamp - 1 hours, "Stale price");
        require(price > 0, "Invalid price");

        return price;
    }
}
```

### Real-World Incident
- **bZx (2020)**: $8 million lost through flash loan price manipulation
- **Harvest Finance (2020)**: $24 million stolen via oracle manipulation

---

## Summary Checklist for Secure Smart Contracts

### Pre-Deployment Checklist
- [ ] All external calls use Checks-Effects-Interactions pattern
- [ ] All functions have explicit visibility modifiers
- [ ] `msg.sender` used instead of `tx.origin` for authorization
- [ ] Return values from low-level calls are checked
- [ ] Access control properly implemented with modifiers
- [ ] No predictable randomness (use Chainlink VRF)
- [ ] Timestamp not used for critical logic
- [ ] Proper signature verification with nonces and chain ID
- [ ] TWAP or Chainlink oracle for price data
- [ ] ReentrancyGuard for functions with external calls
- [ ] Pull payment pattern instead of push
- [ ] Events emitted for all critical state changes
- [ ] Comprehensive test coverage including edge cases
- [ ] Professional audit completed

### Security Tools
- **Slither**: Static analysis
- **Mythril**: Security analysis
- **Echidna**: Fuzzing
- **Foundry Fuzz**: Property-based testing
- **OpenZeppelin Contracts**: Audited utility contracts

---

## References

1. SWC Registry: https://swcregistry.io/
2. OpenZeppelin Security Audits: https://blog.openzeppelin.com/security-audits
3. ConsenSys Smart Contract Best Practices: https://consensys.github.io/smart-contract-best-practices/
4. Rekt News (Incident Database): https://rekt.news/
5. Ethereum Smart Contract Security Best Practices: https://github.com/ethereum/wiki/wiki/Safety