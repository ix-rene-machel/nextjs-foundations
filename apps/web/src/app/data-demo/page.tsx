import { connection } from "next/server";
import {
  fetchPosts,
  fetchStats,
  fetchUser,
  type Post,
  type Stats,
  type User,
} from "./data";

type Dashboard = {
  user: User;
  posts: Post[];
  stats: Stats;
  failed: string[];
  ms: number;
};

// Waterfall (sequential): ~750ms. Only used for the before/after timing, so a
// failing source is swallowed here and never breaks the page.
async function measureSequential(): Promise<number> {
  const start = performance.now();
  await fetchUser().catch(() => undefined);
  await fetchPosts().catch(() => undefined);
  await fetchStats().catch(() => undefined);
  return Math.round(performance.now() - start);
}

// Parallel: ~300ms (the slowest source), not the sum. Promise.allSettled keeps
// the page up when one source fails: failed sources fall back to defaults.
async function fetchParallel(): Promise<Dashboard> {
  const start = performance.now();
  const [user, posts, stats] = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchStats(),
  ]);
  const ms = Math.round(performance.now() - start);

  const failed: string[] = [];
  for (const [name, result] of [
    ["user", user],
    ["posts", posts],
    ["stats", stats],
  ] as const) {
    if (result.status === "rejected") {
      failed.push(name);
      console.error(`[data-demo] fetch "${name}" failed:`, result.reason);
    }
  }

  return {
    user:
      user.status === "fulfilled" ? user.value : { name: "Guest", email: "" },
    posts: posts.status === "fulfilled" ? posts.value : [],
    stats: stats.status === "fulfilled" ? stats.value : { views: 0, likes: 0 },
    failed,
    ms,
  };
}

export default async function DataDemoPage() {
  // Opt out of prerendering so timings are measured per request.
  await connection();

  const sequentialMs = await measureSequential();
  const { user, posts, stats, failed, ms } = await fetchParallel();

  // Before/after comparison in the server log (requirement 2).
  console.log(
    `[data-demo] sequential=${sequentialMs}ms parallel=${ms}ms (saved ~${sequentialMs - ms}ms)`
  );

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-3xl">
        Data Fetching Without Waterfalls
      </h1>

      <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
        <h2 className="font-semibold text-green-800">Performance Result</h2>
        <p className="text-green-700">
          Parallel fetch completed in{" "}
          <span className="font-bold font-mono">{ms}ms</span>
        </p>
        <p className="mt-2 text-green-600 text-sm">
          Sequential took {sequentialMs}ms (200 + 300 + 250ms). Parallel takes
          ~300ms (max of all three).
        </p>
      </div>

      {failed.length > 0 && (
        <p
          role="alert"
          className="mb-6 rounded border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm"
        >
          Some data failed to load: {failed.join(", ")}
        </p>
      )}

      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">User (200ms fetch)</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Posts (300ms fetch)</h2>
          <ul className="list-inside list-disc">
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Stats (250ms fetch)</h2>
          <p>Views: {stats.views.toLocaleString("en-US")}</p>
          <p>Likes: {stats.likes.toLocaleString("en-US")}</p>
        </div>
      </div>
    </main>
  );
}
