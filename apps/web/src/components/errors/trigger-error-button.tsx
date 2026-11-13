"use client";

import { useState } from "react";

/** Throws during render after a click, so the nearest error boundary catches it. */
export function TriggerErrorButton() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a demo error triggered by the button!");
  }

  return (
    <button
      type="button"
      onClick={() => setShouldError(true)}
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Trigger Error
    </button>
  );
}
