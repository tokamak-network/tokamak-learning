"use client";

import { useMemo } from "react";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseMarkdown(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, _lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Paragraphs
  const lines = html.split("\n");
  const result: string[] = [];
  let inPre = false;

  for (const line of lines) {
    if (line.includes("<pre>")) inPre = true;
    if (line.includes("</pre>")) {
      inPre = false;
      result.push(line);
      continue;
    }
    if (inPre) {
      result.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (
      trimmed === "" ||
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<ul") ||
      trimmed.startsWith("<ol") ||
      trimmed.startsWith("<li") ||
      trimmed.startsWith("<pre") ||
      trimmed.startsWith("<block") ||
      trimmed.startsWith("</")
    ) {
      result.push(line);
    } else {
      result.push(`<p>${line}</p>`);
    }
  }

  return result.join("\n");
}

export default function Markdown({ content }: { content: string }) {
  const html = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div
      className="prose-dark"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
