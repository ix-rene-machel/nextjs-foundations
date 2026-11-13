"use client";

import { Button } from "@repo/ui/components/button";
import { type ReactNode, useState } from "react";

type ExpandableWrapperProps = {
  children: ReactNode;
  title: string;
};

/**
 * A minimal client wrapper that shows/hides server-rendered content.
 * The children prop accepts Server Components that stream through unchanged.
 */
export function ExpandableWrapper({ children, title }: ExpandableWrapperProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      {/* Server-rendered children passed through */}
      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  );
}
