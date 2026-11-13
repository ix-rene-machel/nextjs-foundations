# Architecture

## Monorepo

```
apps/web     @repo/web   Next 16.4.5, port 3000, Vercel project root
apps/blog    @repo/blog  Next 16.4.5, port 3001
packages/ui  @repo/ui    Tailwind 4 + shadcn-style (Button, Dialog compound component (named exports), cn util, globals.css)
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
| `/security-demo` | `security-demo/page.tsx` | done (task 04): DAL (`lib/server`, `server-only`) → DTO → `UserCard` |
| `GET /api/env-check` | `api/env-check/route.ts` | task 04: edge runtime env demo (edge is deprecated) |
| `/error-demo` | `error-demo/{layout,page,error}.tsx` | tasks 05 + 09: server (`?throw=true`) and client (button) errors, nested boundary with correlation ID (`x-request-id`) |
| `/error-demo/granular` | `error-demo/granular/page.tsx` | task 09 side quest: `catchError` widget boundaries, form draft preserved |
| `/posts`, `/posts/[slug]` | `posts/**` | task 09: `notFound()` + nested `not-found.tsx` |
| `GET /api/debug` | `api/debug/route.ts` | task 06: echoes `x-request-id`/`x-pathname` set by the proxy |
| `/demo/counter`, `/demo/cards` | `demo/*/page.tsx` | done (task 07): Server pages + small client wrappers; both ○ static |
| `/demo/dialog` | `demo/dialog/page.tsx` | done (task 08): shared `@repo/ui` Dialog, server children inside |
| `/`, `/about` | `(marketing)/{layout,page}.tsx`, `about/page.tsx` | task 10: marketing chrome (header, nav incl. Dashboard link, footer). Home moved under the route group |
| `/dashboard/*` | `dashboard/{layout,page}.tsx`, `analytics/`, `settings/` | task 10: sidebar layout, persists across sibling pages; page state resets |
| `/data-demo` | `data-demo/{page,data}.ts(x)` | task 11: parallel vs sequential timing, `allSettled` partial failure (ƒ, `connection()`) |
| `/users/[id]` | `users/[id]/page.tsx` | task 11: `await params` inside `Promise.all` |
| `/gallery` | `gallery/page.tsx` | plain `<img>` with picsum URLs, to convert to `next/image` |
| `/profile/[id]` | `profile/[id]/page.tsx` | sequential awaits in `ProfileContent` inside `Suspense` |
| `/env-demo` | `env-demo/page.tsx` | done (task 02): server vs. client env display, counter, `Collapsible` composition |
| `POST /api/analytics` | `api/analytics/route.ts` | logs unvalidated JSON |
| `GET,POST /api/transactions` | `api/transactions/route.ts` | mock; POST body unvalidated |

Special files: `(marketing)/layout.tsx`, `(marketing)/error.tsx` (client boundary, `retry`), `about/loading.tsx`, root `error.tsx` + global `not-found.tsx` (task 05), `error-demo/error.tsx`. No `global-error.tsx` yet.

Root layouts (web + blog): `<body>` carries no classes; `container mx-auto px-4 py-8` sits on a wrapper `<div>` because Radix's scroll lock overrides `body` margin/padding (task 08).

Theme: `ThemeScript` (inline script in `<head>`) + `ThemeToggle` (client), `data-theme` on `<html>`, tokens in `globals.css`.

`layout.tsx`: title from `NEXT_PUBLIC_APP_NAME`; hand-rolled GA via raw `<script>` when `NEXT_PUBLIC_GA_ID` is set (uses `dangerouslySetInnerHTML`, Biome rule disabled for this file).

## apps/blog routes

| Route | File |
| --- | --- |
| `/` | `page.tsx`: `fetchPosts(10)` |
| 404 | `not-found.tsx` | custom (task 05) |
| `/demo/dialog` | `demo/dialog/page.tsx` | done (task 08): shared Dialog from `@repo/ui` |
| `/demo/boundary` | `demo/boundary/page.tsx` | done (task 07): Server page + local `Counter` client component |
| `/[slug]` | `[slug]/page.tsx`: `fetchPostBySlug`, `notFound()`, async `params`, `generateStaticParams` (top 10) |

## packages/api

- `blog`: `fetchPosts(limit, offset)`, `fetchPostsByCategory`, `fetchPostBySlug`, `searchPosts`, type `BlogPost`
- `brand`: `fetchTeamMembers`, `fetchGalleryItems`, `fetchTestimonials`, `fetchServices`, `fetchContactInfo`, `fetchCompanyStats`, `fetchFAQs`, `fetchClients`, `submitContactForm`, `subscribeNewsletter`, `fetchGalleryCategories`, `fetchDepartments`
- `gallery`: `getGalleryItems(limit)`

Data is Faker-generated and NOT seeded: memoized per process only, so separate build workers see different posts (see task 03 findings). `fetchPostBySlug` generates a random post for unknown slugs instead of returning `null`. Simulated latency via timeouts.

## Proxy

`src/proxy.ts` (task 06): runs on every request except `_next/static`, `_next/image`, `favicon.ico`. Logs `[Proxy] METHOD /path`, adds request headers `x-request-id`, `x-pathname`, and response headers `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-Request-Id`. Node.js runtime only.

## Environment variables

| Var | Scope | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_NAME` | client+server | page title |
| `NEXT_PUBLIC_SITE_URL` | client+server | `.env.example` only |
| `NEXT_PUBLIC_GA_ID` | client+server | optional, empty until Third-Party Scripts lesson |
| `INTERNAL_CONFIG` | server only | `undefined` in Client Components |
| `VERCEL_OIDC_TOKEN` | server | written by `vercel env pull`; secret |

Validation: Zod schemas in `src/lib/env-schema.ts`, enforced in `next.config.ts` (dev/build/start) and `src/instrumentation.ts` (server start). Server code reads env via `getServerEnv()` (`src/lib/server/env.ts`).

Source of truth is Vercel; `apps/web/.env.local` is pulled. `.env.example` at repo root is the template.

## Tooling notes

- `pnpm check` is the same as `pnpm lint` (no format check).
- `biome.jsonc` `$schema` is 2.5.9 while installed CLI is 2.6.6, so lint prints a "migrate" info message. Harmless.
- Baseline at analysis time: `pnpm lint` and `pnpm check-types` pass.
