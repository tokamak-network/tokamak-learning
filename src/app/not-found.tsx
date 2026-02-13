import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-[var(--color-accent)] mb-4">
          404
        </h1>
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
          Page Not Found
        </h2>
        <p className="text-[var(--color-muted)] mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-[var(--shadow-glow-strong)] transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
