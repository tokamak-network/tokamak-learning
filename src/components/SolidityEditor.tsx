"use client";

import { useRef, useCallback, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "@/components/ThemeProvider";

interface SolidityEditorProps {
  value: string;
  onChange: (value: string) => void;
  vimMode?: boolean;
}

export default function SolidityEditor({ value, onChange, vimMode = false }: SolidityEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const vimModeRef = useRef<{ dispose: () => void } | null>(null);
  const statusBarRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

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

    // Light theme — warm gray
    monaco.editor.defineTheme("solidity-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "0000ff", fontStyle: "bold" },
        { token: "type", foreground: "267f99" },
        { token: "comment", foreground: "6a9955" },
        { token: "string", foreground: "a31515" },
        { token: "number", foreground: "098658" },
        { token: "number.hex", foreground: "098658" },
        { token: "operator", foreground: "383838" },
        { token: "identifier", foreground: "001080" },
      ],
      colors: {
        "editor.background": "#f5f3f0",
        "editor.foreground": "#1a1a1a",
        "editorLineNumber.foreground": "#a8a29e",
        "editorLineNumber.activeForeground": "#1a1a1a",
        "editor.selectionBackground": "#b4d7ff",
        "editor.lineHighlightBackground": "#eae8e4",
        "editorCursor.foreground": "#2563eb",
        "editorWidget.background": "#eae8e4",
      },
    });

    const currentTheme = document.documentElement.getAttribute("data-theme");
    monaco.editor.setTheme(currentTheme === "light" ? "solidity-light" : "solidity-dark");
    editor.focus();
  }, []);

  // Switch Monaco theme when app theme changes
  useEffect(() => {
    if (!editorRef.current) return;
    import("monaco-editor").then((monaco) => {
      monaco.editor.setTheme(theme === "light" ? "solidity-light" : "solidity-dark");
    });
  }, [theme]);

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
          theme={theme === "light" ? "solidity-light" : "solidity-dark"}
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
          className="h-6 px-3 text-xs font-mono bg-[var(--color-surface)] border-t border-[var(--color-border)] text-[var(--color-muted)] flex items-center"
        />
      )}
    </div>
  );
}
