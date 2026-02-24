// src/lib/error-utils.ts

export function parseTevmError(error: unknown): string {
  if (typeof error === "string") return error;

  if (error instanceof Error) {
    const msg = error.message;

    if (msg.includes("revert")) {
      const match = msg.match(/revert(?:ed)?\s*(?:with\s+(?:reason\s+)?['"]?([^'"]+)['"]?)?/i);
      if (match && match[1]) {
        return `Reverted: ${match[1]}`;
      }
      return "Transaction reverted";
    }

    if (msg.includes("out of gas")) {
      return "Out of gas";
    }

    if (msg.includes("invalid opcode")) {
      return "Invalid opcode - contract crashed";
    }

    if (msg.includes("stack overflow")) {
      return "Stack overflow - likely deep recursion";
    }

    if (msg.includes("stack underflow")) {
      return "Stack underflow - execution error";
    }

    if (msg.includes("invalid jump")) {
      return "Invalid jump - bad function selector or corrupted bytecode";
    }

    return msg;
  }

  return "Unknown error";
}

export function formatGasUsed(gas: bigint): string {
  return `${gas.toLocaleString()} gas`;
}

export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}