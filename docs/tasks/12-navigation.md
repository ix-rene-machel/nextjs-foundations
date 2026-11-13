# 12: Navigation (Section 2.6)

- Status: done with one deviation (see "Form state"); side quest "breadcrumb generator" not done
- Branch: `feat/core-next-link` (merge to `main` pending)
- Source: https://vercel.com/academy/nextjs-foundations/navigation
- Concepts: `<Link>` soft navigation, plain `<a>` hard navigation, `useRouter` push/back/replace, `redirect()` on the server, Server Action redirect after sign-in

## Files

```
apps/web/src/app/nav-demo/
├── page.tsx                  hub: Link, hard <a>, useRouter buttons, form + redirect links
├── navigation-buttons.tsx    'use client' useRouter push/back/replace
├── page-a/page.tsx           target page
├── page-b/page.tsx           target page
├── form-demo/{page,draft-form}.tsx   draft textarea (Client state)
├── redirect-demo/page.tsx    server redirect() when no session cookie
└── login/page.tsx            Server Action: sign in sets httpOnly cookie, redirects; sign out clears it
```

Adaptations from the lesson's solution (no database or auth in this repo):
- `db.post.create` / `getSession()` / `@/lib/auth` → cookie `session` read with `cookies()`; sign-in/out as Server Actions.
- The lesson's `/posts/new` create form was not added (no DB); the redirect-after-mutation pattern is shown with sign-in instead.

## Done-When (verified, production build, chrome-devtools)

- [x] `/nav-demo` → "Go to Page A": URL `/nav-demo/page-a`, document marker survives → no page reload (soft).
- [x] Browser back from Page A returns to `/nav-demo` (soft, marker survives).
- [x] "Hard nav to Page A" (plain `<a>`): the document marker is gone → full reload.
- [x] `router.push()` → Page A, soft (marker alive), history grows.
- [x] `router.back()` → previous entry, soft.
- [x] `router.replace()` → Page B soft, history length unchanged (8 → 8); browser back then goes to Page A, skipping the `/nav-demo` entry it replaced.
- [x] Server `redirect()`: `/nav-demo/redirect-demo` without cookie → HTTP 307 to `/nav-demo/login` before any protected markup; Sign in (Server Action) sets the cookie and redirects → "Welcome, Demo User!".
- [ ] **Form state across soft navigation + back: NOT preserved** (see below).
- [x] Soft navigation loads only the RSC payload, not full HTML: verified via marker, not via DevTools Network. (Not separately inspected in the Network panel.)
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass; no console errors on the tested pages.

## Form state: deviation from the lesson

The lesson's Page-copy says: "The layout state is preserved during soft navigation" and the demo invites you to type in a form and come back. Measured twice (Link click, then browser back): the **document marker survives** (no reload) but the **textarea is empty** after back. The page component remounts.

Cause (bundled doc `02-guides/preserving-ui-state.md`): Next keeps a page's React and DOM state through `<Activity>` only when **Cache Components** is enabled (`cacheComponents: true`). This app doesn't enable it, and enabling it is a later lesson that changes caching app-wide, so it was not turned on here.

What remains true without it:
- Layout state persists (see task 10: the sidebar DOM node survived).
- Page-level state does not survive back/forward; lift it into a layout, a store, or the URL.

The demo copy was kept but reworded to match reality ("Soft navigation keeps the form state of the layout; a hard navigation clears it") — read that as: it does **not** keep page-level draft state yet.

## Findings

- A Link click is soft, but a `history.back()` into a page with local state still remounts it (see above).
- `/nav-demo` uses `connection()` (ƒ) because the lesson's timestamp must be request-time.
- Hard `<a>` is kept deliberately as the comparison; it carries `biome-ignore`-free markup (lint doesn't flag it).
- Cookie `session` is `httpOnly`, so `document.cookie` can't read it (expected; the redirect flow was checked server-side and in the browser).
- The mock sign-in accepts any submit. It is a demo for the redirect flow only, not authentication.
- Lesson's `biome-ignore lint/a11y/useValidAnchor` comments were not needed (rule doesn't fire) and were removed.
- Focus management (requirement 2: "Ensure focus lands meaningfully after navigation") was not implemented. Page A/B only have a visible `h1` and no focus move; that's an open item. Next.js moves focus to the new route's heading on soft navigation by default; that was not separately verified.
