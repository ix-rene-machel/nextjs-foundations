import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="mb-2 font-bold text-6xl text-gray-900">404</h1>
      <p className="mb-6 text-gray-600 text-xl">Page not found</p>
      <p className="mb-8 max-w-md text-center text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
      >
        Go home
      </Link>
    </div>
  );
}
