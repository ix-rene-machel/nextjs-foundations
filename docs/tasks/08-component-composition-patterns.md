# 08: Component Composition Patterns

- Status: done (side quest "polymorphic component library" not done)
- Source: https://vercel.com/academy/nextjs-foundations/component-composition-patterns
- Concepts: compound components, named exports vs namespace objects across the `'use client'` boundary, server-rendered `children` inside a client dialog, Radix Dialog a11y

Approach: built from the requirements/hints first; the lesson's solution section was **not needed** (types, lint, build and browser checks passed on the first try). Used it only as a cross-check for the file layout (`@repo/ui/components/dialog`, demo routes in both apps).

## Decision (asked)

Shared component in `packages/ui` (user choice) instead of per-app copies. This modifies a shared package, which `AGENTS.md` normally forbids without instruction.

## Files

```
packages/ui/src/components/dialog.tsx       compound Dialog (named exports)
packages/ui/package.json                    + @radix-ui/react-dialog ^1.3.1 (pnpm re-sorted the dependency keys: noise in the diff)
apps/web/src/app/demo/dialog/page.tsx       Delete Account (confirmation) + View Terms (server content)
apps/blog/src/app/demo/dialog/page.tsx      Subscribe to Newsletter
apps/{web,blog}/src/app/layout.tsx          body classes moved to a wrapper div (scroll-lock shift fix)
```

API: `DialogRoot`, `DialogTrigger`, `DialogContent` (portal + overlay + close icon), `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`. Built on `@radix-ui/react-dialog`.

## Done-When (verified on production builds, chrome-devtools)

- [x] web `/demo/dialog`: "Delete Account" opens the dialog
- [x] blog `/demo/dialog`: "Subscribe to Newsletter" opens the dialog (focus moves to the email input)
- [x] Focus trap (web): 4 more Tab presses logged focus `Cancel → Delete → Close → Cancel`, all inside the dialog; background gets `aria-hidden="true"`, `body` scroll locked
- [x] Escape closes: tested on the **blog** dialog (closed) and on the web "Delete Account" dialog (closed; focus returned to the trigger)
- [x] Overlay click closes (web "View Terms" dialog; synthetic pointer events on `[data-slot=dialog-overlay]`)
- [x] ARIA: `role="dialog"`, `aria-labelledby` → title text ("Are you sure?" / "Terms of Service" / "Join Our Newsletter"), `aria-describedby` present. `aria-modal` is not set (Radix hides the background with `aria-hidden` instead).
- [x] web "View Terms": server-generated date ("last updated on 11/13/2026") appears inside the dialog; also present in the server HTML
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` (both apps) pass; no console errors

Not done in a real pointer sense: overlay close was triggered with dispatched events, not a physical click. Escape and Tab were real key presses.

## Bug found after review: background shifted when a dialog opened

Reported on `/demo/dialog`: opening "View Terms" moved the page content. Measured in Chrome (dev server): `h1` jumped from left 119.1 / top 109.1 to 103.0 / 77.1.

- **Cause:** both root layouts had `<body className="container mx-auto px-4 py-8">`. Radix Dialog's scroll lock (react-remove-scroll) sets `body[data-scroll-locked] { margin: 0 !important; padding-left/right: <previous auto margin>; padding-top: 0 }`, which replaces the body's `container`/`mx-auto`/`px-4`/`py-8` layout.
- **Fix (user-approved):** `<body>` is now unstyled; `container mx-auto px-4 py-8` moved to a wrapper `<div>` around `ThemeToggle` + `{children}` (web) and `{children}` (blog). Third-party scripts (GA) stay direct children of `<body>`.
- **Verified:** with the dialog open and scroll locked, `h1`, theme toggle and the trigger button all have delta 0 (web); blog `h1` unchanged (119.11, 63.99 before and while open). Closing restores the lock state with no shift. Baseline layout unchanged vs. before the fix. No console errors; both app builds pass.
- **Rule of thumb:** never put layout spacing on `<body>` when using modal primitives; they own `body` styles while open.

## Findings

- **Named exports, no `Dialog.*` namespace.** An object exported from a `'use client'` module reaches Server Components as a client reference, so `Dialog.Root` would be `undefined`. The lesson's troubleshooting says the same. API reads `<DialogRoot>` instead of `<Dialog.Root>`.
- **Tailwind classes from `packages/ui` reach both apps:** `bg-black/80`, `zoom-in-95`, `fade-in-0` are present in each app's built CSS (the shared `globals.css` has `@source "../"`; `tw-animate-css` supplies the animation utilities).
- **Server children work:** `termsContent` is computed in the page (Server Component) and passed as `children` of `DialogContent`; the dialog module never imports server code.
- Lesson's page uses `new Date().toLocaleDateString()` for the terms date; that formats differently on server vs. browser locale (the task 02 hydration issue). Here the string is built on the server only and rendered as text, so no mismatch, but I pinned `en-US`/UTC to keep output deterministic.
- `/demo/dialog` is prerendered (○), so the "server date" is the build date. Same caveat as task 07's timestamp.
- Lesson's blog form had an unlabeled email input; wrapped it in a `<label>`.
- `apps/web` already depended on `@radix-ui/react-dialog` (starter leftover). It's still listed there; it could be removed now that the shared package owns it, but I left `apps/web/package.json` alone.
- `DialogContent` always renders the built-in close button (X). There's no prop to hide it; add one only if a use case appears.
- Radix warns (dev) if a `DialogContent` has no `DialogTitle`/`Description`. All three demos include both.
