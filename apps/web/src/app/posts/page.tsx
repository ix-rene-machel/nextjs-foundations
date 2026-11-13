import Link from "next/link";

const slugs = [
  { slug: "hello-world", title: "Hello World" },
  { slug: "nextjs-tips", title: "Next.js Tips" },
  { slug: "nonexistent-slug", title: "Missing post (triggers notFound)" },
];

export default function PostsPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-3xl">Posts</h1>
      <ul className="list-inside list-disc space-y-1">
        {slugs.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/posts/${p.slug}`}
              className="text-blue-600 hover:underline"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
