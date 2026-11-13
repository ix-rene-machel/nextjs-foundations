# 02: Server and Client Components

- Status: done
- Source: https://vercel.com/academy/nextjs-foundations/server-and-client-components
- Concepts: `'use client'` boundary, env var visibility (`NEXT_PUBLIC_*` vs server-only), Server Components as `children` of a Client Component, hydration mismatch

## Steps (from lesson)

1. `client-env-display.tsx`: add `useState` counter button
2. Verify `/env-demo` (server shows `INTERNAL_CONFIG`, client shows `undefined`)
3. Composition: new `collapsible.tsx` (Client) wrapping `ServerEnvDisplay` (Server) as `children` in `env-demo/page.tsx`
4. Side quest: theme toggle without flash of wrong theme

## Files

```
apps/web/src/
├── components/{client-env-display,collapsible,theme-script,theme-toggle}.tsx
├── lib/theme.ts
├── app/env-demo/page.tsx
├── app/layout.tsx          (ThemeScript in <head>, ThemeToggle, suppressHydrationWarning on <html>)
└── app/globals.css         (data-theme variables, dark variant)
biome.jsonc                 (theme-script.tsx: noDangerouslySetInnerHtml off)
```

## Done-When (verified, dev server + chrome-devtools)

- [x] `/env-demo` shows both Server and Client components
- [x] Server card shows `server-only-value`; client card shows `undefined`
- [x] Counter increments (clicked 6x → "Clicked 6 times")
- [x] Collapsible toggles the Server Component content (− / +)
- [x] `server-only-value` is in the initial HTML (server card). Prod build: `/env-demo` is ○ static.
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass; no console errors on a fresh load

## Deviation: lesson code causes a hydration error and leaks the value

The lesson's `ClientEnvDisplay` renders `process.env.INTERNAL_CONFIG || 'undefined'`. Client Components are also prerendered on the server, where `INTERNAL_CONFIG` exists. Consequences, observed:

1. Initial HTML of the **client** card contained `server-only-value` (the lesson claims it shows `undefined` in the HTML).
2. In the browser bundle Next replaces the value, so the client renders `undefined` → console error "Hydration failed because the server rendered text didn't match the client", and React re-renders the tree client-side.

Fix (`client-env-display.tsx`): read the var only when `typeof window !== 'undefined'`. Server HTML and browser both say `undefined`; the hydration error is gone and the value no longer leaks through the client card. The lesson text had no guidance for this case. (Starter code had the same issue.)

Mismatch is still possible for other lesson variants: never read server-only env in a Client Component.

## Side quest: theme toggle without flash

Approach follows bundled guide `next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`.

- `ThemeScript` (Server Component, in `<head>`): blocking inline script sets `data-theme` on `<html>` while HTML is parsed, before first paint and before React loads. Value = `localStorage.theme`, else OS `prefers-color-scheme`.
- `<html suppressHydrationWarning>`: the script changes an attribute React didn't render.
- `ThemeToggle` (Client): writes `data-theme` + `localStorage`. The label (☀ Light / ☾ Dark) is switched by the CSS `dark:` variant, not React state, so server HTML and first client render are identical (no mismatch).
- `useLayoutEffect` re-applies the stored theme: in dev, Strict Mode remount resets `<html>` attributes. No-op in production.
- `globals.css`: `@custom-variant dark` bound to `[data-theme="dark"]`, plus `:root[data-theme=...]` token overrides so an explicit choice beats the OS media query in `@repo/ui`.
- Verified: after toggling to dark and reloading, `data-theme="dark"` is already set when the first `<body>` is parsed; no console errors; toggle label correct.
- Why not `useEffect`/`useState`: they run after paint → flash. Why not cookies in the layout: `cookies()` in the root layout makes the whole app dynamic.
- Caveat: a strict CSP without `unsafe-inline` would need a nonce for the inline script.
- Not verified: a real visual-flash capture on a throttled connection (checked DOM state at parse time instead).

## Notes

- `pnpm format` rewrites unrelated files (`AGENTS.md`, `docs/`, `.pi/`); use `biome format --write <paths>` instead. Reverted that run.
- Lesson uses single quotes/no semicolons. Kept existing per-file Biome style.
