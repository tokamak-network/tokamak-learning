"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const shortcuts = [
  {
    group: "General",
    items: [
      { keys: ["/"], description: "Keyboard shortcuts" },
    ],
  },
  {
    group: "Editor (Problem page)",
    items: [
      { keys: ["⌘", "Enter"], description: "Run tests" },
      { keys: ["⌘", "⇧", "H"], description: "Toggle hints" },
      { keys: ["⌘", "⇧", "S"], description: "Toggle solution" },
    ],
  },
];

export default function ShortcutHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with "/" key (ignore in input fields)
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement)?.closest?.(".monaco-editor")
      ) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Close with Escape
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-background)] border border-[var(--color-border)]">
                    ESC
                  </span>
                </button>
              </div>

              {/* Shortcut groups */}
              <div className="px-5 py-4 space-y-5">
                {shortcuts.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wider mb-2.5">
                      {group.group}
                    </h3>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <div
                          key={item.description}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-[var(--color-foreground)]">
                            {item.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, i) => (
                              <span key={i}>
                                <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[11px] font-medium text-[var(--color-muted)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-md shadow-[0_1px_0_var(--color-border)]">
                                  {key}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-background)]/50">
                <p className="text-[11px] text-[var(--color-muted)] text-center">
                  Use Ctrl instead of ⌘ on Windows/Linux
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
