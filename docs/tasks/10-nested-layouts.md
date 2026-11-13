# 10: Nested Layouts (Section 2)

- Status: done (side quest "multi-tenant layout system" not done)
- Branch: `feat/core-nested-layout` (from `main`, not pushed yet)
- Source: https://vercel.com/academy/nextjs-foundations/nested-layouts
- Concepts: route groups, section layouts as persistent chrome, layout vs page state, layouts stay mounted across sibling navigation

## Files

```
apps/web/src/app/
├── (marketing)/layout.tsx     marketing chrome (+ "Dashboard →" link)
├── (marketing)/page.tsx       moved from app/page.tsx (now under the group)
└── dashboard/
    ├── layout.tsx             sidebar chrome, "← Back to site"
    ├── page.tsx               overview
    ├── analytics/page.tsx
    └── settings/page.tsx      checkbox + select (page state, not layout state)
```

Root `app/layout.tsx` is unchanged. Its `container` wrapper still works with the sidebar (the `<section>` is `flex-1 min-w-0`).

## Done-When (verified, production build, chrome-devtools)

- [x] `/dashboard` → `/dashboard/analytics`: sidebar is the same DOM node (`===`), attribute survived, no new JS/CSS requests, only the content swapped.
- [x] `/dashboard/analytics` → `/dashboard/settings` (and back): same sidebar node; no new JS/CSS resources.
- [x] `/` → `/about`: marketing header/footer persist (route group, same layout). Verified by HTTP; the browser check of `/`→`/about` was not repeated separately.
- [x] `/` vs `/dashboard`: marketing header + footer vs dashboard sidebar. Cross-section navigation swaps the whole chrome; "← Back to site" returns to the marketing header.
- [x] `/about` works; `/marketing/about` → 404 (route group adds no segment).
- [x] Build: `/`, `/about`, `/dashboard`, `/dashboard/analytics`, `/dashboard/settings` are ○ static. `pnpm check-types`, `pnpm lint`, `pnpm build` pass.
- [ ] "Watch Network tab / layout JS does not re-fetch" — verified via `performance` resource entries (0 new JS/CSS per section switch), not via the DevTools Network panel.

## Findings

- **Layouts keep state; pages do not.** Settings checkbox was checked, then unchecked after leaving and returning to `/dashboard/settings` (new node). That is the lesson's point: lift shared state into the layout or a store if it must survive navigation.
- **`/pricing` 404s.** It's linked in the marketing nav but the page doesn't exist (same as task 01). The only browser console error on `/` is this 404.
- **Home moved under `(marketing)`.** `app/page.tsx` → `app/(marketing)/page.tsx`, so `/` now gets the marketing chrome, which the lesson's tree requires. Before this, `/` had no header/footer.
- **Blog app untouched.** Its `app/layout.tsx` is separate.
- **Dynamic check not run:** `/dashboard` is static (○). Nothing reads request data here.
- Lesson's `DashboardLayout` used `flex min-h-screen`; I used `min-h-[70vh]` because the root body is no longer full-height.
- Lesson code I did not copy: none; file contents follow the lesson's structure with our Biome style (double quotes, `Link` instead of `<a>` for internal links).
