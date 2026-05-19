# FORGE Completion Audit

## Foundation / Deployment
- Next.js 15 App Router, TypeScript, and standalone output: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`.
- System-font styling only, with no `next/font/google`: `src/app/globals.css`.
- PWA install metadata: `public/manifest.json`, `public/icon.svg`.
- Docker/Coolify deployment path: `Dockerfile`, `.dockerignore`, `next.config.ts`.

## Data Model
- Local SQLite Prisma storage with production database override through `DATABASE_URL`: `prisma/schema.prisma`.
- Product models: `User`, `TaxProfile`, `IncomeEntry`, `QuarterlyEstimate`, `WaitlistEmail`.
- Auth adapter models for optional Google OAuth: `Account`, `Session`, `VerificationToken`.
- Prisma singleton: `src/lib/prisma.ts`.

## Auth
- Email/password signup and login: `src/app/api/auth/signup/route.ts`, `src/auth.ts`, `src/components/AuthForm.tsx`.
- Optional Google OAuth when `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are present: `src/auth.ts`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`.
- Protected app shell and auth redirect: `src/app/(app)/layout.tsx`, `src/lib/auth-helpers.ts`.
- Production host trust for Forge/Coolify domains, fixing Auth.js `UntrustedHost`: `src/auth.ts`, `Dockerfile`.

## Core Product Workflows
- Tax profile onboarding: `src/app/(app)/onboard/page.tsx`, `src/components/OnboardingForm.tsx`, `src/app/api/tax-profile/route.ts`.
- Public set-aside calculator with federal, self-employment, state, total, and percentage breakdown: `src/components/PublicCalculator.tsx`, `src/app/calculator/page.tsx`.
- State calculator pages for all states/DC: `src/data/states.ts`, `src/app/calculator/[state]/page.tsx`.
- Payment logger with immediate calculation, bank-app CTA fallback, and manual transfer confirmation: `src/components/PaymentLoggerDialog.tsx`, `src/app/api/income-entries/route.ts`, `src/app/api/income-entries/[id]/route.ts`.
- Dashboard with YTD income, recommended set-aside, savings gap, next due date, and recent payments: `src/app/(app)/dashboard/page.tsx`.
- Quarterly estimator with standard/annualized toggle, safe harbor method, and IRS payment link: `src/app/(app)/dashboard/quarterly/page.tsx`, `src/lib/tax-calculator.ts`.
- Free tier five-entry gate and paid status check: `src/lib/subscription.ts`, `src/app/api/income-entries/route.ts`.
- CPA-ready CSV export: `src/app/(app)/dashboard/export/page.tsx`, `src/app/api/export/income/route.ts`.

## Billing / Email / Storage
- Stripe checkout lazy-loads the SDK inside the route and falls back safely without credentials: `src/app/api/stripe/checkout/route.ts`, `src/components/CheckoutButton.tsx`.
- Stripe webhook lazy-loads the SDK, verifies signatures when configured, and handles checkout/subscription updates: `src/app/api/webhooks/stripe/route.ts`.
- Resend reminder cron lazy-loads the SDK, sends quarterly reminders and 30-day inactivity nudges when configured, and dry-runs without credentials: `src/app/api/cron/quarterly-reminders/route.ts`.
- Email reminder capture persists locally: `src/app/api/waitlist/route.ts`, `src/components/WaitlistForm.tsx`.

## Marketing / SEO Pages
- Homepage with embedded calculator and signup CTA: `src/app/page.tsx`.
- Quarterly tax dates page with 2026 due dates and capture form: `src/app/quarterly-tax-dates/page.tsx`.
- Required guide pages: `src/data/guides.ts`, `src/app/guide/[slug]/page.tsx`.
- Blog index: `src/app/blog/page.tsx`.
- Pricing page: `src/app/pricing/page.tsx`.
- Supporting pages: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/legal/privacy/page.tsx`, `src/app/legal/terms/page.tsx`.

## Deferred External-Credential Items
- Real Google OAuth requires `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`; email/password auth works without them.
- Real Stripe checkout and subscription updates require Stripe secret, webhook secret, and price IDs; without them checkout returns a local fallback message.
- Real reminder email delivery requires `RESEND_API_KEY` and `EMAIL_FROM`; without them the cron route reports dry-run counts.
- Production support/legal copy requires owner-provided final text; placeholder support/legal text is documented in `HUMAN_INPUT_NEEDED.md`.

## Verification
- `npm run build` passed on May 19, 2026 after the Auth.js host-trust deployment fix.
- `DATABASE_URL="file:./dev.db" npx prisma db push` completed and regenerated Prisma Client.
- Dev server started at `http://localhost:3001` because port 3000 was already occupied.
- Hosted-domain Auth.js session smoke test returned HTTP 200 with `Host: freelancer-tax-withholding-helper.forge.yoursiteguru.com`, verifying the `UntrustedHost` deployment failure is fixed.
- Public route smoke tests returned HTTP 200: `/`, `/calculator`, `/calculator/california`, `/quarterly-tax-dates`, `/guide/how-much-to-set-aside-freelance-taxes`, `/pricing`, `/login`, `/signup`, `/about`, `/contact`, `/blog`, `/legal/privacy`, `/legal/terms`.
- Protected dashboard route redirects unauthenticated users to `/login`.
- Authenticated API workflow passed: signup, credentials login, profile save, income entry create, transfer patch, CSV export, Stripe checkout fallback.
- Integration fallback tests passed: waitlist capture, Stripe checkout fallback, Resend cron dry-run.
- Playwright screenshot pass completed for desktop homepage and mobile calculator; layouts rendered cleanly with no obvious overlap.
- `docker build .` was attempted, but Docker daemon access is denied for this user at `/var/run/docker.sock`; the Dockerfile is present and aligned with standalone Next.js output.
