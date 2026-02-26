"use client";

interface SolidityHighlightProps {
  code: string;
  className?: string;
}

// Token types
type TokenType = 'comment' | 'string' | 'number' | 'keyword' | 'type' | 'boolean' | 'special' | 'pragma' | 'operator' | 'punctuation' | 'identifier' | 'whitespace';

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "contract", "interface", "library", "is", "function", "modifier", "event", 
  "struct", "enum", "mapping", "constructor", "fallback", "receive",
  "public", "private", "internal", "external", "pure", "view", "payable",
  "constant", "immutable", "memory", "storage", "calldata", "transient",
  "if", "else", "for", "while", "do", "break", "continue", "return", "returns",
  "require", "revert", "assert", "emit", "new", "delete", "this", "super",
  "virtual", "override", "abstract", "indexed", "anonymous", "using", "import",
  "from", "as", "error", "unchecked", "assembly", "type"
]);

const TYPES = new Set([
  "address", "bool", "string", "bytes", "byte",
  "int8", "int16", "int32", "int64", "int128", "int256",
  "uint8", "uint16", "uint32", "uint64", "uint128", "uint256",
  "bytes1", "bytes2", "bytes4", "bytes8", "bytes16", "bytes32",
  "int", "uint"
]);

const SPECIAL = new Set(['msg', 'block', 'tx', 'abi']);

const COLOR_MAP: Record<TokenType, string> = {
  comment: 'text-zinc-500',
  string: 'text-emerald-400',
  number: 'text-amber-400',
  keyword: 'text-pink-400',
  type: 'text-cyan-400',
  boolean: 'text-amber-400',
  special: 'text-orange-400',
  pragma: 'text-purple-400',
  operator: 'text-zinc-300',
  punctuation: 'text-zinc-300',
  identifier: 'text-zinc-300',
  whitespace: ''
};

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Single-line comment
    if (code.slice(i, i + 2) === '//') {
      let end = code.indexOf('\n', i);
      if (end === -1) end = code.length;
      tokens.push({ type: 'comment', value: code.slice(i, end) });
      i = end;
      continue;
    }

    // Multi-line comment
    if (code.slice(i, i + 2) === '/*') {
      let end = code.indexOf('*/', i + 2);
      if (end === -1) end = code.length;
      else end += 2;
      tokens.push({ type: 'comment', value: code.slice(i, end) });
      i = end;
      continue;
    }

    // String literal
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') {
        if (code[j] === '\\' && j + 1 < code.length) j++;
        j++;
      }
      j++; // include closing quote
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Hex number
    if (code.slice(i, i + 2).toLowerCase() === '0x') {
      let j = i + 2;
      while (j < code.length && /[0-9a-fA-F]/.test(code[j])) j++;
      tokens.push({ type: 'number', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Decimal number (with optional dots for versions like 0.8.33)
    if (/\d/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      // Check if this is a version number pattern
      const value = code.slice(i, j);
      if (/^\d+\.\d+(\.\d+)?$/.test(value)) {
        tokens.push({ type: 'number', value });
      } else if (/^\d+$/.test(value)) {
        tokens.push({ type: 'number', value });
      } else {
        tokens.push({ type: 'number', value });
      }
      i = j;
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const value = code.slice(i, j);

      // Pragma
      if (value === 'pragma') {
        // Look ahead for 'solidity'
        let k = j;
        while (k < code.length && /\s/.test(code[k])) k++;
        if (code.slice(k, k + 8) === 'solidity') {
          // Find semicolon
          let semi = code.indexOf(';', k);
          if (semi !== -1) {
            tokens.push({ type: 'pragma', value: 'pragma solidity' });
            // Add whitespace
            let ws = '';
            while (j < k) { ws += code[j]; j++; }
            if (ws) tokens.push({ type: 'whitespace', value: ws });
            // Add version
            let verStart = k + 8;
            while (verStart < semi && /\s/.test(code[verStart])) verStart++;
            const version = code.slice(verStart, semi).trim();
            if (version) tokens.push({ type: 'whitespace', value: ' ' });
            if (version) tokens.push({ type: 'number', value: version });
            tokens.push({ type: 'punctuation', value: ';' });
            i = semi + 1;
            continue;
          }
        }
      }

      // Keyword
      if (KEYWORDS.has(value)) {
        tokens.push({ type: 'keyword', value });
      }
      // Type
      else if (TYPES.has(value)) {
        tokens.push({ type: 'type', value });
      }
      // Boolean
      else if (value === 'true' || value === 'false') {
        tokens.push({ type: 'boolean', value });
      }
      // Special (msg, block, tx, abi)
      else if (SPECIAL.has(value)) {
        tokens.push({ type: 'special', value });
      }
      // Regular identifier
      else {
        tokens.push({ type: 'identifier', value });
      }
      i = j;
      continue;
    }

    // Whitespace
    if (/\s/.test(code[i])) {
      let j = i;
      while (j < code.length && /\s/.test(code[j])) j++;
      tokens.push({ type: 'whitespace', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Operators and punctuation
    const char = code[i];
    if ('{}[]();,.:'.includes(char)) {
      tokens.push({ type: 'punctuation', value: char });
      i++;
      continue;
    }

    if ('=+-*/%<>!&|^~'.includes(char)) {
      let j = i;
      while (j < code.length && '=+-*/%<>!&|^~'.includes(code[j])) j++;
      tokens.push({ type: 'operator', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Default: treat as identifier character
    tokens.push({ type: 'identifier', value: char });
    i++;
  }

  return tokens;
}

function processDotAccess(tokens: Token[]): Token[] {
  const result: Token[] = [];
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Check for dot followed by identifier
    if (token.type === 'punctuation' && token.value === '.' && i + 1 < tokens.length) {
      const next = tokens[i + 1];
      if (next.type === 'identifier') {
        // Convert the identifier to 'special' type
        result.push(token);
        result.push({ type: 'special', value: next.value });
        i++; // Skip the next token since we handled it
        continue;
      }
    }
    
    result.push(token);
  }
  
  return result;
}

function tokensToHtml(tokens: Token[]): string {
  let html = '';
  
  for (const token of tokens) {
    const escaped = token.value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    if (token.type === 'whitespace') {
      html += escaped;
    } else {
      const color = COLOR_MAP[token.type] || 'text-zinc-300';
      html += `<span class="${color}">${escaped}</span>`;
    }
  }
  
  return html;
}

export default function SolidityHighlight({ code, className = "" }: SolidityHighlightProps) {
  let tokens = tokenize(code);
  tokens = processDotAccess(tokens);
  const html = tokensToHtml(tokens);

  return (
    <code 
      className={`font-mono ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}