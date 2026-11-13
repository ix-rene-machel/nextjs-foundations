# 13: params vs searchParams (Section 2.7)

- Status: done (side quest "validate & canonicalize URLs" not done; Cache Components part out of scope)
- Branch: `feat/core-params-searchparams` (merge to `main` pending)
- App: `apps/blog`
- Source: https://vercel.com/academy/nextjs-foundations/params-vs-searchparams
- Concepts: `params` for identity, `searchParams` for view state, both awaited, URL-driven filters, preserving other params, `useSearchParams` + `useRouter` in a Client Component, Suspense around `useSearchParams`

## Files

```
apps/blog/src/app/page.tsx               listing: await searchParams → category + sort; fetchPosts + fetchCategories in Promise.all
apps/blog/src/components/filter-controls.tsx   'use client': category chips, sort select, Clear, router.push with preserved params
apps/blog/src/app/[slug]/page.tsx        unchanged: params identity (already awaited, from task 03)
```

## Done-When (verified, production build, chrome-devtools)

- [x] `/hello-world`-style detail page renders by `params` (`/adfero-porro-valeo-cado.` → post h1). Unknown slugs still 200 (known: `fetchPostBySlug` invents a post; task 03).
- [x] Clicking "Technology" updates the URL to `?category=Technology` and filters the list to Technology posts only (4 posts), no reload.
- [x] The filtered URL in a **new tab** shows the same category, sort, and the same four titles in the same order.
- [x] Changing sort to title keeps `category=Technology` and adds `sort=title`.
- [x] "Clear filters" returns to `/` with an empty query and all 10 posts.
- [x] Browser back from the cleared view restores the filtered URL and the Technology chip pressed.
- [x] Click a filtered post → `/<slug>` renders via soft navigation (marker survives).
- [x] Code review: listing awaits `searchParams`, detail awaits `params`; both typed as `Promise<...>`.
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` (blog) pass.

## Deviations from the lesson

- **Category names:** the lesson's chips are `Tech` / `General` (fixed mock data). The blog's Faker data uses `Technology`, `Design`, `Business`, etc. The chips are generated from `fetchCategories()` (first 5), so they match real data. The lesson's `?category=tech` URL returns 0 posts on this data, by design of the data, not a bug.
- **Filtering happens in memory** after `fetchPosts(50)`. The mock API has no filter parameter; a real API would take `category`/`sort`/`page` as query arguments.
- **Pagination not implemented.** The lesson mentions a `page` param; the listing shows the first 10 after filtering with no pager. Filter changes do not need a page reset because there is no page yet.
- **Filter component placed inside `<Suspense>`** at the call site, as the lesson's solution does, so the static shell can prerender.
- **Caching section not implemented** (`"use cache"`, `cacheTag`, `cacheLife`): those are Cache Components features in a later lesson, and the lesson itself marks them as such.
- `toLocaleDateString` pinned to `en-US` / UTC (hydration consistency, see task 02).

## Findings

- The blog listing is now dynamic (ƒ): it reads `searchParams`. The detail pages keep `generateStaticParams` (●), so the blog's post routes stay prerendered.
- Chip active state compares category names case-insensitively, so `?category=technology` also highlights the Technology chip.
- The sort select maps any unknown `sort` value to "Newest"; an invalid value cannot break the page.
