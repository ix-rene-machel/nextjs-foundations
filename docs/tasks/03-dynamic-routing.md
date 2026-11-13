# 03: Dynamic Routing

- Status: done (side quest not done)
- Source: https://vercel.com/academy/nextjs-foundations/dynamic-routing
- Concepts: `[slug]`, async `params`, `notFound()`, `generateStaticParams`, `dynamicParams`, `[...slug]` vs `[[...slug]]`

## Steps (from lesson)

1. Read existing `apps/blog/src/app/[slug]/page.tsx` (async params, `notFound()`). Nothing to change.
2. Add `generateStaticParams` (top 10 posts) to that file.
3. Read blog index `apps/blog/src/app/page.tsx`. Nothing to change.
4. Catch-all practice in `apps/web`: `docs/[...slug]` (required) and `shop/[[...slug]]` (optional).

## Files

```
apps/blog/src/app/[slug]/page.tsx        (+ generateStaticParams)
apps/web/src/app/docs/[...slug]/page.tsx
apps/web/src/app/shop/[[...slug]]/page.tsx
```

## Done-When (verified)

- [x] Async params usage understood: `params: Promise<{ slug: string }>`, `await params` before use
- [x] `generateStaticParams` added; `pnpm build` blog: `● /[slug]` with 10 prerendered paths (3 listed + "[+7 more paths]")
- [x] Blog index renders (200) with 10 posts; post pages render (200)
- [x] `notFound()` path: temporarily forced `slug === 'test-not-found'` → 404; reverted
- [x] Catch-all (dev server): `/docs` 404, `/docs/api` 1 segment, `/docs/api/auth/oauth` 3 segments, `/shop` "All Products", `/shop/electronics` depth 1, `/shop/electronics/phones/iphone` depth 3
- [x] Build: web `/docs/[...slug]` ƒ, `/shop/[[...slug]]` ƒ. `pnpm check-types` and `pnpm lint` pass.

## Findings

- **Data is not stable across processes (`@repo/api/blog`). Production only.** Posts are Faker-generated (unseeded) and memoized per process (`cachedPosts`). Verified by comparing each index link title with the post page `<h1>`: `next dev` 0/10 mismatches (single process, shared cache), `next build` + `next start` 10/10 mismatches. In prod the static index is rendered in a build worker, post pages render on demand in another process, and `generateStaticParams` ran in a third: the 10 prerendered slugs and the 10 index links had 0 overlap. `fetchPostBySlug` then generates a random post for the unknown slug (title on index "Arbitro vesper…" vs post `<h1>` "Adeo corrumpo…"). Likely pre-existing (index already static, posts already on-demand); not re-tested on the pre-change code. Fix would be `faker.seed(...)` in `packages/api/src/blog.ts`; not done because the course rules say not to modify shared packages unless instructed.
- `fetchPostBySlug` never returns `null`, so `notFound()` never fires naturally (lesson anticipates this; tested with the forced slug).
- Blog `[slug]` page has `● /[slug]` but `dynamicParams` is the default `true`, so unknown slugs still render on demand.
- Slugs from Faker's `slugify` end with a trailing `.` (sentence period). Cosmetic.
- Catch-all pages use the index as `key` with a `biome-ignore` (segments can repeat). Lesson code used `key={i}` without it; Biome flags it.

## Notes

- Side quest (dynamic metadata with OG images) not done.
- Lesson shows `readingTime`/`publishedAt` variants; the existing file already has the fuller version.
