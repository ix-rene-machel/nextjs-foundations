# Architecture

## Monorepo

```
apps/web     @repo/web   Next 16.4.5, port 3000, Vercel project root
apps/blog    @repo/blog  Next 16.4.5, port 3001
packages/ui  @repo/ui    Tailwind 4 + shadcn-style (Button, cn util, globals.css)
packages/api @repo/api   Faker mock data, async fetch* functions
```

Workspaces: `apps/*`, `packages/*` (`pnpm-workspace.yaml`). Turbo tasks: `build` (cached, outputs `.next/**`), `check-types`, `dev` + `start` (persistent, uncached).
Packages are consumed as source (no build step); `next.config.ts` in both apps is empty (no `transpilePackages`, no image config).

## apps/web routes (`src/app`)

| Route | File | State |
| --- | --- | --- |
| `/` | `page.tsx` | placeholder ("TODO: Content") |
| `/about` | `(marketing)/about/page.tsx` | done (task 01): marketing layout, 2s fake fetch, `loading.tsx`, static metadata |
| `GET /api/ping` | `api/ping/route.ts` | done (task 01) |
| `/docs/[...slug]` | `docs/[...slug]/page.tsx` | done (task 03): required catch-all, `/docs` is 404 |
| `/shop/[[...slug]]` | `shop/[[...slug]]/page.tsx` | done (task 03): optional catch-all |
| `/gallery` | `gallery/page.tsx` | plain `<img>` with picsum URLs, to convert to `next/image` |
| `/profile/[id]` | `profile/[id]/page.tsx` | sequential awaits in `ProfileContent` inside `Suspense` |
| `/env-demo` | `env-demo/page.tsx` | done (task 02): server vs. client env display, counter, `Collapsible` composition |
| `POST /api/analytics` | `api/analytics/route.ts` | logs unvalidated JSON |
| `GET,POST /api/transactions` | `api/transactions/route.ts` | mock; POST body unvalidated |

Special files: `(marketing)/layout.tsx`, `(marketing)/error.tsx` (client boundary, `retry`), `about/loading.tsx`, global `not-found.tsx`.

Theme: `ThemeScript` (inline script in `<head>`) + `ThemeToggle` (client), `data-theme` on `<html>`, tokens in `globals.css`.

`layout.tsx`: title from `NEXT_PUBLIC_APP_NAME`; hand-rolled GA via raw `<script>` when `NEXT_PUBLIC_GA_ID` is set (uses `dangerouslySetInnerHTML`, Biome rule disabled for this file).

## apps/blog routes

| Route | File |
| --- | --- |
| `/` | `page.tsx`: `fetchPosts(10)` |
| `/[slug]` | `[slug]/page.tsx`: `fetchPostBySlug`, `notFound()`, async `params`, `generateStaticParams` (top 10) |

## packages/api

- `blog`: `fetchPosts(limit, offset)`, `fetchPostsByCategory`, `fetchPostBySlug`, `searchPosts`, type `BlogPost`
- `brand`: `fetchTeamMembers`, `fetchGalleryItems`, `fetchTestimonials`, `fetchServices`, `fetchContactInfo`, `fetchCompanyStats`, `fetchFAQs`, `fetchClients`, `submitContactForm`, `subscribeNewsletter`, `fetchGalleryCategories`, `fetchDepartments`
- `gallery`: `getGalleryItems(limit)`

Data is Faker-generated and NOT seeded: memoized per process only, so separate build workers see different posts (see task 03 findings). `fetchPostBySlug` generates a random post for unknown slugs instead of returning `null`. Simulated latency via timeouts.

## Environment variables

| Var | Scope | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_NAME` | client+server | page title |
| `NEXT_PUBLIC_SITE_URL` | client+server | `.env.example` only |
| `NEXT_PUBLIC_GA_ID` | client+server | optional, empty until Third-Party Scripts lesson |
| `INTERNAL_CONFIG` | server only | `undefined` in Client Components |
| `VERCEL_OIDC_TOKEN` | server | written by `vercel env pull`; secret |

Source of truth is Vercel; `apps/web/.env.local` is pulled. `.env.example` at repo root is the template.

## Tooling notes

- `pnpm check` is the same as `pnpm lint` (no format check).
- `biome.jsonc` `$schema` is 2.5.9 while installed CLI is 2.6.6, so lint prints a "migrate" info message. Harmless.
- Baseline at analysis time: `pnpm lint` and `pnpm check-types` pass.
