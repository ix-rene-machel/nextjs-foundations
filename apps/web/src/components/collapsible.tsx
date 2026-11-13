"use client";

import { type ReactNode, useState } from "react";

export function Collapsible({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-semibold hover:bg-gray-50"
      >
        {title}
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="border-t p-4">{children}</div>}
    </div>
  );
}
