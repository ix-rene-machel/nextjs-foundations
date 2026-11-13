import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function signIn(): Promise<void> {
  "use server";
  const store = await cookies();
  store.set("session", "demo", { httpOnly: true, path: "/", sameSite: "lax" });
  // After a mutation: send the user to where they were going.
  redirect("/nav-demo/redirect-demo");
}

async function signOut(): Promise<void> {
  "use server";
  const store = await cookies();
  store.delete("session");
  redirect("/nav-demo/login");
}

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-8">
      <h1 className="font-bold text-2xl">Login (demo)</h1>
      <p className="text-gray-600 text-sm">
        You were redirected here by redirect() on the server because no session
        cookie exists.
      </p>
      <form action={signIn}>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Sign out
        </button>
      </form>
      <Link href="/nav-demo" className="text-blue-600 text-sm hover:underline">
        ← Back to demo
      </Link>
    </main>
  );
}
