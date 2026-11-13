import Link from "next/link";

export default async function ErrorDemoPage(props: {
  searchParams: Promise<{ throw?: string }>;
}) {
  const searchParams = await props.searchParams;

  // Conditionally throw based on URL param
  if (searchParams.throw === "true") {
    throw new Error("This error was triggered intentionally for testing");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-3xl">Error Boundary Demo</h1>
      <p className="mb-6 text-gray-600">
        This page demonstrates how error boundaries work in Next.js.
      </p>

      <div className="space-y-4">
        <div className="rounded border p-4">
          <h2 className="mb-2 font-semibold">Trigger an Error</h2>
          <p className="mb-4 text-gray-600 text-sm">
            Click below to throw an error and see the error boundary in action.
          </p>
          <Link
            href="/error-demo?throw=true"
            className="inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Throw Error
          </Link>
        </div>

        <div className="rounded border p-4">
          <h2 className="mb-2 font-semibold">Safe Navigation</h2>
          <p className="mb-4 text-gray-600 text-sm">
            This link loads the page without triggering an error.
          </p>
          <Link
            href="/error-demo"
            className="inline-block rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Load Normally
          </Link>
        </div>
      </div>
    </main>
  );
}
