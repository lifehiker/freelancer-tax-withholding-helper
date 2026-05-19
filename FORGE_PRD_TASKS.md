# FORGE PRD Tasks

## Foundation
- [x] Read `PRD.md` end-to-end.
- [x] Read `BUILD_INSTRUCTIONS.md` end-to-end.
- [x] Confirm existing repo state and identify that no Next.js app files exist yet.
- [x] Scaffold Next.js 15 App Router project with TypeScript, Tailwind-compatible CSS, system fonts only, and standalone output.
- [x] Add README, `.gitignore`, `.env.example`, and deployment-safe defaults.

## Data Model
- [x] Add Prisma with SQLite so the app runs without an external database.
- [x] Define `User`, `TaxProfile`, `IncomeEntry`, `QuarterlyEstimate`, and `WaitlistEmail`.
- [x] Include auth-compatible user fields and subscription fields.
- [x] Generate Prisma client and verify local database initialization.

## Auth
- [x] Implement credential-based signup/login using NextAuth v5 and bcrypt.
- [x] Keep public marketing routes accessible without auth.
- [x] Gate dashboard, onboarding, settings/export, and quarterly estimator routes.
- [x] Add graceful unauthenticated redirects.

## Tax Calculation Core
- [x] Implement federal income tax estimate, self-employment tax, standard deduction defaults, state tax estimate, safe harbor comparison, annualized installment mode, quarterly due dates, and CSV data shaping.
- [x] Include all 50 states plus DC in a static data file.
- [x] Use clear estimate/disclaimer copy.

## User-Facing Pages
- [x] `/` homepage with embedded calculator and signup CTA.
- [x] `/calculator` public calculator with filing status, state, annual income, and payment amount.
- [x] `/calculator/[state]` static state calculator pages.
- [x] `/signup` and `/login` auth entry pages.
- [x] `/onboard` tax profile wizard.
- [x] `/dashboard` YTD dashboard with payment logger.
- [x] `/dashboard/quarterly` quarterly estimate page.
- [x] `/dashboard/export` CSV export workflow.
- [x] `/pricing` Free vs Pro page.
- [x] `/quarterly-tax-dates` due dates and reminder signup.
- [x] `/guide/[slug]` five SEO guide pages.
- [x] `/blog` launch blog index.
- [x] `/about`, `/contact`, and `/legal/*` support pages.

## API / Server Actions
- [x] `POST /api/auth/signup`.
- [x] `GET/POST /api/tax-profile`.
- [x] `GET/POST /api/income-entries`.
- [x] `PATCH /api/income-entries/[id]` for transfer toggles.
- [x] `GET /api/export/income`.
- [x] `POST /api/waitlist`.
- [x] `POST /api/stripe/checkout` with missing-credential fallback.
- [x] `POST /api/webhooks/stripe` with lazy Stripe initialization.
- [x] `POST /api/cron/quarterly-reminders` with lazy Resend initialization and safe dry-run fallback.

## Core Workflows
- [x] First-time signup -> onboarding -> dashboard.
- [x] Public calculator -> signup upsell.
- [x] Log payment -> instant set-aside breakdown -> transfer confirmation.
- [x] Dashboard totals and next due date update from entries.
- [x] Free tier gating at five lifetime income entries.
- [x] Quarterly estimator standard/annualized toggle.
- [x] CSV export for CPA handoff.

## Integrations And Safe Fallbacks
- [x] Stripe checkout route returns a demo-safe upgrade response when credentials are missing.
- [x] Stripe webhook route does not crash without credentials.
- [x] Resend reminder route stores/writes local state and dry-runs without credentials.
- [x] No third-party SDK client initialized at module scope.
- [x] No unavailable network resources required during build.

## Marketing / SEO
- [x] Metadata for homepage, calculator, state calculators, guides, pricing, and tax dates.
- [x] Calculator answer rendered above fold.
- [x] Five cornerstone guides present.
- [x] Blog index present.
- [x] PWA manifest and icons.

## Docker / Deploy
- [x] `next.config.ts` uses `output: "standalone"`.
- [x] Production-ready Dockerfile using Node 20 slim, Prisma generate after copy, SQLite startup migration, and only existing directories.
- [x] `.dockerignore` added.
- [x] Docker build attempted if Docker is available. Docker is installed, but this environment denied access to `/var/run/docker.sock`.

## Verification
- [x] Run `npm run build` and fix all errors.
- [x] Start dev server and verify it does not crash.
- [x] Smoke-test primary public and authenticated routes.
- [x] Review visual quality for desktop/mobile routes through responsive CSS/code review and rendered HTML smoke tests. Browser screenshots were unavailable because no browser binary is installed.
- [x] Test forms, buttons, calculator, navigation, payment logger, gating, export, waitlist, and checkout fallback through build, route, API, and code-path smoke checks.
- [x] Create `HUMAN_INPUT_NEEDED.md` for production credentials only.
- [x] Create `FORGE_COMPLETION_AUDIT.md` mapping PRD requirements to implementation files.
