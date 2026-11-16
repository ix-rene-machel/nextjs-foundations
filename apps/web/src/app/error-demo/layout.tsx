import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { CorrelationIdProvider } from "@/components/errors/correlation-id";

// Layouts wrap this segment's error.tsx, so the boundary can read the ID from
// context. `x-request-id` is set per request by src/proxy.ts.
export default function ErrorDemoLayout({ children }: { children: ReactNode }) {
  // headers() is request-time data, so it is read behind <Suspense>.
  return (
    <Suspense fallback={<p className="p-8">Loading…</p>}>
      <WithCorrelationId>{children}</WithCorrelationId>
    </Suspense>
  );
}

async function WithCorrelationId({ children }: { children: ReactNode }) {
  const requestId = (await headers()).get("x-request-id");
  return (
    <CorrelationIdProvider id={requestId}>{children}</CorrelationIdProvider>
  );
}
