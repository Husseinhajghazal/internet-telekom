# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Arabic-language (RTL) Next.js 16 App Router site for **إنترنت تيليكوم**, a Turkish ISP reseller serving Arabic-speaking customers in Turkey. Three surfaces in one app:

1. **Marketing site** — `app/page.js` + `components/home/*`
2. **Public 6-step application wizard** — `/internet-basvuru-formu`, plus `/start`, `/inquiry`, status lookup, and a customer review form
3. **Staff panel** — `/panel/*`, cookie-authenticated, ADMIN and EMPLOYEE roles

Plain JavaScript (no TypeScript). Tailwind v4, Prisma + PostgreSQL, Formik + Yup.

## Commands

```bash
npm run dev              # dev server on :3000
npm run build            # production build
npm start                # serve the build
npm run prisma:generate  # regenerate the Prisma client after schema edits
npm run prisma:migrate   # create + apply a dev migration
node seed_admin.js       # upsert the ADMIN user (credentials hard-coded in the file)
node seed_reviews.js     # insert sample approved reviews
node scripts/backfill-review-service.mjs  # backfill Review.service from linked Applications
node --env-file=.env scripts/backfill-service-type.mjs          # dry run: find/plan unclassified serviceType
node --env-file=.env scripts/backfill-service-type.mjs --apply  # write
node --env-file=.env scripts/prune-orphan-invoices.mjs          # dry run: unreferenced upload files
node --env-file=.env scripts/prune-orphan-invoices.mjs --apply  # delete them
```

No test runner, linter, or formatter is configured — there is nothing to run for those.

## Environment

`.env` must define `website_url` (lowercase — used by `metadataBase` in [app/layout.js](app/layout.js), and `new URL(undefined)` throws at build time), `DATABASE_URL`, and `ADMIN_SESSION_SECRET`. WhatsApp Cloud API vars are optional; when unset, [lib/whatsappNotify.js](lib/whatsappNotify.js) logs and returns without failing the request. See [.env.example](.env.example).

## Architecture

### Auth — custom HMAC cookie, no auth library

[lib/admin-session.js](lib/admin-session.js) signs a base64url payload with HMAC-SHA256 into the `admin_session` cookie (24h). Two enforcement points, both must be kept in sync:

- **Pages**: [app/panel/(panel)/layout.jsx](app/panel/(panel)/layout.jsx) verifies the cookie server-side and redirects to `/panel/login`. Everything under the `(panel)` route group is gated by this one layout; `(public)/login` is not.
- **API**: each `/api/panel/*` route calls `isAdminAuthenticated()` from [lib/admin-api.js](lib/admin-api.js) itself. There is no middleware — a new panel route with no such call is public.

Role checks are inline per-route (`sessionUser.role !== "ADMIN"`), not centralized. ADMIN-only: employees CRUD, reviews moderation, deleted/restore, audit logs, editing `createdAt`/`completedAt`.

The payload carries `v: 3`. Changing its shape invalidates all live sessions, so bump `v` when you do. Login creates a `UserSession` row; [components/admin/SessionHeartbeat.jsx](components/admin/SessionHeartbeat.jsx) pings `/api/panel/heartbeat` every 2 min to maintain `lastSeenAt`.

### Two API namespaces with different trust levels

- `/api/applications/*` and `/api/review-submit` are **intentionally unauthenticated** — the public wizard writes drafts here, authorized only by possession of the application's cuid. Never add panel-only fields to the payloads these routes accept; [lib/application.js](lib/application.js) `normalizeDraftPayload` is the allowlist.
- `/api/panel/*` requires the session cookie.

### The wizard's branching flow

Steps are **not linear** — the path depends on `serviceType` (`newline` / `services` / `inquiry`), `contractPreference`, and `selectedService`. Three functions in [utils/general.js](utils/general.js) are the single source of truth: `getNextStep`, `getPreviousStep`, `getStepFieldOrder` (the last also decides which Yup errors block the step). Changing the flow means editing all three plus the per-step Yup schema in [hooks/ApplicationForm.jsx](hooks/ApplicationForm.jsx), `ProgressBar`, and `SIDEBAR_CONTENT` in [utils/data.js](utils/data.js). All wizard state lives in the `useApplicationForm` hook; the page component is presentation only.

Draft lifecycle:

1. `POST /api/applications/start` matches on name + normalized phone and returns one of three actions — `redirect` (an active application exists → status page), `resume` (a `NOT_COMPLETED` draft → rehydrate at its saved `step`), or `created`.
2. `PATCH /api/applications/[id]` on every step. Steps 1–5 send JSON; **step 6 sends multipart/form-data** because of invoice uploads, and only that branch writes `invoiceFileUrl`.
3. `POST /api/applications/[id]/submit` sets status `COMPLETED` and returns `whatsappText`; the client then navigates to `wa.me/...` so the customer sends the summary from their own number.

### Data model gotchas ([prisma/schema.prisma](prisma/schema.prisma))

- **`appIndex`** is the human-facing sequential number (public status URLs use it). Allocated as `max + 1` with a 5-attempt retry loop on Prisma `P2002` — there is no sequence. Both `/api/applications/start` and the panel create path implement this separately.
- **Phone numbers are stored in display format** — `normalizePhoneForMatch` in [lib/application.js](lib/application.js) produces `0 (5XX) XXX XX XX`, and that string is what lands in `Application.phone`. This is why panel search in [app/api/panel/applications/route.js](app/api/panel/applications/route.js) generates sliding-window formatted variations to match partial digit input. Do not "fix" one side without the other.
- **`selectedPackage`** encodes `kind-durationMonths-speed` (e.g. `family-18-100`). Contract expiry is derived as `completedAt + durationMonths`, which drives the `/panel/expiring` view and its badge count.
- **`completedAt` means activation date**, set when status becomes `ACTIVATED` — not when the customer submitted.
- **Soft delete only** — `isDeleted`; `/panel/deleted` restores.
- **Audit trail** — panel mutations diff old vs. new via `diffApplication` and write an `ApplicationLog` with action `CREATE`/`UPDATE`/`STATUS_CHANGE`/`DELETE`/`RESTORE`. Fields in `diffApplication`'s `ignoreFields` are excluded.
- **`serviceType` must always be one of `newline` / `services` / `inquiry`.** The panel has no "show everything" list — `/panel`, `/panel/services` and `/panel/added` partition the table by `serviceType` + `status`, and search is ANDed into that same condition. A row that matches no list is saved successfully and then unreachable in the UI. `KNOWN_SERVICE_TYPES` / `UNCLASSIFIED_SERVICE_TYPE` in the list route keep unclassified rows visible on the internet list; POST rejects a create without a type. When adding a serviceType value, add it to a list condition in the same change.
- **Watch for NULL in negated Prisma filters** — `{ field: { notIn: [...] } }` compiles to SQL `NOT IN`, which is NULL (not true) for a NULL column, so those rows silently drop out. Pair every `notIn` on a nullable column with an explicit `{ field: null }` branch.
- `ApplicationStatus` has 18 values and grew by migration. `VALID_STATUSES` (list route) and `ALLOWED_STATUSES` (PATCH route) must both list all of them, and `STATUS_LABELS` in [utils/data.js](utils/data.js) drives the UI — a new status needs adding in all three or it is either silently unfilterable or rejected with "حالة غير صالحة".
- Reviews are unapproved (`isApproved: false`) until moderated in the panel; public pages query only approved ones.

Migrations are hand-written, hand-dated SQL under [prisma/migrations/](prisma/migrations/).

### Uploads

Invoice files are written to `public/uploads/invoices/` on the local filesystem (`saveInvoiceFileLocally`) and served statically — they are committed to the repo. This assumes a persistent disk; it will silently lose files on an ephemeral/serverless filesystem.

Rules enforced in [lib/application.js](lib/application.js), which owns every read/write of that directory:

- The stored filename is always generated (`timestamp-uuid.ext`). The extension comes from an allowlist, resolved from the uploaded name and falling back to the MIME type — **never concatenate a client-supplied filename into the path**. Max 15 MB per file (`MAX_UPLOAD_MB`), checked against both the reported `size` and the received bytes.
- Rejections throw with `code === "INVALID_UPLOAD"`; route handlers map that to a 400 carrying the Arabic message rather than a generic 500.
- **Writes must be balanced by cleanup.** Uploads land on disk before the DB write, so every failure path (validation, 404, thrown update) has to call `deleteInvoiceFiles(writtenFileUrls)`, and a successful update must delete the invoices the user removed. `deleteInvoiceFiles` is best-effort, never throws, and refuses paths outside the upload directory. Three routes do this: the panel POST/PUT/DELETE, and the public wizard PATCH.
- Step 6 of the wizard recomputes the whole invoice list, so `invoiceFileUrl` must be written even when null — `sanitizeUpdatePayload` strips nulls, so that field is re-applied explicitly afterwards.

`scripts/prune-orphan-invoices.mjs` reports unreferenced files and rows whose files are missing (dry run; `--apply` deletes).

### UI conventions

- **Arabic is hard-coded**, not translated — user-facing strings, API error messages, and status labels are inline Arabic literals. There is no i18n library. `<html lang="ar" dir="rtl">` is set globally and the Cairo font is forced on every element in [app/globals.css](app/globals.css).
- **Tailwind v4** — configured via `@import "tailwindcss"` in `globals.css` with the PostCSS plugin. There is no `tailwind.config.js`; custom keyframe animations live in `globals.css`.
- **React Compiler is on** (`reactCompiler: true` in [next.config.mjs](next.config.mjs)) — avoid manual memoization patterns that fight it. `experimental.optimizeCss` depends on the `critters` package.
- Panel pages are server components that gate + fetch, delegating interactivity to a `*Client.jsx` component in [components/admin/](components/admin/).
- Unsaved-changes protection uses a custom `NavigationGuardProvider` + `GuardedLink` ([components/admin/NavigationGuardContext.jsx](components/admin/NavigationGuardContext.jsx)); panel navigation must go through `GuardedLink`, not bare `next/link`, to respect it.
- Heavy client-only libs are dynamically imported: `turkey_province_image` (cascading province → district → neighborhood → street address picker in Step 6), `lottie-web`, `xlsx` (panel Excel export).
- `jsconfig.json` maps `@/*` to the repo root, but most existing files use relative imports — both appear throughout.
