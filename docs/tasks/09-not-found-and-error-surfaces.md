# 09: Not Found & Errors (Section 2)

- Status: done, incl. side quest "Granular Error Recovery"
- Source: https://vercel.com/academy/nextjs-foundations/not-found-and-error-surfaces
- Concepts: `notFound()` → nearest `not-found.tsx`, nested `error.tsx` overriding root, `retry()`, correlation IDs, component-level boundaries (`catchError`), preserving form input across recovery

## Decisions (asked)

- `/error-demo` keeps the task-05 server trigger (`?throw=true`) **and** gets the lesson's client "Trigger Error" button (instead of replacing the page with a `'use client'` page).
- Correlation ID = the proxy's per-request `x-request-id` (task 06), not a client-generated random ID. It matches the `[Proxy]` log and the `X-Request-Id` response header. Falls back to `client-<uuid>` if missing.

## Files

```
apps/web/src/app/posts/page.tsx                    index (links incl. a missing slug)
apps/web/src/app/posts/[slug]/page.tsx             notFound() for unknown slugs, generateStaticParams
apps/web/src/app/posts/[slug]/not-found.tsx        nested "Post Not Found"
apps/web/src/app/error-demo/layout.tsx             reads x-request-id → CorrelationIdProvider
apps/web/src/app/error-demo/error.tsx              orange boundary + Correlation ID + Digest + structured log
apps/web/src/app/error-demo/page.tsx               + client "Trigger Error" + link to granular demo
apps/web/src/app/error-demo/granular/page.tsx      side quest
apps/web/src/components/errors/
  correlation-id.tsx          context + useCorrelationId()
  trigger-error-button.tsx    throws during render after click
  widget-boundary.tsx         catchError()-based component boundary with Retry
  flaky-widget.tsx            widget that throws while `broken`
  granular-demo.tsx           widgets + form with preserved draft
```

## Done-When (verified, production build, chrome-devtools)

- [x] `/posts/nonexistent-slug` → HTTP 404, nested "Post Not Found" (`Browse Posts`, `Go Home`)
- [x] `/random-nonexistent-page` → HTTP 404, root "404 / Page not found" (checked in a fresh tab)
- [x] `/error-demo` → "Trigger Error" → orange nested boundary "Demo Error Caught!" with the error message
- [x] "Try Again" recovers **without a full reload** (a `window` marker set before the error survived; page back to normal)
- [x] "Correlation ID: <uuid>" displayed; same value as the `x-request-id` header of that request (verified with curl: header id = id in HTML)
- [x] Server error (`?throw=true`) also shows Correlation ID + Digest; console logs a structured object `{ correlationId, digest, message, timestamp, location }`
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass. Build: `/posts` ○, `/posts/[slug]` ● (hello-world, nextjs-tips), `/error-demo` and `/error-demo/granular` ƒ (dynamic: they read `headers()`)

## Side quest: granular error recovery (`/error-demo/granular`)

Three levels:

| Level | Boundary | Triggered by | Recovery |
| --- | --- | --- | --- |
| 1 component | `WidgetBoundary` (`catchError` from `next/error`) per widget | Break Stats / Break Feed / Break Preview | "Retry <name>": clears the cause (`onRecover`) then `retry()` |
| 2 segment | `app/error-demo/error.tsx` | Crash whole page | "Try Again" (`retry()`) |
| 3 root | `app/error.tsx` | anything outside `/error-demo` | "Try again" |

Verified:
- Break Stats → only "Stats unavailable"; Feed kept its local state (2 clicks), form input untouched, segment boundary **not** triggered. Retry Stats → Stats back (its own local state resets to 0, as expected for a remounted subtree), Feed still 2.
- Break Preview (boundary inside the form) → fallback; inputs keep values and stay editable (edited "Rene" → "Rene M." while broken); Retry Preview renders the updated draft.
- Crash whole page → segment boundary replaces the whole form; draft is in `sessionStorage`; Try Again (no reload) → form back with "Rene M." / "Please keep this text".
- Full reload → draft restored; Submit clears input and storage. No console errors/warnings.

### Challenge: preserve form input

Two mechanisms, matching the two failure scopes:
1. **Component boundary inside the form:** draft state lives in the form component *above* the boundary, so only the broken subtree remounts.
2. **Segment boundary (whole form unmounts):** draft is mirrored to `sessionStorage` on every change and restored after mount (`useEffect`, not the `useState` initializer, to keep SSR and hydration identical; see task 02).

Uncontrolled inputs or state inside the failing subtree would be lost; that's the trade-off to design around.

## Findings / gotchas

- **`catchError` fallback is called as a plain function `(props, errorInfo)`**, not rendered as a component. Hooks inside it trip Biome's `useHookAtTopLevel`, and per React rules they shouldn't be there. Fix: fallback returns `<WidgetErrorPanel …/>`, which holds the hooks.
- **`retry()` alone doesn't fix a persistent cause.** If the widget is broken by parent state, retry re-renders and throws again. `onRecover` clears the cause first. Same reason `?throw=true` re-throws on Try Again (task 05).
- **Client-side 404 navigation quirk:** navigating the *same tab* from `/posts/nonexistent-slug` to `/random-nonexistent-page` via `navigate_page` showed the stale nested "Post Not Found" content in the snapshot; a fresh tab (and curl) shows the root 404 correctly. Likely tool/bfcache artefact; worth a manual check if it ever shows up in real navigation.
- Correlation layout makes `/error-demo/*` dynamic (`headers()`); acceptable for a demo, but don't read request headers in a layout that should stay static.
- Production masks server error messages ("Minified React error #441"); the digest + correlation ID are what you hand to support.
- Lesson's code used `useMemo` + `Math.random()` for the ID and `biome-ignore noConsole` comments (rule not enabled here); both dropped.
