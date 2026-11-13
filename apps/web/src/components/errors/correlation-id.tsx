"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

const CorrelationIdContext = createContext<string | null>(null);

/**
 * Holds the request's correlation ID (the proxy's `x-request-id`) so client
 * error boundaries can show and log the same ID the server logged.
 */
export function CorrelationIdProvider({
  id,
  children,
}: {
  id: string | null;
  children: ReactNode;
}) {
  return (
    <CorrelationIdContext.Provider value={id}>
      {children}
    </CorrelationIdContext.Provider>
  );
}

function fallbackId(): string {
  return `client-${crypto.randomUUID()}`;
}

/** The request's correlation ID, or a stable client-generated one if missing. */
export function useCorrelationId(): string {
  const id = useContext(CorrelationIdContext);
  const [fallback] = useState(fallbackId);
  return id ?? fallback;
}
