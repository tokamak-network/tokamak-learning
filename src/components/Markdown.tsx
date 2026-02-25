"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for code blocks
          pre: ({ children }) => (
            <pre className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 overflow-x-auto">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-[var(--color-accent)]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Custom table styling
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-[var(--color-border)] rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--color-surface)]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left border-b border-[var(--color-border)] font-semibold text-[var(--color-foreground)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-[var(--color-border)] border-r last:border-r-0 text-[var(--color-foreground)]">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-[var(--color-border)] last:border-b-0">
              {children}
            </tr>
          ),
          // Custom heading styling
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-[var(--color-foreground)] mt-6 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-[var(--color-foreground)] mt-5 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mt-4 mb-2">
              {children}
            </h3>
          ),
          // Custom list styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 text-[var(--color-foreground)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 text-[var(--color-foreground)]">
              {children}
            </ol>
          ),
          // Custom paragraph styling
          p: ({ children }) => (
            <p className="text-[var(--color-foreground)] leading-relaxed mb-3">
              {children}
            </p>
          ),
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[var(--color-accent)] pl-4 italic text-[var(--color-muted)]">
              {children}
            </blockquote>
          ),
          // Custom link styling
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}