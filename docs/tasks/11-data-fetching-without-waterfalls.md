# 11: Data Fetching Without Waterfalls (Section 2.5)

- Status: done (side quest "request deduplication" not done)
- Branch: `feat/core-parallel-fetch` (merged to `main`, branch kept)
- Source: https://vercel.com/academy/nextjs-foundations/data-fetching-without-waterfalls
- Concepts: `Promise.all` vs sequential awaits, `Promise.allSettled` for partial failure, `await params` inside `Promise.all`, `connection()` to measure per request

## Files

```
apps/web/src/app/data-demo/data.ts     simulated fetchUser (200ms), fetchPosts (300ms), fetchStats (250ms)
apps/web/src/app/data-demo/page.tsx    before/after timing, allSettled rendering, failure banner
apps/web/src/app/users/[id]/page.tsx   await params inside Promise.all
```

## Done-When (verified, production server)

- [x] `/data-demo` shows "Parallel fetch completed in Nms": 301-302ms across 3 requests
- [x] Sequential reference in the same request: 753-773ms (lesson: ~750ms)
- [x] One `Promise.allSettled` call for all three fetches; no sequential awaits for independent data (the sequential measurement is a separate, timing-only function)
- [x] Server log has the before/after line: `[data-demo] sequential=754ms parallel=302ms (saved ~452ms)`
- [x] Partial failure (temporary failing `fetchPosts`): page returns 200, shows "Some data failed to load: posts", renders user and stats, logs `fetch "posts" failed`. Failing source removed afterwards.
- [x] `/users/42` renders with `await params` in `Promise.all` (200)
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass; no browser console errors on `/data-demo`

## Deviations / findings

- **`connection()`:** the page would be prerendered (○) and the timings frozen at build time. `await connection()` opts it out (ƒ). The lesson's solution uses it too.
- **Measurement must not break the page.** First draft ran the sequential timing with plain awaits, so the forced failure returned 500. The timing helper now catches each failure, and only the `allSettled` call decides what renders.
- **One request set.** An earlier draft fetched twice (sequential timing plus parallel). The final page makes the parallel fetch once; the sequential timing is an extra measurement only.
- Lesson's Step 4 `dashboard/page.tsx` was not added as a separate route; its `allSettled` logic lives in the demo page instead.
- Lesson 1 `Promise.all` + `Promise.allSettled` both shown in code. `Promise.all` is in the lesson's `users/[id]` example.
- The lesson's `console.log` `biome-ignore` comments dropped (rule not enabled).
