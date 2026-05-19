# FORGE Completion Audit

## Foundation / Deployment
- Next.js 15 App Router, TypeScript, standalone output: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`.
- System fonts only, no `next/font/google`: `src/app/globals.css`.
- PWA manifest and icon: `public/manifest.json`, `public/icon.svg`.
- Docker/Coolify support: `Dockerfile`, `.dockerignore`, `next.config.ts`.
- Setup documentation and env template: `README.md`, `.env.example`.

## Data Model
- SQLite Prisma schema with no external database requirement: `prisma/schema.prisma`.
- Models implemented: `User`, `TaxProfile`, `IncomeEntry`, `QuarterlyEstimate`, `WaitlistEmail`.
- Prisma singleton: `src/lib/prisma.ts`.

## Auth
- Credentials auth with bcrypt and NextAuth v5: `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/signup/route.ts`.
- Auth-gated app shell: `src/app/(app)/layout.tsx`, `src/lib/auth-helpers.ts`.
- Public auth entry pages: `src/app/signup/page.tsx`, `src/app/login/page.tsx`, `src/components/AuthForm.tsx`.

## Tax Calculation Engine
- Federal estimate, self-employment tax, state estimate, standard deductions, safe harbor, annualized quarterly plan, and due dates: `src/lib/tax-calculator.ts`.
- All 50 states plus DC static planning rates and notes: `src/data/states.ts`.
- Currency/percent helpers: `src/lib/utils.ts`.

## Core Product Workflows
- Public calculator with immediate result breakdown and signup upsell: `src/components/PublicCalculator.tsx`, `src/app/calculator/page.tsx`.
- State-specific calculator pages with static generation: `src/app/calculator/[state]/page.tsx`.
- Onboarding/profile workflow: `src/app/(app)/onboard/page.tsx`, `src/components/OnboardingForm.tsx`, `src/app/api/tax-profile/route.ts`.
- Payment logger with instant set-aside result and transfer confirmation: `src/components/PaymentLoggerDialog.tsx`, `src/app/api/income-entries/route.ts`, `src/app/api/income-entries/[id]/route.ts`.
- YTD dashboard totals, savings gap, next due date, and recent entries: `src/app/(app)/dashboard/page.tsx`.
- Quarterly estimator with standard and annualized modes plus IRS payment link: `src/app/(app)/dashboard/quarterly/page.tsx`.
- Free tier five-entry gating: `src/lib/subscription.ts`, `src/app/api/income-entries/route.ts`, dashboard upgrade banner.
- CSV export for CPA handoff: `src/app/(app)/dashboard/export/page.tsx`, `src/app/api/export/income/route.ts`.

## Billing / Email / Storage Fallbacks
- Stripe checkout with lazy SDK initialization and missing-key fallback: `src/app/api/stripe/checkout/route.ts`, `src/components/CheckoutButton.tsx`, `src/app/pricing/page.tsx`.
- Stripe webhook with lazy SDK initialization and missing-key fallback: `src/app/api/webhooks/stripe/route.ts`.
- Resend reminder cron with lazy SDK initialization and dry-run fallback: `src/app/api/cron/quarterly-reminders/route.ts`.
- Waitlist/reminder email capture stored locally: `src/app/api/waitlist/route.ts`, `src/components/WaitlistForm.tsx`.
- No third-party client is initialized at module scope.

## Marketing / SEO Pages
- Homepage with embedded calculator and product positioning: `src/app/page.tsx`.
- Pricing page: `src/app/pricing/page.tsx`.
- Quarterly tax dates page with 2026 due dates and capture form: `src/app/quarterly-tax-dates/page.tsx`.
- Five cornerstone guide pages powered by static guide data: `src/data/guides.ts`, `src/app/guide/[slug]/page.tsx`.
- Blog index: `src/app/blog/page.tsx`.
- Supporting pages: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/legal/privacy/page.tsx`, `src/app/legal/terms/page.tsx`.

## Deferred External-Credential Items
- Real Stripe checkout requires Stripe keys and price IDs. The UI and route are implemented; without credentials the route returns a non-crashing local fallback.
- Real subscription webhook updates require Stripe webhook secret. The route is implemented and safely no-ops without credentials.
- Real reminder emails require Resend credentials. The cron route is implemented and reports dry-run counts without credentials.
- Production legal/support text needs owner-provided copy. The app runs with clear placeholder legal/support text noted in `HUMAN_INPUT_NEEDED.md`.

## Verification
- `npm install` completed after schema creation.
- `DATABASE_URL="file:./dev.db" npx prisma db push` completed.
- `DATABASE_URL="file:./dev.db" AUTH_SECRET="dev-secret" npm run build` passed.
- Dev server started on `http://localhost:3000`.
- Smoke-tested public routes: `/`, `/calculator`, `/calculator/california`, `/pricing`, `/quarterly-tax-dates`, guide page.
- Smoke-tested unauthenticated `/dashboard` redirect to `/login`.
- Smoke-tested `POST /api/auth/signup`, `POST /api/waitlist`, and `POST /api/cron/quarterly-reminders`.
- Dockerfile was created, but `docker build .` could not run in this environment because the user lacks permission to access `/var/run/docker.sock`.
