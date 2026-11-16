# 16: Cache Components (Section 3.1)

- Status: done (side quest "cache profiling" not done)
- Branch: `feat/cache-components` (merge to `main` pending)
- Source: https://vercel.com/academy/nextjs-foundations/cache-components
- Concepts: `cacheComponents`, `partialPrefetching`, `"use cache"`, `cacheLife` profiles, `cacheTag`, `updateTag`, PPR (static shell + Suspense holes), `connection()` as a last resort

## What changed

`apps/web/next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, `cacheLife` profiles `blog`, `products`, `social` (values from the lesson).

New (product page, the lesson's example):
```
apps/web/src/lib/products.ts                  getProduct (use cache, cacheLife products, cacheTag products + product-<id>), getProducts, saveProduct
apps/web/src/app/actions/products.ts          updateProduct Server Action: Zod, saveProduct, updateTag x2
apps/web/src/app/products/[id]/page.tsx       static shell + Suspense + `export const instant = true`
apps/web/src/components/products/product-form.tsx
```
No real API or DB exists, so the lesson's `fetch('https://api.acme.com/...')` and `db.products.*` are replaced by an in-memory store with a 300ms simulated read and a read counter.

## Enabling the flag broke 12 routes. Each fix:

The lesson's warning ("Before you enable cacheComponents") applied heavily. `next build --debug-prerender` named every failing route and line. Fixes, in the lesson's order of preference:

| Route | Problem | Fix |
| --- | --- | --- |
| `/api/env-check` | `export const runtime = "edge"` is rejected | Removed the export (this was the task-04 edge demo; the build-time vs runtime comparison still works on Node). Added `await connection()` so it stays per-request |
| `/docs/[...slug]`, `/shop/[[...slug]]`, `/users/[id]`, `/profile/[id]` | `await params` outside Suspense (no `generateStaticParams`) | Page is sync and renders a child behind `<Suspense>` that awaits `params` |
| `/error-demo`, `/error-demo/granular` | `headers()` in the layout | Layout renders `<Suspense>` + child that reads `headers()` |
| `/nav-demo` | `connection()` for the whole page + `new Date()` | `connection()` moved into one `<RenderedAt>` child behind Suspense; rest of the page prerenders |
| `/nav-demo/redirect-demo` | `cookies()` | Read behind Suspense; `redirect()` still fires |
| `/data-demo` | `connection()` + `performance.now()` for the whole page | Heading is in the shell; timings in a Suspense child that calls `connection()` |
| `/demo/counter` | `new Date()` | `"use cache"` + `cacheLife('seconds')` child behind Suspense (lesson recipe #1) |
| `/demo/dialog` | `new Date()` | `"use cache"` + `cacheLife('hours')`, rendered behind Suspense inside the dialog |
| `/security-demo` | `new Date()` in the fake DB row | Deterministic stored timestamp (a real row holds a stored value, not "now") |

Result: build passes; routes are ○ static or ◐ partial prerender; only the API handlers and the proxy are dynamic.

## Done-When

- [x] Static shell prerendered: build output shows `◐ /products/[id]` (partial prerender); the raw HTML of `/products/456` contains the `<h1>Product Details</h1>`, the footer and the skeleton fallback before streaming.
- [~] "Next.js DevTools reports the navigation as instant": `export const instant = true` is set on the product route and the dev server logged **no** blocking/instant warnings for `/products/*`, `/about`, `/nav-demo`. The DevTools Navigation Inspector UI was not opened (visual tool).
- [x] Cached data: three requests to `/products/123` returned the same entry ("cache entry read #1", identical timestamp). Different id → separate entry.
- [x] `updateTag()` → next render fresh: edited price 99→120 and inventory 40→25 via the form; the same render showed `$120 / 25` and "cache entry read #2" with a new timestamp, with no page reload. A later request also returned the new entry.
- [x] Build output shows cache config: the `Revalidate`/`Expire` columns appear (e.g. `/demo/dialog` 1h / 1d).
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass; no console errors on `/products/789`.

## Findings

- **`Cache-Control` on the cached page is `private, no-cache, no-store`.** The lesson says to "verify cache headers in the Network tab". On a self-hosted `next start` the page response is not publicly cacheable; the cache is the server-side Next cache (what I measured via the read counter). `x-nextjs-stale-time: 300` (the profile's `stale`) and `x-nextjs-prerender: 1` are the useful headers.
- **`revalidate`/`expire` columns:** `/products/[id]` shows none because it is a dynamic route with no params prerendered at build; only `/demo/dialog` (fully cached) shows `1h / 1d`.
- **`/products/does-not-exist` returns HTTP 200 with the 404 page.** `notFound()` is called inside a Suspense child after streaming started, so the status is already sent (the page body is the not-found UI; `noindex` is present). The lesson's hint "sets HTTP 404 *when called before streaming starts*" applies. To get a real 404 the existence check would have to happen before the shell flushes.
- **`connection()` is now an anti-pattern here.** It survived only in two Suspense children (`/data-demo` timings, `/nav-demo` timestamp) where the content genuinely is request-time.
- **In-memory store resets on restart and is per server instance.** Fine for a demo; on Vercel (multiple instances) edits wouldn't be shared.
- **Task 04's edge demo** (`/api/env-check` runtime comparison) loses its "edge" half permanently. Cache Components and edge are mutually exclusive in Next 16.
- **Task 12 follow-up:** page-level form state (`/nav-demo/form-demo`) might now survive back navigation because Cache Components enables `<Activity>`. Not re-tested in this task.
