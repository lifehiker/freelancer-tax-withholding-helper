# Human Input Needed

The app runs and builds without these values. Provide them for production integrations:

- `AUTH_SECRET`: Set a strong production secret, for example `openssl rand -base64 32`.
- `NEXT_PUBLIC_APP_URL`: Set the public site URL used for Stripe redirects.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_MONTHLY_PRICE_ID`, `STRIPE_PRO_ANNUAL_PRICE_ID`: Required for real Pro checkout and subscription updates. Without them, checkout returns a safe local fallback message.
- `RESEND_API_KEY`, `EMAIL_FROM`: Required to send quarterly reminder emails. Without them, the reminder cron route dry-runs and reports how many emails would be sent.
- Production support/legal copy: Replace `support@example.com`, privacy policy, and terms with launch-ready details.
