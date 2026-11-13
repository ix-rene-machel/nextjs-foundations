# 01: App Router Basics

- Status: done
- Source: https://vercel.com/academy/nextjs-foundations/app-router-basics
- Concepts: `page`, `layout`, `loading`, `error`, `not-found`, `route.ts`, route groups, Metadata API (static, dynamic, `title.template` inheritance)

## Steps (from lesson)

1. Route group `(marketing)` with layout (header Home/About/Pricing, footer) and `/about` page
2. `GET /api/ping` → `{ ok, timestamp }`
3. `about/loading.tsx` skeleton; about page has a 2s simulated fetch
4. `(marketing)/error.tsx` client boundary using `retry()`
5. Global `not-found.tsx`

## Files

```
apps/web/src/app/
├── (marketing)/{layout,error}.tsx
├── (marketing)/about/{page,loading}.tsx
├── api/ping/route.ts
└── not-found.tsx
```

## Done-When (verified)

- [x] `/about` shows marketing layout. Home/About/Pricing links and footer render (browser snapshot).
- [x] `GET /api/ping` → `{"ok":true,"timestamp":...}`
- [x] `/about` shows skeleton while the 2s fetch runs (`animate-pulse` in streamed HTML, response took ~2.03s)
- [x] `/does-not-exist` → 404 with "Go home" link
- [x] `pnpm build`: `/about` ○, `/api/ping` ƒ
- [x] `pnpm check-types` and `pnpm lint` pass; no console errors on `/about`
- [x] Error boundary tested with a temporary `throw` in the about page: fallback renders inside the layout (header/footer persist). Throw removed afterwards.

## Notes / deviations

- Lesson shows no semicolons / single quotes; code was written in `apps/web` Biome style (double quotes, semicolons).
- `error.tsx` uses the `retry` prop: stable since Next 16.3.0 (`reset` still exists; only use it to skip re-fetching). Verified in bundled docs `01-app/03-api-reference/03-file-conventions/error.md`.
- Static `metadata` was added to the about page (from the Metadata API section, not a numbered step). Root `layout.tsx` still has the plain `title` and no `title.template`, so the about title is just "About Us". Adding the template is optional and would change the title of all pages.
- Marketing nav uses plain `<a>` as in the lesson (full page reload, no prefetch). `next/link` is the better choice, so switch if a later lesson covers navigation.
- `/pricing` is linked but doesn't exist; it returns the global 404.
- `/` (home) is outside the `(marketing)` group, so it doesn't get the marketing layout.
- Side quest (intercepting routes modal) not done.
