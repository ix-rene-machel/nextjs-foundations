import { headers } from "next/headers";
import type { ReactNode } from "react";
import { CorrelationIdProvider } from "@/components/errors/correlation-id";

// Layouts wrap this segment's error.tsx, so the boundary can read the ID from
// context. `x-request-id` is set per request by src/proxy.ts.
export default async function ErrorDemoLayout({
  children,
}: {
  children: ReactNode;
}) {
  const requestId = (await headers()).get("x-request-id");
  return (
    <CorrelationIdProvider id={requestId}>{children}</CorrelationIdProvider>
  );
}
