import Link from "next/link";

// Dashboard section chrome: sidebar. Persists while navigating between
// /dashboard, /dashboard/analytics and /dashboard/settings; only {children}
// is swapped.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh]">
      <aside className="w-64 shrink-0 border-r bg-gray-50 p-4">
        <h2 className="mb-4 font-bold text-lg">Dashboard</h2>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/analytics"
            className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Analytics
          </Link>
          <Link
            href="/dashboard/settings"
            className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Settings
          </Link>
        </nav>
        <div className="mt-8 border-t pt-4">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-700">
            ← Back to site
          </Link>
        </div>
      </aside>
      <section className="min-w-0 flex-1 p-8">{children}</section>
    </div>
  );
}
