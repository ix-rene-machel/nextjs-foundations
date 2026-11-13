import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Mock session check: a cookie named "session" means "logged in".
async function getSession(): Promise<{ user: { name: string } } | null> {
  const store = await cookies();
  return store.get("session") ? { user: { name: "Demo User" } } : null;
}

export default async function RedirectDemoPage() {
  const session = await getSession();

  // redirect() throws; keep it outside try/catch. Runs before any markup.
  if (!session) {
    redirect("/nav-demo/login");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-2xl">Protected content</h1>
      <p>Welcome, {session.user.name}!</p>
    </main>
  );
}
