export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-4 font-bold text-3xl">Settings</h1>
      <p className="mb-6 text-gray-600">
        The sidebar persists across sibling pages. This form's state does not:
        it resets when you leave this page.
      </p>
      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Notifications</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span>Email notifications</span>
          </label>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Theme</h2>
          <select className="rounded border px-3 py-2">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
      </div>
    </div>
  );
}
