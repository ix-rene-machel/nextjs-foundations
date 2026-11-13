import { fetchCategories, fetchPosts } from '@repo/api/blog';
import Link from 'next/link';
import { Suspense } from 'react';
import { FilterControls } from '@/components/filter-controls';

type Sort = 'date' | 'title';

// Category and sort come from the URL (`?category=tech&sort=title`), so every
// filtered view is bookmarkable and shareable. The page reads them here, on the
// server, and passes them down as plain strings.
export default async function BlogHomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const currentSort: Sort = sort === 'title' ? 'title' : 'date';

  // Fetch the recent posts, then filter/sort in memory (the mock API has no
  // query params). Categories are fetched in parallel with the posts.
  const [posts, categories] = await Promise.all([
    fetchPosts(50),
    fetchCategories(),
  ]);

  const filtered = category
    ? posts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      )
    : posts;
  const visible = (
    currentSort === 'title'
      ? [...filtered].sort((a, b) => a.title.localeCompare(b.title))
      : filtered
  ).slice(0, 10);

  return (
    <main className="flex flex-col gap-8">
      <h1 className="font-bold text-4xl">
        Blog{' '}
        {category && (
          <span className="text-gray-500 text-2xl">in {category}</span>
        )}
      </h1>

      {/* useSearchParams needs a Suspense boundary (see lesson warning). */}
      <Suspense
        fallback={<div className="h-10 animate-pulse rounded bg-gray-100" />}
      >
        <FilterControls categories={categories.slice(0, 5)} />
      </Suspense>

      <p className="text-gray-500 text-sm">
        {visible.length} post{visible.length === 1 ? '' : 's'}
        {category ? ` in ${category}` : ''} · sorted by {currentSort}
      </p>

      <div className="flex flex-col gap-6">
        {visible.length === 0 && (
          <p className="text-gray-600">No posts match this filter.</p>
        )}
        {visible.map((post) => (
          <article key={post.id} className="flex flex-col gap-2 border-b pb-6">
            <Link href={`/${post.slug}`} className="hover:underline">
              <h2 className="font-semibold text-2xl">{post.title}</h2>
            </Link>
            <p className="text-gray-500 text-sm">
              {post.category} · {post.readingTime} min read ·{' '}
              {post.publishedAt.toLocaleDateString('en-US', {
                timeZone: 'UTC',
              })}
            </p>
            <p className="text-gray-700">{post.excerpt}</p>
            <Link
              href={`/${post.slug}`}
              className="text-blue-600 text-sm hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
