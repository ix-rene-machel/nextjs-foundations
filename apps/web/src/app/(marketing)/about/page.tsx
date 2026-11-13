import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission and team",
};

// Simulate slow data fetch
async function getAboutData() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { founded: 2026, team: "Distributed" };
}

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 font-bold text-3xl">About Us</h1>
      <p className="mb-4 text-gray-600">
        This page uses the marketing layout. Notice the header and footer are
        defined once in the layout and wrap this content automatically.
      </p>
      <p className="text-gray-500 text-sm">
        Founded: {data.founded} · Team: {data.team}
      </p>
    </div>
  );
}
