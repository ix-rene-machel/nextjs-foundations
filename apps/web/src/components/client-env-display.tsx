'use client';

import { useState } from 'react';

export function ClientEnvDisplay() {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => setClicks(clicks + 1);

  // Client Components are also prerendered on the server, where INTERNAL_CONFIG
  // exists. Don't read it there: it would leak into the HTML and mismatch the
  // browser (where Next replaces it with an empty value), causing a hydration error.
  const internalConfig =
    typeof window === 'undefined' ? undefined : process.env.INTERNAL_CONFIG;

  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold">Client Component Env Access</h3>
      <p>Public: {process.env.NEXT_PUBLIC_APP_NAME}</p>
      <p>Server-only: {internalConfig || 'undefined'}</p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
      >
        Clicked {clicks} times
      </button>
    </div>
  );
}
