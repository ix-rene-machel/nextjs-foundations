# Starter exercises (TODO map)

Intentionally unfinished code. Section/lesson numbers come from code comments; confirm against the task markdown.

| Location | Gap | Hint in code |
| --- | --- | --- |
| `apps/web/src/app/page.tsx` | Home placeholder | "TODO: Content" |
| `apps/web/src/app/gallery/page.tsx` | `<img>` → `next/image` (WebP/AVIF, lazy, responsive `sizes`, no layout shift). Remote host needs `images.remotePatterns` in `next.config.ts` | Section 3 Lesson 4 |
| `apps/web/src/app/profile/[id]/page.tsx` | Sequential fetches → `Promise.all` / parallel + Suspense | Section 4 Lesson 2 |
| `apps/web/src/app/api/transactions/route.ts` | Zod validation of POST body | Section 4 Lesson 1 |
| `apps/web/src/app/api/analytics/route.ts` | Validation + proper logging | Section 4 |
| `apps/web/src/app/layout.tsx` | Replace raw GA scripts with `@next/third-parties` / `next/script` | Section 4 Lesson 3 |
| `apps/web/src/app/env-demo/page.tsx` | Env var demo (server vs. client) | Env lesson |

When an exercise is finished, strike it here (`~~row~~`) and link the task file.
