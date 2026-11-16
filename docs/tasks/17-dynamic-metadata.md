# 17: Dynamic Metadata Done Right (Section 3.2)

- Status: done (side quests "social preview testing" and "OG image generator" not done)
- Branch: `feat/advanced-dynamic-metadata` (merge to `main` pending)
- Source: https://vercel.com/academy/nextjs-foundations/dynamic-metadata-done-right
- Concepts: `generateMetadata` with direct data access, `metadataBase`, title templates, canonical, OpenGraph and Twitter cards, shallow metadata merge across segments

## Files

```
apps/blog/src/app/layout.tsx          metadataBase = NEXT_PUBLIC_SITE_URL + "/blog"; title template "%s | VAF Blog"; site defaults
apps/blog/src/app/[slug]/page.tsx     generateMetadata: title, description, keywords, authors, canonical, OG (1200x630, article, publishedTime), Twitter summary_large_image; fallback "Post Not Found"
apps/web/src/app/layout.tsx           metadataBase = NEXT_PUBLIC_SITE_URL; title template "%s | <app name>"; OG site defaults
apps/web/src/app/(marketing)/page.tsx canonical "/"
apps/web/src/app/(marketing)/about/page.tsx  canonical "/about"
```

## Done-When (verified on `next build` + `next start`, page source read with curl)

- [x] `og:title` = post title (`Demulceo veritatis socius.`)
- [x] `og:image` absolute (`https://picsum.photos/...` 1200×630; `og:image:width`/`height` set)
- [x] `twitter:card` = `summary_large_image`
- [x] `canonical` absolute: `https://<site>/blog/<slug>`
- [x] `og:type` = `article`; `article:published_time` set; `article:author` set
- [x] No "Failed to parse URL" or relative-fetch errors in server logs
- [x] Through the web proxy (`:3111` → blog `:3110`) the canonical and OG tags are the same.
- [ ] Twitter Card Validator: not run (needs a public URL; see "Not done").

## Deviations and findings

- **The lesson's canonical is wrong for `/blog`.** Its solution sets `canonical: '/${slug}'` with a comment saying it resolves to `/blog/<slug>`. Bundled docs: a relative field is composed with `metadataBase`, and `metadataBase` here ends in `/blog`. With the lesson's `metadataBase` (no `/blog`) the canonical would be `https://host/<slug>`. Fixed: `metadataBase` includes `/blog`, and the relative canonical keeps the slug. Verified in the HTML.
- **`metadataBase` uses `NEXT_PUBLIC_SITE_URL`, not `VERCEL_URL`.** `VERCEL_URL` is a per-deployment host (changes every deploy and isn't the public domain), so canonicals would point at deployment URLs. `NEXT_PUBLIC_SITE_URL` is already declared in `turbo.json` and in the env schema. It has to be set in Vercel for both projects, and the production value is `https://nextjs-foundations-eta-ten.vercel.app` for web. The blog's production domain is `https://nextjs-foundations-blog-two.vercel.app`.
- **OpenGraph merges shallowly across segments.** The post page's `openGraph` replaces the layout's whole object, so `siteName`/`locale` from the layout were lost. Fixed by repeating those two fields in the page (bundled docs describe this).
- **Canonical is per page.** My first attempt set it in the web root layout, so `/about` inherited `/` as its canonical. Moved to the pages.
- **Web app only needed defaults.** It had one static page (`/about`) and no per-page metadata beyond that, so the lesson's "marketing-focused defaults" became: `metadataBase`, title template, and per-page canonicals.
- **Fallback metadata is untested in practice.** The "Post Not Found" branch exists, but `fetchPostBySlug` never returns `null` (task 03 gap), so every slug gets full metadata.
- The lesson's `biome-ignore` / unused import patterns were not copied.

## Not done

- Twitter/Facebook/LinkedIn validators need a publicly reachable URL. The `*.vercel.app` production alias is public, but the blog's production build and its `NEXT_PUBLIC_SITE_URL` must be set first.
- Setting `NEXT_PUBLIC_SITE_URL` on the Vercel projects is a shared-state change. It is required before the blog's canonicals are correct in production.
