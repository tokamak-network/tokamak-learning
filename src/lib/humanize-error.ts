/**
 * Rewrite cryptic solc errors into beginner-friendly messages.
 * Falls back to the original error if no pattern matches.
 */
export function humanizeError(error: string, source: string): string {
  // console.log used outside a function/constructor
  if (
    error.includes("Expected identifier but got") &&
    source.includes("console.log")
  ) {
    // Check if console.log appears at contract body level (outside function/constructor)
    const lines = source.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("console.log")) {
        return (
          'console.log() must be inside a function or constructor.\n\n' +
          'Example:\n' +
          '  constructor() {\n' +
          '      console.log("hello");\n' +
          '  }'
        );
      }
    }
  }

  return error;
}
