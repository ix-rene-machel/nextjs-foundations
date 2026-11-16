// No 'use client' - this is a Server Component by default
// Data fetching and heavy logic stays here on the server

import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Counter } from "@/components/counter";

// Simulated server-side data. Cache Components forbids reading the clock in the
// static shell, so it is a short-lived cached value behind <Suspense>.
async function ServerTimestamp() {
  "use cache";
  cacheLife("seconds");
  return <code className="font-mono text-xs">{new Date().toISOString()}</code>;
}

export default function CounterDemoPage() {
  return (
    <main className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Server/Client Boundary Demo</h1>
        <p className="mt-2 text-muted-foreground">
          This page is a Server Component. The counter below is a Client
          Component.
        </p>
      </div>

      {/* Server-rendered content (no JS) */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Server-Rendered Content</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Generated at:{" "}
          <Suspense fallback={<code className="font-mono text-xs">…</code>}>
            <ServerTimestamp />
          </Suspense>
        </p>
        <p className="mt-1 text-muted-foreground text-sm">
          This content ships as HTML with zero JavaScript.
        </p>
      </section>

      {/* Client Component - interactive widget */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">
          Client Component (Interactive)
        </h2>
        <p className="mb-4 text-muted-foreground text-sm">
          Only this counter component ships JavaScript to the browser.
        </p>
        <Counter initialCount={0} />
      </section>

      {/* Decision documentation */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Decision Rationale</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground text-sm">
          <li>
            <strong>Page (Server):</strong> Fetches data, renders static
            content, no interactivity needed
          </li>
          <li>
            <strong>Counter (Client):</strong> Uses useState hook, handles
            onClick events
          </li>
        </ul>
      </section>
    </main>
  );
}
