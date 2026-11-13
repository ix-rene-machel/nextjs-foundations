import Link from "next/link";

// Marketing section chrome: header, nav, footer. The (marketing) route group
// does not add a URL segment, so this serves /, /about and /pricing.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="mb-8 border-b py-4">
        <nav className="flex gap-4">
          <Link href="/" className="font-semibold">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="ml-auto text-blue-600 hover:text-blue-800"
          >
            Dashboard →
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="mt-8 border-t py-4 text-gray-500 text-sm">
        © 2026 Next.js Foundations
      </footer>
    </div>
  );
}
