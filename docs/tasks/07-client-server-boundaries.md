# 07: Client-Server Component Boundaries (Section 2, Core Features)

- Status: done (side quest "hybrid data dashboard" not done)
- Source: https://vercel.com/academy/nextjs-foundations/client-server-boundaries
- Concepts: decision model server vs client, small client wrappers, server `children` through a client boundary, bundle impact

## Steps (from lesson solution)

1. `web`: `/demo/counter` (Server page + `Counter` client widget)
2. `web`: `/demo/cards` (Server page, `ExpandableWrapper` client wrapper, server-rendered cards as `children`)
3. `blog`: `/demo/boundary` + local copy of `Counter`

## Files

```
apps/web/src/app/demo/{counter,cards}/page.tsx
apps/web/src/components/{counter,expandable-wrapper}.tsx
apps/blog/src/app/demo/boundary/page.tsx
apps/blog/src/components/counter.tsx
```

## Done-When (verified, production build, chrome-devtools)

- [x] `/demo/counter`: `+` increments without reload (3x `+`, 1x `-` → 2; navigation type unchanged)
- [x] Server timestamp unchanged after clicks (`sameTimestamp: true`)
- [x] `/demo/cards`: Collapse hides the cards (button → "Expand", `aria-expanded=false`), Expand restores them
- [x] No network requests while clicking the counter (0 new resource entries)
- [x] Page source of `/demo/cards` contains Widget Pro / Gadget Plus / Tool Master and prices (server-rendered HTML)
- [x] Blog `/demo/boundary`: counter 10 → 12; no console errors
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` (both apps) pass

## Requirement 2: decision log

| Component | Decision | Why |
| --- | --- | --- |
| `demo/counter/page.tsx`, `demo/cards/page.tsx`, blog `demo/boundary/page.tsx` | Server | Static markup, data access, no hooks/handlers |
| `Counter` | Client | `useState` + `onClick` (browser interactivity). Minimal: one hook, imports only `Button` |
| `ExpandableWrapper` | Client | `useState` for the toggle; renders `children` it never inspects |
| Product cards | Server (passed as `children`) | Static content; their code and data never ship |

## Requirement 3: no secrets in client boundaries

`counter.tsx`, `expandable-wrapper.tsx` (web) and `counter.tsx` (blog) read no `process.env`, import no `lib/server/*`, and receive only primitives (`initialCount`, `title`) plus `children`.

## Requirement 4: bundle impact (production build, measured)

- **Server children never reach the client bundle.** Searching all client JS chunks in `.next/static`: product strings ("Widget Pro", "Professional-grade widget", "Product Catalog", "Server-Rendered Content") appear in **0** chunks. Only the wrapper's own "Collapse" label is in client JS.
- **Anti-pattern comparison** (temporary page, deleted): same cards, but the whole page as one `'use client'` component. The product strings now appear in **1** client chunk. Initial JS for the route: 621.1 KB raw / 191.4 KB gzip (pattern) vs 621.6 KB / 191.6 KB (anti-pattern).
- **Honest reading:** with 3 tiny cards the size difference is ~0.5 KB, i.e. noise. The measurable difference here is *what* ships (data + markup code in the bundle), not *how much*. It scales with the size of the subtree you pull across the boundary or its imports (a heavy library inside the client boundary would show up).
- Baseline: pages without any demo components ship ~588 KB raw / ~181 KB gzip of initial JS (framework + the theme toggle). The demo routes add ~32 KB raw / ~10 KB gzip (one extra shared chunk, the `Button` + `class-variance-authority`/`clsx`/`tailwind-merge` stack from `@repo/ui`).
- Measured from `<script src>` tags in the initial HTML (not lazy chunks).
- `pnpm next analyze` (Turbopack bundle analyzer, 16.1+) exists in this version but starts an interactive UI server, so it wasn't run here. Run it manually (`cd apps/web && pnpm exec next analyze`) to inspect module-level sizes.

## Findings / deviations

- **`/demo/counter` is statically prerendered (○).** "Server timestamp" is the *build* time, so it can never change on request, regardless of client clicks. The lesson's check ("timestamp doesn't change when clicking") passes trivially. To show per-request server rendering, make the page dynamic (e.g. `export const dynamic = "force-dynamic"` or read `headers()`); not changed to keep the lesson's solution intact.
- **Cookie-based theme/proxy:** proxy runs on these routes (task 06) but doesn't influence them.
- Lesson uses `interface` for props; changed to `type` per project style. Added `aria-label`s to `+`/`-`, `<output aria-live="polite">` for the count and `aria-expanded` on the toggle (a11y, not in lesson).
- Lesson's commit/branch step (`git push -u origin feat/core-boundaries`) not followed: this repo works on `main`.
- Blog duplicates `Counter` (as the lesson's file structure says). Promoting it to `@repo/ui` would avoid the copy but the course says not to modify shared packages unless instructed.
