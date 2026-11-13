"use client";

import { useLayoutEffect } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  // React Strict Mode (dev only) remounts and resets attributes on <html> that
  // are not in JSX, wiping what the inline script set. Re-apply before paint.
  // No-op in production.
  useLayoutEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  function toggle(): void {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  // The icon is chosen by CSS (`dark:` variant follows <html data-theme>), not
  // by React state. Server HTML and first client render are identical, so
  // there is nothing to mismatch.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded border px-3 py-1 text-sm hover:bg-accent"
    >
      <span aria-hidden="true" className="dark:hidden">
        ☀ Light
      </span>
      <span aria-hidden="true" className="hidden dark:inline">
        ☾ Dark
      </span>
    </button>
  );
}
