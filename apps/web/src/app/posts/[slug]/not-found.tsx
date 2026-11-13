// Nested not-found.tsx: overrides the root one for /posts/[slug]
import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="mb-4 font-bold text-4xl">Post Not Found</h1>
      <p className="mb-4 text-gray-600">
        The blog post you&apos;re looking for doesn&apos;t exist.
      </p>
      <p className="mb-6 text-gray-500 text-sm">
        This is the nested not-found.tsx in /posts/[slug]/
      </p>
      <div className="flex gap-4">
        <Link
          href="/posts"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Browse Posts
        </Link>
        <Link
          href="/"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
