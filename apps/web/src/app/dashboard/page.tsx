export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-4 font-bold text-3xl">Dashboard Overview</h1>
      <p className="mb-6 text-gray-600">
        Welcome to your dashboard. Navigate with the sidebar: it stays mounted
        while only this content changes.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-800">Users</h3>
          <p className="font-bold text-2xl text-blue-600">1,234</p>
        </div>
        <div className="rounded-lg border bg-green-50 p-4">
          <h3 className="font-semibold text-green-800">Revenue</h3>
          <p className="font-bold text-2xl text-green-600">$45,678</p>
        </div>
        <div className="rounded-lg border bg-purple-50 p-4">
          <h3 className="font-semibold text-purple-800">Orders</h3>
          <p className="font-bold text-2xl text-purple-600">567</p>
        </div>
      </div>
    </div>
  );
}
