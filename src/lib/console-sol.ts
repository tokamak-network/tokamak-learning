import { ethers } from "ethers";

export const CONSOLE_ADDRESS = "0x000000000000000000636f6e736f6c652e6c6f67";
export const CONSOLE_ADDRESS_LOWER = CONSOLE_ADDRESS.toLowerCase();

export const CONSOLE_SOL = `// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library console {
    address constant CONSOLE_ADDRESS = address(0x000000000000000000636F6e736F6c652e6c6f67);

    function _sendLogPayload(bytes memory payload) private view {
        address consoleAddress = CONSOLE_ADDRESS;
        assembly {
            pop(staticcall(gas(), consoleAddress, add(payload, 32), mload(payload), 0, 0))
        }
    }

    function log() internal view { _sendLogPayload(abi.encodeWithSignature("log()")); }
    function log(string memory p0) internal view { _sendLogPayload(abi.encodeWithSignature("log(string)", p0)); }
    function log(uint256 p0) internal view { _sendLogPayload(abi.encodeWithSignature("log(uint256)", p0)); }
    function log(int256 p0) internal view { _sendLogPayload(abi.encodeWithSignature("log(int256)", p0)); }
    function log(bool p0) internal view { _sendLogPayload(abi.encodeWithSignature("log(bool)", p0)); }
    function log(address p0) internal view { _sendLogPayload(abi.encodeWithSignature("log(address)", p0)); }
    function log(string memory p0, string memory p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,string)", p0, p1)); }
    function log(string memory p0, uint256 p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,uint256)", p0, p1)); }
    function log(string memory p0, int256 p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,int256)", p0, p1)); }
    function log(string memory p0, bool p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,bool)", p0, p1)); }
    function log(string memory p0, address p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,address)", p0, p1)); }
    function log(uint256 p0, uint256 p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256)", p0, p1)); }
    function log(uint256 p0, string memory p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(uint256,string)", p0, p1)); }
    function log(address p0, string memory p1) internal view { _sendLogPayload(abi.encodeWithSignature("log(address,string)", p0, p1)); }
    function log(string memory p0, string memory p1, string memory p2) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,string,string)", p0, p1, p2)); }
    function log(string memory p0, uint256 p1, uint256 p2) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,uint256,uint256)", p0, p1, p2)); }
    function log(string memory p0, string memory p1, uint256 p2) internal view { _sendLogPayload(abi.encodeWithSignature("log(string,string,uint256)", p0, p1, p2)); }
    function logBytes(bytes memory p0) internal view { _sendLogPayload(abi.encodeWithSignature("log(bytes)", p0)); }
    function logBytes32(bytes32 p0) internal view { _sendLogPayload(abi.encodeWithSignature("log(bytes32)", p0)); }
}`;

const CONSOLE_ABI = [
  "function log()",
  "function log(string)",
  "function log(uint256)",
  "function log(int256)",
  "function log(bool)",
  "function log(address)",
  "function log(string, string)",
  "function log(string, uint256)",
  "function log(string, int256)",
  "function log(string, bool)",
  "function log(string, address)",
  "function log(uint256, uint256)",
  "function log(uint256, string)",
  "function log(address, string)",
  "function log(string, string, string)",
  "function log(string, uint256, uint256)",
  "function log(string, string, uint256)",
  "function log(bytes)",
  "function log(bytes32)",
];

const consoleIface = new ethers.Interface(CONSOLE_ABI);

/** Auto-inject `import "hardhat/console.sol"` when source uses console.log */
export function injectConsoleImport(source: string): string {
  if (!source.includes("console.log")) return source;
  if (source.includes('"hardhat/console.sol"') || source.includes("'hardhat/console.sol'")) return source;

  // Insert after pragma line
  const pragmaMatch = source.match(/pragma solidity[^;]+;/);
  if (pragmaMatch) {
    return source.replace(pragmaMatch[0], pragmaMatch[0] + '\nimport "hardhat/console.sol";');
  }
  return 'import "hardhat/console.sol";\n' + source;
}

export function decodeConsoleLog(data: Uint8Array): string | null {
  try {
    const hexData = "0x" + Buffer.from(data).toString("hex");
    if (hexData.length < 10) return null;
    const result = consoleIface.parseTransaction({ data: hexData, value: BigInt(0) });
    if (!result) return null;
    if (result.args.length === 0) return "";
    return result.args.map((v: unknown) => String(v)).join(" ");
  } catch {
    return null;
  }
}

/**
 * Create an onBeforeMessage handler that captures console.log calls
 * This is more reliable than onStep because it receives the full message data directly
 */
export function createConsoleLogCapture() {
  const capturedLogs: string[] = [];

  return {
    logs: capturedLogs,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBeforeMessage: (message: any, next?: () => void) => {
      // Check if this is a call to the console address
      if (message.to) {
        const toLower = typeof message.to === "string" 
          ? message.to.toLowerCase() 
          : String(message.to).toLowerCase();
        
        if (toLower === CONSOLE_ADDRESS_LOWER) {
          // Decode the console log data
          const decoded = decodeConsoleLog(message.data);
          if (decoded !== null) {
            capturedLogs.push(decoded);
          }
        }
      }
      next?.();
    },
    getLogs: () => [...capturedLogs],
  };
}
