# WithholdingHelper

A focused Next.js app for US freelancers who want to know how much to set aside from each payment for federal income tax, self-employment tax, and estimated state tax.

## Stack

- Next.js 15 App Router, TypeScript, CSS system fonts
- Prisma + SQLite by default
- NextAuth credentials auth
- Guarded Stripe and Resend integrations with safe local fallbacks

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
```

The app is configured with `output: "standalone"` for Docker/Coolify deployment.
