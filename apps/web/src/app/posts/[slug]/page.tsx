// Demonstrates notFound() routing to the nearest not-found.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

type Post = { title: string; content: string };

// Simulated posts database
const posts: Record<string, Post> = {
  "hello-world": {
    title: "Hello World",
    content: "This is the first post. Welcome to the blog!",
  },
  "nextjs-tips": {
    title: "Next.js Tips",
    content: "Here are some tips for building with Next.js...",
  },
};

export function generateStaticParams(): { slug: string }[] {
  return Object.keys(posts).map((slug) => ({ slug }));
}

// In Next.js 16, params is a Promise that must be awaited
export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = posts[slug];

  // notFound() throws: keep it outside try/catch or it won't reach not-found.tsx
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link
        href="/posts"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back to posts
      </Link>
      <h1 className="mb-4 font-bold text-3xl">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
    </main>
  );
}
