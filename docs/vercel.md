# Vercel

- Project: `nextjs-foundations` (`prj_vEfgOAIshMHQJopPbaNOK29M4QCZ`), team `team_WEubgFNeuXdzA7AWn8uOFfEB`
- Link file: `.vercel/repo.json` (gitignored), project directory `apps/web`
- Only `apps/web` is linked. `apps/blog` has no Vercel project yet (create one if a task requires deploying it).
- Root `vercel.json` is only the schema stub.

```bash
cd apps/web
vercel env ls
vercel env pull          # refreshes apps/web/.env.local (contains OIDC token)
vercel list
vercel logs <deployment-url>
vercel                   # preview deploy
vercel --prod            # production deploy
vercel open
```

Env var changes: add via `vercel env add NAME <environment>`, then pull. `NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.
