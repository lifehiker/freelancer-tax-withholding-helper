# FORGE PRD Tasks

Implementation order: foundation -> data/auth -> core workflows -> secondary workflows -> marketing/pages -> deployment -> QA.

## Foundation
- [x] Next.js 15 App Router TypeScript app exists under `src/app`.
- [x] System fonts only; no `next/font/google`.
- [x] Global responsive styling and app shell exist.
- [x] PWA manifest and icon exist in `public/`.
- [x] Tax calculation library covers federal income tax, self-employment tax, state estimate, safe harbor, due dates, and quarterly plans.
- [x] Re-read PRD foundation requirements after build fixes.

## Data Model
- [x] Prisma schema includes users, tax profiles, income entries, quarterly estimates, and waitlist emails.
- [x] SQLite local fallback is configured through `DATABASE_URL`.
- [x] Add NextAuth OAuth adapter models for optional Google OAuth support.
- [x] Verify Prisma client generation and schema compatibility.

## Auth
- [x] Credentials signup endpoint with password hashing.
- [x] Credentials login through NextAuth.
- [x] Protected app routes redirect unauthenticated users to login.
- [x] Optional Google OAuth when `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are provided.
- [x] Auth flow smoke-tested locally.

## User-Facing App Pages
- [x] `/onboard`: one-screen tax profile setup with filing status, state, deductions, prior-year tax liability, reminders toggle.
- [x] `/dashboard`: YTD income, cumulative recommended set-aside, transferred amount/gap, due-date countdown, recent payments.
- [x] `/dashboard/quarterly`: standard and annualized quarterly estimator, safe harbor method, IRS payment link.
- [x] `/dashboard/export`: CSV export entrypoint.
- [x] `/pricing`: free and pro pricing with guarded checkout.
- [x] Improve transfer-to-savings CTA behavior in the payment logger.
- [x] App pages smoke-tested.

## Public/SEO Pages
- [x] `/`: homepage with embedded calculator and signup CTA.
- [x] `/calculator`: free public calculator.
- [x] `/calculator/[state]`: state-specific calculator pages generated for all states/DC.
- [x] `/quarterly-tax-dates`: 2026 quarterly dates with email capture.
- [x] `/guide/[slug]`: required guide pages.
- [x] `/blog`: guide index.
- [x] `/about`, `/contact`, `/legal/privacy`, `/legal/terms` exist.
- [x] Public pages visually smoke-tested.

## API / Server Actions
- [x] `POST /api/auth/signup`.
- [x] NextAuth `/api/auth/[...nextauth]`.
- [x] `GET/POST /api/tax-profile`.
- [x] `GET/POST /api/income-entries`.
- [x] `PATCH /api/income-entries/[id]` verified and fixed if needed.
- [x] `GET /api/export/income`.
- [x] `POST /api/waitlist`.
- [x] `POST /api/stripe/checkout` with safe fallback when Stripe env vars are missing.
- [x] `POST /api/webhooks/stripe` with safe fallback when Stripe env vars are missing.
- [x] `POST /api/cron/quarterly-reminders` sends quarterly reminders and handles missing Resend credentials safely.

## Core Workflows
- [x] Public calculator computes per-payment set-aside breakdown.
- [x] Signup -> onboard -> dashboard flow exists.
- [x] Log payment -> immediate federal/SE/state/total set-aside result exists.
- [x] Free tier limits users to five income entries.
- [x] Manual transfer status can be recorded.
- [x] Quarterly estimator supports standard and annualized modes.
- [x] CSV export supports CPA handoff.
- [x] Inactivity nudge behavior added or documented.
- [x] Core workflows smoke-tested.

## Billing, Email, Storage Integrations
- [x] Stripe checkout is lazy-loaded inside the route and gracefully falls back without credentials.
- [x] Stripe webhook is lazy-loaded inside the route and gracefully falls back without credentials.
- [x] Resend is lazy-loaded inside the cron route and dry-runs without credentials.
- [x] Local SQLite storage works without external accounts.
- [x] Credential requirements documented in `HUMAN_INPUT_NEEDED.md`.

## Docker / Deploy Config
- [x] `next.config.ts` uses `output: "standalone"`.
- [x] Dockerfile uses standalone output and existing `public/` directory.
- [x] Dockerfile initializes Prisma schema at container startup.
- [x] `docker build .` attempted; Docker daemon permission denied in this environment.

## Verification
- [x] `npm run build` passes.
- [x] Dev server starts without crashing.
- [x] Primary routes smoke-tested.
- [x] Interactive forms/buttons/navigation smoke-tested.
- [x] `FORGE_COMPLETION_AUDIT.md` created.
- [x] Final response includes `FORGE_BUILD_COMPLETE`.
