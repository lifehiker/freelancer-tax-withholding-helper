import type { Metadata } from "next";
import { CheckoutButton } from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing",
  description: "WithholdingHelper pricing for freelance tax set-aside tracking.",
};

export default function PricingPage() {
  return (
    <main className="shell section">
      <div className="eyebrow">Pricing</div>
      <h1>Simple pricing for a narrow job.</h1>
      <p className="lead">Use the free calculator forever. Create an account when you want payment history and quarterly estimates.</p>
      <div className="two-grid">
        <div className="card">
          <h2>Free</h2>
          <p className="metric">$0</p>
          <p className="muted">Up to five lifetime income entries, federal and state set-aside calculation, and dashboard totals.</p>
          <a className="secondary-button" href="/signup">Start free</a>
        </div>
        <div className="card">
          <h2>Pro</h2>
          <p className="metric">$9/mo or $69/yr</p>
          <p className="muted">Unlimited entries, annualized installment estimates, reminders, and CPA-ready CSV export.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <CheckoutButton plan="annual" />
            <CheckoutButton plan="monthly" />
          </div>
        </div>
      </div>
    </main>
  );
}
