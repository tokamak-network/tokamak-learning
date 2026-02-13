"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-[var(--color-danger)] mb-4">
          Oops
        </h1>
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
          Something went wrong
        </h2>
        <p className="text-[var(--color-muted)] mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-[var(--shadow-glow-strong)] transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
