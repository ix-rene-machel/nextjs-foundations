"use client";

import { useRouter } from "next/navigation";

// useRouter needs the client: it reads the router from React context.
export function NavigationButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-4">
      {/* push: adds an entry to the history stack */}
      <button
        type="button"
        onClick={() => router.push("/nav-demo/page-a")}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        router.push()
      </button>
      {/* back: previous history entry */}
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        router.back()
      </button>
      {/* replace: swaps the current entry, so back skips it */}
      <button
        type="button"
        onClick={() => router.replace("/nav-demo/page-b")}
        className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
      >
        router.replace()
      </button>
    </div>
  );
}
