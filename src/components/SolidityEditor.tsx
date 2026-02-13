"use client";

import { useRef, useCallback, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface SolidityEditorProps {
  value: string;
  onChange: (value: string) => void;
  vimMode?: boolean;
}

export default function SolidityEditor({ value, onChange, vimMode = false }: SolidityEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const vimModeRef = useRef<{ dispose: () => void } | null>(null);
  const statusBarRef = useRef<HTMLDivElement | null>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Register Solidity language
    monaco.languages.register({ id: "sol" });
    monaco.languages.setMonarchTokensProvider("sol", {
      keywords: [
        "pragma", "solidity", "contract", "interface", "library", "is",
        "function", "modifier", "event", "struct", "enum", "mapping",
        "address", "bool", "string", "bytes", "byte",
        "int", "uint", "int8", "int16", "int32", "int64", "int128", "int256",
        "uint8", "uint16", "uint32", "uint64", "uint128", "uint256",
        "bytes1", "bytes2", "bytes4", "bytes8", "bytes16", "bytes32",
        "fixed", "ufixed",
        "public", "private", "internal", "external",
        "pure", "view", "payable", "constant", "immutable",
        "memory", "storage", "calldata",
        "if", "else", "for", "while", "do", "break", "continue",
        "return", "returns", "require", "revert", "assert", "emit",
        "new", "delete", "this", "super",
        "constructor", "fallback", "receive",
        "virtual", "override", "abstract", "indexed", "anonymous",
        "using", "import", "from", "as", "error", "unchecked",
        "assembly", "type",
      ],
      typeKeywords: ["true", "false", "wei", "gwei", "ether", "seconds", "minutes", "hours", "days", "weeks"],
      operators: [
        "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=",
        "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^",
        "%", "<<", ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=",
        "^=", "%=", "<<=", ">>=", ">>>=", "**",
      ],
      symbols: /[=><!~?:&|+\-*/^%]+/,
      tokenizer: {
        root: [
          [/\/\/.*$/, "comment"],
          [/\/\*/, "comment", "@comment"],
          [/SPDX-License-Identifier:.*$/, "comment"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string"],
          [/'[^']*'/, "string"],
          [/0[xX][0-9a-fA-F]+/, "number.hex"],
          [/\d+/, "number"],
          [
            /[a-zA-Z_$][\w$]*/,
            {
              cases: {
                "@keywords": "keyword",
                "@typeKeywords": "type",
                "@default": "identifier",
              },
            },
          ],
          [/[{}()[\]]/, "@brackets"],
          [
            /@symbols/,
            {
              cases: {
                "@operators": "operator",
                "@default": "",
              },
            },
          ],
          [/[;,.]/, "delimiter"],
        ],
        comment: [
          [/[^/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[/*]/, "comment"],
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, "string", "@pop"],
        ],
      },
    });

    // Dark theme
    monaco.editor.defineTheme("solidity-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "569cd6", fontStyle: "bold" },
        { token: "type", foreground: "4ec9b0" },
        { token: "comment", foreground: "6a9955" },
        { token: "string", foreground: "ce9178" },
        { token: "number", foreground: "b5cea8" },
        { token: "number.hex", foreground: "b5cea8" },
        { token: "operator", foreground: "d4d4d4" },
        { token: "identifier", foreground: "9cdcfe" },
      ],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#e6edf3",
        "editorLineNumber.foreground": "#484f58",
        "editorLineNumber.activeForeground": "#e6edf3",
        "editor.selectionBackground": "#264f78",
        "editor.lineHighlightBackground": "#161b22",
        "editorCursor.foreground": "#58a6ff",
        "editorWidget.background": "#161b22",
      },
    });

    monaco.editor.setTheme("solidity-dark");
    editor.focus();
  }, []);

  // VIM mode toggle
  useEffect(() => {
    if (!editorRef.current) return;

    if (vimMode) {
      // Dynamically import monaco-vim
      import("monaco-vim").then((MonacoVim) => {
        if (!editorRef.current || !statusBarRef.current) return;
        // Dispose existing if any
        if (vimModeRef.current) {
          vimModeRef.current.dispose();
        }
        vimModeRef.current = MonacoVim.initVimMode(editorRef.current, statusBarRef.current);
      });
    } else {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    }

    return () => {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    };
  }, [vimMode]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Editor
          height="100%"
          language="sol"
          theme="solidity-dark"
          value={value}
          onChange={(v) => onChange(v || "")}
          onMount={handleMount}
          options={{
            fontSize: 14,
            fontFamily: "var(--font-geist-mono), monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
            insertSpaces: true,
            automaticLayout: true,
            padding: { top: 16 },
            lineNumbers: "on",
            renderLineHighlight: "line",
            folding: true,
            bracketPairColorization: { enabled: true },
            suggest: { showWords: false },
          }}
        />
      </div>
      {vimMode && (
        <div
          ref={statusBarRef}
          className="h-6 px-3 text-xs font-mono bg-[#161b22] border-t border-[var(--color-border)] text-[var(--color-muted)] flex items-center"
        />
      )}
    </div>
  );
}
