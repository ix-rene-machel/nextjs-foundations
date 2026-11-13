"use client";

import { useState } from "react";

/** Client widget that throws during render while `broken` is true. */
export function FlakyWidget({
  label,
  broken,
}: {
  label: string;
  broken: boolean;
}) {
  const [count, setCount] = useState(0);

  if (broken) {
    throw new Error(`${label} crashed while rendering`);
  }

  return (
    <div className="rounded border p-4 text-sm">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-muted-foreground">Local clicks: {count}</p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="mt-2 rounded border px-3 py-1 hover:bg-accent"
      >
        Click {label}
      </button>
    </div>
  );
}
