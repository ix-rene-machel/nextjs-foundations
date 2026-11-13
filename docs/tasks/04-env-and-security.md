# 04: Environment and Security

- Status: done (incl. side quest and Layer 4 tainting)
- Source: https://vercel.com/academy/nextjs-foundations/env-and-security
- Concepts: env load order, `NEXT_PUBLIC_` build-time inlining, `server-only`, Data Access Layer, DTOs, Zod env validation, edge vs Node env access

## Steps (from lesson)

1. `pnpm add server-only --filter @repo/web`
2. DAL `lib/server/db.ts` (`import "server-only"`)
3. DTO `lib/server/user-dto.ts` (id, name, createdAt only)
4. `/security-demo` Server Component → passes DTO to `UserCard`
5. `UserCard` Client Component
6. Bad import test (`bad-import.tsx` + `test-bad-import` page) → build fails; files removed
7. `.env.example` documents public + server-only vars

## Files

```
apps/web/src/lib/server/{db,user-dto,env}.ts   server-only
apps/web/src/lib/env-schema.ts                  Zod schemas, runtime-agnostic
apps/web/src/instrumentation.ts                 validates env on server start
apps/web/src/app/security-demo/page.tsx
apps/web/src/app/api/env-check/route.ts         edge demo
apps/web/src/components/user-card.tsx
apps/web/next.config.ts                         validates env on dev/build/start
.env.example                                    + DATABASE_URL
```

## Done-When (verified)

- [x] `pnpm list server-only --filter @repo/web` → `server-only@0.0.1`
- [x] `lib/server/db.ts` starts with `import "server-only"`
- [x] Build fails with the bad import: "Turbopack build failed … You're importing a module that depends on "server-only"" at `db.ts:1:1`. Test files deleted afterwards.
- [x] `/security-demo` shows name, ID, joined date (browser). Prod HTML and all client JS chunks contain none of `passwordHash`, `bcrypt`, `user@example.com`, `VIP customer`, `server-only-value`.
- [x] `.env.example` documents public and server-only variables
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass; no console errors

## Deviations

- **`.env.example` location:** lesson says `apps/web/.env.example`, but `apps/web/.gitignore` has `.env*`, so it could not be committed. Updated the existing root `.env.example` instead (README already points there). Added `DATABASE_URL`.
- **Hydration error in lesson's `UserCard`:** `toLocaleDateString()` without arguments uses the server locale (`11/13/2026`) and the browser locale (`13/11/2026`), so hydration failed. Fixed with `toLocaleDateString("en-US", { timeZone: "UTC" })`.
- Bad-import error text differs from lesson (Next 16.4 says "…but you are using it in the Pages Router", 4 errors instead of 2). Same protection.
- DAL reads `INTERNAL_CONFIG` via validated `getServerEnv()` instead of `?? "default"` (a missing value now fails loudly).

## Side quest: runtime env validation with Zod

Layers:

| When | Where | Effect on bad config |
| --- | --- | --- |
| `next dev` / `next build` / `next start` | `next.config.ts` → `validateEnv()` | process exits before compiling ("Failed to load next.config.ts") |
| server instance start (Node + edge) | `instrumentation.ts` `register()` | "Failed to prepare server", requests 500. Last line of defense if config is loaded elsewhere (e.g. a platform that only runs the built output) |
| first use | `getServerEnv()` (memoized, `server-only`) | typed access in the DAL |

Verified: `INTERNAL_CONFIG= DATABASE_URL=not-a-url pnpm build` fails listing both problems; `INTERNAL_CONFIG= next start` (config check disabled temporarily) fails in the instrumentation hook.

Schema notes: empty string treated as unset; optional `DATABASE_URL`/`NEXT_PUBLIC_SITE_URL` validated as URLs when set; errors print names only, never values.

### Challenge: build time vs runtime in edge functions

`/api/env-check` sets `runtime = "edge"` and returns names/flags, never secret values.

- `NEXT_PUBLIC_*` with a static reference is inlined at build. Started the prod server with `NEXT_PUBLIC_APP_NAME="Changed At Runtime"`: `builtWithAppName` stayed `"ACME Corporation"`, while the dynamic lookup `process.env[...]` returned `"Changed At Runtime"`. Changing a public var needs a rebuild.
- Server-only vars are read at request time from the edge `process.env` (`serverEnvValid: true`). Validate lazily, not at module scope.
- `env-schema.ts` has no Node APIs and no `server-only`, so it runs in `next.config.ts`, instrumentation, Node and edge.
- Edge runtime is **deprecated** in Next 16 (bundled docs `route-segment-config/runtime.md`) and incompatible with Cache Components (later lesson). Kept only for this demo; the route is a removal candidate when Cache Components is enabled.

## Notes

- `next.config.ts` imports `./src/lib/env-schema` (Zod). Restart the dev server to pick up config changes.

## Layer 4: data tainting (experimental)

- `next.config.ts`: `experimental: { taint: true }` (the lesson shows `next.config.js`; this repo uses TS). Build output lists `✓ taint`. Bundled doc: `01-app/03-api-reference/05-config/01-next-config-js/taint.md`.
- Side effects of the flag (per docs): switches the app directory to React's **experimental channel** and taints `process.env` itself.
- `lib/server/db.ts`: `getUserFromDB` taints the record with `experimental_taintObjectReference` and the hash with `experimental_taintUniqueValue` (lesson only shows the object API; the value API covers the sensitive string).
- `getUserDTO()` returns a fresh object with only safe fields, so `/security-demo` is unaffected (200, only the name appears).

Verified with a temporary Client Component sink + page (production build; scaffolding deleted afterwards):

| Passed to a Client Component | Result |
| --- | --- |
| `user.name` (single field) | 200, renders |
| `user` (tainted reference) | 500 "Do not pass the full user record to the client…" |
| `user.passwordHash` (tainted value) | 500 "Do not pass password hashes to the client." |
| `process.env` (whole object) | 500 "Do not pass process.env to Client Components…" |
| `{ ...user }` (copy) | **200 and leaks** `email`, `internalNotes`, `VIP customer (config: server-only-value)`. Only `passwordHash` was replaced (the tainted value still blocks that field's value from serializing, shown as a reference). |

Takeaways: taint tracks references, not content. A spread copy or a derived value bypasses it, so the DTO + `server-only` layers remain the primary protection (docs say the same). The error fires at render time, not build time, unlike `server-only`.
