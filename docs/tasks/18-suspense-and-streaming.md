# 18: Suspense and Streaming (Section 3.3)

- Status: done (side quest not done; Slow 3G throttling not run, see "Not done")
- Branch: `feat/advanced-suspense-streaming` (merge to `main` pending)
- Source: https://vercel.com/academy/nextjs-foundations/suspense-and-streaming
- Concepts: `loading.tsx` as a route-level Suspense boundary, one boundary per independent section, skeletons shaped like the content, streaming order

## Files

```
apps/web/src/app/profile/[id]/loading.tsx   route-level skeleton (profile layout)
apps/web/src/app/profile/[id]/page.tsx      ProfileHeader / ProfileStats / ProfileActivity, one Suspense each, shaped skeletons
```

The starter's page ran three fetches one after another inside one boundary (`ProfileContent`). Now each section is its own component and boundary, so they resolve independently.

## Done-When

- [x] Shell arrives first: browser navigation timing shows TTFB 14ms for `/profile/42`; the whole document finished at 626ms.
- [x] Skeleton fallbacks: `loading.tsx` renders before the page's boundaries resolve (the streamed HTML contains `animate-pulse` in the first 4 KB).
- [x] Independent resolution: the server-side stream timeline shows the sections arriving separately, in order: header at ~0.26s (Demo User), stats at ~0.46s (42 posts, 1234 followers), activity at ~0.66s (Recent Activity, Liked a post). The old single boundary delivered all content in one chunk at ~0.68s.
- [~] DevTools Performance recording with multiple chunks: not recorded; the chunk timing above was taken from the raw stream with curl (`-N`), which shows the same behavior.
- [x] No spinner soup: 3 boundaries and 1 route-level skeleton; each fallback is a shape, not a spinner.
- [x] Full page: no leftover skeletons, correct content, no console errors.
- [ ] Slow 3G throttling in DevTools: not run (the Performance-tab step needs a manual recording).

## Deviations and findings

- **Mock timestamps are fixed strings.** The lesson's `new Date()` in mock data would fail Cache Components prerendering (task 16). Same fix as `security-demo`: stored values.
- **`await params` lives in a small child per boundary** (task 16 requirement). So each section awaits params on its own; the page itself stays synchronous.
- **Fallback timing:** the starter's single fallback ("Loading profile...") appeared at the same moment as the first content at ~0.68s, i.e. the old page effectively showed a blank-then-full page. The new page shows the header first.
- **Staggered delays** (200/400/600ms) are my choice so the order is observable; the lesson's values are 200/400/600 as well (its solution).
- The `loading.tsx` skeleton is only seen during navigation or the initial stream when the page segment is not yet ready. With Cache Components, the shell may already include the route's Suspense, so `loading.tsx` shows on client navigations more than on direct loads. I verified the fallbacks exist in the HTML, not visually on navigation.

## Not done

- Slow 3G throttling and a Performance-tab recording (the lesson's Try It steps) need a manual DevTools session.
