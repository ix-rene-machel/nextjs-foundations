import Link from "next/link";
import { connection } from "next/server";
import { NavigationButtons } from "./navigation-buttons";

export default async function NavDemoPage() {
  // Opt out of prerendering: the timestamp below must be request-time.
  await connection();

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="font-bold text-3xl">Navigation Demo</h1>

      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-semibold text-xl">
          Soft navigation with Link
        </h2>
        <p className="mb-4 text-gray-600 text-sm">
          These links use next/link: client-side transitions, no full reload.
        </p>
        <nav className="flex gap-4">
          <Link
            href="/nav-demo/page-a"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Page A
          </Link>
          <Link
            href="/nav-demo/page-b"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Page B
          </Link>
        </nav>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-semibold text-xl">Hard navigation (avoid)</h2>
        <p className="mb-4 text-gray-600 text-sm">
          A plain anchor triggers a full page reload.
        </p>
        {/* Intentional plain <a>: this is the hard-navigation comparison */}
        <a
          href="/nav-demo/page-a"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Hard nav to Page A
        </a>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-semibold text-xl">Programmatic navigation</h2>
        <p className="mb-4 text-gray-600 text-sm">
          useRouter runs from event handlers (Client Component).
        </p>
        <NavigationButtons />
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-semibold text-xl">
          Form state across navigation
        </h2>
        <p className="mb-4 text-gray-600 text-sm">
          Type in the form, go to Page A and back with the browser. Soft
          navigation keeps the form state of the layout; a hard navigation
          clears it.
        </p>
        <Link
          href="/nav-demo/form-demo"
          className="text-blue-600 hover:underline"
        >
          Open the form demo →
        </Link>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-semibold text-xl">Server-side redirect</h2>
        <p className="mb-4 text-gray-600 text-sm">
          redirect() runs on the server: an unauthenticated visitor is sent away
          before the page renders.
        </p>
        <Link
          href="/nav-demo/redirect-demo"
          className="text-blue-600 hover:underline"
        >
          Open the redirect demo →
        </Link>
      </section>

      <p className="text-gray-500 text-sm">
        Rendered at {new Date().toISOString()}
      </p>
    </main>
  );
}
