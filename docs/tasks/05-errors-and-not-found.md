# 05: Errors and Not Found

- Status: done (side quest "Vercel Observability error monitoring" not done)
- Source: https://vercel.com/academy/nextjs-foundations/errors-and-not-found
- Concepts: `error.tsx` boundaries (`error`, `retry`, `digest`), nested boundaries, custom `not-found.tsx`, `notFound()` vs errors

## Steps (from lesson)

1. Root `app/error.tsx` (client, `retry()`, digest)
2. Custom `app/not-found.tsx` (replaces the task-01 version)
3. `app/error-demo/page.tsx` throws when `?throw=true`
4. Nested `app/error-demo/error.tsx` (orange UI)

## Files

```
apps/web/src/app/{error,not-found}.tsx
apps/web/src/app/error-demo/{page,error}.tsx
```

Boundary layout in `apps/web`: `app/error.tsx` (root), `(marketing)/error.tsx` (task 01), `error-demo/error.tsx` (nearest wins).

## Done-When (verified)

- [x] `/error-demo?throw=true` shows the orange nested boundary (dev server + browser)
- [x] "Try Again" re-renders; it throws again because `?throw=true` is still in the URL (expected per lesson); "Reload Page" clears it
- [x] Unknown URL shows the custom 404 "Page not found" with "Go home" (verified on a production build: HTTP 404)
- [x] Root `error.tsx` has `'use client'` and takes `error` + `retry`
- [x] Console shows "Error demo boundary caught:" with the error
- [x] Root boundary also verified: a temporary dynamic route that throws rendered "Something went wrong" + `Error ID: <digest>` (prod build, route deleted afterwards)
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass

## Findings / deviations

- **Production hides the message.** Dev shows "This error was triggered intentionally for testing". A production build shows "Minified React error #441 …" (React's wording for "An error occurred in the Server Components render. The specific message is omitted in production builds… A digest property is included"). The root boundary prints the digest (`Error ID`); the nested demo boundary does not, so in prod only the generic text appears. This is by design (bundled `error.md`: server errors are replaced with a generic message + `error.digest`). Consider showing the digest in the nested boundary too.
- `biome-ignore lint/suspicious/noConsole` from the lesson is flagged as unused (that rule is not enabled in this Biome config), so it was removed. `console.error` in the effect lints clean.
- Lesson uses single quotes/no semicolons; kept this app's Biome style (double quotes, semicolons).
- `/error-demo` is dynamic (ƒ) because it reads `searchParams`.
- `not-found.tsx` from task 01 was replaced with the lesson's design ("Page not found" + explanatory text).
- Lesson step 5 ("blog notFound still works"): `fetchPostBySlug` never returns `null` (it generates a post for any slug), so `/test-not-found` on the blog renders a post unless the temporary `slug === 'test-not-found'` trigger from task 03 is added. Also `apps/blog` had no `not-found.tsx` (default Next 404). Added `apps/blog/src/app/not-found.tsx` ("Post not found" + "← Back to posts"). Verified on a prod build with the temporary trigger (HTTP 404, custom page, no console errors); trigger and test config reverted. Unmatched URLs like `/a/b` use the same page.
- No `global-error.tsx`: root-layout errors would still hit Next's default (lesson only mentions it).
- Long-running dev server on :3000 kept serving the old task-01 404 markup after the file changed (stale); production output was correct. Restart `next dev` if you see the old page.
