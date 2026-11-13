// Simulated API calls with realistic delays.
// In production these would be real fetch calls to your API.

export type User = { name: string; email: string };
export type Post = { id: number; title: string };
export type Stats = { views: number; likes: number };

export async function fetchUser(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { name: "John Doe", email: "john@example.com" };
}

export async function fetchPosts(): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 1, title: "Getting Started with Next.js" },
    { id: 2, title: "Server Components Deep Dive" },
    { id: 3, title: "Caching Strategies" },
  ];
}

export async function fetchStats(): Promise<Stats> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return { views: 1234, likes: 567 };
}
