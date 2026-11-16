import type { Metadata } from "next";

// Canonical is per page: a root-layout canonical would make every page claim "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl">Web</h1>
      <p>TODO: Content</p>
    </div>
  );
}
