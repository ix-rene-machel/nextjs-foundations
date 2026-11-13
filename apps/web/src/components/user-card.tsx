"use client";

// Declared locally on purpose: importing the type from lib/server would pull a
// server-only module into the client graph (type-only imports are erased, but
// keeping the client contract explicit is the point of a DTO).
type UserDTO = {
  id: string;
  name: string;
  createdAt: string;
};

// Fixed locale + time zone: the server and the browser must produce identical
// text, otherwise hydration fails (the default locale differs per machine).
function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { timeZone: "UTC" });
}

export function UserCard({ user }: { user: UserDTO }) {
  return (
    <div className="rounded border bg-white p-4 shadow-sm">
      <h2 className="font-semibold">{user.name}</h2>
      <p className="text-gray-500 text-sm">ID: {user.id}</p>
      <p className="text-gray-500 text-sm">
        Joined: {formatJoined(user.createdAt)}
      </p>
    </div>
  );
}
