import Link from "next/link";
import { GranularDemo } from "@/components/errors/granular-demo";

export default function GranularErrorPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <Link
        href="/error-demo"
        className="text-blue-600 text-sm hover:underline"
      >
        ← Back to error demo
      </Link>
      <h1 className="font-bold text-3xl">Granular Error Recovery</h1>
      <ul className="list-inside list-disc text-muted-foreground text-sm">
        <li>
          Level 1 (component): a widget fails alone; siblings and form keep
          working.
        </li>
        <li>
          Level 2 (segment): &quot;Crash whole page&quot; is caught by
          app/error-demo/error.tsx.
        </li>
        <li>Level 3 (root): anything else falls back to app/error.tsx.</li>
      </ul>
      <GranularDemo />
    </main>
  );
}
