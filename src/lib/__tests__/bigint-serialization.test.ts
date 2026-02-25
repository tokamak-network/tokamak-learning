import { describe, it, expect } from "vitest";

/**
 * BigInt 직렬화 문제 테스트
 * 
 * 문제: viem의 decodeFunctionResult는 uint256을 BigInt로 반환합니다.
 * JSON.stringify는 BigInt를 직렬화할 수 없어 에러가 발생합니다.
 * 
 * 에러 메시지: "Do not know how to serialize a BigInt"
 */

describe("BigInt Serialization Issue", () => {
  it("should demonstrate JSON.stringify cannot handle BigInt", () => {
    const dataWithBigInt = {
      success: true,
      data: BigInt(123),  // This is what decodeFunctionResult returns for uint256
    };

    // This will throw: "TypeError: Do not know how to serialize a BigInt"
    expect(() => JSON.stringify(dataWithBigInt)).toThrow();
  });

  it("should demonstrate JSON.stringify works with converted BigInt", () => {
    const dataWithBigInt = {
      success: true,
      data: BigInt(123).toString(),  // Convert to string
    };

    // This should work
    const serialized = JSON.stringify(dataWithBigInt);
    expect(serialized).toBe('{"success":true,"data":"123"}');
  });

  it("should handle nested BigInt in arrays", () => {
    const dataWithBigIntArray = {
      success: true,
      data: [BigInt(1), BigInt(2), BigInt(3)],
    };

    expect(() => JSON.stringify(dataWithBigIntArray)).toThrow();
  });

  it("should handle deep object with BigInt", () => {
    const dataWithDeepBigInt = {
      success: true,
      data: {
        value: BigInt(999),
        nested: {
          amount: BigInt(1000),
        },
      },
    };

    expect(() => JSON.stringify(dataWithDeepBigInt)).toThrow();
  });
});

describe("BigInt Serialization Solution", () => {
  // Helper function to convert BigInt to string recursively
  function serializeBigInt(data: unknown): unknown {
    if (typeof data === "bigint") {
      return data.toString();
    }
    if (Array.isArray(data)) {
      return data.map(serializeBigInt);
    }
    if (data !== null && typeof data === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = serializeBigInt(value);
      }
      return result;
    }
    return data;
  }

  it("should convert BigInt to string for serialization", () => {
    const input = {
      success: true,
      data: BigInt(123),
    };

    const serialized = serializeBigInt(input);
    expect(() => JSON.stringify(serialized)).not.toThrow();
    expect(JSON.stringify(serialized)).toBe('{"success":true,"data":"123"}');
  });

  it("should handle nested BigInt in arrays", () => {
    const input = {
      success: true,
      data: [BigInt(1), BigInt(2), BigInt(3)],
    };

    const serialized = serializeBigInt(input);
    expect(() => JSON.stringify(serialized)).not.toThrow();
    expect(JSON.stringify(serialized)).toBe('{"success":true,"data":["1","2","3"]}');
  });

  it("should handle deep object with BigInt", () => {
    const input = {
      success: true,
      data: {
        value: BigInt(999),
        nested: {
          amount: BigInt(1000),
        },
      },
    };

    const serialized = serializeBigInt(input);
    expect(() => JSON.stringify(serialized)).not.toThrow();
    const parsed = JSON.parse(JSON.stringify(serialized));
    expect(parsed.data.value).toBe("999");
    expect(parsed.data.nested.amount).toBe("1000");
  });

  it("should handle mixed types", () => {
    const input = {
      success: true,
      data: {
        bigint: BigInt(123),
        string: "hello",
        number: 42,
        boolean: true,
        null: null,
        array: [BigInt(1), "test", 42],
      },
    };

    const serialized = serializeBigInt(input);
    expect(() => JSON.stringify(serialized)).not.toThrow();
    const parsed = JSON.parse(JSON.stringify(serialized));
    expect(parsed.data.bigint).toBe("123");
    expect(parsed.data.string).toBe("hello");
    expect(parsed.data.number).toBe(42);
    expect(parsed.data.boolean).toBe(true);
    expect(parsed.data.null).toBe(null);
    expect(parsed.data.array).toEqual(["1", "test", 42]);
  });

  it("should handle address type (string, not BigInt)", () => {
    const input = {
      success: true,
      data: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    };

    const serialized = serializeBigInt(input);
    expect(() => JSON.stringify(serialized)).not.toThrow();
    expect(JSON.parse(JSON.stringify(serialized)).data).toBe(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });
});