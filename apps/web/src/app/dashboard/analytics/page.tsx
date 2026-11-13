export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="mb-4 font-bold text-3xl">Analytics</h1>
      <p className="mb-6 text-gray-600">
        The sidebar persisted while you navigated here.
      </p>
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold text-xl">Traffic Overview</h2>
        <div className="flex h-64 items-center justify-center rounded bg-gray-100">
          <span className="text-gray-400">[Chart placeholder]</span>
        </div>
      </div>
    </div>
  );
}
