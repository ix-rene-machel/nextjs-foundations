import { fetchPostBySlug, fetchPosts } from '@repo/api/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await fetchPosts(10); // Pre-render top 10 posts

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

// Direct data access: call the data function, never fetch('/api/...') here.
// Relative URLs don't resolve on the server; the canonical below is relative to
// metadataBase (which already includes /blog).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.title, // template adds " | VAF Blog"
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      siteName: 'VAF Blog',
      locale: 'en_US',
      title: post.title,
      description: post.excerpt,
      url: `/${slug}`,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to posts
      </Link>

      <article className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl">{post.title}</h1>
          <p className="text-sm text-gray-500">
            {post.category} · {post.readingTime} min read ·{' '}
            {post.publishedAt.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">By {post.author.name}</p>
        </header>

        <div className="prose max-w-none">
          {post.content.split('\n\n').map((paragraph) => (
            <p key={paragraph} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="flex flex-wrap gap-2 border-t pt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600"
            >
              {tag}
            </span>
          ))}
        </footer>
      </article>
    </main>
  );
}
