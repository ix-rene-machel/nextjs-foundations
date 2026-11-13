"use client";

import { useState } from "react";

// Plain client state. Soft navigation + back restores the page from the router
// cache; a hard navigation reloads the document and loses it.
export function DraftForm() {
  const [text, setText] = useState("");

  return (
    <label className="flex flex-col gap-1 text-sm">
      Draft message
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="rounded border bg-background px-3 py-2"
        rows={3}
      />
    </label>
  );
}
