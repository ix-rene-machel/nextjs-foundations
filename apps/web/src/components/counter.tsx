"use client";

// Only import what's needed for this tiny component
import { Button } from "@repo/ui/components/button";
import { useState } from "react";

type CounterProps = {
  initialCount: number;
};

/**
 * A minimal client component demonstrating useState + onClick.
 * Only this component ships JavaScript to the browser.
 */
export function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        aria-label="Decrement"
        onClick={() => setCount((c) => c - 1)}
      >
        -
      </Button>
      <output
        aria-live="polite"
        className="min-w-[3ch] text-center font-mono text-2xl"
      >
        {count}
      </output>
      <Button
        type="button"
        variant="outline"
        aria-label="Increment"
        onClick={() => setCount((c) => c + 1)}
      >
        +
      </Button>
    </div>
  );
}
