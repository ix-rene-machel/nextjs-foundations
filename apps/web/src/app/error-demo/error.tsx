"use client";

// Nested error boundary for /error-demo: contextual UI, correlation ID, Retry.

import { useEffect } from "react";
import { useCorrelationId } from "@/components/errors/correlation-id";

export default function ErrorDemoBoundary({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const correlationId = useCorrelationId();

  // Server Component errors arrive as Error instances. Client code can throw anything.
  const message = error instanceof Error ? error.message : String(error);
  const digest =
    error instanceof Error && "digest" in error
      ? String(error.digest)
      : undefined;

  useEffect(() => {
    // In production: send to Sentry/Datadog/etc. The same ID is in the proxy log.
    console.error("Error demo boundary caught:", {
      correlationId,
      digest,
      message,
      timestamp: new Date().toISOString(),
      location: "/error-demo",
    });
  }, [correlationId, digest, message]);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-6">
        <h2 className="mb-2 font-bold text-orange-800 text-xl">
          Demo Error Caught!
        </h2>
        <p className="mb-4 text-orange-700">
          This error was caught by the nested error boundary in /error-demo.
        </p>
        <p className="mb-4 font-mono text-orange-600 text-sm">{message}</p>
        <p className="mb-1 font-mono text-orange-400 text-xs">
          Correlation ID: {correlationId}
        </p>
        {digest && (
          <p className="mb-4 font-mono text-orange-400 text-xs">
            Digest: {digest}
          </p>
        )}
        <div className="mt-4 flex gap-3">
          {/* retry() re-fetches and re-renders the segment (no full reload) */}
          <button
            type="button"
            onClick={() => retry()}
            className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            Try Again
          </button>
          <a
            href="/error-demo"
            className="rounded border border-orange-600 px-4 py-2 text-orange-600 hover:bg-orange-100"
          >
            Reload Page
          </a>
        </div>
      </div>
    </div>
  );
}
