# 19: Images with next/image (Section 3.4)

- Status: done (side quest "adaptive image component" not done; Slow 3G throttling and Lighthouse audit not run)
- Branch: `feat/advanced-image-optimization` (merge to `main` pending)
- Source: https://vercel.com/academy/nextjs-foundations/images-next-image
- Concepts: `next/image` with `fill` + aspect ratio, `preload` for the LCP hero, `sizes` for a 2-column grid, `remotePatterns`, `qualities` allowlist, AVIF/WebP negotiation

## Files

```
apps/web/next.config.ts        images: qualities [75, 80, 85], formats [avif, webp], remotePatterns picsum.photos
apps/web/src/app/gallery/page.tsx   hero (fill, preload, quality 85, sizes) + 4 gallery cards (fill, lazy, quality 80, sizes "(max-width: 768px) 50vw, 400px")
```

## Done-When (verified on a production build, curl + chrome-devtools)

- [x] `<link rel="preload" as="image">` in `<head>` for the hero, with a `srcSet` matching its `sizes`
- [x] The hero `<img>` has no `loading="lazy"` (eager), the four gallery `<img>`s have `loading="lazy"`
- [x] Hero requested early and at a large width (`w=1920`, its rendered 832px on a 2× display); gallery cards requested at `w=750`
- [x] Formats: AVIF returned to an `image/avif,image/webp` Accept header; WebP to a WebP-only client; JPEG as fallback
- [x] Cumulative layout shift on `/gallery`: 0 (PerformanceObserver, page load plus scroll to bottom)
- [x] Below-fold images lazy: the gallery images are `loading="lazy"`; the hero loads eagerly
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass; no console errors

## Not done

- **Slow 3G throttling and the "scroll and watch lazy loads" check:** needs manual DevTools throttling.
- **Lighthouse audit:** not run; CLS was measured directly instead (0).
- **Mobile `sizes` breakpoint:** the browser would not go below 555px in this session, so the `max-width: 768px` branch was not observed at a phone width. The markup contains the rule; behavior at phone width is unverified.

## Findings and deviations

- **`images.qualities` is required in Next 16** (bundled docs). It defaults to `[75]`. The lesson's `quality={80}` and `{85}` would be silently coerced to 75 without it. Set to `[75, 80, 85]`. Direct REST calls with an unlisted quality return 400.
- **`formats: ['image/avif','image/webp']`** (from the lesson) is a valid choice. The bundled default is `['image/webp']`. AVIF costs more server CPU per image on first optimization; acceptable for this demo.
- **picsum redirects** (`picsum.photos` → `fastly.picsum.photos`). The `remotePatterns` entry for `picsum.photos` is enough: Next fetches server-side and follows the redirect. Verified by the 200 responses through `/_next/image`.
- **`sizes` on a 2-column grid:** the browser picked `w=750` for ~213–408px CSS-width cards on a 2× display. That's the density-driven choice, not over-fetching from a wrong `sizes`. The hero's `w=1920` is the largest of its `srcSet`, since its `sizes` allows up to 896px CSS width on a 2× display.
- **The lesson's hero URL `random=hero`** works on picsum (it redirects to a stable image id).
- **The starter's `// TODO: Convert to next/image` comment** and the `Performance Issues` list were replaced by an "Optimizations Applied" list.
- **Known remaining problem:** the picsum images are remote, so every first optimization goes through an external fetch. A local `public/` image would avoid that round trip.
