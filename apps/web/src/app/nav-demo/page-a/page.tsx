import Link from "next/link";

export default function PageA() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="font-bold text-2xl">Page A</h1>
      <p className="text-gray-600">
        You navigated here. Focus is moved to this heading.
      </p>
      <nav className="flex gap-4">
        <Link
          href="/nav-demo"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to demo
        </Link>
        <Link
          href="/nav-demo/page-b"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go to Page B
        </Link>
      </nav>
    </main>
  );
}
