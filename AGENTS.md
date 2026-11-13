# Next.js Foundations (Vercel Academy certification)

Turborepo + pnpm monorepo. Goal: complete certification tasks (supplied as markdown in `docs/tasks/`) by evolving intentionally unfinished starter code. Docs index: [`docs/README.md`](docs/README.md).

## Workflow for a task

1. Task markdown goes in `docs/tasks/NN-name.md` (copy `docs/tasks/_template.md`).
2. Read it, then read `docs/exercises.md` (map of starter TODOs) and the relevant bundled Next docs (see below).
3. Implement in `apps/web` or `apps/blog`. Do not touch `packages/*` unless the task says so.
4. Run `pnpm check-types && pnpm lint && pnpm build`. Fix before reporting done.
5. Record outcome and decisions in the task file (Status, Notes). Put reusable learnings in `docs/notes/`.

## Stack (verify in `package.json`, do not assume)

Next.js 16.4.5 (App Router, async request APIs), React 19.3, TypeScript 5.9 strict, Tailwind 4, Zod 4, Biome 2 (no ESLint/Prettier), Turborepo, pnpm 10.34.5, Node 24.x.

## Layout

| Path | Purpose | Port |
| --- | --- | --- |
| `apps/web` | Marketing site; Vercel project root (`.vercel/repo.json` → `apps/web`) | 3000 |
| `apps/blog` | Content hub, uses `@repo/api/blog` | 3001 |
| `packages/ui` | Shared shadcn-style components (`@repo/ui`) | – |
| `packages/api` | Faker-based mock data (`@repo/api`) | – |

Details: [`docs/architecture.md`](docs/architecture.md).

## Commands

```bash
pnpm dev                          # both apps
pnpm dev --filter @repo/web       # one app
pnpm check-types                  # next typegen + tsc, all packages
pnpm lint                         # biome lint
pnpm format                       # biome format --write
pnpm build                        # turbo build
pnpm add <pkg> --filter @repo/web # add dep to one workspace
```

Vercel CLI is installed, authenticated and linked (project `nextjs-foundations`, team `team_WEubgFNeuXdzA7AWn8uOFfEB`). Run Vercel commands from `apps/web`: `vercel env pull`, `vercel list`, `vercel logs <url>`, `vercel --prod`. See [`docs/vercel.md`](docs/vercel.md).

## Imports

- `@/*` → app-local `src/*`
- `@repo/ui/components/button`, `@repo/ui/lib/utils`, `@repo/ui/globals.css`
- `@repo/api/blog`, `@repo/api/brand`, `@repo/api/gallery` (exports map `./*` → `src/*.ts`)

Check each app's `tsconfig.json` paths before importing; `apps/blog` maps `@repo/ui/*` to `packages/ui/src/*`.

## Conventions

- Server Components by default; add `'use client'` only for state/effects/browser APIs.
- Next 16: `params`/`searchParams`/`cookies()`/`headers()` are Promises, `await` them.
- Use `next/image`, `next/link`, `next/font`, `next/script`; never `<img>`/`<head>`.
- Strict TS (`noUncheckedIndexedAccess` etc.), no `any`, use `unknown` + type guards, `type` over `interface`, explicit return types on functions.
- Validate external input (route handlers) with Zod.
- Env: `NEXT_PUBLIC_*` is bundled to the browser; everything else is server-only. Never commit `.env*` (gitignored). `apps/web/.env.local` holds a Vercel OIDC token; never print it.
- Biome quote style differs per area (`apps/web` double, `apps/blog` + `packages/*` single, plus overrides in `biome.jsonc`). Run `pnpm format` instead of hand-formatting. Lint rules in `.rules`.
- Any `// biome-ignore ... intentional` marks an exercise; remove it when solving that exercise.

## Next.js docs: use these, not training data

Bundled version-matched docs: `apps/web/node_modules/next/dist/docs/` (`01-app/` = App Router guides + API reference). Grep there first; fall back to https://nextjs.org/docs.

## Don't

- Don't refactor outside the task scope; later tasks build on the current state.
- Don't remove exercise TODO comments until that exercise is actually done.
- Don't commit unless asked.
