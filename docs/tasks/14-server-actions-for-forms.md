# 14: Server Actions for Forms (Section 2.8)

- Status: done (side quest "form state recovery" not done)
- Branch: `feat/core-server-actions-form` (merge to `main` pending)
- Source: https://vercel.com/academy/nextjs-foundations/server-actions-for-forms
- Concepts: `'use server'` action with Zod `safeParse`, errors returned as state (not thrown), `useActionState`, `useFormStatus` for pending, progressive enhancement, no secrets in HTML

## Files

```
apps/web/src/app/actions/contact.ts    'use server' submitContactForm(prevState, formData): Zod schema, returns errors/success
apps/web/src/app/contact/page.tsx      'use client' form: useActionState, inline field errors, noValidate
apps/web/src/app/ui/submit-button.tsx  'use client' useFormStatus → "Submitting..." + disabled
```

## Done-When (verified, production build, chrome-devtools)

- [x] `/contact` valid form submits → "Message sent successfully!" (green), server log `[contact] submitted: …`
- [x] Invalid email (`notanemail`) → inline "Invalid email address" from the server (Zod), page not reloaded.
- [x] Short message (under 10 chars) → inline "Message must be at least 10 characters".
- [x] Pending state: during submit the button reads "Submitting..." and is disabled; afterwards "Send Message" again.
- [x] JavaScript on: result is shown inline, no document reload (marker survives). One POST to `/contact` per submit (2 server log lines = document + action; see note below).
- [x] View source: no `process.env`, `INTERNAL_CONFIG`, `DATABASE_URL` or secret in the HTML (`grep` count 0). The page is ○ static.
- [x] `pnpm check-types`, `pnpm lint`, `pnpm build` pass.

## Deviations

- **`noValidate` on the form.** Without it the browser blocks the submit for an invalid email (`type="email"`), so the server never ran and no server message appeared. The lesson's Done-When requires the server-side message, so `noValidate` was added. `required` and `type` remain as markup hints; Zod on the server is the validation of record.
- **Fields reset after a submit with errors.** `useActionState` re-renders the uncontrolled inputs, which clears name and message on an error response. The lesson doesn't mention it. Not fixed: keeping values would need `defaultValue` from the previous state (e.g. returning the submitted fields in `ContactState`). Candidate for a follow-up.
- **No database or mail provider.** The lesson's `await db.contacts.create` / `sendEmail` are commented-out placeholders in the solution; here the action logs the validated payload (with the message truncated) and returns success. The `try/catch` error branch is kept.
- **Zod 4 API:** `z.email()` (top-level) rather than `z.string().email()`, which is deprecated in Zod 4.
- The lesson's `biome-ignore` comments for `console.log` / `console.error` were dropped (rule not enabled here).
- `toLocaleDateString` etc. not used on this page.

## Findings

- Progressive enhancement is only partly verified: I tested with JavaScript on. Submitting with JS disabled (a plain POST to the action) was not tested in a browser; the form is a `'use client'` form, which the lesson notes is queued until hydration.
- The lesson's solution puts `useFormStatus` in its own `ui/submit-button.tsx` (a Client Component). Kept as the lesson shows.
- No `useActionState` `initialState` issue: the lesson's `{ message: '' }` works; `ContactState` is typed as `{}` here with optional fields.
