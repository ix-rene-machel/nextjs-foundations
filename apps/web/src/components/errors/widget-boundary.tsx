"use client";

import { catchError, type ErrorInfo } from "next/error";
import { useEffect } from "react";
import { useCorrelationId } from "./correlation-id";

type WidgetBoundaryProps = {
  name: string;
  /** Clear the failure cause (e.g. parent state) before re-rendering. */
  onRecover?: () => void;
};

function WidgetErrorPanel({
  name,
  error,
  onRetry,
}: {
  name: string;
  error: unknown;
  onRetry: () => void;
}) {
  const correlationId = useCorrelationId();
  const message = error instanceof Error ? error.message : String(error);

  useEffect(() => {
    console.error(`[${name}] widget boundary caught:`, {
      correlationId,
      message,
    });
  }, [name, correlationId, message]);

  return (
    <div
      role="alert"
      className="rounded border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm"
    >
      <p className="font-semibold">{name} unavailable</p>
      <p className="mt-1 font-mono text-xs">{message}</p>
      <p className="mt-1 font-mono text-amber-600 text-xs">
        Correlation ID: {correlationId}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded bg-amber-600 px-3 py-1 text-white hover:bg-amber-700"
      >
        Retry {name}
      </button>
    </div>
  );
}

// `catchError` calls this as a plain function (props, errorInfo), not as a
// component, so it must not use hooks itself. It renders a real component.
function widgetFallback(
  { name, onRecover }: WidgetBoundaryProps,
  { error, retry }: ErrorInfo
) {
  return (
    <WidgetErrorPanel
      name={name}
      error={error}
      onRetry={() => {
        onRecover?.();
        retry();
      }}
    />
  );
}

/**
 * Component-level boundary (Next's `catchError`): isolates one widget so a
 * failure there doesn't take down the segment. `notFound()`/`redirect()`
 * still pass through to the framework.
 */
export const WidgetBoundary = catchError(widgetFallback);
