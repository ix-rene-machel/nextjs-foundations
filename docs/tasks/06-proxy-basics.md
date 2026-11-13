# 06: Proxy Basics

- Status: done (side quest "geolocation-based redirects" not done)
- Source: https://vercel.com/academy/nextjs-foundations/proxy-basics
- Concepts: `proxy.ts` (replaces `middleware.ts` in Next 16), `NextResponse.next()`, request vs response headers, `config.matcher`, request lifecycle

## Steps (from lesson)

1. `apps/web/src/proxy.ts`: log request, set security headers, matcher excluding `_next/static`, `_next/image`, `favicon.ico`
2. Lifecycle (reading only): `next.config` headers/redirects → proxy → route matching → render
3. Forward `x-request-id` / `x-pathname` as **request** headers, `X-Request-Id` as response header (final solution file includes steps 1+3)
4. `app/api/debug/route.ts` reads them via `headers()`

## Files

```
apps/web/src/proxy.ts
apps/web/src/app/api/debug/route.ts
```

## Done-When (verified)

- [x] `proxy.ts` at `apps/web/src/proxy.ts`; build output lists `ƒ Proxy (Middleware)`
- [x] `X-Frame-Options: DENY` on page responses (curl on prod build; fetch in browser on dev)
- [x] `X-Content-Type-Options: nosniff` on page responses
- [x] `[Proxy] GET /` appears in server logs (prod stdout; dev writes to `.next/dev/logs/next-development.log`)
- [x] `/api/debug` returns `requestId` + `pathname`; the id equals the `X-Request-Id` response header and is new per request
- [x] Static assets not matched: `/_next/static/*.css` returns 200 with no `X-Frame-Options`, and no `[Proxy] ... _next` log lines (0)
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass

## Notes / deviations

- Lesson keeps `biome-ignore ... noConsole`; that rule isn't enabled here (flagged as unused), so `console.log` has no suppression comment.
- Added explicit return type `NextResponse` and `??` instead of `||` per project TS style.
- The proxy matcher also matches `/api/*`, unknown URLs (404 responses get `X-Frame-Options` too) and RSC/prefetch requests. Keep the function cheap.
- `proxy.ts` runs on every matching request, including the 404 for `/nope` and the dev `/api` calls. The `[Proxy]` log is noisy; remove or gate it before shipping.
- Verified `proxy.ts` coexists with `instrumentation.ts` (task 04) and `next.config.ts` env validation.
- `X-Frame-Options: DENY` blocks embedding this app in any iframe, including your own pages. `X-Content-Type-Options: nosniff` is harmless. No CSP or HSTS yet (not in lesson).
- A first browser `fetch` right after navigation failed with "Failed to fetch" while the dev server was recompiling; the retry succeeded. No console errors.
- The Vercel runtime note in the docs: proxy is Node.js runtime only; `runtime` can't be set in this file. Compare with task 04's edge `env-check` route (route handlers can still set it, but it is deprecated).
