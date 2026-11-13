import { fetchPosts, fetchStats, fetchUser } from "../../data-demo/data";

type PageProps = {
  params: Promise<{ id: string }>;
};

// Lesson pattern: await params inside Promise.all next to the independent
// fetches, so params resolution doesn't add a sequential step.
export default async function UserPage({ params }: PageProps) {
  const [{ id }, user, posts, stats] = await Promise.all([
    params,
    fetchUser(),
    fetchPosts(),
    fetchStats(),
  ]);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-2xl">User {id}</h1>
      <p>{user.name}</p>
      <p className="text-gray-600">
        {posts.length} posts · {stats.views.toLocaleString("en-US")} views
      </p>
    </main>
  );
}
