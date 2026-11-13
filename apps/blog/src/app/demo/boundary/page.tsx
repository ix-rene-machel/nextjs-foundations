// Server Component - demonstrates boundary pattern in blog app

import { Counter } from '@/components/counter';

export default function BoundaryDemoPage() {
  return (
    <main className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Blog App: Boundary Demo</h1>
        <p className="mt-2 text-muted-foreground">
          Same pattern works across all apps in the monorepo.
        </p>
      </div>

      {/* Server-rendered content */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Server Content</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          This article preview renders server-side with zero JavaScript.
        </p>
      </section>

      {/* Client Component - reused from web app pattern */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Interactive Widget</h2>
        <Counter initialCount={10} />
      </section>
    </main>
  );
}
