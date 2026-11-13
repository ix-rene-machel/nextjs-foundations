import { UserCard } from "@/components/user-card";
import { getUserDTO } from "@/lib/server/user-dto";

export default function SecurityDemoPage() {
  // Server Component safely calls the Data Access Layer
  const user = getUserDTO("user-123");

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="font-bold text-2xl">Security Demo</h1>
      <p className="text-gray-600">
        This page demonstrates secure data fetching patterns.
      </p>
      {/* Pass only the safe DTO to the Client Component */}
      <UserCard user={user} />
    </main>
  );
}
