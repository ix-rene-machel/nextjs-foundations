// Route-level fallback: Next wraps this segment's page in a Suspense boundary.
// Shaped like the profile page so the layout doesn't jump when content arrives.
export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-6 p-8">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>
      <div className="flex gap-4">
        <div className="h-6 w-20 rounded bg-gray-200" />
        <div className="h-6 w-20 rounded bg-gray-200" />
        <div className="h-6 w-20 rounded bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
    </div>
  );
}
