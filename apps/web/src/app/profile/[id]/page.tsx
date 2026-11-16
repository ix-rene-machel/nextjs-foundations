import { Suspense } from "react";

// Simulated API calls. Delays are staggered so the streaming order is visible:
// header (200ms) → stats (400ms) → activity (600ms).
// Mock timestamps are fixed values (a real API returns stored dates, and
// Cache Components rejects reading the clock during prerender).
async function fetchUserProfile(_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    name: "Demo User",
    email: "demo@example.com",
    joinedAt: "2024-01-15T00:00:00.000Z",
  };
}

async function fetchUserStats(_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { posts: 42, followers: 1234, following: 567 };
}

async function fetchUserActivity(_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [
    { type: "post", title: "My first post", date: "2024-03-01T10:00:00.000Z" },
    {
      type: "comment",
      title: "Great article!",
      date: "2024-03-02T12:00:00.000Z",
    },
    { type: "like", title: "Liked a post", date: "2024-03-03T09:30:00.000Z" },
  ];
}

// Each section is its own async component, so each streams independently.
async function ProfileHeader({ id }: { id: string }) {
  const profile = await fetchUserProfile(id);
  return (
    <section>
      <h1 className="font-bold text-2xl">{profile.name}</h1>
      <p className="text-gray-600">{profile.email}</p>
    </section>
  );
}

async function ProfileStats({ id }: { id: string }) {
  const stats = await fetchUserStats(id);
  return (
    <section className="flex gap-4">
      <div>
        <strong>{stats.posts}</strong> posts
      </div>
      <div>
        <strong>{stats.followers}</strong> followers
      </div>
      <div>
        <strong>{stats.following}</strong> following
      </div>
    </section>
  );
}

async function ProfileActivity({ id }: { id: string }) {
  const activity = await fetchUserActivity(id);
  return (
    <section>
      <h2 className="mb-2 font-semibold text-xl">Recent Activity</h2>
      <ul className="space-y-2">
        {activity.map((item) => (
          <li key={`${item.type}-${item.title}`} className="text-gray-700">
            {item.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Skeletons match the shape of each section (no spinners).
function HeaderSkeleton() {
  return (
    <section className="animate-pulse space-y-2">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="h-4 w-32 rounded bg-gray-200" />
    </section>
  );
}

function StatsSkeleton() {
  return (
    <section className="flex animate-pulse gap-4">
      <div className="h-6 w-20 rounded bg-gray-200" />
      <div className="h-6 w-20 rounded bg-gray-200" />
      <div className="h-6 w-20 rounded bg-gray-200" />
    </section>
  );
}

function ActivitySkeleton() {
  return (
    <section className="animate-pulse space-y-2">
      <div className="h-6 w-32 rounded bg-gray-200" />
      <div className="h-4 w-full rounded bg-gray-200" />
      <div className="h-4 w-full rounded bg-gray-200" />
      <div className="h-4 w-3/4 rounded bg-gray-200" />
    </section>
  );
}

// Three boundaries, one per independent section. The page itself is sync; the
// `params` await lives in a child so the shell can prerender.
export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <Suspense fallback={<HeaderSkeleton />}>
        <ProfileHeaderById params={params} />
      </Suspense>
      <Suspense fallback={<StatsSkeleton />}>
        <ProfileStatsById params={params} />
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <ProfileActivityById params={params} />
      </Suspense>
    </main>
  );
}

async function ProfileHeaderById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileHeader id={id} />;
}

async function ProfileStatsById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileStats id={id} />;
}

async function ProfileActivityById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileActivity id={id} />;
}
