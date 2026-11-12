# Build with Next.js: starter

> This is the starter for **[Build with Next.js](https://vercel.com/academy/nextjs-foundations)** on Vercel Academy. Start at [lesson 1.1, Project Setup](https://vercel.com/academy/nextjs-foundations/project-setup).

## Run it locally

### Prerequisites

- Node.js 24 (`engines` asks for `24.x`)
- pnpm 10.34.5, from `packageManager` in `package.json`. Run `corepack enable` to get that version.
- A Vercel account and the [Vercel CLI](https://vercel.com/docs/cli)

### Environment variables

The web app reads its variables from `apps/web/.env.local`. Run `vercel link` and `vercel env pull` in `apps/web` to fill it from your Vercel project, or copy `.env.example` there and fill it in:

- `NEXT_PUBLIC_APP_NAME`: the app name in the web app's page title. It's public, so it ends up in the browser bundle.
- `NEXT_PUBLIC_SITE_URL`: the site's public base URL.
- `NEXT_PUBLIC_GA_ID` (optional): a Google Analytics ID. Leave it blank until the Third-Party Scripts lesson.
- `INTERNAL_CONFIG`: a server-only value. It's `undefined` in Client Components, which the course uses to show the difference.

### Commands

```bash
corepack enable
pnpm install
pnpm dev
```

`pnpm dev` runs both apps: `web` on http://localhost:3000 and `blog` on http://localhost:3001.

## About this starter

A Turborepo monorepo for the course.

The starter targets Next.js 16.4 and intentionally leaves selected exercises
unfinished. Those fixtures should be improved as you progress through the course;
the repository itself installs, type-checks, lints, and builds before you begin.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Facademy-starters%2Ftree%2Fmain%2Fnextjs-foundations%2Fstarter&project-name=nextjs-foundations&repository-name=nextjs-foundations&root-directory=apps/web&env=NEXT_PUBLIC_APP_NAME,INTERNAL_CONFIG&envDefaults=%7B%22NEXT_PUBLIC_APP_NAME%22%3A%22ACME%20Corporation%22%2C%22INTERNAL_CONFIG%22%3A%22server-only-value%22%7D&envDescription=Demo%20environment%20variables%20for%20the%20course)

## Other scripts

```bash
# Type check all packages
pnpm check-types

# Build all packages
pnpm build

# Format and lint
pnpm format
pnpm lint
```

## Project Structure

```
starter/
├── apps/
│   ├── web/                    # Marketing site (localhost:3000)
│   └── blog/                   # Content hub (localhost:3001)
├── packages/
│   ├── ui/                     # Shared UI components
│   └── api/                    # Mock data layer (Faker)
├── turbo.json                  # Turborepo configuration
├── biome.jsonc                 # Biome linting/formatting
└── package.json
```

## Apps

- **web** (`apps/web`) - Marketing site running on port 3000
- **blog** (`apps/blog`) - Content hub running on port 3001

## Packages

- **@repo/ui** - Shared React components
- **@repo/api** - Mock data functions using Faker

## Tech Stack

- [Next.js 16.4](https://nextjs.org/) - React framework
- [Turborepo](https://turbo.build/repo) - Monorepo build system
- [pnpm](https://pnpm.io/) - Package manager
- [Biome](https://biomejs.dev/) - Linting and formatting
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Vercel Projects

Create separate Vercel projects for `apps/web` and `apps/blog`, setting the Root
Directory in each project's Build and Deployment settings. The course connects
the two deployments with a Next.js rewrite after both apps are running.

## License

MIT
