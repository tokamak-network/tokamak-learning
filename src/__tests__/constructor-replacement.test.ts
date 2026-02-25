import { describe, it, expect } from "vitest";

describe("Constructor Replacement", () => {
  // Implementation matching VulnerabilityClient.tsx
  function injectTargetAddress(code: string, targetAddress: string): string {
    // Handle empty constructor: constructor() {} or constructor() { }
    let updated = code.replace(
      /constructor\s*\(\s*\)\s*\{\s*\}/g,
      `constructor() {\n        // Target deployed at: ${targetAddress}\n    }`
    );
    
    // Handle empty constructor with address param: constructor(address _target) {} or { }
    // Use a more specific pattern to avoid matching braces with content
    updated = updated.replace(
      /constructor\s*\(\s*address\s+_target\s*\)\s*\{\s*\}/g,
      `constructor(address _target) {\n        // Target address: ${targetAddress}\n        // Use: target = Interface(${targetAddress});\n    }`
    );
    
    // Handle constructor with existing body starting with whitespace/newline
    // Pattern matches opening brace followed by whitespace then non-whitespace (actual code)
    updated = updated.replace(
      /constructor\s*\(\s*address\s+_target\s*\)\s*\{(\s+)([^\s\\/])/g,
      (match, whitespace, nextChar) => {
        return `constructor(address _target) {\n        // Target address: ${targetAddress}\n${whitespace}${nextChar}`;
      }
    );
    
    return updated;
  }

  const targetAddress = "0x8720B704373dd16ef7913c7775369aDE448cdDb7";

  it("should handle empty constructor", () => {
    const originalCode = `contract Exploit {
    constructor() {}
    
    function attack() external pure {}
}`;

    const result = injectTargetAddress(originalCode, targetAddress);
    console.log("Result:");
    console.log(result);

    // Should have proper structure with comment
    expect(result).toContain(`constructor() {`);
    expect(result).toContain(`// Target deployed at: ${targetAddress}`);
    expect(result).not.toContain(`{} }`);  // No broken braces
    
    // Count braces - should be balanced
    const opens = (result.match(/{/g) || []).length;
    const closes = (result.match(/}/g) || []).length;
    expect(opens).toBe(closes);
  });

  it("should handle empty constructor with address parameter", () => {
    const originalCode = `contract Exploit {
    constructor(address _target) {}
    
    function attack() external pure {}
}`;

    const result = injectTargetAddress(originalCode, targetAddress);
    console.log("Result with address param:");
    console.log(result);

    expect(result).toContain(`constructor(address _target)`);
    expect(result).toContain(`// Target address: ${targetAddress}`);
    
    // Should NOT have duplicate comments
    const matchCount = (result.match(/\/\/ Target address:/g) || []).length;
    expect(matchCount).toBe(1);
    
    // Count braces - should be balanced
    const opens = (result.match(/{/g) || []).length;
    const closes = (result.match(/}/g) || []).length;
    expect(opens).toBe(closes);
  });

  it("should handle constructor with existing body", () => {
    const originalCode = `contract Exploit {
    constructor(address _target) {
        target = IDonationPool(_target);
    }
    
    function attack() external pure {}
}`;

    const result = injectTargetAddress(originalCode, targetAddress);
    console.log("Result with existing body:");
    console.log(result);

    // Should preserve the existing body
    expect(result).toContain(`target = IDonationPool(_target)`);
    expect(result).toContain(`// Target address: ${targetAddress}`);
    
    // Count braces - should be balanced
    const opens = (result.match(/{/g) || []).length;
    const closes = (result.match(/}/g) || []).length;
    expect(opens).toBe(closes);
  });

  it("should preserve full code structure", () => {
    const originalCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exploit {
    constructor() {}
    
    function attack() external pure {
        // attack code
    }
}`;

    const result = injectTargetAddress(originalCode, targetAddress);
    console.log("Full code after replacement:");
    console.log(result);

    // Should compile - check structure
    const lines = result.split("\n");
    const constructorLineIndex = lines.findIndex(l => l.includes("constructor()"));
    
    expect(constructorLineIndex).toBeGreaterThanOrEqual(0);
    expect(lines[constructorLineIndex + 1]).toContain("// Target deployed at:");
    expect(lines[constructorLineIndex + 2]?.trim()).toBe("}");
    
    // SPDX should be preserved
    expect(result).toContain("SPDX-License-Identifier");
    expect(result).toContain("pragma solidity");
  });
});